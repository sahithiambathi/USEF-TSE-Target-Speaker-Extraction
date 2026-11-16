import React, { useState } from "react";
import { Sun, Moon, Sparkles, Menu, X, ArrowRight } from "lucide-react";
import Logo from "./Logo";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({
  onLoadSample,
  isExtracting,
  backendState,
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

  const isModelReady = backendState?.isReady;

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--bg-page)]/85 backdrop-blur-md border-b border-[var(--border-subtle)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
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

        {/* Center Nav Links matching Reference Image */}
        <div className="hidden md:flex items-center gap-8 text-sm font-sans font-semibold text-[var(--text-secondary)]">
          <button
            onClick={() => scrollTo("hero")}
            className="hover:text-[var(--text-primary)] hover:underline decoration-[var(--accent-lime)] decoration-2 underline-offset-8 transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo("how-it-works")}
            className="hover:text-[var(--text-primary)] hover:underline decoration-[var(--accent-lime)] decoration-2 underline-offset-8 transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo("workspace")}
            className="hover:text-[var(--text-primary)] hover:underline decoration-[var(--accent-lime)] decoration-2 underline-offset-8 transition-colors cursor-pointer"
          >
            Extract Audio
          </button>
          <button
            onClick={() => scrollTo("research")}
            className="hover:text-[var(--text-primary)] hover:underline decoration-[var(--accent-lime)] decoration-2 underline-offset-8 transition-colors cursor-pointer"
          >
            About
          </button>
        </div>

        {/* Right Action Controls: Theme Pill & Start Extracting Pill */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Sample Action */}
          <button
            type="button"
            onClick={onLoadSample}
            disabled={isExtracting}
            className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono font-bold bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            title="Load demo audio samples"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
            <span>Load Demo Samples</span>
          </button>

          {/* Theme Switch Pill matching reference design */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-all duration-200 cursor-pointer"
            title={isDark ? "Switch to Soft Studio (Light)" : "Switch to Neon Brutalist (Dark)"}
          >
            <div className={`flex items-center justify-center w-5 h-5 rounded-full transition-all ${isDark ? "bg-[var(--accent-lime)] text-[var(--accent-lime-text)] shadow-sm" : "text-amber-500"}`}>
              {isDark ? <Moon className="w-3 h-3 fill-current" /> : <Sun className="w-3 h-3 fill-current" />}
            </div>
            <span className="text-[11px] font-mono font-semibold hidden sm:inline">
              {isDark ? "Dark" : "Light"}
            </span>
          </button>

          {/* Primary CTA Button matching reference */}
          <button
            type="button"
            onClick={() => scrollTo("workspace")}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold bg-[var(--accent-lime)] hover:bg-[var(--accent-lime-hover)] text-[var(--accent-lime-text)] shadow-[0_0_15px_var(--accent-lime-glow)] hover:shadow-[0_0_25px_var(--accent-lime-glow)] transition-all cursor-pointer uppercase tracking-tight"
          >
            <span>Start Extracting</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Mobile hamburger menu toggle */}
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
        <div className="md:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-surface-1)] px-5 py-4 space-y-3.5 shadow-2xl">
          <div className="flex items-center justify-between text-xs font-mono py-1 border-b border-[var(--border-subtle)]">
            <span className="text-[var(--text-secondary)]">USEF-TFGridNet</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-primary)]">
              <span className={`w-2 h-2 rounded-full ${isModelReady ? "bg-[var(--accent-lime)] animate-pulse" : "bg-amber-400"}`} />
              {isModelReady ? "Model Online (8 kHz)" : backendState?.detail || "Connecting..."}
            </span>
          </div>

          <div className="flex flex-col space-y-2 text-sm font-semibold text-[var(--text-secondary)]">
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
              About
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onLoadSample();
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-xs font-mono font-bold bg-[var(--bg-surface-2)] text-[var(--text-primary)] border border-[var(--border-subtle)] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
              <span>Load Demo Audio Samples</span>
            </button>
            <button
              type="button"
              onClick={() => scrollTo("workspace")}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-xs font-mono font-bold bg-[var(--accent-lime)] text-[var(--accent-lime-text)] shadow-lg cursor-pointer uppercase"
            >
              <span>Try Speaker Extraction</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
