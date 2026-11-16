"""
Convenience launcher to run both USEF-TSE Backend (FastAPI) and Frontend (Vite)
Usage:
    python run_app.py
"""

import subprocess
import sys
import time
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"

def main():
    print("=" * 60)
    print("  USEF-TSE: Target Speaker Extraction Application")
    print("=" * 60)
    print("Starting FastAPI backend on http://127.0.0.1:8000 ...")

    backend_proc = subprocess.Popen(
        [sys.executable, "app.py"],
        cwd=str(BACKEND_DIR),
    )

    time.sleep(2)

    print("Starting Vite frontend on http://localhost:5173 ...")
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=str(FRONTEND_DIR),
    )

    print("\n✓ Both services are up and running!")
    print("  • Frontend: http://localhost:5173")
    print("  • Backend API: http://127.0.0.1:8000/docs")
    print("\nPress Ctrl+C to terminate both servers.")

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Done.")

if __name__ == "__main__":
    main()
