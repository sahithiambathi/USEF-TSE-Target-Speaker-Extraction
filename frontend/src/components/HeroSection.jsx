import React from "react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import HeroWaveformCanvas from "./HeroWaveformCanvas";

export default function HeroSection({
  onStartExtracting,
  onLoadSample,
  isExtracting,
}) {
  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative pt-8 pb-16 sm:pt-14 sm:pb-20 overflow-hidden studio-ambient-lighting border-b border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Grid: Left Brutalist Typography & CTAs, Right Cinematic Waveform Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Column: Heading & CTAs (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col items-start text-left space-y-6">
            {/* Tag Badge matching reference */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-[var(--text-secondary)] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-lime)] animate-pulse shadow-[0_0_8px_var(--accent-lime)]" />
              <span className="text-[var(--text-primary)] font-semibold">Target Speaker Extraction</span>
            </div>

            {/* Main Brutalist Heading matching reference */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-black italic tracking-tighter leading-[0.98] uppercase text-[var(--text-primary)]">
              ONE VOICE. <br />
              <span className="text-[var(--accent-lime)] glow-text-lime not-italic">
                OUT OF THE NOISE.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans max-w-lg">
              Separate the speaker you want from a mixture of voices. Upload a recording, provide a short voice reference, and extract the voice that matters.
            </p>

            {/* Buttons Row matching reference */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-2">
              <button
                type="button"
                onClick={onStartExtracting}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-mono text-xs uppercase tracking-wider font-extrabold bg-[var(--accent-lime)] hover:bg-[var(--accent-lime-hover)] text-[var(--accent-lime-text)] shadow-[0_0_20px_var(--accent-lime-glow)] hover:shadow-[0_0_35px_var(--accent-lime-glow)] transition-all cursor-pointer scale-100 hover:scale-[1.02] active:scale-[0.99]"
              >
                <span>TRY SPEAKER EXTRACTION</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={scrollToHowItWorks}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold bg-[var(--bg-surface-1)] hover:bg-[var(--bg-surface-2)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[var(--accent-lime)]" />
                <span>HOW IT WORKS</span>
              </button>

              <button
                type="button"
                onClick={onLoadSample}
                disabled={isExtracting}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold bg-[var(--accent-lime-dim)] hover:bg-[var(--accent-lime)]/25 text-[var(--accent-lime)] border border-[var(--accent-lime)]/30 transition-all cursor-pointer disabled:opacity-50"
                title="Immediately test using demo sample files"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>DEMO</span>
              </button>
            </div>
          </div>

          {/* Right Column: Spectacular Cinematic Waveform Canvas (7 cols on lg) */}
          <div className="lg:col-span-7 relative w-full rounded-2xl bg-[var(--bg-surface-1)]/70 border border-[var(--border-subtle)] shadow-[var(--shadow-chassis)] backdrop-blur-md overflow-hidden">
            <HeroWaveformCanvas />

            {/* Flow Diagram directly under the hero waveform matching reference image */}
            <div className="px-6 py-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-0)]/80 flex items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-[var(--text-secondary)]">
              {/* Mixture */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 h-4 text-[var(--text-muted)]">
                  <span className="w-1 h-2 bg-current rounded-full" />
                  <span className="w-1 h-3.5 bg-current rounded-full" />
                  <span className="w-1 h-2 bg-current rounded-full" />
                </div>
                <span className="font-semibold text-[var(--text-primary)]">Mixture</span>
              </div>

              <span className="text-[var(--text-muted)] text-base font-bold">+</span>

              {/* Reference */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 h-4 text-[var(--accent-lime)]">
                  <span className="w-1 h-2 bg-current rounded-full" />
                  <span className="w-1 h-4 bg-current rounded-full" />
                  <span className="w-1 h-2.5 bg-current rounded-full" />
                </div>
                <span className="font-semibold text-[var(--text-primary)]">Reference</span>
              </div>

              <span className="text-[var(--text-muted)] text-base font-bold">→</span>

              {/* Isolated Voice */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 h-4 text-[var(--accent-lime)] shadow-[0_0_8px_var(--accent-lime)]">
                  <span className="w-1 h-2.5 bg-current rounded-full" />
                  <span className="w-1 h-5 bg-current rounded-full" />
                  <span className="w-1 h-3 bg-current rounded-full" />
                </div>
                <span className="font-bold text-[var(--accent-lime)]">Isolated Voice</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
