import os
import sys
import time
from collections import OrderedDict
from pathlib import Path
import numpy as np
import soundfile as sf
import torch
import torch.nn as nn
from scipy import signal

# Add original-USEF-TSE to sys.path to access model architectures without modifying original code
ROOT_DIR = Path(__file__).resolve().parent.parent
ORIGINAL_REPO_DIR = ROOT_DIR / "original-USEF-TSE"
if str(ORIGINAL_REPO_DIR) not in sys.path:
    sys.path.insert(0, str(ORIGINAL_REPO_DIR))

try:
    from models.model_USEF_TFGridNet import Tar_Model
    from models.local.TFgridnet import TF_gridnet_attentionblock
    USEF_IMPORTS_AVAILABLE = True
except ImportError as e:
    USEF_IMPORTS_AVAILABLE = False
    IMPORT_ERROR = str(e)


class CleanSTFT(nn.Module):
    """Clean STFT module compliant with PyTorch 2.x standard STFT."""
    def __init__(self, n_fft=128, hop_length=64, win_length=128):
        super().__init__()
        self.n_fft = n_fft
        self.hop_length = hop_length
        self.win_length = win_length

    def forward(self, y):
        # y: [B, C, T] or [B, T]
        num_dims = y.dim()
        batch_size = y.shape[0]
        num_samples = y.shape[-1]
        if num_dims == 3:
            y = y.reshape(-1, num_samples)

        window = torch.hann_window(self.win_length, device=y.device)
        complex_stft = torch.stft(
            y,
            self.n_fft,
            self.hop_length,
            self.win_length,
            window=window,
            return_complex=True,
        )
        _, num_freqs, num_frames = complex_stft.shape
        if num_dims == 3:
            complex_stft = complex_stft.reshape(batch_size, -1, num_freqs, num_frames)

        mag = torch.abs(complex_stft)
        phase = torch.angle(complex_stft)
        real = complex_stft.real
        imag = complex_stft.imag
        return mag, phase, real, imag, complex_stft


class CleaniSTFT(nn.Module):
    """Clean inverse STFT module compliant with PyTorch 2.x."""
    def __init__(self, n_fft=128, hop_length=64, win_length=128, length=None):
        super().__init__()
        self.n_fft = n_fft
        self.hop_length = hop_length
        self.win_length = win_length
        self.length = length

    def forward(self, features, input_type="real_imag"):
        if input_type == "real_imag":
            real, imag = features
            c = torch.complex(real, imag)
        elif input_type == "complex":
            c = features
        elif input_type == "mag_phase":
            mag, phase = features
            c = torch.complex(mag * torch.cos(phase), mag * torch.sin(phase))
        else:
            raise NotImplementedError(f"Unsupported input_type: {input_type}")

        window = torch.hann_window(self.win_length, device=c.device)
        return torch.istft(
            c,
            self.n_fft,
            self.hop_length,
            self.win_length,
            window=window,
            length=self.length,
        )


