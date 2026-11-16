import React from "react";
import { User, Check, Waves } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Upload Mixture",
      desc: "Upload an audio recording containing multiple speakers.",
      icon: Waves,
    },
    {
      num: "02",
      title: "Add Reference",
      desc: "Provide a short recording of the speaker you want.",
      icon: User,
    },
    {
      num: "03",
      title: "Extract Voice",
      desc: "Get the isolated speaker's voice using USEF-TSE.",
      icon: Check,
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Clean Center Divider with 'HOW IT WORKS' matching reference */}
        <div className="relative flex items-center justify-center mb-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border-subtle)]" />
          </div>
          <div className="relative px-4 bg-[var(--bg-page)] text-xs font-mono font-bold tracking-widest uppercase text-[var(--text-secondary)]">
            HOW IT WORKS
          </div>
        </div>

        {/* 3 Step Cards matching reference design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] transition-all hover:border-[var(--accent-lime)]/50"
              >
                {/* Number Badge with Circle */}
                <div className="w-9 h-9 rounded-full bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] flex items-center justify-center text-xs font-mono font-bold text-[var(--accent-lime)] shrink-0 shadow-sm">
                  {step.num}
                </div>

                {/* Step Icon */}
                <div className="w-9 h-9 rounded-xl bg-[var(--accent-lime-dim)] text-[var(--accent-lime)] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>

                {/* Step Content */}
                <div className="space-y-0.5">
                  <h3 className="text-sm font-sans font-bold text-[var(--text-primary)] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
