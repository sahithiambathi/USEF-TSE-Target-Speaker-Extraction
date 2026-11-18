
import React from "react";
import { ArrowRight, ArrowDown, Info, Cpu, Headphones } from "lucide-react";

export default function InsideExtractionProcess() {
  const stages = [
    {
      num: 1,
      title: "Two audio inputs",
      tag: "8 kHz Audio",
      desc: "A mixed recording containing multiple speakers and a short reference recording of the target speaker.",
      visual: (
        <div className="space-y-2 py-2">
          {/* Mixed Recording Wave */}
          <div className="p-2 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-[9px] font-mono text-[var(--accent-gold)] mb-1">
              <span className="font-bold">Mixed recording</span>
              <span className="text-[8px] text-[var(--text-muted)]">x(t)</span>
            </div>
            <div className="flex items-center gap-[2px] h-6 justify-center">
              {[10, 18, 22, 14, 24, 16, 20, 12, 19, 23, 15, 18].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}px` }}
                  className="w-1 rounded-full bg-[var(--accent-gold)]/85"
                />
              ))}
            </div>
          </div>

          {/* Target Reference Wave */}
          <div className="p-2 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-[9px] font-mono text-[var(--accent-purple)] mb-1">
              <span className="font-bold">Target voice sample</span>
              <span className="text-[8px] text-[var(--text-muted)]">r(t)</span>
            </div>
            <div className="flex items-center gap-[2px] h-6 justify-center">
              {[8, 14, 18, 20, 12, 16, 14, 10, 15, 18, 12, 8].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}px` }}
                  className="w-1 rounded-full bg-[var(--accent-purple)]/85"
                />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      num: 2,
      title: "Turn audio into features",
      tag: "Complex STFT",
      desc: "STFT converts both recordings into 2D time-frequency spectrogram representations across 65 frequency bins.",
      visual: (
        <div className="space-y-2 py-2">
          {/* Spectrogram 1 */}
          <div className="h-12 rounded-lg overflow-hidden bg-gradient-to-r from-purple-950 via-slate-900 to-amber-950 flex items-center justify-center p-1 border border-[var(--border-subtle)] shadow-inner">
            <div className="w-full h-full flex items-center justify-between gap-0.5 opacity-85">
              {[60, 90, 40, 80, 100, 70, 50, 85, 95, 65, 45, 75].map((v, i) => (
                <div
                  key={i}
                  style={{ height: `${v}%` }}
                  className="flex-1 bg-gradient-to-t from-amber-400 via-purple-400 to-indigo-300 rounded-sm"
                />
              ))}
            </div>
          </div>
          {/* Spectrogram 2 */}
          <div className="h-10 rounded-lg overflow-hidden bg-gradient-to-r from-purple-950 via-slate-900 to-amber-950 flex items-center justify-center p-1 border border-[var(--border-subtle)] shadow-inner">
            <div className="w-full h-full flex items-center justify-between gap-0.5 opacity-85">
              {[40, 70, 85, 60, 75, 90, 55, 65, 80, 50, 60, 40].map((v, i) => (
                <div
                  key={i}
                  style={{ height: `${v}%` }}
                  className="flex-1 bg-gradient-to-t from-purple-400 to-amber-300 rounded-sm"
                />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      num: 3,
      title: "Match the target voice",
      tag: "Direct Attention",
      desc: "Mixture features act as Queries (Q), while reference features act as Keys (K) and Values (V) without fixed speaker embeddings.",
      visual: (
        <div className="py-2 flex flex-col items-center justify-center gap-1.5">
          <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[var(--accent-purple-dim)] text-[var(--accent-purple)] border border-[var(--accent-purple)]/30">
            Mixture = Query (Q)
          </span>
          <div className="text-[10px] text-[var(--text-muted)] leading-none">↓</div>
          <div className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--accent-gold)] text-center w-full shadow-sm">
            <span className="text-[10px] font-mono font-bold text-[var(--text-primary)] block">
              Cross-Attention
            </span>
          </div>
          <div className="text-[10px] text-[var(--text-muted)] leading-none">↑</div>
          <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[var(--accent-gold-dim)] text-[var(--accent-gold)] border border-[var(--accent-gold)]/30">
            Ref = Key (K) + Value (V)
          </span>
        </div>
      ),
    },
    {
      num: 4,
      title: "Combine the clues",
      tag: "Feature Fusion",
      desc: "The cross-attention output is concatenated with mixture representations, focusing the model exclusively on the target speaker.",
      visual: (
        <div className="h-28 flex flex-col items-center justify-center py-1">
          {/* Two incoming feature streams */}
          <div className="flex items-center justify-center gap-3 w-full">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-mono text-[var(--accent-purple)]">
                Mixture
              </span>
              <div className="flex gap-[3px]">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="w-2 h-5 rounded-sm bg-gradient-to-b from-purple-400 to-indigo-600 opacity-85"
                  />
                ))}
              </div>
            </div>

            <span className="text-[var(--text-muted)] text-xs">+</span>

            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-mono text-[var(--accent-gold)]">
                Attended Target
              </span>
              <div className="flex gap-[3px]">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="w-2 h-5 rounded-sm bg-gradient-to-b from-amber-300 to-amber-600 opacity-90"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Feature streams converge */}
          <div className="relative w-24 h-5">
            <svg
              viewBox="0 0 96 20"
              className="w-full h-full"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M20 0 L48 18 M76 0 L48 18"
                stroke="var(--border-strong)"
                strokeWidth="1.5"
              />
              <circle cx="48" cy="18" r="2" fill="var(--accent-gold)" />
            </svg>
          </div>

          {/* Fused representation */}
          <div className="flex items-center justify-center gap-1 w-full">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className={`h-3.5 flex-1 max-w-5 rounded-sm ${
                  n % 2 === 0
                    ? "bg-gradient-to-b from-amber-300 to-amber-600"
                    : "bg-gradient-to-b from-purple-400 to-indigo-600"
                } opacity-90`}
              />
            ))}
          </div>

          <span className="text-[9px] font-mono font-semibold text-[var(--text-muted)] mt-2">
            Fused TF Representations
          </span>
        </div>
      ),
    },
    {
      num: 5,
      title: "Separate the voice",
      tag: "TF-GridNet",
      desc: "6 TFGridNet blocks with intra/inter BLSTMs iteratively estimate a complex spectral ratio mask for the target speech.",
      visual: (
        <div className="h-28 flex flex-col items-center justify-center gap-2 py-1">
          <div className="flex items-center gap-1 opacity-70">
            <div className="w-1 h-3 rounded bg-slate-400" />
            <div className="w-1 h-5 rounded bg-slate-400" />
            <div className="w-1 h-2 rounded bg-slate-400" />
          </div>
          <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-[var(--bg-surface-2)] to-[var(--bg-surface-3)] border border-[var(--accent-purple)] flex items-center gap-1.5 shadow-md">
            <Cpu className="w-3.5 h-3.5 text-[var(--accent-purple)]" />
            <span className="text-[10px] font-mono font-bold text-[var(--text-primary)]">
              TF-GridNet
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-3 rounded bg-[var(--accent-gold)]" />
            <div className="w-1 h-6 rounded bg-[var(--accent-gold)]" />
            <div className="w-1 h-4 rounded bg-[var(--accent-gold)]" />
            <div className="w-1 h-5 rounded bg-[var(--accent-gold)]" />
          </div>
        </div>
      ),
    },
    {
      num: 6,
      title: "Listen to the result",
      tag: "iSTFT Waveform",
      desc: "Inverse STFT reconstructs the estimated complex spectrogram into a clean, single-speaker time-domain audio waveform.",
      isFinal: true,
      visual: (
        <div className="h-28 flex flex-col items-center justify-center gap-2 py-1">
          <div className="w-10 h-10 rounded-full bg-[var(--accent-gold)] text-[var(--accent-gold-text)] flex items-center justify-center shadow-md">
            <Headphones className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1 h-6">
            {[8, 16, 24, 18, 22, 14, 20, 10].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}px` }}
                className="w-1 rounded-full bg-[var(--accent-gold)]"
              />
            ))}
          </div>
          <span className="text-[9px] font-mono font-bold text-[var(--accent-gold)]">
            Clean Target Speech ŝ(t)
          </span>
        </div>
      ),
    },
  ];

  return (
    <section id="process" className="py-16 sm:py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-0)]/50 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[130px] pointer-events-none opacity-20 bg-[var(--accent-purple)]"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header matching Image 1 Reference */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-[var(--accent-purple-dim)] text-[var(--accent-purple)] border border-[var(--accent-purple)]/30 mb-3 shadow-sm">
                <span>ACOUSTIC PIPELINE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-[var(--text-primary)]">
                Inside the{" "}
                <span className="font-editorial italic font-normal text-gold-gradient">
                  Extraction Process
                </span>
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)] font-sans max-w-xl">
                A mixed recording + a short voice sample = the speaker you want to hear.
              </p>
            </div>

            {/* Concise Paper-Accurate Explanation */}
            <div className="max-w-md p-4 rounded-xl bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] shadow-sm text-xs text-[var(--text-secondary)] leading-relaxed">
              <p>
                <strong className="text-[var(--text-primary)]">USEF-TSE</strong> takes a mixed recording and a short reference sample of the target speaker. It decomposes both via STFT, computes multi-head cross-attention without fixed speaker embeddings, fuses the representations into TFGridNet, and synthesizes the isolated waveform via iSTFT.
              </p>
            </div>
          </div>
        </div>

        {/* 6-Stage Visually Connected Diagram matching Reference 1 with Centered Arrows */}
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-2.5 lg:gap-1.5 relative">
          {stages.map((stage, idx) => {
            const isLast = idx === stages.length - 1;

            return (
              <React.Fragment key={stage.num}>
                {/* Stage Card */}
                <div
                  className={`flex-1 min-w-0 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-[var(--shadow-card)] relative group hover:-translate-y-1 ${
                    stage.isFinal
                      ? "bg-gradient-to-b from-[var(--bg-surface-1)] to-[var(--accent-gold-dim)] border-2 border-[var(--accent-gold)]/70 shadow-[0_4px_25px_-4px_var(--accent-gold-glow)]"
                      : "bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <div>
                    {/* Top Header: Numbered Circle + Tag */}
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[var(--border-subtle)]">
                      <div className="w-6 h-6 rounded-full bg-[var(--accent-gold)] text-[var(--accent-gold-text)] font-sans font-bold text-xs flex items-center justify-center shadow-sm">
                        {stage.num}
                      </div>
                      <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[var(--bg-surface-2)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                        {stage.tag}
                      </span>
                    </div>

                    <h4 className="text-xs font-sans font-bold text-[var(--text-primary)] mb-2">
                      {stage.title}
                    </h4>

                    {/* Graphic illustration */}
                    {stage.visual}
                  </div>

                  <p className="text-[11px] text-[var(--text-secondary)] mt-3 leading-normal border-t border-[var(--border-subtle)] pt-2.5">
                    {stage.desc}
                  </p>
                </div>

                {/* Vertically Centered Arrow OUTSIDE the cards */}
                {!isLast && (
                  <div className="flex items-center justify-center text-[var(--accent-gold)] opacity-80 shrink-0 self-center py-1 lg:py-0 px-0.5">
                    <ArrowRight className="hidden lg:block w-4 h-4" />
                    <ArrowDown className="lg:hidden w-4 h-4" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Bottom Callout Banner matching Reference 1 */}
        <div className="mt-8 p-4 rounded-xl bg-[var(--bg-surface-1)] border border-[var(--accent-gold)]/40 flex items-center justify-center gap-2.5 text-center text-xs text-[var(--text-secondary)] shadow-sm">
          <Info className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
          <span>
            <strong className="text-[var(--text-primary)]">Key Advantage:</strong> No separate speaker-recognition model or fixed speaker embedding is required.
          </span>
        </div>
      </div>
    </section>
  );
}
