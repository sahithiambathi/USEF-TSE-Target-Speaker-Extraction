import React from "react";
import { Cpu, Layers, GitBranch, BookOpen, ExternalLink, Award } from "lucide-react";

export default function AboutResearchSection() {
  return (
    <section id="research" className="py-16 sm:py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-0)]/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-[var(--bg-surface-2)] text-[var(--accent-lime)] border border-[var(--border-subtle)] mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
            <span>ACADEMIC FOUNDATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-[var(--text-primary)]">
            About the USEF-TSE Research
          </h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)] font-sans">
            Universal Speaker Embedding Free Target Speaker Extraction removes fixed speaker verification networks in favor of direct cross-attention.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: USEF Paradigm */}
          <div className="p-6 rounded-2xl bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-lime-dim)] text-[var(--accent-lime)] border border-[var(--accent-lime)]/30 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-base text-[var(--text-primary)] mb-2">
                1. Embedding-Free Paradigm
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Conventional TSE systems depend on a pre-trained speaker verification network (e.g., d-vector, x-vector, or ECAPA-TDNN) that forces reference audio into a single 1D vector. USEF-TSE bypasses fixed speaker embeddings entirely, computing multi-head cross-attention directly between mixture and reference time-frequency features.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--accent-lime)] font-semibold">
              End-to-End Cross-Attention
            </div>
          </div>

          {/* Card 2: TFGridNet Backbone */}
          <div className="p-6 rounded-2xl bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface-2)] text-[var(--accent-cyan)] border border-[var(--border-subtle)] flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-base text-[var(--text-primary)] mb-2">
                2. TFGridNet Backbone
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Employs 6 GridNetV2 blocks operating iteratively across time and frequency axes. Full-band and sub-band BLSTMs paired with cross-frame attention allow the model to follow harmonic trajectories and unmix overlapping speech with minimal distortion.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--accent-cyan)] font-semibold">
              15.6M Parameters • 6 Blocks
            </div>
          </div>

          {/* Card 3: Complex STFT Pipeline */}
          <div className="p-6 rounded-2xl bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface-2)] text-[var(--text-primary)] border border-[var(--border-subtle)] flex items-center justify-center mb-4">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-base text-[var(--text-primary)] mb-2">
                3. Complex STFT Synthesis
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Both audio inputs are standardized to 8000 Hz, converted into real and imaginary spectral components via STFT (n_fft=128, hop=64), processed through neural complex masks, and seamlessly reconstructed into clean WAV audio through inverse STFT (iSTFT).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)] font-semibold">
              8 kHz Sample Rate • Complex Domain
            </div>
          </div>
        </div>

        {/* Paper Citation Banner */}
        <div className="mt-8 p-6 rounded-2xl bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-[var(--accent-lime)] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[var(--text-primary)]">
                Paper: USEF-TSE: Universal Speaker Embedding Free Target Speaker Extraction
              </h4>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-sans">
                Z. Bang et al. (Interspeech / ArXiv 2409.02615). Pretrained checkpoint evaluated on the WSJ0-2mix speech separation benchmark.
              </p>
            </div>
          </div>

          <a
            href="https://arxiv.org/abs/2409.02615"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all cursor-pointer shrink-0"
          >
            <span>Read on ArXiv</span>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
          </a>
        </div>
      </div>
    </section>
  );
}
