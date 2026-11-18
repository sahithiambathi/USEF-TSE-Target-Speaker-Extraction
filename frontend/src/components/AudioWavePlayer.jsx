import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw, Activity } from "lucide-react";
import { useAudioWaveform } from "../hooks/useAudioWaveform";

export default function AudioWavePlayer({
  audioUrl,
  mode = "mixture", // "mixture" | "reference" | "extracted"
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // Extract genuine waveform peaks from actual audio file using Web Audio API
  const { peaks, duration: decodedDuration, isLoading: isWaveformLoading } = useAudioWaveform(
    audioUrl,
    46
  );

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
  }, [audioUrl]);

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
          console.warn("Playback prevented or audio error:", err);
          setIsPlaying(false);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
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

  // Handle clicking directly on waveform bar to seek
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
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* Real Waveform Visualizer Display matching Reference 1 (warm gold / purple waves) */}
      <div
        className={`relative w-full h-16 rounded-xl px-3 py-2 flex items-center justify-between gap-1 border transition-all duration-200 select-none ${
          isExtracted
            ? "bg-[var(--accent-gold-dim)] border-[var(--accent-gold)]/40 shadow-[0_0_15px_var(--accent-gold-glow)]"
            : "bg-[var(--bg-surface-2)] border-[var(--border-subtle)]"
        }`}
      >
        {isWaveformLoading ? (
          <div className="w-full flex items-center justify-center gap-2 text-xs font-mono text-[var(--text-muted)]">
            <Activity className="w-4 h-4 animate-spin text-[var(--accent-gold)]" />
            <span>Decoding PCM audio waveform...</span>
          </div>
        ) : peaks.length > 0 ? (
          <div className="w-full h-full flex items-center justify-between gap-[3px]">
            {peaks.map((peak, idx) => {
              const barProgress = idx / peaks.length;
              const hasPlayed = barProgress <= progressRatio;

              // Waveform bar height based on real peak (min 15%, max 100%)
              const heightPct = Math.max(15, Math.round(peak * 100));

              let barColor = "bg-[var(--text-dim)] opacity-40";
              if (isExtracted) {
                barColor = hasPlayed
                  ? "bg-[var(--accent-gold)] shadow-[0_0_8px_var(--accent-gold)] opacity-100"
                  : "bg-[var(--accent-gold)]/40";
              } else if (isReference) {
                barColor = hasPlayed
                  ? "bg-[var(--accent-gold)] opacity-100"
                  : "bg-[var(--accent-gold)]/40";
              } else {
                barColor = hasPlayed
                  ? "bg-[var(--accent-purple)] opacity-100"
                  : "bg-[var(--accent-purple)]/40";
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleBarClick(idx)}
                  style={{ height: `${heightPct}%` }}
                  className={`flex-1 rounded-full transition-all duration-100 hover:scale-y-110 cursor-pointer ${barColor}`}
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
          className="w-full h-1 bg-[var(--border-subtle)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-gold)]"
        />
      </div>

      {/* Control Buttons & Timers Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] pt-1">
        <div className="flex items-center gap-2.5">
          {/* Play/Pause Circular Button matching Reference 1 */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)] ${
              isExtracted
                ? "bg-[var(--accent-gold)] text-[#090a10] hover:bg-[var(--accent-gold-hover)] shadow-sm"
                : "bg-[var(--bg-surface-2)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)]"
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
          </button>

          {/* Time display */}
          <span className="font-mono text-[11px] text-[var(--text-primary)] font-semibold">
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
              }
            }}
            className="p-1.5 rounded-full hover:bg-[var(--bg-surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
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
            className="p-1.5 rounded-full hover:bg-[var(--bg-surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
