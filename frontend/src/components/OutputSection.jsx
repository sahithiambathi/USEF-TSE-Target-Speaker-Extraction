import React, { useState } from "react";
import { Download, RotateCcw, Check, SlidersHorizontal, Clock } from "lucide-react";
import AudioWavePlayer from "./AudioWavePlayer";

export default function OutputSection({
  result,
  mixedAudioUrl,
  mixedFile,
  onReset,
}) {
  const [showComparison, setShowComparison] = useState(false);

  if (!result) return null;

  const handleDownload = () => {
    if (!result.download_url) return;
    const link = document.createElement("a");
    link.href = result.download_url;
    link.download = result.output_filename || "extracted_target_speaker.wav";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="result" className="py-10 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Sleek Output Bar matching reference image */}
        <div className="rounded-3xl bg-[var(--bg-surface-0)] border-2 border-[var(--accent-lime)]/70 p-6 sm:p-8 shadow-[0_0_35px_var(--accent-lime-glow)] relative overflow-hidden transition-all duration-300">
          {/* Top header row: Check badge, title, and A/B toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--accent-lime)] text-[var(--accent-lime-text)] flex items-center justify-center font-bold shadow-md">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-sans font-black tracking-tight text-[var(--text-primary)] uppercase">
                  YOUR TARGET VOICE ISOLATED.
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-mono">
                  USEF-TFGridNet complex STFT extraction • 8000 Hz
                </p>
              </div>
            </div>

            {/* Performance metrics & A/B Comparison Toggle */}
            <div className="flex items-center gap-3 flex-wrap">
              {result.processing_time && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-surface-2)] text-xs font-mono text-[var(--text-secondary)]">
                  <Clock className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
                  <span>{result.processing_time}s inference</span>
                </div>
              )}

              {mixedAudioUrl && (
                <button
                  type="button"
                  onClick={() => setShowComparison(!showComparison)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                    showComparison
                      ? "bg-[var(--accent-lime)] text-[var(--accent-lime-text)] shadow-sm"
                      : "bg-[var(--bg-surface-2)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)]"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>A/B Comparison</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Extracted Audio Waveform Player matching reference */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] mb-6">
            <AudioWavePlayer
              audioUrl={result.output_url}
              title={result.output_filename}
              mode="extracted"
              channelCode="CH-OUT"
            />
          </div>

          {/* A/B Comparison Deck (if toggled on) */}
          {showComparison && mixedAudioUrl && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 rounded-2xl bg-[var(--bg-surface-1)] border border-[var(--border-subtle)]">
              {/* Original Mixture Track */}
              <div className="p-3.5 rounded-xl bg-[var(--bg-surface-2)]">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] mb-2">
                  <span className="font-bold text-[var(--text-primary)]">1. Original Mixture</span>
                  <span className="text-[10px]">Overlapping Speech</span>
                </div>
                <AudioWavePlayer
                  audioUrl={mixedAudioUrl}
                  title={mixedFile?.name || "Mixture"}
                  mode="mixture"
                  channelCode="CH-01"
                />
              </div>

              {/* Extracted Isolated Voice */}
              <div className="p-3.5 rounded-xl bg-[var(--accent-lime-dim)] border border-[var(--accent-lime)]/40">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] mb-2">
                  <span className="font-bold text-[var(--accent-lime)]">2. Extracted Target Voice</span>
                  <span className="text-[10px] text-[var(--accent-lime)] font-bold">Clean Isolated Output</span>
                </div>
                <AudioWavePlayer
                  audioUrl={result.output_url}
                  title={result.output_filename}
                  mode="extracted"
                  channelCode="CH-OUT"
                />
              </div>
            </div>
          )}

          {/* Action Row matching reference: Download WAV & New Extraction */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs font-mono text-[var(--text-secondary)]">
              <span>{result.output_filename}</span> • <span>WAV Format</span> • <span>8 kHz Audio</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-bold bg-[var(--accent-lime)] hover:bg-[var(--accent-lime-hover)] text-[var(--accent-lime-text)] shadow-[0_0_20px_var(--accent-lime-glow)] transition-all cursor-pointer uppercase"
              >
                <Download className="w-4 h-4" />
                <span>Download WAV</span>
              </button>

              <button
                type="button"
                onClick={onReset}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-mono font-bold bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] transition-all cursor-pointer uppercase"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Extraction</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
