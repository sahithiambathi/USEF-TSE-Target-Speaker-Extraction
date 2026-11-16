import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

/**
 * HeroWaveformCanvas
 * A high-performance, cinematic multi-layered audio signal canvas.
 * Renders hundreds of fine harmonic curves, particles, a vertical scanning laser beam,
 * and a prominent, glowing electric lime target speaker waveform.
 */
export default function HeroWaveformCanvas({ className = "" }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const { isDark } = useTheme();

  // Extraction cycle: 0 -> 1 (0 to 1 cycles every 12 seconds)
  const [separationPhase, setSeparationPhase] = useState("Scanning & Extracting");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Particle field
    const PARTICLE_COUNT = 55;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * (width || 800),
      y: Math.random() * (height || 360),
      radius: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.4 + 0.2,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.2,
      isTarget: Math.random() > 0.4,
    }));

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let startTime = performance.now();
    let lastPhaseUpdate = 0;

    const render = (now) => {
      if (prefersReducedMotion) {
        // Static high-quality snapshot
        drawFrame(now, 0, ctx, width, height, isDark, particles, mouseRef.current);
        return;
      }

      const elapsed = (now - startTime) / 1000;
      drawFrame(now, elapsed, ctx, width, height, isDark, particles, mouseRef.current);

      // Update phase text every ~3 seconds
      if (now - lastPhaseUpdate > 1500) {
        lastPhaseUpdate = now;
        const cycle = (elapsed % 12) / 12;
        if (cycle < 0.25) {
          setSeparationPhase("1. Multi-Speaker Mixture Input");
        } else if (cycle < 0.5) {
          setSeparationPhase("2. Reference Cross-Attention Scan");
        } else if (cycle < 0.8) {
          setSeparationPhase("3. Attenuating Background Voices");
        } else {
          setSeparationPhase("4. Target Voice Isolated (Clean)");
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isDark]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000, active: false };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-[260px] sm:h-[340px] md:h-[400px] overflow-hidden select-none ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {/* Floating Phase Pill Badge */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface-1)]/80 backdrop-blur-md border border-[var(--border-subtle)] text-[10px] font-mono shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-lime)] animate-ping" />
          <span className="text-[var(--text-primary)] font-semibold uppercase tracking-wider">
            {separationPhase}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Master Canvas Rendering Function
 */
