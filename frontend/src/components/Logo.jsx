import React from "react";

export default function Logo({ size = "default", className = "" }) {
  const isSmall = size === "small";
  const isLarge = size === "large";

  const iconDims = isSmall ? "w-6 h-6" : isLarge ? "w-10 h-10" : "w-8 h-8";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon from user-supplied image */}
      <div className={`relative ${iconDims} rounded-lg flex items-center justify-center overflow-hidden bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] shadow-sm transition-all duration-200 group-hover:border-[var(--accent-lime)]`}>
        <img
          src="/logo.png"
          alt="USEF-TSE"
          className="w-full h-full object-contain p-0.5 dark:invert-0"
          style={{ filter: 'var(--logo-filter, none)' }}
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span className={`font-mono font-bold tracking-tight text-[var(--text-primary)] ${isLarge ? "text-xl" : "text-base"}`}>
          USEF-TSE
        </span>
        {!isSmall && (
          <span className="text-[10px] text-[var(--text-secondary)] font-medium tracking-tight hidden sm:block">
            Target Speaker Extraction
          </span>
        )}
      </div>
    </div>
  );
}
