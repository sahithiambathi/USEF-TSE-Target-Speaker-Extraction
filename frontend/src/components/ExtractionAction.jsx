import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle, XCircle, Zap } from "lucide-react";

export default function ExtractionAction({
  canExtract,
  isExtracting,
  onExtract,
  error,
  onClearError,
}) {
  const [loadingPhase, setLoadingPhase] = useState(0);

  const loadingMessages = [
    "Uploading audio streams to USEF-TSE engine...",
    "Computing STFT spectrograms & TFGridNet cross-attention...",
    "Separating target speaker features from mixture...",
    "Synthesizing isolated target voice via iSTFT...",
  ];

  useEffect(() => {
    let interval;
    if (isExtracting) {
      setLoadingPhase(0);
      interval = setInterval(() => {
        setLoadingPhase((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 2500);
    } else {
      setLoadingPhase(0);
    }
    return () => clearInterval(interval);
  }, [isExtracting]);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 space-y-4">
      {/* Real-time Oscilloscope Extraction Animation (Active only during processing) */}
      {isExtracting && (
        <div
          className="w-full max-w-2xl bg-[#0b0f16] border border-teal-800/60 rounded-md p-4 shadow-lg relative overflow-hidden transition-all duration-300"
          aria-live="polite"
        >
          {/* Oscilloscope Grid Background */}
          <div className="absolute inset-0 sound-lab-grid opacity-30 pointer-events-none" />

          {/* Thin horizontal laser scanning line */}
          <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-lime-400 to-transparent opacity-80 animate-scan pointer-events-none shadow-[0_0_8px_#a3e635]" />

          {/* Waveform Convergence Graphic: Two waves converging into one isolated wave */}
          <div className="relative z-10 flex flex-col items-center justify-center py-2">
            <div className="w-full h-16 relative flex items-center justify-center">
              <svg className="w-full h-16" viewBox="0 0 500 64" fill="none">
                {/* Upper mixture wave line - converging downwards */}
                <path
                  d="M0 20 Q 70 5, 140 20 T 280 28 T 400 32 T 500 32"
                  stroke="#2dd4bf"
                  strokeWidth="2"
                  className="animate-converge-upper"
                />

                {/* Lower interfering wave line - converging upwards and attenuating */}
                <path
                  d="M0 44 Q 70 59, 140 44 T 280 36 T 400 32 T 500 32"
                  stroke="#64748b"
                  strokeWidth="1.75"
                  strokeDasharray="4 4"
                  className="animate-converge-lower"
                />

                {/* Center isolated target waveform emerging on the right half */}
                <path
                  d="M 280 32 Q 330 18, 380 32 T 440 32 T 500 32"
                  stroke="#a3e635"
                  strokeWidth="2.5"
                  className="animate-isolated-pulse"
                />
              </svg>
            </div>

            {/* Stage Text & Indicator */}
            <div className="flex flex-col items-center mt-2 text-center">
              <span className="font-mono text-xs text-lime-400 font-medium">
                {loadingMessages[loadingPhase]}
              </span>
              <span className="text-[10px] font-mono text-slate-500 mt-1">
                TFGridNet Cross-Attention Active • 8 kHz Processing
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Action Button */}
      <div className="relative">
        <button
          type="button"
          onClick={onExtract}
          disabled={!canExtract || isExtracting}
          className={`px-8 py-3 rounded-md font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2.5 transition-all duration-150 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 ${
            isExtracting
              ? "bg-[#141b25] text-slate-400 border-[#222c3d] cursor-not-allowed"
              : canExtract
              ? "bg-[#16221c] text-lime-400 border-lime-500/80 hover:bg-[#1d2f26] hover:border-lime-400 active:scale-[0.99] shadow-sm cursor-pointer"
              : "bg-[#10141c] text-slate-500 border-[#1c2432] cursor-not-allowed opacity-60"
          }`}
          aria-label="Extract target speaker from mixture"
        >
          {isExtracting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-lime-400" />
              <span>Processing Audio...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-lime-400" />
              <span>Extract Target Speaker</span>
            </>
          )}
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          className="w-full max-w-xl mx-auto p-3 rounded-md bg-[#1d1214] border border-rose-800/80 text-rose-200 text-xs flex items-start justify-between gap-3 font-mono shadow-sm"
          role="alert"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-rose-300 uppercase tracking-wider">
                [Inference Error]:
              </span>{" "}
              <span className="text-rose-200/90">{error}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClearError}
            className="text-rose-400 hover:text-rose-200 p-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-400 cursor-pointer"
            aria-label="Dismiss error"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
