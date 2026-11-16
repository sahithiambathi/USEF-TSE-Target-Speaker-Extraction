import React, { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw, Activity } from "lucide-react";
import { useAudioWaveform } from "../hooks/useAudioWaveform";

/**
 * AudioWavePlayer
 * Real audio waveform visualizer and audio player.
 * Features genuine Web Audio API decoded amplitudes and real-time audio-reactive animation.
 */
export default function AudioWavePlayer({
  audioUrl,
  title = "Audio Track",
  mode = "mixture", // "mixture" | "reference" | "extracted"
  channelCode,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [liveBounce, setLiveBounce] = useState(1);
  const audioRef = useRef(null);
  const animFrameRef = useRef(null);

  // Decode genuine waveform peaks from actual audio using Web Audio API
  const BAR_COUNT = mode === "extracted" ? 64 : 48;
  const { peaks, duration: decodedDuration, isLoading: isWaveformLoading } = useAudioWaveform(
    audioUrl,
    BAR_COUNT
  );

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
  }, [audioUrl]);

  // Audio-reactive loop while playing: modulates active bar dynamics to actual audio amplitude
  useEffect(() => {
    if (!isPlaying) {
      setLiveBounce(1);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const updateLiveDynamics = () => {
      if (!audioRef.current) return;
      const t = audioRef.current.currentTime;
      setCurrentTime(t);

      const dur = audioDuration || decodedDuration || 1;
      const progress = Math.min(1, Math.max(0, t / dur));
      const peakIndex = Math.min(peaks.length - 1, Math.floor(progress * peaks.length));
      const activeAmplitude = peaks[peakIndex] || 0.4;

      // Real-time audio reactivity: scale active amplitude into subtle dynamic bounce
      const dynamicScale = 0.85 + activeAmplitude * 0.45;
      setLiveBounce(dynamicScale);

      animFrameRef.current = requestAnimationFrame(updateLiveDynamics);
    };

    animFrameRef.current = requestAnimationFrame(updateLiveDynamics);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, audioDuration, decodedDuration, peaks]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Playback prevented or audio stream error:", err);
          setIsPlaying(false);
        });
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const effectiveDuration = audioDuration || decodedDuration || 0;
  const progressRatio = effectiveDuration > 0 ? currentTime / effectiveDuration : 0;

  // Direct click-to-seek on the waveform canvas/bars
  const handleBarClick = (index) => {
    if (!audioRef.current || peaks.length === 0 || effectiveDuration <= 0) return;
    const targetTime = (index / peaks.length) * effectiveDuration;
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const isExtracted = mode === "extracted";
  const isReference = mode === "reference";

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* Real Waveform Visualizer Display */}
      <div
        className={`relative w-full rounded-xl px-3.5 py-3 flex items-center justify-between gap-1 border transition-all duration-200 select-none overflow-hidden ${
          isExtracted
            ? "h-20 bg-[var(--bg-surface-0)] border-[var(--accent-lime)] shadow-[0_0_20px_var(--accent-lime-glow)]"
            : "h-16 bg-[var(--bg-surface-0)]/70 border-[var(--border-subtle)]"
        }`}
      >
        {isWaveformLoading ? (
          <div className="w-full flex items-center justify-center gap-2 text-xs font-mono text-[var(--text-muted)]">
            <Activity className="w-4 h-4 animate-spin text-[var(--accent-lime)]" />
            <span>Decoding PCM audio waveform...</span>
          </div>
        ) : peaks.length > 0 ? (
          <div className="w-full h-full flex items-center justify-between gap-[2.5px] relative z-10">
            {peaks.map((peak, idx) => {
              const barProgress = idx / peaks.length;
              const hasPlayed = barProgress <= progressRatio;
              const isPlayHeadBar = Math.abs(barProgress - progressRatio) < 1 / peaks.length;

              // Genuine audio amplitude height: min 14%, max 100%
              let heightPct = Math.max(14, Math.round(peak * 100));

              // Audio-reactive real-time scale for active playhead
              if (isPlaying && isPlayHeadBar) {
                heightPct = Math.min(100, Math.round(heightPct * liveBounce));
              }

              let barColor = "bg-[var(--text-muted)]/35";

              if (isExtracted) {
                // Extracted Isolated Voice - Radiant Electric Lime
                barColor = hasPlayed
                  ? "bg-[var(--accent-lime)] shadow-[0_0_10px_var(--accent-lime)] opacity-100"
                  : "bg-[var(--accent-lime)]/30 opacity-70";
                if (isPlayHeadBar && isPlaying) {
                  barColor = "bg-white shadow-[0_0_14px_var(--accent-lime)] opacity-100";
                }
              } else if (isReference) {
                // Reference Voice - Clean Lime/Cyan tint
                barColor = hasPlayed
                  ? "bg-[var(--accent-lime)] opacity-95"
                  : "bg-[var(--text-secondary)]/40";
              } else {
                // Mixture Audio - High contrast white on played, slate on unplayed
                barColor = hasPlayed
                  ? "bg-[var(--text-primary)] opacity-90"
                  : "bg-[var(--text-muted)]/40";
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleBarClick(idx)}
                  style={{ height: `${heightPct}%` }}
                  className={`flex-1 rounded-full transition-all duration-75 hover:scale-y-115 cursor-pointer ${barColor}`}
                  title={`Seek to ${formatTime((idx / peaks.length) * effectiveDuration)}`}
                />
              );
            })}
          </div>
        ) : (
          <div className="w-full flex items-center justify-center text-[11px] font-mono text-[var(--text-muted)]">
            Audio loaded
          </div>
        )}
      </div>

      {/* Scrub range slider */}
      <div className="relative flex items-center">
        <input
          type="range"
          min="0"
          max={effectiveDuration || 1}
          step="0.05"
          value={currentTime}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setCurrentTime(val);
            if (audioRef.current) audioRef.current.currentTime = val;
          }}
          className="w-full h-1 bg-[var(--border-subtle)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-lime)]"
        />
      </div>

      {/* Control Buttons & Timers Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] pt-0.5">
        <div className="flex items-center gap-2.5">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-lime)] ${
              isExtracted
                ? "bg-[var(--accent-lime)] text-[var(--accent-lime-text)] hover:bg-[var(--accent-lime-hover)] shadow-md"
                : "bg-[var(--bg-surface-2)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)]"
            }`}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Time display */}
          <span className="font-mono text-xs text-[var(--text-primary)] font-semibold tracking-tight">
            {formatTime(currentTime)} / {formatTime(effectiveDuration)}
          </span>
        </div>

        {/* Volume & Replay Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                setCurrentTime(0);
                audioRef.current.play();
                setIsPlaying(true);
              }
            }}
            className="p-1.5 rounded-md hover:bg-[var(--bg-surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            title="Restart track"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.muted = !isMuted;
                setIsMuted(!isMuted);
              }
            }}
            className="p-1.5 rounded-md hover:bg-[var(--bg-surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
