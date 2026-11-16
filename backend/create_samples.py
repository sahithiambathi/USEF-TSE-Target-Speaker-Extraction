import numpy as np
import soundfile as sf
import os
from pathlib import Path

def generate_formant_speech(duration=4.0, sr=8000, f0=130.0, formant_freqs=(500, 1500, 2500), seed=42):
    """
    Synthesizes speech-like audio with fundamental frequency f0 and vowel formants,
    shaped by human syllable rhythm envelopes.
    """
    np.random.seed(seed)
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)
    
    # Pulse train with jitter
    signal = np.zeros_like(t)
    period = 1.0 / f0
    pulses = np.arange(0, duration, period)
    pulses += np.random.uniform(-0.05 * period, 0.05 * period, size=len(pulses))
    
    pulse_indices = (pulses * sr).astype(int)
    pulse_indices = pulse_indices[pulse_indices < len(signal)]
    signal[pulse_indices] = 1.0

    # Human speech syllable envelope (~3-4 Hz modulation)
    syllable_rate = 3.5
    env = 0.5 * (1 + np.sin(2 * np.pi * syllable_rate * t - 0.5))
    env = np.clip(env, 0.1, 1.0) ** 1.8
    # Pause in middle for realism
    pause_mask = ~((t > 1.6) & (t < 2.0))
    env = env * pause_mask

    # Resonate through formant filters (IIR resonators)
    filtered = np.zeros_like(signal)
    for f_c in formant_freqs:
        # Simple digital resonator
        bw = 80.0 # Hz bandwidth
        r = np.exp(-np.pi * bw / sr)
        theta = 2 * np.pi * f_c / sr
        a1 = -2 * r * np.cos(theta)
        a2 = r * r
        b0 = 1.0 - r

        # Apply second order filter manually for stability
        y = np.zeros_like(signal)
        for n in range(2, len(signal)):
            y[n] = b0 * signal[n] - a1 * y[n-1] - a2 * y[n-2]
        filtered += y

    # Add subtle aspiration / breath noise
    noise = np.random.randn(len(t)) * 0.03
    speech = (filtered + noise) * env

    # Normalize
    speech = speech / (np.max(np.abs(speech)) + 1e-6) * 0.8
    return speech.astype(np.float32)

def main():
    samples_dir = Path(__file__).resolve().parent / "samples"
    samples_dir.mkdir(parents=True, exist_ok=True)
    sr = 8000

    # Speaker A (lower pitch, e.g. male formants [600, 1000, 2400])
    spk_a = generate_formant_speech(duration=4.5, sr=sr, f0=120.0, formant_freqs=(600, 1100, 2400), seed=101)
    # Speaker B (higher pitch, e.g. female formants [450, 1800, 2800])
    spk_b = generate_formant_speech(duration=4.5, sr=sr, f0=210.0, formant_freqs=(450, 1800, 2800), seed=202)

    # Reference utterances (shorter 2.5s samples of each speaker with different syllable seeds)
    ref_a = generate_formant_speech(duration=2.5, sr=sr, f0=120.0, formant_freqs=(600, 1100, 2400), seed=303)
    ref_b = generate_formant_speech(duration=2.5, sr=sr, f0=210.0, formant_freqs=(450, 1800, 2800), seed=404)

    # Mixed audio = 0.5 * spk_a + 0.5 * spk_b
    mixed = 0.5 * spk_a + 0.5 * spk_b

    # Save
    sf.write(samples_dir / "speaker_a_ref.wav", ref_a, sr, subtype="PCM_16")
    sf.write(samples_dir / "speaker_b_ref.wav", ref_b, sr, subtype="PCM_16")
    sf.write(samples_dir / "mixed_speakers.wav", mixed, sr, subtype="PCM_16")

    print(f"Sample audio files generated in {samples_dir}")

if __name__ == "__main__":
    main()
