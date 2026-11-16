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
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
          {/* Logo and Tagline */}
          <div className="space-y-2">
            <Logo />
            <p className="text-xs text-[var(--text-muted)] max-w-sm font-sans">
              Universal Speaker Embedding Free Target Speaker Extraction Studio. High-fidelity speech separation powered by deep neural networks.
            </p>
          </div>

          {/* Controls & Nav */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
              <span>{isDark ? "Soft Studio (Light)" : "Graphite Studio (Dark)"}</span>
            </button>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Credits & Architecture Attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
            <span>WSJ0-2mix Benchmark • 8 kHz TFGridNet (15.6M params)</span>
          </div>

          <div>
            <span>Target Speaker Extraction Studio © {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
