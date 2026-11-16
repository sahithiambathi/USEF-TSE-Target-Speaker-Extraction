import React from "react";
import { Sparkles, Info } from "lucide-react";

export default function Header({ onOpenAbout, onLoadSample, isExtracting }) {
  return (
    <header className="w-full border-b border-[#1e2838] bg-[#0c1017]/90 backdrop-blur-sm sticky top-0 z-40 animate-enter-header">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Wordmark and Sound-Wave Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5 px-2 py-1.5 rounded-md bg-[#131924] border border-[#1e2838]">
            {/* Minimalist SVG sound-wave logo in teal & lime */}
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="4" y1="10" x2="4" y2="14" stroke="#a3e635" />
              <line x1="8" y1="6" x2="8" y2="18" stroke="#2dd4bf" />
              <line x1="12" y1="3" x2="12" y2="21" stroke="#2dd4bf" />
              <line x1="16" y1="7" x2="16" y2="17" stroke="#2dd4bf" />
              <line x1="20" y1="11" x2="20" y2="13" stroke="#a3e635" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold tracking-wider text-slate-100">
                USEF-TSE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Universal Speaker Embedding Free Target Speaker Extraction
            </p>
          </div>
        </div>

        {/* Action Controls (Clean and minimal without unnecessary status badges) */}
        <div className="flex items-center gap-2.5">
          {/* Load Sample Button */}
          <button
            type="button"
            onClick={onLoadSample}
            disabled={isExtracting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium bg-[#131924] hover:bg-[#1a2332] text-slate-200 border border-[#1e2838] hover:border-slate-700 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime-400 cursor-pointer"
            title="Load sample mixture and reference files"
          >
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span>Load Demo Samples</span>
          </button>

          {/* Architecture / Info Button */}
          <button
            type="button"
            onClick={onOpenAbout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium bg-[#131924] hover:bg-[#1a2332] text-slate-300 border border-[#1e2838] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-teal-400" />
            <span>Architecture / Info</span>
          </button>
        </div>
      </div>
    </header>
  );
}
