import os
import shutil
import uuid
from pathlib import Path
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from inference import USEFExtractor

app = FastAPI(
    title="USEF-TSE API",
    description="Universal Speaker Embedding Free Target Speaker Extraction Backend",
    version="1.0.0",
)

# Enable CORS for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
TEMP_DIR = BASE_DIR / "temp"
SAMPLES_DIR = BASE_DIR / "samples"
TEMP_DIR.mkdir(parents=True, exist_ok=True)
SAMPLES_DIR.mkdir(parents=True, exist_ok=True)

# Initialize the inference engine
extractor = USEFExtractor()


@app.get("/api/status")
def get_status():
    """Returns model and system readiness status."""
    return {
        "status": extractor.model_status,
        "detail": extractor.status_detail,
        "device": str(extractor.device),
        "model_name": "USEF-TFGridNet (WSJ0-2mix)",
        "sample_rate": extractor.TARGET_SR,
    }


@app.get("/api/samples")
def list_samples():
    """Returns list of bundled sample files for demonstration."""
    # Find mixture file
    mixture_file = None
    ref_file = None
    if (SAMPLES_DIR / "mixed_speaker.wav").exists():
        mixture_file = "mixed_speaker.wav"
    elif (SAMPLES_DIR / "mixed_speakers.wav").exists():
        mixture_file = "mixed_speakers.wav"
    else:
        for f in SAMPLES_DIR.glob("*.wav"):
            if "mix" in f.name.lower():
                mixture_file = f.name
                break

    if (SAMPLES_DIR / "speaker_a_ref.wav").exists():
        ref_file = "speaker_a_ref.wav"
    else:
        for f in SAMPLES_DIR.glob("*.wav"):
            if "ref" in f.name.lower():
                ref_file = f.name
                break

    mixture_file = mixture_file or "mixed_speaker.wav"
    ref_file = ref_file or "speaker_a_ref.wav"

    return {
        "mixed": {
            "name": mixture_file,
            "title": "Mixture Recording (Multiple Speakers)",
            "url": f"/api/samples/{mixture_file}",
            "type": "mixture",
        },
        "reference": {
            "name": ref_file,
            "title": "Target Speaker Reference",
            "url": f"/api/samples/{ref_file}",
            "type": "reference",
        },
    }


@app.get("/api/samples/{filename}")
def get_sample_audio(filename: str):
    """Serves a demo sample audio file."""
    file_path = SAMPLES_DIR / filename
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Sample audio file not found")
    return FileResponse(file_path, media_type="audio/wav", filename=filename)


@app.get("/api/audio/{filename}")
def get_audio(filename: str):
    """Serves extracted or uploaded audio files."""
    file_path = TEMP_DIR / filename
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Audio file not found or expired")
    return FileResponse(file_path, media_type="audio/wav", filename=filename)


@app.post("/api/extract")
async def extract_target_speaker(
    mixed_audio: UploadFile = File(...),
    reference_audio: UploadFile = File(...),
):
    """
    Receives mixed audio and target speaker reference audio,
    executes USEF-TSE model inference, and returns extracted speaker audio.
    """
    if extractor.model_status != "ready":
        raise HTTPException(
            status_code=503,
            detail=f"USEF-TSE model is not available: {extractor.status_detail}",
        )

    # Basic format / extension validation
    allowed_extensions = {".wav", ".mp3", ".flac", ".ogg", ".m4a"}
    mix_ext = Path(mixed_audio.filename).suffix.lower()
    ref_ext = Path(reference_audio.filename).suffix.lower()

    if mix_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format for mixed audio: '{mix_ext}'. Please upload a WAV or standard audio file.",
        )
    if ref_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format for reference audio: '{ref_ext}'. Please upload a WAV or standard audio file.",
        )

    # Save uploaded files into temp directory with UUID
    session_id = uuid.uuid4().hex[:10]
    mix_temp_path = TEMP_DIR / f"upload_mix_{session_id}{mix_ext}"
    ref_temp_path = TEMP_DIR / f"upload_ref_{session_id}{ref_ext}"
    out_filename = f"extracted_speaker_{session_id}.wav"
    output_path = TEMP_DIR / out_filename

    try:
        with open(mix_temp_path, "wb") as f_mix:
            shutil.copyfileobj(mixed_audio.file, f_mix)

        with open(ref_temp_path, "wb") as f_ref:
            shutil.copyfileobj(reference_audio.file, f_ref)

        # Ensure files are non-empty
        if mix_temp_path.stat().st_size == 0:
            raise HTTPException(status_code=400, detail="Uploaded mixed audio file is empty.")
        if ref_temp_path.stat().st_size == 0:
            raise HTTPException(status_code=400, detail="Uploaded reference audio file is empty.")

        # Run extraction
        result = extractor.extract(
            mix_path=str(mix_temp_path),
            aux_path=str(ref_temp_path),
            output_path=str(output_path),
        )

        return {
            "success": True,
            "output_filename": out_filename,
            "output_url": f"/api/audio/{out_filename}",
            "download_url": f"/api/audio/{out_filename}",
            "mix_duration": result["mix_duration"],
            "ref_duration": result["aux_duration"],
            "extracted_duration": result["extracted_duration"],
            "processing_time": result["processing_time"],
            "model_name": result["model_name"],
            "device": result["device"],
            "sample_rate": result["sample_rate"],
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")
    finally:
        # Cleanup uploaded raw temp files, keep extracted output
        try:
            if mix_temp_path.exists():
                mix_temp_path.unlink()
            if ref_temp_path.exists():
                ref_temp_path.unlink()
        except Exception:
            pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
