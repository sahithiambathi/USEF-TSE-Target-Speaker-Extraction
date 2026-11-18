import React from "react";

/**
 * HeroMicrophone Component
 *
 * Reusable hero microphone presentation component.
 * Prepared for future 3D model integration (e.g. WebGL/Three.js Canvas drop-in).
 * Currently renders the realistic metallic microphone image asset with dynamic ambient lighting.
 */
export default function HeroMicrophone({ className = "" }) {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      aria-label="Studio condenser microphone visual"
    >
      {/* Dynamic Ambient Lighting Halo:
          Dark mode: subtle purple & champagne-gold
          Light mode: subtle dusty-blue & champagne-gold
      */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[480px] sm:w-[420px] sm:h-[560px] rounded-full pointer-events-none opacity-80 blur-[80px] transition-all duration-500"
        style={{
          background: "radial-gradient(ellipse at center, var(--mic-glow-1) 0%, var(--mic-glow-2) 45%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle floor contact shadow for realistic grounding */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 rounded-full blur-md opacity-40 dark:opacity-70 pointer-events-none transition-opacity"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Realistic Metallic Microphone Asset */}
      <div className="relative z-10 w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[420px] animate-mic-float flex items-center justify-center">
        <img
          src="/microphone.png"
          alt="Professional Studio Condenser Microphone"
          className="w-full h-auto object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_20px_45px_rgba(0,0,0,0.65)] transition-all duration-300"
          loading="eager"
        />
      </div>
    </div>
  );
}
