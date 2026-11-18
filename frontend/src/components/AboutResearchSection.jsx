import React from "react";
import { BookOpen, Cpu, Layers, GitBranch, Award, ExternalLink } from "lucide-react";

export default function AboutResearchSection() {
  const cards = [
    {
      num: "1",
      title: "1. Embedding-Free Paradigm",
      subtitle: "The Core Problem Addressed",
      desc: "Conventional TSE systems rely on pre-trained speaker verification networks (such as d-vector, x-vector, or ECAPA-TDNN) that compress reference speech into a single 1D embedding, bottlenecking vocal information. USEF-TSE completely bypasses fixed embeddings, performing direct multi-head cross-attention between mixture and reference time-frequency representations.",
      icon: Cpu,
      tag: "End-to-End Cross-Attention",
      accent: "gold",
    },
    {
      num: "2",
      title: "2. TFGridNet Neural Backbone",
      subtitle: "Iterative Grid Processing",
      desc: "The architecture employs 6 TFGridNet blocks processing speech across frequency and time dimensions. Sub-band BLSTMs model local spectral patterns, full-band BLSTMs capture global harmonic trajectories, and frame-level attention tracks the target voice across overlapping speakers with minimal distortion.",
      icon: Layers,
      tag: "15.6M Parameters • 6 Blocks",
      accent: "purple",
    },
    {
      num: "3",
      title: "3. Complex STFT Synthesis",
      subtitle: "High-Fidelity Reconstruction",
      desc: "Both input recordings are standardized to 8000 Hz mono and converted to complex spectrograms via STFT (n_fft=128, hop=64, 65 frequency bins). The network predicts complex ratio masks to isolate the target speaker's spectral bins, and inverse STFT (iSTFT) synthesizes the pristine, unmixed WAV audio.",
      icon: GitBranch,
      tag: "8 kHz • Complex Masking",
      accent: "gold",
    },
  ];

  return (
    <section id="research" className="py-16 sm:py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-0)]/50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header matching Previous Website Presentation */}
        <div className="text-center max-w-2xl mx-auto mb-14">

          <h2 className="text-3xl sm:text-4xl font-editorial font-bold tracking-tight text-[var(--text-primary)]">
            About the{" "}
            <span className="italic font-normal text-gold-gradient">USEF-TSE Research</span>
          </h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)] font-sans">
            Universal Speaker Embedding Free Target Speaker Extraction eliminates fixed speaker-verification networks in favor of direct cross-attention.
          </p>
        </div>

        {/* 3 Academic Foundation Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {cards.map((card) => {
            const Icon = card.icon;
            const isGold = card.accent === "gold";

            return (
              <div
                key={card.num}
                className="p-6 rounded-2xl bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all duration-300 shadow-[var(--shadow-card)] hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Icon Badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border transition-transform group-hover:scale-105 ${
                      isGold
                        ? "bg-[var(--accent-gold-dim)] text-[var(--accent-gold)] border-[var(--accent-gold)]/30"
                        : "bg-[var(--accent-purple-dim)] text-[var(--accent-purple)] border-[var(--accent-purple)]/30"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-sans font-bold text-base text-[var(--text-primary)] mb-1">
                    {card.title}
                  </h3>
                  <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2.5">
                    {card.subtitle}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                {/* Footer Tag */}
                <div className="mt-5 pt-3.5 border-t border-[var(--border-subtle)] text-[11px] font-mono font-semibold text-[var(--accent-gold)]">
                  {card.tag}
                </div>
              </div>
            );
          })}
        </div>

        {/* Paper Citation Banner matching Previous Reference */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-gold-dim)] text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 flex items-center justify-center shrink-0 mt-0.5">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-1">
                Original Research Paper & Implementation
              </div>
              <h4 className="font-sans font-bold text-sm text-[var(--text-primary)]">
                USEF-TSE: Universal Speaker Embedding Free Target Speaker Extraction
              </h4>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-sans max-w-2xl leading-relaxed">
                Z. Bang et al. (Interspeech / ArXiv 2409.02615). Pretrained checkpoint evaluated on the WSJ0-2mix speech separation benchmark using end-to-end TFGridNet cross-attention.
              </p>
            </div>
          </div>

          <a
            href="https://arxiv.org/abs/2409.02615"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-sans font-bold bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/50 transition-all cursor-pointer shrink-0 shadow-sm"
          >
            <span>Read on ArXiv</span>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
          </a>
        </div>
      </div>
    </section>
  );
}
