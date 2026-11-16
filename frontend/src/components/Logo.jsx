import React from "react";

export default function Logo({ size = "default", className = "" }) {
  const isSmall = size === "small";
  const isLarge = size === "large";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Equalizer Waveform Icon matching reference design */}
      <div className="flex items-center gap-[2.5px] h-6 py-0.5">
        <span className="w-[3px] h-3 bg-[var(--accent-lime)] rounded-full animate-pulse" />
        <span className="w-[3px] h-5 bg-[var(--accent-lime)] rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
        <span className="w-[3px] h-6 bg-[var(--accent-lime)] rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
        <span className="w-[3px] h-4 bg-[var(--accent-lime)] rounded-full animate-pulse" style={{ animationDelay: "450ms" }} />
        <span className="w-[3px] h-2 bg-[var(--accent-lime)] rounded-full animate-pulse" style={{ animationDelay: "600ms" }} />
      </div>

      {/* Brand Typography */}
      <div className="flex items-center gap-2">
        <span
          className={`font-mono font-black tracking-tight text-[var(--text-primary)] ${
            isLarge ? "text-2xl" : isSmall ? "text-base" : "text-lg"
          }`}
        >
          USEF-TSE
        </span>
        <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--accent-lime-dim)] text-[var(--accent-lime)] border border-[var(--accent-lime)]/30">
          Studio
        </span>
      </div>
    </div>
  );
}
