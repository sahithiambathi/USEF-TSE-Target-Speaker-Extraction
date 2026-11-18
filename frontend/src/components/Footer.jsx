import React from "react";
import { Sun, Moon, ArrowUp } from "lucide-react";
import Logo from "./Logo";
import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { isDark, toggleTheme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-surface-0)] py-12 text-xs font-sans text-[var(--text-secondary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
          {/* Logo and Tagline matching Reference 1 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Logo />
            <span className="hidden sm:inline text-[var(--border-strong)]">|</span>
            <span className="font-editorial italic text-sm text-[var(--text-secondary)]">
              Every Voice Deserves to Be Heard
            </span>
          </div>

          {/* Controls & Nav matching Reference 1 */}
          <div className="flex flex-wrap items-center gap-5">
            <button
              onClick={() => scrollTo("how-it-works")}
              className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <span className="text-[var(--border-strong)]">|</span>
            <button
              onClick={() => scrollTo("research")}
              className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              About
            </button>

            {/* Theme Toggle Pill */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-colors cursor-pointer shadow-sm"
              title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-purple-700" />}
            </button>

            {/* GitHub Link */}
            <a
              href="https://github.com/ZBang/USEF-TSE"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-colors cursor-pointer"
              title="View Model on GitHub"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>

            {/* Back to top */}
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Credits & Architecture Attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--text-muted)] font-mono">
          <div>
            <span>WSJ0-2mix Pretrained Benchmark • 8 kHz TFGridNet (15.6M params)</span>
          </div>

          <div>
            <span>Universal Speaker Embedding Free Target Speaker Extraction © {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
