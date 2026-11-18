import React from "react";
import { Users, Mic, Cpu, Download, ArrowRight, ArrowDown } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      badge: "CH-MIX",
      title: "Upload Mixture Audio",
      desc: "Upload an audio recording containing multiple speakers conversing or overlapping in the same acoustic space.",
      icon: Users,
      highlight: "WAV, MP3, FLAC, M4A",
      tag: "Multi-Speaker",
    },
    {
      num: "02",
      badge: "REF",
      title: "Add Target Reference",
      desc: "Provide a short, clean recording (1–5 seconds) of the speaker you want to isolate, serving as a vocal guide.",
      icon: Mic,
      highlight: "1 to 5 Seconds",
      tag: "Reference",
    },
    {
      num: "03",
      badge: "SEPARATION",
      title: "Extract Target Speech",
      desc: "The USEF-TSE model computes cross-attention to isolate the target speaker and attenuate interfering voices.",
      icon: Cpu,
      highlight: "USEF-TFGridNet",
      tag: "Neural Model",
    },
    {
      num: "04",
      badge: "OUTPUT-WAV",
      title: "Listen and Download",
      desc: "Listen to the isolated speech, inspect the genuine waveform, compare A/B against mixture, and export 8 kHz WAV.",
      icon: Download,
      highlight: "Clean 8 kHz WAV",
      tag: "Target Ready",
      isFinal: true,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-0)]/40 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header matching Previous Website reference & Current Theme */}
        <div className="text-center max-w-2xl mx-auto mb-14">

          <h2 className="text-3xl sm:text-4xl font-editorial font-bold tracking-tight text-[var(--text-primary)]">
            How It{" "}
            <span className="italic font-normal text-gold-gradient">Works</span>
          </h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)] font-sans">
            A seamless reference-guided speech separation workflow designed for research and real-world clarity.
          </p>
        </div>

        {/* 4-Step Cards Row with Vertically Centered Arrows Between Cards */}
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-3 lg:gap-2 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <React.Fragment key={step.num}>
                {/* Step Card matching previous website composition */}
                <div
                  className={`flex-1 min-w-0 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[var(--shadow-card)] relative group ${
                    step.isFinal
                      ? "bg-gradient-to-b from-[var(--bg-surface-1)] to-[var(--accent-gold-dim)] border-2 border-[var(--accent-gold)]/70 shadow-[0_4px_24px_-4px_var(--accent-gold-glow)]"
                      : "bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <div>
                    {/* Top Bar: Large Step Number + Channel/State Badge */}
                    <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[var(--border-subtle)]">
                      <span className="font-mono text-2xl font-bold tracking-wider text-[var(--text-muted)] group-hover:text-[var(--accent-gold)] transition-colors">
                        {step.num}
                      </span>
                      <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                        {step.badge}
                      </span>
                    </div>

                    {/* Icon & Heading */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 ${
                          step.isFinal
                            ? "bg-[var(--accent-gold)] text-[var(--accent-gold-text)] border-[var(--accent-gold)] shadow-sm"
                            : "bg-[var(--accent-purple-dim)] text-[var(--accent-purple)] border-[var(--accent-purple)]/30"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-sans font-bold text-[var(--text-primary)] leading-tight">
                        {step.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                      {step.desc}
                    </p>
                  </div>

                  {/* Card Footer Detail Row */}
                  <div className="pt-3 border-t border-[var(--border-subtle)]/70 text-[11px] font-mono text-[var(--text-muted)] flex items-center justify-between">
                    <span className="truncate pr-1">{step.highlight}</span>
                    <span
                      className={`text-[10px] font-semibold shrink-0 ${
                        step.isFinal
                          ? "text-[var(--accent-gold)] font-bold"
                          : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {step.tag}
                    </span>
                  </div>
                </div>

                {/* Vertically Centered Arrow OUTSIDE the cards */}
                {!isLast && (
                  <div className="flex items-center justify-center text-[var(--accent-gold)] opacity-80 shrink-0 self-center py-1 lg:py-0 px-1">
                    {/* Desktop: Horizontal Arrow */}
                    <ArrowRight className="hidden lg:block w-5 h-5" />
                    {/* Mobile/Tablet: Vertical Arrow */}
                    <ArrowDown className="lg:hidden w-5 h-5" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
