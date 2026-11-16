import React from "react";
import { X, Layers, Cpu, GitBranch, Radio } from "lucide-react";

export default function ResearchModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="research-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-[#0f141d] border border-[#243044] rounded-lg p-5 shadow-2xl max-h-[88vh] overflow-y-auto animate-enter-workspace">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1f2937]">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-teal-400" />
            <h3 id="research-modal-title" className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider">
              USEF-TSE Research Architecture
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1a2332] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Technical Verified Content */}
        <div className="mt-4 space-y-3.5 text-xs text-slate-300 leading-relaxed font-sans">
          <section className="p-3 rounded bg-[#131923] border border-[#1e2736]">
            <h4 className="font-mono font-bold text-lime-400 text-xs uppercase flex items-center gap-1.5 mb-1.5">
              <Cpu className="w-3.5 h-3.5" />
              1. Universal Speaker Embedding Free (USEF) Paradigm
            </h4>
            <p className="text-slate-300 text-[11px] leading-normal">
              Conventional Target Speaker Extraction (TSE) systems rely on a pre-trained speaker verification network (e.g., d-vector, x-vector, or ECAPA-TDNN) to condense reference audio into a single fixed 1D vector. USEF-TSE bypasses fixed speaker embeddings entirely: it models cross-attention directly between the mixture time-frequency representations and the raw reference representations.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded bg-[#131923] border border-[#1e2736]">
              <h5 className="font-mono font-bold text-teal-400 text-xs uppercase flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5" />
                2. TFGridNet Backbone
              </h5>
              <p className="text-slate-400 text-[11px]">
                Features 6 GridNetV2 blocks operating iteratively across time and frequency axes with intra-frame and inter-frame recurrence, cross-attending reference speech to construct an extraction mask.
              </p>
            </div>

            <div className="p-3 rounded bg-[#131923] border border-[#1e2736]">
              <h5 className="font-mono font-bold text-teal-400 text-xs uppercase flex items-center gap-1.5 mb-1">
                <GitBranch className="w-3.5 h-3.5" />
                3. STFT & Waveform Synthesis
              </h5>
              <p className="text-slate-400 text-[11px]">
                Both streams are resampled to 8000 Hz, decomposed via STFT (<code className="text-teal-300 font-mono">n_fft=128</code>, <code className="text-teal-300 font-mono">hop=64</code>), processed in complex domain, and re-synthesized into isolated speech via inverse STFT.
              </p>
            </div>
          </div>

          <section className="p-3 rounded bg-[#131923] border border-[#1e2736]">
            <h4 className="font-mono font-bold text-slate-300 text-[11px] uppercase mb-1">
              Verified Model Weights & Benchmark
            </h4>
            <p className="text-slate-400 text-[11px]">
              Trained and evaluated on the standard <strong>WSJ0-2mix</strong> target speaker extraction benchmark. Pretrained PyTorch checkpoint loaded locally from the authors&apos; official repository (<code className="text-slate-300 font-mono">ZBang/USEF-TSE</code>, 15.6M parameters).
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-[#1f2937] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded text-xs font-mono bg-[#16202c] hover:bg-[#1e2a3a] text-slate-200 border border-[#273549] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
