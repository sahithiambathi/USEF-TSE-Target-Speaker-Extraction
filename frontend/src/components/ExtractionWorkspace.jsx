import React, { useState } from "react";
import { Waves, ArrowRight, Loader2, RotateCcw, AlertCircle, XCircle, Sparkles, RefreshCw } from "lucide-react";
import AudioUploadCard from "./AudioUploadCard";

export default function ExtractionWorkspace({
  mixedFile,
  mixedAudioUrl,
  mixedDuration,
  refFile,
  refAudioUrl,
  refDuration,
  onSelectMixed,
  onRemoveMixed,
  onSelectRef,
  onRemoveRef,
  isExtracting,
  canExtract,
  onExtract,
  error,
  onClearError,
  backendState,
  onRecheckBackend,
  onLoadSample,
}) {
  const [loadingPhase, setLoadingPhase] = useState(0);

  const processingStages = [
    "Uploading audio streams to USEF-TSE server...",
    "Resampling to 8 kHz & computing complex STFT spectrograms...",
    "Executing USEF-TFGridNet cross-attention across time-frequency bins...",
    "Attenuating interfering voices & synthesizing clean waveform via iSTFT...",
  ];

  React.useEffect(() => {
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

  const isModelReady = backendState?.isReady;
  const isModelLoading = backendState?.state === "LOADING";
  const isBackendOffline = backendState?.state === "OFFLINE";

  return (
    <section id="workspace" className="py-12 sm:py-20 border-b border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Brutalist Studio Chassis matching reference */}
        <div className="rounded-3xl bg-[var(--bg-surface-0)] border border-[var(--border-subtle)] p-6 sm:p-8 md:p-10 shadow-[var(--shadow-chassis)] relative overflow-hidden">
          {/* Subtle perimeter neon glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--accent-coral)] via-[var(--accent-lime)] to-[var(--accent-lime)] opacity-70" />

          {/* Chassis Top Bar: Heading, Subtitle & Backend Connection Status */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 mb-8 border-b border-[var(--border-subtle)]">
            <div>
              <div className="flex items-center gap-3">
                <Waves className="w-6 h-6 text-[var(--accent-lime)]" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-black tracking-tight text-[var(--text-primary)] uppercase">
                  PULL A VOICE OUT OF THE NOISE.
                </h2>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] font-sans">
                Give us the conversation and a reference voice. We&apos;ll isolate the speaker you want.
              </p>
            </div>

            {/* Honest Backend & Model Status Bar */}
            <div className="flex items-center gap-3 flex-wrap">
              {isModelReady ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-lime-dim)] border border-[var(--accent-lime)]/40 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-lime)] shadow-[0_0_8px_var(--accent-lime)] animate-pulse" />
                  <span className="font-bold text-[var(--accent-lime)]">
                    Model Online (8 kHz • {backendState.device?.toUpperCase()})
                  </span>
                </div>
              ) : isModelLoading ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Loading PyTorch weights...</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Backend Offline</span>
                  <button
                    type="button"
                    onClick={onRecheckBackend}
                    className="p-1 hover:text-white transition-colors cursor-pointer"
                    title="Retry connection"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Load Demo Samples trigger */}
              <button
                type="button"
                onClick={onLoadSample}
                disabled={isExtracting}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-lime)]/40 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
                <span>Load Demo Samples</span>
              </button>
            </div>
          </div>

          {/* Offline notice with troubleshooting advice if server isn't running */}
          {isBackendOffline && (
            <div className="mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-rose-200">FastAPI backend is not reachable.</span>
                  <p className="text-[11px] text-rose-300/80 mt-0.5">
                    Run <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300">python run_app.py</code> from the project root to launch both FastAPI (port 8000) and the inference engine.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onRecheckBackend}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-white font-bold text-[11px] shrink-0 cursor-pointer"
              >
                Recheck Engine
              </button>
            </div>
          )}

          {/* Main Studio Deck Grid: Left Inputs (8 cols), Right Extract Block (4 cols) matching reference */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Input Cards Container (8 cols on desktop) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Card 1: Mixture Audio */}
              <AudioUploadCard
                id="mixture-audio-input"
                label="MIXTURE AUDIO"
                channelCode="CH-01"
                variant="mixture"
                file={mixedFile}
                audioUrl={mixedAudioUrl}
                duration={mixedDuration}
                onFileSelect={onSelectMixed}
                onRemove={onRemoveMixed}
                isExtracting={isExtracting}
              />

              {/* Card 2: Target Voice Reference */}
              <AudioUploadCard
                id="reference-audio-input"
                label="TARGET VOICE REFERENCE"
                channelCode="REF-01"
                variant="reference"
                file={refFile}
                audioUrl={refAudioUrl}
                duration={refDuration}
                onFileSelect={onSelectRef}
                onRemove={onRemoveRef}
                isExtracting={isExtracting}
              />
            </div>

            {/* Right Side: Big Electric Lime Extraction Action Block matching reference */}
            <div className="lg:col-span-4 flex flex-col">
              <button
                type="button"
                onClick={onExtract}
                disabled={!canExtract || isExtracting}
                className={`w-full flex-1 min-h-[170px] lg:min-h-full rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all duration-200 border select-none cursor-pointer group ${
                  isExtracting
                    ? "bg-[var(--bg-surface-2)] text-[var(--text-muted)] border-[var(--border-subtle)] cursor-wait"
                    : canExtract
                    ? "bg-[var(--accent-lime)] hover:bg-[var(--accent-lime-hover)] text-[var(--accent-lime-text)] border-[var(--accent-lime)] shadow-[0_0_30px_var(--accent-lime-glow)] hover:shadow-[0_0_50px_var(--accent-lime-glow)] scale-100 hover:scale-[1.01] active:scale-[0.99]"
                    : "bg-[var(--bg-surface-2)]/60 text-[var(--text-muted)] border-[var(--border-subtle)] opacity-50 cursor-not-allowed"
                }`}
              >
                {isExtracting ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-9 h-9 animate-spin text-[var(--accent-lime)]" />
                    <span className="font-mono text-sm font-black uppercase tracking-wider text-[var(--text-primary)]">
                      INFERENCING...
                    </span>
                    <span className="font-mono text-[11px] text-[var(--accent-lime)] max-w-xs">
                      {processingStages[loadingPhase]}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    {/* Equalizer Icon inside button */}
                    <div className="flex items-center gap-1 h-7">
                      <span className="w-1 h-3.5 bg-current rounded-full" />
                      <span className="w-1 h-6 bg-current rounded-full" />
                      <span className="w-1.5 h-7 bg-current rounded-full" />
                      <span className="w-1 h-5 bg-current rounded-full" />
                      <span className="w-1 h-2.5 bg-current rounded-full" />
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-xl sm:text-2xl font-sans font-black uppercase tracking-tight leading-none">
                        EXTRACT
                      </span>
                      <div className="flex items-center gap-2 text-xl sm:text-2xl font-sans font-black uppercase tracking-tight leading-none mt-1">
                        <span>TARGET VOICE</span>
                        <ArrowRight className="w-5 h-5 stroke-[3] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {!canExtract && (
                      <span className="text-[10px] font-mono opacity-80 mt-1">
                        Upload both files to start
                      </span>
                    )}
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Extraction Error Notice with Retry */}
          {error && (
            <div className="mt-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-rose-200">Extraction Failed</span>
                  <p className="text-[11px] text-rose-300/80 mt-0.5">{error}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {canExtract && (
                  <button
                    type="button"
                    onClick={onExtract}
                    className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-white font-bold text-[10px] uppercase cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Retry
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClearError}
                  className="p-1 hover:text-white text-rose-400 transition-colors cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
