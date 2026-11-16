import React from "react";

export default function Logo({ size = "default", className = "" }) {
  const isSmall = size === "small";
  const isLarge = size === "large";

  const iconDims = isSmall ? "w-6 h-6" : isLarge ? "w-10 h-10" : "w-8 h-8";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Studio Icon Badge */}
      <div className={`relative ${iconDims} rounded-lg flex items-center justify-center p-1 bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] shadow-sm transition-all duration-200 group-hover:border-[var(--accent-lime)]`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Upper interfering soundwave (muted slate/silver) */}
          <path
            d="M4 12 C9 6, 12 18, 16 12 C19 8, 21 16, 24 14"
            stroke="currentColor"
            className="text-[var(--text-muted)]"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Lower interfering soundwave (muted slate/silver) */}
          <path
            d="M4 24 C9 30, 12 18, 16 24 C19 28, 21 20, 24 22"
            stroke="currentColor"
            className="text-[var(--text-dim)]"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Central extraction point / separator node */}
          <circle
            cx="24"
            cy="18"
            r="2.5"
            className="fill-[var(--bg-surface-1)] stroke-[var(--accent-lime)]"
            strokeWidth="2"
          />
          {/* Clean target speaker isolated waveform (vibrant electric lime) */}
          <path
            d="M24 18 C26 9, 29 27, 32 18"
            stroke="var(--accent-lime)"
            strokeWidth="2.75"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-mono font-bold tracking-tight text-[var(--text-primary)] ${isLarge ? "text-xl" : "text-base"}`}>
            USEF-TSE
          </span>
          <span className="text-[10px] uppercase font-mono font-semibold px-1.5 py-0.5 rounded bg-[var(--accent-lime-dim)] text-[var(--accent-lime)] border border-[var(--accent-lime)]/30">
            Studio
          </span>
        </div>
        {!isSmall && (
          <span className="text-[10px] text-[var(--text-secondary)] font-medium tracking-tight hidden sm:block">
            Target Speaker Extraction
          </span>
        )}
      </div>
    </div>
  );
}
