import React from "react";
import { Users, Mic, Cpu, Sparkles, ArrowRight } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Upload Mixture",
      desc: "Upload an audio recording containing multiple speakers conversing or overlapping in the same acoustic space.",
      icon: Users,
      badge: "CH-MIX",
      highlight: "WAV, MP3, FLAC, M4A",
      detail: "Supports dual-speaker overlapping speech; automatically resampled to 8 kHz for the acoustic model.",
    },
    {
      num: "02",
      title: "Add Reference",
      desc: "Provide a short recording of the speaker you want to isolate, serving as an acoustic fingerprint.",
      icon: Mic,
      badge: "REF-PROMPT",
      highlight: "1 to 5 Seconds",
      detail: "Bypasses fixed speaker embedding vectors (no d-vectors/x-vectors) via direct cross-attention.",
    },
    {
      num: "03",
      title: "Extract Voice",
      desc: "The USEF-TSE model extracts the target speaker's voice, attenuating all background interference.",
      icon: Cpu,
      badge: "ISOLATED-OUT",
      highlight: "USEF-TFGridNet",
      detail: "Iterative GridNetV2 time-frequency blocks synthesize the isolated clean target waveform via iSTFT.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-0)]/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-[var(--accent-lime-dim)] text-[var(--accent-lime)] border border-[var(--accent-lime)]/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-[var(--text-primary)]">
            Three Steps to Isolated Speech
          </h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            A seamless reference-guided speech separation pipeline designed for research and real-world clarity.
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <div
                key={step.num}
                className={`relative rounded-2xl bg-[var(--bg-surface-1)] border p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-[var(--shadow-card)] ${
                  isLast
                    ? "border-[var(--accent-lime)]/40 hover:border-[var(--accent-lime)] shadow-[0_4px_24px_-4px_var(--accent-lime-glow)]"
                    : "border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
                }`}
              >
                <div>
                  {/* Step Top Bar */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-subtle)]">
                    <span className="font-mono text-2xl font-bold tracking-wider text-[var(--text-muted)]">
                      {step.num}
                    </span>
                    <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                      {step.badge}
                    </span>
                  </div>

                  {/* Icon & Heading */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        isLast
                          ? "bg-[var(--accent-lime-dim)] text-[var(--accent-lime)] border-[var(--accent-lime)]/40 shadow-sm"
                          : "bg-[var(--bg-surface-2)] text-[var(--accent-cyan)] border-[var(--border-subtle)]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-mono font-bold text-[var(--text-primary)]">
                      {step.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                    {step.desc}
                  </p>
                </div>

                {/* Card Detail Footer */}
                <div className="pt-4 border-t border-[var(--border-subtle)]/70 text-[11px] font-mono text-[var(--text-muted)] flex items-center justify-between">
                  <span>{step.highlight}</span>
                  {isLast ? (
                    <span className="text-[var(--accent-lime)] font-bold">Target Ready</span>
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
