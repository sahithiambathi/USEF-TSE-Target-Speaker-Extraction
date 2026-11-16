import React, { useRef, useState } from "react";
import { UploadCloud, FileAudio, Trash2, RefreshCw, CheckCircle2 } from "lucide-react";
import AudioWavePlayer from "./AudioWavePlayer";

export default function AudioUploadCard({
  id,
  label,
  channelCode,
  subtitle,
  hint,
  icon: Icon,
  variant = "mixture", // "mixture" or "reference"
  file,
  audioUrl,
  duration,
  onFileSelect,
  onRemove,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDuration = (secs) => {
    if (!secs || isNaN(secs)) return "--:--";
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  const isMixture = variant === "mixture";

  return (
    <div
      className={`flex-1 flex flex-col bg-[#121721] border rounded-lg p-4 transition-all duration-200 shadow-sm ${
        isDragging
          ? isMixture
            ? "border-teal-400 bg-[#141d2a]"
            : "border-lime-400 bg-[#16201e]"
          : "border-[#1e2838] hover:border-slate-700"
      }`}
    >
      {/* Panel Header */}
      <div className="flex items-start justify-between pb-3 mb-3 border-b border-[#1c2433]">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded flex items-center justify-center border ${
              isMixture
                ? "bg-[#0e1d24] text-teal-400 border-teal-900/60"
                : "bg-[#162017] text-lime-400 border-lime-900/60"
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-slate-400 tracking-wider">
                {channelCode}
              </span>
              <h3 className="font-semibold text-slate-100 text-sm tracking-tight">{label}</h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
          </div>
        </div>

        {file ? (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-teal-300 bg-[#0d221f] border border-teal-800/60 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-teal-400" /> LOADED
          </span>
        ) : (
          <span className="font-mono text-[10px] text-slate-500 bg-[#161d28] border border-[#222b3a] px-1.5 py-0.5 rounded">
            AWAITING INPUT
          </span>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="audio/*,.wav,.mp3,.flac,.ogg"
        className="hidden"
        id={id}
      />

      {/* Empty Upload State vs File Player State */}
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`flex-1 min-h-[170px] border border-dashed rounded-md flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 ${
            isMixture
              ? "focus-visible:ring-teal-400 border-[#243044] hover:border-teal-500/70 hover:bg-[#151c29]"
              : "focus-visible:ring-lime-400 border-[#243044] hover:border-lime-500/70 hover:bg-[#16201e]"
          } bg-[#0e131b]`}
        >
          {/* Animated Graphic representation of input type */}
          <div className="w-full max-w-[200px] h-10 mb-2 flex items-center justify-center relative overflow-hidden">
            {isMixture ? (
              // Mixture: Overlapping dual waveforms representing multi-speaker interference
              <svg className="w-full h-10" viewBox="0 0 200 40" fill="none">
                {/* Wave 1: Speaker A (Muted Teal) */}
                <path
                  d="M0 20 Q 25 5, 50 20 T 100 20 T 150 20 T 200 20"
                  stroke="#2dd4bf"
                  strokeWidth="1.75"
                  className="opacity-75 transition-transform duration-700 hover:scale-y-110"
                />
                {/* Wave 2: Speaker B (Zinc / Slate-500 overlapping) */}
                <path
                  d="M0 20 Q 20 32, 45 20 T 95 20 T 145 20 T 200 20"
                  stroke="#64748b"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  className="opacity-80"
                />
              </svg>
            ) : (
              // Reference: Single clean sine wave representing clean target speaker
              <svg className="w-full h-10" viewBox="0 0 200 40" fill="none">
                <path
                  d="M0 20 Q 25 7, 50 20 T 100 20 T 150 20 T 200 20"
                  stroke="#a3e635"
                  strokeWidth="2"
                  className="opacity-90"
                />
              </svg>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium mb-1">
            <UploadCloud
              className={`w-4 h-4 ${isMixture ? "text-teal-400" : "text-lime-400"}`}
            />
            <span>Drop audio file or</span>
            <span
              className={`underline font-mono ${
                isMixture ? "text-teal-400 hover:text-teal-300" : "text-lime-400 hover:text-lime-300"
              }`}
            >
              Browse
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            {isMixture
              ? "WAV, MP3, FLAC (Overlapping voices)"
              : "WAV, MP3, FLAC (Clean solo reference clip)"}
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between space-y-3 animate-enter-workspace">
          {/* File Metadata Bar */}
          <div className="flex items-center justify-between p-2.5 rounded bg-[#0d121a] border border-[#1e2838]">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <FileAudio
                className={`w-4 h-4 shrink-0 ${isMixture ? "text-teal-400" : "text-lime-400"}`}
              />
              <div className="min-w-0">
                <p className="text-xs font-mono font-medium text-slate-200 truncate">{file.name}</p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                  <span>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span>{formatDuration(duration)}</span>
                </div>
              </div>
            </div>

            {/* Replace & Remove Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-[#1a2332] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 cursor-pointer"
                title="Replace audio file"
                aria-label={`Replace ${label} file`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-[#1a2332] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-400 cursor-pointer"
                title="Remove audio file"
                aria-label={`Remove ${label} file`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Audio Waveform Player */}
          {audioUrl && (
            <AudioWavePlayer
              audioUrl={audioUrl}
              title={label}
              mode={isMixture ? "mixture" : "reference"}
            />
          )}
        </div>
      )}

      {/* Helper Guidance Hint */}
      {hint && (
        <p className="text-[11px] text-slate-500 mt-2.5 font-mono flex items-center gap-1.5">
          <span className="text-slate-400 font-semibold">[INFO]</span> {hint}
        </p>
      )}
    </div>
  );
}
