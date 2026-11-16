import React from "react";
import { Sun, Moon, ArrowUp, Cpu } from "lucide-react";
import Logo from "./Logo";
import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { isDark, toggleTheme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-surface-0)] py-12 text-xs font-mono text-[var(--text-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
          {/* Logo and Tagline */}
          <div className="space-y-2">
            <Logo size="large" />
            <p className="text-xs text-[var(--text-muted)] max-w-sm font-sans mt-2">
              Audio Signal Neon Brutalist Studio. Universal Speaker Embedding Free Target Speaker Extraction platform.
            </p>
          </div>

          {/* Controls & Nav */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
              <span>{isDark ? "Soft Studio (Light)" : "Neon Brutalist (Dark)"}</span>
            </button>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Specs Attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
            <span>WSJ0-2mix Benchmark • 8 kHz TFGridNet (15.6M parameters)</span>
          </div>

          <div>
            <span>USEF-TSE Studio © 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
