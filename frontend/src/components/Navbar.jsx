import React, { useState } from "react";
import { Sun, Moon, Sparkles, Menu, X, ArrowUpRight } from "lucide-react";
import Logo from "./Logo";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({
  onLoadSample,
  isExtracting,
  modelStatus,
}) {
  const { toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isModelReady = modelStatus?.status === "ready";

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--bg-page)]/85 backdrop-blur-md border-b border-[var(--border-subtle)] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("hero");
          }}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] rounded-lg group"
        >
          <Logo />
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-7 text-xs font-mono font-medium text-[var(--text-secondary)]">
          <button
            onClick={() => scrollTo("hero")}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo("how-it-works")}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo("workspace")}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Extract Audio
          </button>
          <button
            onClick={() => scrollTo("research")}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            About Research
          </button>
        </div>

        {/* Action Controls & Theme Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Quick Demo Sample Action */}
          <button
            type="button"
            onClick={onLoadSample}
            disabled={isExtracting}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] transition-all duration-150 disabled:opacity-50 cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)]"
            title="Load bundled sample recordings"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
            <span>Load Demo Samples</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-lg bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)]"
            title={isDark ? "Switch to Soft Studio (Light)" : "Switch to Graphite Studio (Dark)"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-300 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Primary CTA */}
          <button
            type="button"
            onClick={() => scrollTo("workspace")}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-mono font-bold bg-[var(--accent-lime)] hover:bg-[var(--accent-lime-hover)] text-[var(--accent-lime-text)] shadow-sm hover:shadow-[0_0_12px_var(--accent-lime-glow)] transition-all duration-150 cursor-pointer"
          >
            <span>Start Extracting</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-lg md:hidden bg-[var(--bg-surface-2)] text-[var(--text-primary)] border border-[var(--border-subtle)] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-surface-1)] px-5 py-4 space-y-3.5 shadow-lg animate-fadeInSlideDown">
          {/* Status pill in mobile menu */}
          <div className="flex items-center justify-between text-xs font-mono py-1 border-b border-[var(--border-subtle)]">
            <span className="text-[var(--text-secondary)]">USEF-TFGridNet</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-primary)]">
              <span className={`w-2 h-2 rounded-full ${isModelReady ? "bg-[var(--accent-lime)] animate-pulse" : "bg-amber-400"}`} />
              {isModelReady ? "Model Online (8 kHz)" : "Connecting..."}
            </span>
          </div>

          <div className="flex flex-col space-y-2 text-sm font-mono font-medium text-[var(--text-secondary)]">
            <button
              onClick={() => scrollTo("hero")}
              className="text-left py-2 hover:text-[var(--text-primary)] border-b border-[var(--border-subtle)]/50"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="text-left py-2 hover:text-[var(--text-primary)] border-b border-[var(--border-subtle)]/50"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo("workspace")}
              className="text-left py-2 text-[var(--accent-lime)] font-bold border-b border-[var(--border-subtle)]/50"
            >
              Extract Audio Workspace
            </button>
            <button
              onClick={() => scrollTo("research")}
              className="text-left py-2 hover:text-[var(--text-primary)]"
            >
              About Research
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onLoadSample();
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono font-semibold bg-[var(--bg-surface-2)] text-[var(--text-primary)] border border-[var(--border-subtle)] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
              <span>Load Demo Audio Samples</span>
            </button>
            <button
              type="button"
              onClick={() => scrollTo("workspace")}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono font-bold bg-[var(--accent-lime)] text-[var(--accent-lime-text)] shadow-sm cursor-pointer"
            >
              <span>Start Extracting Voice</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
