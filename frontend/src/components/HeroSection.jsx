import React from "react";
import { Play, Compass, Sparkles } from "lucide-react";
import HeroMicrophone from "./HeroMicrophone";

export default function HeroSection({ onStartExtracting, onLoadSample, isExtracting }) {
  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden border-b border-[var(--border-subtle)]">
      {/* Studio Background Ambient Lighting */}
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[360px] rounded-full blur-[130px] pointer-events-none opacity-20 bg-[var(--accent-purple)]"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[500px] h-[340px] rounded-full blur-[120px] pointer-events-none opacity-25 bg-[var(--accent-gold)]"
        aria-hidden="true"
      />

      {/* Decorative Wave Ribbons in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-35">
        <svg
          viewBox="0 0 1440 450"
          className="w-full h-full object-cover animate-float-slow"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M -100 220 C 300 120, 600 350, 1000 180 C 1200 90, 1400 240, 1600 190"
            stroke="url(#heroRibbonGrad1)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
          <path
            d="M -50 250 C 350 150, 650 380, 1050 210 C 1250 120, 1450 270, 1650 220"
            stroke="url(#heroRibbonGrad2)"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="heroRibbonGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-purple)" stopOpacity="0.1" />
              <stop offset="50%" stopColor="var(--accent-purple)" stopOpacity="0.8" />
              <stop offset="80%" stopColor="var(--accent-gold)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="heroRibbonGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.2" />
              <stop offset="40%" stopColor="var(--accent-purple)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Subtitle & Action Buttons */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Main Heading with Editorial Serif Italic Highlight */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight text-[var(--text-primary)] leading-[1.14]">
              Every Voice <br />
              <span className="font-normal">Deserves to </span>
              <span className="font-editorial italic font-normal text-gold-gradient tracking-normal">
                Be Heard
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="mt-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl font-sans">
              Extract the target speaker from mixed audio with precision using USEF-TSE.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              {/* Start Extracting Primary Button */}
              <button
                type="button"
                onClick={onStartExtracting}
                className="btn-gold px-7 py-3 rounded-full text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Extracting</span>
              </button>

              {/* Explore How It Works Button */}
              <button
                type="button"
                onClick={scrollToHowItWorks}
                className="px-5 py-3 rounded-full font-sans text-xs font-semibold bg-[var(--bg-surface-1)] hover:bg-[var(--bg-surface-2)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Compass className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>Explore How It Works</span>
              </button>

              {/* Demo Sample Button */}
              <button
                type="button"
                onClick={onLoadSample}
                disabled={isExtracting}
                className="px-4 py-3 rounded-full font-sans text-xs font-semibold bg-[var(--accent-gold-dim)] hover:bg-[var(--accent-gold)]/25 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                title="Immediately test using verified 2-speaker audio"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Try Demo Audio</span>
              </button>
            </div>
          </div>

          {/* Right Column: Realistic Metallic Microphone Asset (Separate Reusable Component) */}
          <div className="lg:col-span-5 flex items-center justify-center pt-4 lg:pt-0">
            <HeroMicrophone className="w-full max-w-[380px] lg:max-w-[420px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
