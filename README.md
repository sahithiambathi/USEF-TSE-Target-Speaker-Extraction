# USEF-TSE: Target Speaker Extraction Web Application

A full-stack, research-grade web application for **Universal Speaker Embedding Free Target Speaker Extraction (USEF-TSE)**, built for college project demonstration and evaluation.

Based on the research paper: *USEF-TSE: Universal Speaker Embedding Free Target Speaker Extraction* (Z. Bang et al., Interspeech / ArXiv [2409.02615](https://arxiv.org/abs/2409.02615)).

---

## 🚀 Key Features

- **Genuine Deep Learning Inference**: Uses the official pretrained `USEF-TFGridNet` model (15.6M parameters) trained on the standard **WSJ0-2mix** speaker extraction benchmark.
- **Single-Page Polished Interface**: Designed in React + Tailwind CSS with a dark navy/charcoal research theme, subtle purple/indigo accents, rounded cards, and responsive layout.
- **Full Audio Lifecycle**:
  - Drag-and-drop & file browsing for **Mixed Audio** (multi-speaker mixture) and **Target Reference** (clean speaker prompt).
  - In-browser playback with seekable progress bars, duration tracking, and waveform visualizers before processing.
  - One-click **"Extract Target Speaker"** with live multi-stage processing indicators.
  - Result card displaying isolated speech waveform, audio player, duration, processing latency, and a prominent **Download WAV** button.
- **Built-in Demo Samples**: Includes ready-to-test sample audio files accessible via the **"Load Demo Samples"** button for immediate presentation without manual recording preparation.

---

## 📁 Repository Structure

```
usef tse project/
├── original-USEF-TSE/        # Original research repository (cloned and kept isolated)
│   ├── config/               # Model configurations (SepFormer & TFGridNet)
│   ├── models/               # Model architectures and local layers
│   ├── trainer/              # Training routines
│   └── eval.py               # Evaluation script
├── backend/                  # FastAPI Application & Inference Engine
│   ├── app.py                # REST API endpoints (/api/status, /api/extract, /api/samples)
│   ├── inference.py          # PyTorch inference pipeline (audio loading, STFT, model forward, iSTFT)
│   ├── create_samples.py     # Demo sample audio synthesizer
│   ├── requirements.txt      # Python dependencies
│   ├── checkpoints/          # Pretrained weights (USEF-TFGridNet WSJ0-2mix)
│   ├── samples/              # Pre-generated sample multi-speaker audio files
│   └── temp/                 # Temporary storage for uploaded and extracted audio
├── frontend/                 # React + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── components/       # Header, AudioUploadCard, ExtractionAction, OutputSection, AudioWavePlayer, ResearchModal
│   │   ├── App.jsx           # Main single-page workflow
│   │   └── index.css         # Styling and dark theme variables
│   └── package.json
└── run_app.py                # Single-command launcher script
```

---

## 🛠️ Quick Start

### 1. Prerequisites
- **Python 3.10+** (tested on Python 3.13)
- **Node.js v18+** & **npm**

### 2. Launching Both Servers

Simply run the launcher script from the project root:

```bash
python run_app.py
```

This starts:
- **FastAPI Backend**: `http://127.0.0.1:8000` (API Docs at `http://127.0.0.1:8000/docs`)
- **Vite Frontend**: `http://localhost:5173`

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Demonstration Workflow

1. Open `http://localhost:5173`.
2. Notice the green **"Model Online"** status indicator in the top header.
3. Click **"Load Demo Samples"** to automatically populate:
   - **Mixed Audio**: A 2-speaker overlapping recording.
   - **Target Reference**: A clean 2.5-second clip of Speaker A.
4. Listen to both tracks using the integrated waveform players.
5. Click **"Extract Target Speaker"**.
6. Watch the real-time inference progress. Within ~9 seconds (CPU), the model isolates Speaker A's speech.
7. Listen to the extracted target speech in the result card and click **"Download WAV"**.
