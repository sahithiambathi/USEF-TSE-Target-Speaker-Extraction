import React from "react";
import { Cpu, Layers, GitBranch, ExternalLink, Award } from "lucide-react";

export default function AboutResearchSection() {
  return (
    <section id="research" className="py-16 sm:py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[var(--bg-surface-2)] text-[var(--accent-lime)] border border-[var(--border-subtle)] mb-3 uppercase tracking-wider">
            <span>RESEARCH ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-[var(--text-primary)] uppercase">
            HOW USEF-TSE WORKS UNDER THE HOOD
          </h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)] font-sans">
            Universal Speaker Embedding Free Target Speaker Extraction replaces rigid verification networks with direct time-frequency cross-attention.
          </p>
        </div>

        {/* 3 Core Architecture Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[var(--bg-surface-0)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent-lime-dim)] text-[var(--accent-lime)] flex items-center justify-center mb-5">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-sm text-[var(--text-primary)] uppercase tracking-wide mb-2">
                1. Embedding-Free Paradigm
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Traditional TSE relies on pre-trained speaker verification models (d-vectors, x-vectors, ECAPA-TDNN) that compress reference audio into a single static 1D vector. USEF-TSE eliminates this bottleneck by learning multi-head cross-attention directly between mixture and raw reference spectrogram features.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--accent-lime)] font-bold">
              Direct Cross-Attention
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[var(--bg-surface-0)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[var(--bg-surface-2)] text-[var(--accent-coral)] flex items-center justify-center mb-5">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-sm text-[var(--text-primary)] uppercase tracking-wide mb-2">
                2. TFGridNet Backbone
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Powered by 6 GridNetV2 blocks with intra-frame and inter-frame BLSTM recurrence. The network tracks vocal pitch harmonics across time and frequency axes simultaneously, synthesizing a precise separation mask that preserves target voice details while stripping interference.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--accent-coral)] font-bold">
              15.6M Parameters • 6 Blocks
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[var(--bg-surface-0)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[var(--bg-surface-2)] text-[var(--text-primary)] flex items-center justify-center mb-5">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-sm text-[var(--text-primary)] uppercase tracking-wide mb-2">
                3. Complex STFT Synthesis
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Both audio inputs are resampled to 8000 Hz and processed in the complex time-frequency domain via Short-Time Fourier Transform (STFT, n_fft=128, hop=64). Inverse STFT (iSTFT) reconstructs the clean time-domain speech waveform ready for immediate listening and download.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)] font-bold">
              8 kHz Complex Domain Synthesis
            </div>
          </div>
        </div>

        {/* Paper Citation Card */}
        <div className="mt-8 p-6 sm:p-7 rounded-3xl bg-[var(--bg-surface-0)] border border-[var(--border-subtle)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm">
          <div className="flex items-start gap-3.5">
            <Award className="w-6 h-6 text-[var(--accent-lime)] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[var(--text-primary)]">
                USEF-TSE: Universal Speaker Embedding Free Target Speaker Extraction
              </h4>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-sans">
                Z. Bang et al. (Interspeech / ArXiv 2409.02615). Pretrained checkpoint evaluated on the WSJ0-2mix target speaker extraction benchmark.
              </p>
            </div>
          </div>

          <a
            href="https://arxiv.org/abs/2409.02615"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-lime)]/40 transition-all cursor-pointer shrink-0"
          >
            <span>Read on ArXiv</span>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
          </a>
        </div>
      </div>
    </section>
  );
}
