import React from "react";
import { ArrowDown, Sparkles } from "lucide-react";

export default function HeroSection({ onStartExtracting, onLoadSample, isExtracting }) {
  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden studio-grid-bg border-b border-[var(--border-subtle)]">
      {/* Subtle radial ambient gradient centered behind the hero */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[340px] rounded-full blur-[110px] pointer-events-none opacity-20 bg-[var(--accent-lime)]"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Engineering Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-[var(--text-secondary)] mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-lime)] animate-pulse" />
            <span>Target Speaker Extraction • TFGridNet Neural Backbone</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold tracking-tight text-[var(--text-primary)] leading-[1.12]">
            Every voice deserves <br className="hidden sm:inline" />
            <span className="relative inline-block text-[var(--text-primary)]">
              to be heard.
              <span className="absolute left-0 right-0 -bottom-1 h-1 bg-[var(--accent-lime)] rounded-full opacity-80" />
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="mt-6 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl font-sans">
            Isolate a target speaker from mixed speech using a short reference recording and AI-powered speech extraction.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onStartExtracting}
              className="w-full sm:w-auto px-7 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-bold bg-[var(--accent-lime)] hover:bg-[var(--accent-lime-hover)] text-[var(--accent-lime-text)] shadow-md hover:shadow-[0_0_20px_var(--accent-lime-glow)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Start Extracting</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold bg-[var(--bg-surface-1)] hover:bg-[var(--bg-surface-2)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Explore How It Works</span>
            </button>

            <button
              type="button"
              onClick={onLoadSample}
              disabled={isExtracting}
              className="w-full sm:w-auto px-5 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold bg-[var(--accent-lime-dim)] hover:bg-[var(--accent-lime)]/25 text-[var(--accent-lime)] border border-[var(--accent-lime)]/30 transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              title="Immediately test using verified 2-speaker audio"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Try Demo Samples</span>
            </button>
          </div>
        </div>

        {/* Hero Visual: Custom Animated Flow Illustration (Mixture -> Reference -> Isolated Voice) */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="relative rounded-2xl bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] p-5 sm:p-7 shadow-[var(--shadow-card)] overflow-hidden">
            {/* Visual Header / Sub-labels */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-lime)] animate-ping" />
                SIGNAL SEPARATION PIPELINE
              </span>
              <span className="hidden sm:inline font-mono">
                MIXTURE → CROSS-ATTENTION → ISOLATED VOICE
              </span>
            </div>

            {/* SVG Visual Flow diagram */}
            <div className="w-full h-44 sm:h-52 relative flex items-center justify-center">
              <svg
                viewBox="0 0 800 200"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Linear gradient for extraction flow */}
                  <linearGradient id="limeFlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--text-muted)" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="var(--accent-cyan)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="var(--accent-lime)" stopOpacity="1" />
                  </linearGradient>

                  <linearGradient id="glowFilter" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--accent-lime)" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="var(--accent-lime)" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* --- 1. MIXTURE REGION (Left) --- */}
                {/* Background column label */}
                <text x="110" y="24" fill="var(--text-muted)" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  OVERLAPPING MIXTURE
                </text>

                {/* Speaker A wave component (slate) */}
                <path
                  d="M 20 70 Q 55 25, 90 70 T 160 70 T 230 70"
                  stroke="var(--text-muted)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="animate-wave-flow-1"
                  opacity="0.65"
                />
                {/* Speaker B interfering wave component (cyan/dim) */}
                <path
                  d="M 20 130 Q 55 175, 90 130 T 160 130 T 230 130"
                  stroke="var(--accent-cyan)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="animate-wave-flow-2"
                  opacity="0.75"
                />
                {/* Combined jagged collision lines */}
                <path
                  d="M 20 100 Q 40 60, 70 100 T 130 100 T 190 100 T 230 100"
                  stroke="var(--text-secondary)"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />

                {/* --- CONVERGENCE FUNNEL (Center-Left to Center) --- */}
                {/* Funnel bounds */}
                <path
                  d="M 230 65 C 290 65, 340 90, 390 95"
                  stroke="var(--border-strong)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 230 135 C 290 135, 340 110, 390 105"
                  stroke="var(--border-strong)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Target Speaker Reference Prompt Injection from top */}
                <path
                  d="M 390 32 L 390 85"
                  stroke="var(--accent-lime)"
                  strokeWidth="2"
                  strokeDasharray="2 3"
                />
                <circle cx="390" cy="32" r="4" fill="var(--accent-lime)" />
                <text x="390" y="24" fill="var(--accent-lime)" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  REFERENCE PROMPT
                </text>

                {/* --- 2. TFGridNet Cross-Attention Core (Center) --- */}
                <rect
                  x="365"
                  y="85"
                  width="50"
                  height="30"
                  rx="6"
                  fill="var(--bg-surface-2)"
                  stroke="var(--accent-lime)"
                  strokeWidth="2"
                  className="shadow-md"
                />
                <text x="390" y="104" fill="var(--text-primary)" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  USEF
                </text>

                {/* Divergence: interfering voice attenuated downward */}
                <path
                  d="M 415 105 C 470 115, 530 150, 600 160"
                  stroke="var(--text-dim)"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  opacity="0.4"
                />
                <text x="605" y="164" fill="var(--text-dim)" fontSize="10" fontFamily="monospace" opacity="0.6">
                  [Attenuated Interferers]
                </text>

                {/* --- 3. ISOLATED TARGET SPEAKER WAVEFORM (Right) --- */}
                <text x="630" y="24" fill="var(--accent-lime)" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  TARGET VOICE ISOLATED
                </text>

                {/* Main Isolated Waveform in vibrant electric lime */}
                <path
                  d="M 415 98 C 455 98, 480 50, 510 100 C 535 150, 560 55, 590 100 C 620 145, 650 65, 680 100 C 710 135, 740 85, 775 100"
                  stroke="var(--accent-lime)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="animate-target-pulse animate-pulse-glow"
                />

                {/* Soft glow halo path */}
                <path
                  d="M 415 98 C 455 98, 480 50, 510 100 C 535 150, 560 55, 590 100 C 620 145, 650 65, 680 100 C 710 135, 740 85, 775 100"
                  stroke="var(--accent-lime)"
                  strokeWidth="9"
                  strokeLinecap="round"
                  opacity="0.18"
                />
              </svg>
            </div>

            {/* Bottom Key indicators */}
            <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-surface-2)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--text-muted)]" />
                <div>
                  <div className="text-[11px] font-mono font-bold text-[var(--text-primary)]">Input Mixture</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">Multi-speaker overlap</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-surface-2)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-cyan)]" />
                <div>
                  <div className="text-[11px] font-mono font-bold text-[var(--text-primary)]">Target Reference</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">Vocal prompt guidance</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--accent-lime-dim)] border border-[var(--accent-lime)]/30">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-lime)] shadow-[0_0_8px_var(--accent-lime)]" />
                <div>
                  <div className="text-[11px] font-mono font-bold text-[var(--text-primary)]">Isolated Speech</div>
                  <div className="text-[10px] text-[var(--accent-lime)] font-mono font-medium">Clean target voice output</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
