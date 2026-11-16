import React, { useState } from "react";
import { Download, RotateCcw, Volume2, CheckCircle2, Clock, SlidersHorizontal } from "lucide-react";
import AudioWavePlayer from "./AudioWavePlayer";

export default function OutputSection({
  result,
  mixedAudioUrl,
  mixedFile,
  onReset,
}) {
  const [activeTab, setActiveTab] = useState("extracted"); // "extracted" | "comparison"

  if (!result) {
    return (
      <div className="w-full bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-[var(--shadow-card)]">
        <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] flex items-center justify-center mb-3 text-[var(--text-muted)]">
          <Volume2 className="w-6 h-6" />
        </div>
        <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-[var(--text-primary)] mb-1">
          Your Isolated Speaker
        </h4>
        <p className="text-xs text-[var(--text-secondary)] max-w-md font-sans">
          Provide your mixture and reference recordings, then click &ldquo;Extract Target Speaker&rdquo; to isolate the voice.
        </p>
      </div>
    );
  }

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
    <div className="w-full bg-[var(--bg-surface-1)] border-2 border-[var(--accent-lime)]/60 rounded-2xl p-6 sm:p-7 shadow-[0_4px_30px_-4px_var(--accent-lime-glow)] relative overflow-hidden transition-all duration-300">
      {/* Top accent border line in electric lime */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--accent-lime)]" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--accent-lime-dim)] text-[var(--accent-lime)] border border-[var(--accent-lime)]/40 shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[var(--accent-lime)] font-bold tracking-wider px-2 py-0.5 rounded bg-[var(--accent-lime-dim)]">
                CH-OUT
              </span>
              <h3 className="text-base font-mono font-bold text-[var(--text-primary)] tracking-tight">
                Your Isolated Speaker
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Target voice isolated via USEF-TFGridNet cross-attention
            </p>
          </div>
        </div>

        {/* Real Measured Metrics */}
        <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
          {result.processing_time !== undefined && result.processing_time !== null && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
              <Clock className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
              <span>{result.processing_time}s inference</span>
            </div>
          )}

          {result.extracted_duration !== undefined && result.extracted_duration !== null && (
            <div className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
              <span>{result.extracted_duration}s track</span>
            </div>
          )}

          <div className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
            <span>{result.sample_rate || 8000} Hz</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher: Isolated Speaker Player vs A/B Comparison */}
      <div className="flex items-center gap-2 mb-5 p-1 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] w-fit text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab("extracted")}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === "extracted"
              ? "bg-[var(--accent-lime)] text-[var(--accent-lime-text)] shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          Extracted Target Voice
        </button>
        {mixedAudioUrl && (
          <button
            type="button"
            onClick={() => setActiveTab("comparison")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "comparison"
                ? "bg-[var(--accent-lime)] text-[var(--accent-lime-text)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>A/B Comparison (Mixture vs Isolated)</span>
          </button>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === "extracted" ? (
        /* Single Extracted Track Player */
        <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-surface-2)]/60 border border-[var(--border-subtle)] mb-5">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] mb-3">
            <span className="font-bold text-[var(--accent-lime)]">Isolated Speech Waveform</span>
            <span className="truncate max-w-[200px]">{result.output_filename}</span>
          </div>
          <AudioWavePlayer
            audioUrl={result.output_url}
            title={result.output_filename}
            mode="extracted"
            channelCode="CH-OUT"
          />
        </div>
      ) : (
        /* A/B Comparison View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {/* Track 1: Original Mixture */}
          <div className="p-4 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] mb-3">
              <span className="font-bold text-[var(--text-primary)]">1. Original Mixture</span>
              <span className="text-[10px] text-[var(--text-muted)]">Multiple Speakers</span>
            </div>
            <AudioWavePlayer
              audioUrl={mixedAudioUrl}
              title={mixedFile?.name || "Original Mixture"}
              mode="mixture"
              channelCode="CH-01"
            />
          </div>

          {/* Track 2: Extracted Target Speaker */}
          <div className="p-4 rounded-xl bg-[var(--accent-lime-dim)] border border-[var(--accent-lime)]/40 shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] mb-3">
              <span className="font-bold text-[var(--accent-lime)]">2. Extracted Target Voice</span>
              <span className="text-[10px] text-[var(--accent-lime)] font-bold">Clean Output</span>
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

      {/* Bottom Controls Row: Download WAV and Reset */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
        <div className="text-xs font-mono text-[var(--text-secondary)] flex items-center gap-2">
          <span className="text-[var(--text-primary)] font-semibold">{result.output_filename}</span>
          <span>•</span>
          <span>WAV Audio</span>
          <span>•</span>
          <span className="text-[var(--accent-lime)] font-bold">Ready</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-medium bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Extract Another</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-mono font-bold bg-[var(--accent-lime)] hover:bg-[var(--accent-lime-hover)] text-[var(--accent-lime-text)] shadow-md hover:shadow-[0_0_20px_var(--accent-lime-glow)] transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download WAV</span>
          </button>
        </div>
      </div>
    </div>
  );
}
