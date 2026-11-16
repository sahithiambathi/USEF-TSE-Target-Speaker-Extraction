import React, { useRef, useState } from "react";
import { UploadCloud, FileAudio, Trash2, RefreshCw, CheckCircle2, Music, AlertCircle } from "lucide-react";
import AudioWavePlayer from "./AudioWavePlayer";

export default function AudioUploadCard({
  id,
  label,
  channelCode,
  subtitle,
  hint,
  icon: Icon,
  variant = "mixture", // "mixture" | "reference"
  file,
  audioUrl,
  duration,
  onFileSelect,
  onRemove,
  isExtracting,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formatError, setFormatError] = useState(null);

  const allowedExtensions = [".wav", ".mp3", ".flac", ".ogg", ".m4a"];

  const validateAndSelect = (selectedFile) => {
    if (!selectedFile) return;
    setFormatError(null);

    const name = selectedFile.name.toLowerCase();
    const isValid = allowedExtensions.some((ext) => name.endsWith(ext));

    if (!isValid) {
      setFormatError("Unsupported audio format. Please upload WAV, MP3, FLAC, OGG, or M4A.");
      return;
    }

    onFileSelect(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isExtracting) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (isExtracting) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
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
      className={`flex-1 flex flex-col bg-[var(--bg-surface-1)] border rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-[var(--shadow-card)] relative ${
        isDragging
          ? "border-[var(--accent-lime)] bg-[var(--accent-lime-dim)] shadow-[0_0_20px_var(--accent-lime-glow)]"
          : file
          ? "border-[var(--border-subtle)]"
          : "border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
      }`}
    >
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        id={id}
        accept=".wav,.mp3,.flac,.ogg,.m4a,audio/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={isExtracting}
      />

      {/* Card Header */}
      <div className="flex items-start justify-between pb-4 mb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm ${
              isMixture
                ? "bg-[var(--bg-surface-2)] text-[var(--text-primary)] border-[var(--border-subtle)]"
                : "bg-[var(--accent-lime-dim)] text-[var(--accent-lime)] border-[var(--accent-lime)]/30"
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-[var(--text-muted)] tracking-wider">
                {channelCode}
              </span>
              <h3 className="font-mono font-bold text-[var(--text-primary)] text-sm tracking-tight">
                {label}
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{subtitle}</p>
          </div>
        </div>

        {file ? (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[var(--accent-lime)] bg-[var(--accent-lime-dim)] border border-[var(--accent-lime)]/30 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> READY
          </span>
        ) : (
          <span className="font-mono text-[10px] text-[var(--text-muted)] bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] px-2 py-0.5 rounded-full">
            EMPTY
          </span>
        )}
      </div>

      {/* Body Area */}
      {file && audioUrl ? (
        /* Loaded File State: Waveform Player & Metadata */
        <div className="flex-1 flex flex-col justify-between space-y-4">
          {/* File Meta Info Bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-xs font-mono">
            <div className="flex items-center gap-2 truncate pr-2">
              <FileAudio className="w-4 h-4 text-[var(--accent-lime)] shrink-0" />
              <span className="truncate font-semibold text-[var(--text-primary)]" title={file.name}>
                {file.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)] shrink-0 text-[11px]">
              <span>{formatFileSize(file.size)}</span>
              <span>•</span>
              <span className="text-[var(--text-primary)] font-bold">{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Genuine Web Audio Waveform Player */}
          <div className="p-1">
            <AudioWavePlayer
              audioUrl={audioUrl}
              title={file.name}
              mode={variant}
              channelCode={channelCode}
            />
          </div>

          {/* Action Row: Replace / Remove */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs font-mono">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isExtracting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace File</span>
            </button>

            <button
              type="button"
              onClick={onRemove}
              disabled={isExtracting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty Upload Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isExtracting && fileInputRef.current?.click()}
          className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--accent-lime)]/60 rounded-xl bg-[var(--bg-surface-0)]/60 hover:bg-[var(--bg-surface-2)]/50 transition-all duration-200 cursor-pointer text-center group min-h-[190px]"
        >
          <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--accent-lime)] group-hover:border-[var(--accent-lime)]/40 transition-colors mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>

          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] group-hover:text-[var(--accent-lime)] transition-colors">
            Click to upload or drag audio here
          </h4>
          <p className="text-[11px] text-[var(--text-secondary)] max-w-xs mt-1.5">
            {hint}
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] text-[var(--text-muted)] bg-[var(--bg-surface-2)] px-2.5 py-1 rounded-md border border-[var(--border-subtle)]">
            <Music className="w-3 h-3" />
            <span>WAV, MP3, FLAC, M4A up to 25MB</span>
          </div>
        </div>
      )}

      {/* Format Error Notice */}
      {formatError && (
        <div className="mt-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formatError}</span>
        </div>
      )}
    </div>
  );
}