class USEFExtractor:
    """Universal Speaker Embedding Free Target Speaker Extraction Engine."""

    TARGET_SR = 8000  # Model trained on 8kHz WSJ0-2mix audio

    def __init__(self, checkpoint_path: str = None):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.checkpoint_path = checkpoint_path or str(
            ROOT_DIR / "backend" / "checkpoints" / "usef_tfgridnet_wsj02mix.pth.tar"
        )
        self.model = None
        self.model_status = "uninitialized"
        self.status_detail = ""
        self._initialize_model()

    def _initialize_model(self):
        if not USEF_IMPORTS_AVAILABLE:
            self.model_status = "error"
            self.status_detail = f"Failed to import USEF-TSE architecture: {IMPORT_ERROR}"
            print(f"[USEFExtractor] {self.status_detail}")
            return

        if not os.path.exists(self.checkpoint_path):
            self.model_status = "checkpoint_missing"
            self.status_detail = (
                f"Checkpoint file not found at {self.checkpoint_path}. "
                "Download the pretrained weights from Hugging Face (ZBang/USEF-TSE)."
            )
            print(f"[USEFExtractor] {self.status_detail}")
            return

        try:
            stft = CleanSTFT(n_fft=128, hop_length=64, win_length=128)
            istft = CleaniSTFT(n_fft=128, hop_length=64, win_length=128)
            att = TF_gridnet_attentionblock(
                emb_dim=128,
                n_freqs=65,
                n_head=4,
                approx_qk_dim=512,
                activation="prelu",
            )
            self.model = Tar_Model(
                stft=stft,
                istft=istft,
                real_att=att,
                n_freqs=65,
                hidden_channels=256,
                n_head=4,
                emb_dim=128,
                emb_ks=1,
                emb_hs=1,
                num_layers=6,
            )

            # Load checkpoint
            ckpt = torch.load(self.checkpoint_path, map_location="cpu", weights_only=False)
            sd = OrderedDict()
            for k, v in ckpt["model_state_dict"].items():
                name = k.replace("module.", "").replace("convolution_", "convolution_module.")
                sd[name] = v

            missing, unexpected = self.model.load_state_dict(sd, strict=False)
            self.model.to(self.device)
            self.model.eval()

            self.model_status = "ready"
            self.status_detail = (
                f"USEF-TFGridNet loaded successfully on {self.device} "
                f"({sum(p.numel() for p in self.model.parameters()):,} parameters)."
            )
            print(f"[USEFExtractor] {self.status_detail}")
        except Exception as e:
            self.model_status = "error"
            self.status_detail = f"Error loading checkpoint: {str(e)}"
            print(f"[USEFExtractor] {self.status_detail}")

    def load_and_preprocess_audio(self, file_path: str) -> tuple[np.ndarray, float]:
        """Loads audio file, converts to mono, resamples to TARGET_SR (8000 Hz)."""
        data, sr = sf.read(file_path, dtype="float32")
        # Mono conversion
        if data.ndim > 1:
            data = np.mean(data, axis=1)

        duration = len(data) / sr

        # Resample to 8kHz if required
        if sr != self.TARGET_SR:
            num_target_samples = int(round(len(data) * self.TARGET_SR / sr))
            data = signal.resample(data, num_target_samples)

        # Avoid zero variance
        if np.std(data) < 1e-7:
            data = data + 1e-6 * np.random.randn(*data.shape).astype(np.float32)

        return data.astype(np.float32), duration

    def extract(self, mix_path: str, aux_path: str, output_path: str) -> dict:
        """Runs USEF-TSE target speaker extraction given mixture and reference audio."""
        if self.model_status != "ready" or self.model is None:
            raise RuntimeError(f"USEF-TSE model is not ready: {self.status_detail}")

        start_time = time.perf_counter()

        mix_audio, mix_duration = self.load_and_preprocess_audio(mix_path)
        aux_audio, aux_duration = self.load_and_preprocess_audio(aux_path)

        # Convert to torch tensor [1, T]
        mix_tensor = torch.from_numpy(mix_audio).unsqueeze(0).to(self.device)
        aux_tensor = torch.from_numpy(aux_audio).unsqueeze(0).to(self.device)

        with torch.no_grad():
            est_source = self.model(mix_tensor, aux_tensor)
            est_np = est_source.squeeze().cpu().numpy()

        # Handle size matching and normalization
        min_len = min(len(est_np), len(mix_audio))
        est_np = est_np[:min_len]

        # Prevent clipping while preserving dynamics
        peak = np.max(np.abs(est_np))
        if peak > 0.99:
            est_np = est_np / (peak + 1e-5) * 0.95

        # Save output WAV file at TARGET_SR
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        sf.write(output_path, est_np, self.TARGET_SR, subtype="PCM_16")

        elapsed_time = round(time.perf_counter() - start_time, 2)
        extracted_duration = round(len(est_np) / self.TARGET_SR, 2)

        return {
            "output_path": output_path,
            "output_filename": os.path.basename(output_path),
            "mix_duration": round(mix_duration, 2),
            "aux_duration": round(aux_duration, 2),
            "extracted_duration": extracted_duration,
            "processing_time": elapsed_time,
            "sample_rate": self.TARGET_SR,
            "model_name": "USEF-TFGridNet (WSJ0-2mix)",
            "device": str(self.device),
        }
