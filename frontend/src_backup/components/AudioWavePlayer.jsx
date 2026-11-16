import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";

export default function AudioWavePlayer({ audioUrl, title, mode = "mixture" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // Generate deterministic pseudo-waveform heights based on track mode
  const [waveHeights] = useState(() => {
    // Mode-specific contour
    if (mode === "mixture") {
      // Overlapping noisy contours
      return [
        35, 60, 80, 45, 90, 75, 40, 85, 95, 65, 30, 70, 85, 90, 50, 40, 80, 95, 85,
        60, 40, 75, 90, 65, 80, 85, 40, 55, 90, 70, 45, 80, 60, 40, 30, 20
      ];
    } else if (mode === "reference") {
      // Pure clean vocal speech contour
      return [
        15, 25, 45, 65, 75, 80, 85, 70, 50, 20, 15, 35, 60, 85, 90, 75, 55, 25, 15,
        20, 45, 70, 80, 65, 40, 20, 15, 20, 35, 50, 60, 40, 25, 15, 10, 10
      ];
    } else {
      // Extracted output - crisp harmonic contour
      return [
        20, 35, 65, 85, 90, 95, 80, 60, 35, 25, 45, 75, 90, 95, 85, 60, 35, 20, 30,
        60, 85, 90, 75, 50, 30, 25, 40, 65, 80, 70, 45, 30, 20, 15, 10, 10
      ];
    }
  });

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
        .catch((err) => console.error("Playback error:", err));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Active bar and progress styles based on mode
  const activeBarClass =
    mode === "reference"
      ? "bg-lime-400"
      : mode === "extracted"
      ? "bg-lime-400"
      : "bg-teal-400";

  return (
    <div className="w-full bg-[#0d121a] border border-[#1e2838] rounded-md p-3">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Waveform Visualization Bars */}
      <div
        className="flex items-center justify-between gap-1 h-9 mb-2.5 px-0.5"
        role="img"
        aria-label={`${title} audio waveform`}
      >
        {waveHeights.map((h, i) => {
          const barProgress = (i / waveHeights.length) * 100;
          const isPassed = barProgress <= progressPercent;
          return (
            <div
              key={i}
              onClick={() => {
                if (duration > 0 && audioRef.current) {
                  const targetTime = (i / waveHeights.length) * duration;
                  audioRef.current.currentTime = targetTime;
                  setCurrentTime(targetTime);
                }
              }}
              className={`flex-1 rounded-[1px] cursor-pointer transition-all duration-100 ${
                isPassed
                  ? activeBarClass
                  : "bg-[#1c2433] hover:bg-[#253043]"
              }`}
              style={{
                height: `${h}%`,
                transform: isPlaying && isPassed ? "scaleY(1.08)" : "scaleY(1)",
              }}
            />
          );
        })}
      </div>

      {/* Progress Bar Track */}
      <div className="relative w-full h-1 bg-[#1a2230] rounded-full mb-2.5 cursor-pointer group">
        <div
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-75 ${
            mode === "reference"
              ? "bg-lime-400"
              : mode === "extracted"
              ? "bg-gradient-to-r from-teal-400 to-lime-400"
              : "bg-teal-400"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.05"
          value={currentTime}
          onChange={handleSeek}
          aria-label="Seek track position"
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Playback Controls & Timers */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={togglePlay}
            className="w-7 h-7 rounded bg-[#16202e] hover:bg-[#1f2d40] text-slate-100 flex items-center justify-center border border-[#233145] hover:border-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 cursor-pointer"
            title={isPlaying ? "Pause audio" : "Play audio"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current text-lime-400" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5 text-slate-100" />
            )}
          </button>

          <button
            type="button"
            onClick={restartAudio}
            className="p-1 rounded hover:bg-[#16202e] text-slate-400 hover:text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
            title="Restart"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="p-1 rounded hover:bg-[#16202e] text-slate-400 hover:text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-3 h-3 text-rose-400" />
            ) : (
              <Volume2 className="w-3 h-3" />
            )}
          </button>
        </div>

        <div className="text-[11px] text-slate-400">
          <span className="text-slate-200">{formatTime(currentTime)}</span>
          <span className="text-slate-600 mx-1">/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
