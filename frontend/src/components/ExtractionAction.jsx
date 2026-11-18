import React from "react";
import { Loader2, AlertCircle, XCircle, RotateCcw, AudioWaveform } from "lucide-react";

export default function ExtractionAction({
  canExtract,
  isExtracting,
  onExtract,
  error,
  onClearError,
}) {
  return (
    <div className="w-full flex flex-col items-center justify-center my-8 space-y-4">
      {/* Extract Target Speaker Button with Internal Loading State */}
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onExtract}
          disabled={!canExtract || isExtracting}
          className={`px-8 py-4 rounded-2xl font-sans text-sm font-bold flex flex-col items-center justify-center gap-1.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] min-w-[280px] sm:min-w-[320px] ${
            isExtracting
              ? "btn-gold cursor-wait shadow-lg brightness-95 pointer-events-none"
              : canExtract
              ? "btn-gold cursor-pointer shadow-lg hover:shadow-[0_0_24px_var(--accent-gold-glow)] scale-100 hover:scale-[1.02] active:scale-[0.99]"
              : "bg-[var(--bg-surface-2)] text-[var(--text-muted)] border border-[var(--border-subtle)] cursor-not-allowed opacity-60"
          }`}
        >
          {isExtracting ? (
            <>
              <div className="flex items-center gap-2.5">
                <Loader2 className="w-5 h-5 animate-spin text-[var(--accent-gold-text)]" />
                <span className="text-base tracking-tight text-[var(--accent-gold-text)]">
                  Extracting Target Speech...
                </span>
              </div>
              <span className="text-[11px] font-normal text-[var(--accent-gold-text)] opacity-90">
                Running USEF-TFGridNet acoustic separation
              </span>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <AudioWaveform className="w-5 h-5" />
                <span className="text-base tracking-tight">Extract Target Speaker</span>
              </div>
              <span className="text-[11px] font-normal opacity-90">
                Let&apos;s find the voice you want!
              </span>
            </>
          )}
        </button>

        {!canExtract && !isExtracting && (
          <span className="text-xs font-sans text-[var(--text-muted)] mt-1">
            Upload both Mixture Audio and Target Reference to extract
          </span>
        )}
      </div>

      {/* API Error Box with Retry */}
      {error && (
        <div className="w-full max-w-xl p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-sans flex items-start justify-between gap-3 shadow-md">
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
