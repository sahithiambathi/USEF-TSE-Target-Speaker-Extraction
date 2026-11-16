import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle, XCircle, Zap, RotateCcw, Cpu } from "lucide-react";

export default function ExtractionAction({
  canExtract,
  isExtracting,
  onExtract,
  error,
  onClearError,
}) {
  const [loadingPhase, setLoadingPhase] = useState(0);

  const processingStages = [
    "Uploading audio streams to USEF-TSE server...",
    "Resampling to 8 kHz & computing complex STFT spectrograms...",
    "Executing USEF-TFGridNet cross-attention across time-frequency bins...",
    "Attenuating interfering voices & synthesizing clean waveform via iSTFT...",
  ];

  useEffect(() => {
    let timer;
    if (isExtracting) {
      setLoadingPhase(0);
      timer = setInterval(() => {
        setLoadingPhase((prev) => (prev < processingStages.length - 1 ? prev + 1 : prev));
      }, 2500);
    } else {
      setLoadingPhase(0);
    }
    return () => clearInterval(timer);
  }, [isExtracting]);

  return (
    <div className="w-full flex flex-col items-center justify-center my-8 space-y-5">
      {/* Real-time Oscilloscope Extraction Animation (Active only during real inference) */}
      {isExtracting && (
        <div
          className="w-full max-w-2xl bg-[var(--bg-surface-1)] border border-[var(--accent-lime)]/50 rounded-2xl p-5 shadow-[0_0_30px_var(--accent-lime-glow)] relative overflow-hidden transition-all duration-300"
          aria-live="polite"
        >
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 studio-grid-bg opacity-30 pointer-events-none" />

          {/* Thin horizontal laser scanning line */}
          <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[var(--accent-lime)] to-transparent opacity-90 animate-scan-laser pointer-events-none shadow-[0_0_10px_var(--accent-lime)]" />

          {/* Waveform Convergence Graphic */}
          <div className="relative z-10 flex flex-col items-center justify-center py-2">
            <div className="w-full h-20 relative flex items-center justify-center">
              <svg className="w-full h-20" viewBox="0 0 500 80" fill="none">
                {/* Upper mixture wave line */}
                <path
                  d="M0 24 Q 70 8, 140 24 T 280 34 T 400 40 T 500 40"
                  stroke="var(--accent-cyan)"
                  strokeWidth="2.2"
                  className="animate-wave-flow-1"
                  opacity="0.8"
                />

                {/* Lower interfering wave line */}
                <path
                  d="M0 56 Q 70 72, 140 56 T 280 46 T 400 40 T 500 40"
                  stroke="var(--text-muted)"
                  strokeWidth="1.8"
                  strokeDasharray="4 4"
                  className="animate-wave-flow-2"
                  opacity="0.6"
                />

                {/* Center isolated target waveform emerging on the right half */}
                <path
                  d="M 280 40 Q 330 20, 380 40 T 440 40 T 500 40"
                  stroke="var(--accent-lime)"
                  strokeWidth="3.5"
                  className="animate-pulse-glow"
                />
              </svg>
            </div>

            {/* Stage Text & Indicator */}
            <div className="flex flex-col items-center mt-2 text-center">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-[var(--accent-lime)] font-bold">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{processingStages[loadingPhase]}</span>
              </div>
              <span className="text-[10px] font-mono text-[var(--text-secondary)] mt-1.5">
                PyTorch USEF-TFGridNet Model Active • 15.6M Parameters
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Action Button */}
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onExtract}
          disabled={!canExtract || isExtracting}
          className={`px-8 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2.5 transition-all duration-200 border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] ${
            isExtracting
              ? "bg-[var(--bg-surface-2)] text-[var(--text-muted)] border-[var(--border-subtle)] cursor-not-allowed opacity-80"
              : canExtract
              ? "bg-[var(--accent-lime)] hover:bg-[var(--accent-lime-hover)] text-[var(--accent-lime-text)] border-[var(--accent-lime)] shadow-lg hover:shadow-[0_0_24px_var(--accent-lime-glow)] scale-100 hover:scale-[1.02] active:scale-[0.99]"
              : "bg-[var(--bg-surface-2)] text-[var(--text-muted)] border-[var(--border-subtle)] cursor-not-allowed opacity-60"
          }`}
        >
          {isExtracting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[var(--accent-lime)]" />
              <span>Extracting Target Speaker...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current" />
              <span>Extract Target Speaker</span>
            </>
          )}
        </button>

        {!canExtract && !isExtracting && (
          <span className="text-[11px] font-mono text-[var(--text-secondary)]">
            Upload both Mixture Recording and Target Speaker Reference to begin
          </span>
        )}
      </div>

      {/* API Error Box with Retry */}
      {error && (
        <div className="w-full max-w-xl p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start justify-between gap-3 shadow-md">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-rose-200">Extraction Error</p>
              <p className="text-[11px] text-rose-300/90 mt-0.5 leading-relaxed">{error}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {canExtract && (
              <button
                type="button"
                onClick={onExtract}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-[10px] uppercase font-bold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Retry
              </button>
            )}
            <button
              type="button"
              onClick={onClearError}
              className="p-1 rounded text-rose-400 hover:text-white transition-colors cursor-pointer"
              title="Dismiss error"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