function drawFrame(now, time, ctx, width, height, isDark, particles, mouse) {
  ctx.clearRect(0, 0, width, height);

  const centerY = height * 0.52;
  const cycleTime = (time % 12) / 12; // 0.0 to 1.0 progress in extraction cycle

  // Background Speaker attenuation factor based on separation cycle:
  // Phase 1 (0.0 - 0.25): High mixture noise (interfering waves full power)
  // Phase 2 (0.25 - 0.55): Laser scan beam sweeps across, selection begins
  // Phase 3 (0.55 - 0.85): Background waves fade down to faint ghost lines
  // Phase 4 (0.85 - 1.0): Fully isolated target speaker, near-zero background interference
  let bgWaveOpacity = 0.65;
  let targetWaveProminence = 1.0;

  if (cycleTime < 0.25) {
    bgWaveOpacity = 0.65;
    targetWaveProminence = 0.85;
  } else if (cycleTime < 0.6) {
    const progress = (cycleTime - 0.25) / 0.35;
    bgWaveOpacity = 0.65 - progress * 0.45;
    targetWaveProminence = 0.85 + progress * 0.4;
  } else {
    bgWaveOpacity = 0.18; // Very faint wireframe background
    targetWaveProminence = 1.35; // Target voice dominates brilliantly!
  }

  // 1. Draw Background Particles (Audio Dust)
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    if (p.isTarget) {
      ctx.fillStyle = isDark
        ? `rgba(163, 230, 53, ${p.alpha * 0.7 * targetWaveProminence})`
        : `rgba(132, 204, 22, ${p.alpha * 0.6})`;
    } else {
      ctx.fillStyle = isDark
        ? `rgba(255, 255, 255, ${p.alpha * 0.25 * bgWaveOpacity})`
        : `rgba(100, 116, 139, ${p.alpha * 0.25 * bgWaveOpacity})`;
    }
    ctx.fill();
  });

  // 2. Draw Scanning Vertical Laser Beam
  // Beam sweeps back and forth smoothly across the canvas
  const beamProgress = (Math.sin(time * 0.9) + 1) / 2; // 0 to 1
  const beamX = width * (0.12 + beamProgress * 0.76);

  const beamGrad = ctx.createLinearGradient(beamX - 45, 0, beamX + 45, 0);
  beamGrad.addColorStop(0, "rgba(163, 230, 53, 0)");
  beamGrad.addColorStop(0.48, isDark ? "rgba(163, 230, 53, 0.12)" : "rgba(132, 204, 22, 0.08)");
  beamGrad.addColorStop(0.5, isDark ? "rgba(163, 230, 53, 0.7)" : "rgba(132, 204, 22, 0.5)");
  beamGrad.addColorStop(0.52, isDark ? "rgba(163, 230, 53, 0.12)" : "rgba(132, 204, 22, 0.08)");
  beamGrad.addColorStop(1, "rgba(163, 230, 53, 0)");

  ctx.fillStyle = beamGrad;
  ctx.fillRect(beamX - 45, 0, 90, height);

  // 3. Draw Background Interfering Voice Layers (Multi-Speaker Mesh)
  // Multiple fine sinusoidal / harmonic curves representing background voices and reverberation
  const bgLayers = [
    { freq: 0.007, speed: 1.1, amp: 45, color: isDark ? "255, 255, 255" : "71, 85, 105", width: 1.2, phase: 0 },
    { freq: 0.012, speed: -0.9, amp: 35, color: isDark ? "203, 213, 225" : "100, 116, 139", width: 1.0, phase: 1.5 },
    { freq: 0.016, speed: 1.4, amp: 55, color: isDark ? "255, 107, 53" : "234, 88, 12", width: 1.1, phase: 3.2 }, // Coral interferer
    { freq: 0.009, speed: -1.3, amp: 40, color: isDark ? "148, 163, 184" : "148, 163, 184", width: 1.0, phase: 4.5 },
    { freq: 0.022, speed: 0.8, amp: 28, color: isDark ? "255, 255, 255" : "71, 85, 105", width: 0.8, phase: 2.1 },
    { freq: 0.018, speed: -1.7, amp: 48, color: isDark ? "255, 107, 53" : "234, 88, 12", width: 1.0, phase: 5.7 },
  ];

  bgLayers.forEach((layer) => {
    ctx.beginPath();
    const effectiveOpacity = Math.max(0.06, bgWaveOpacity * 0.45);
    ctx.strokeStyle = `rgba(${layer.color}, ${effectiveOpacity})`;
    ctx.lineWidth = layer.width;

    for (let x = 0; x <= width; x += 3) {
      // Harmonic wave formula with speech envelope modulation
      const envelope = Math.sin((x / width) * Math.PI); // Pinches at left/right edges
      const noiseMod = Math.sin(x * 0.03 + time * 2) * 0.25 + 0.75;
      const yOffset =
        Math.sin(x * layer.freq + time * layer.speed + layer.phase) *
        layer.amp *
        envelope *
        noiseMod;

      // Subtle mouse interaction
      let mouseDisp = 0;
      if (mouse.active) {
        const dx = x - mouse.x;
        const dist = Math.abs(dx);
        if (dist < 180) {
          mouseDisp = (1 - dist / 180) * 16 * Math.sin(time * 3);
        }
      }

      const y = centerY + yOffset + mouseDisp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });

  // 4. Draw Dense Fine-line Wireframe Mesh (Studio Spectrogram Effect)
  // 12 subtle wireframe ribbons weaving behind the target waveform
  const ribbonCount = 8;
  for (let r = 0; r < ribbonCount; r++) {
    ctx.beginPath();
    const rProgress = r / ribbonCount;
    const alpha = (0.08 - r * 0.007) * bgWaveOpacity;
    ctx.strokeStyle = isDark
      ? `rgba(255, 255, 255, ${Math.max(0.02, alpha)})`
      : `rgba(15, 23, 42, ${Math.max(0.02, alpha)})`;
    ctx.lineWidth = 0.75;

    const rOffset = (r - ribbonCount / 2) * 8;
    for (let x = 0; x <= width; x += 6) {
      const envelope = Math.sin((x / width) * Math.PI);
      const wave =
        Math.sin(x * 0.014 + time * 1.5 + r * 0.4) *
        (38 + r * 5) *
        envelope;
      const y = centerY + wave + rOffset;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // 5. Draw THE TARGET SPEAKER WAVEFORM (The Signature Hero Element in Electric Lime)
  // Formant vocal speech envelope with prominent peaks, harmonics, and bright glow!
  const targetColor = isDark ? "#a3e635" : "#84cc16";

  // Multi-pass glow passes
  const glowPasses = isDark
    ? [
        { width: 14, alpha: 0.12 * targetWaveProminence },
        { width: 8, alpha: 0.25 * targetWaveProminence },
        { width: 4.5, alpha: 0.75 * targetWaveProminence },
        { width: 2.5, alpha: 1.0 },
      ]
    : [
        { width: 10, alpha: 0.15 },
        { width: 5, alpha: 0.4 },
        { width: 2.75, alpha: 1.0 },
      ];

  glowPasses.forEach((pass) => {
    ctx.beginPath();
    ctx.lineWidth = pass.width;
    ctx.strokeStyle = isDark
      ? `rgba(163, 230, 53, ${pass.alpha})`
      : `rgba(132, 204, 22, ${pass.alpha})`;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let x = 0; x <= width; x += 2) {
      const normX = x / width; // 0 to 1
      const envelope = Math.sin(normX * Math.PI); // Windowing curve

      // Vocal formant synthesis simulation: fundamental frequency (F0) + formants (F1, F2)
      const f0 = Math.sin(x * 0.016 + time * 2.2);
      const f1 = Math.sin(x * 0.038 - time * 3.4) * 0.55;
      const f2 = Math.sin(x * 0.082 + time * 4.1) * 0.3;

      // Burst articulation peaks (speech syllables)
      const syllableBurst1 = Math.exp(-Math.pow((normX - 0.38) * 9, 2)) * 52;
      const syllableBurst2 = Math.exp(-Math.pow((normX - 0.65) * 8, 2)) * 68;
      const syllableBurst3 = Math.exp(-Math.pow((normX - 0.82) * 11, 2)) * 42;

      // Scan beam resonance boost when beam passes over
      const distFromBeam = Math.abs(x - beamX);
      const beamResonance = distFromBeam < 90 ? (1 - distFromBeam / 90) * 18 : 0;

      // Target speech amplitude
      const totalAmp =
        ((f0 + f1 + f2) * 44 + syllableBurst1 + syllableBurst2 + syllableBurst3 + beamResonance) *
        envelope *
        targetWaveProminence;

      // Mouse interactive wave displacement
      let mouseDisp = 0;
      if (mouse.active) {
        const dx = x - mouse.x;
        const dist = Math.abs(dx);
        if (dist < 140) {
          mouseDisp = Math.cos((dist / 140) * (Math.PI / 2)) * -24;
        }
      }

      const y = centerY + totalAmp + mouseDisp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });

  // 6. Draw Frequency Accent Bars along the Target Waveform Peaks
  // Highlighting key vocal frequency bins in electric lime
  const barCount = 38;
  for (let b = 0; b < barCount; b++) {
    const barNorm = (b + 0.5) / barCount;
    const barX = width * barNorm;
    const envelope = Math.sin(barNorm * Math.PI);

    const f0 = Math.sin(barX * 0.016 + time * 2.2);
    const f1 = Math.sin(barX * 0.038 - time * 3.4) * 0.55;
    const burst =
      Math.exp(-Math.pow((barNorm - 0.38) * 9, 2)) * 52 +
      Math.exp(-Math.pow((barNorm - 0.65) * 8, 2)) * 68;

    const waveY = centerY + (f0 + f1) * 40 * envelope + burst * envelope * targetWaveProminence;
    const barHeight = (Math.sin(b * 0.8 + time * 4) * 12 + 18) * envelope * targetWaveProminence;

    ctx.beginPath();
    ctx.strokeStyle = isDark
      ? `rgba(163, 230, 53, ${0.45 * targetWaveProminence})`
      : `rgba(132, 204, 22, ${0.4 * targetWaveProminence})`;
    ctx.lineWidth = 1.75;
    ctx.moveTo(barX, waveY - barHeight * 0.5);
    ctx.lineTo(barX, waveY + barHeight * 0.5);
    ctx.stroke();
  }
}
