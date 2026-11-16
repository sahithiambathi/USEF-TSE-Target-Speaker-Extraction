import React from "react";
import { Download, RotateCcw, Volume2, CheckCircle, Clock } from "lucide-react";
import AudioWavePlayer from "./AudioWavePlayer";

export default function OutputSection({ result, onReset }) {
  if (!result) {
    return (
      <div className="w-full bg-[#0f141c] border border-[#1b2330] rounded-lg p-6 flex flex-col items-center justify-center text-center">
        <div className="w-9 h-9 rounded bg-[#161d28] border border-[#222b3a] flex items-center justify-center mb-2.5 text-slate-500">
          <Volume2 className="w-4 h-4 text-slate-400" />
        </div>
        <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300 mb-1">
          Extracted Voice
        </h4>
        <p className="text-xs text-slate-500 max-w-md font-mono">
          Your extracted audio will appear here.
        </p>
      </div>
    );
  }

  const handleDownload = () => {
    if (!result.download_url) return;
    const link = document.createElement("a");
    link.href = result.download_url;
    link.download = result.output_filename || "extracted_target_speaker.wav";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-[#111722] border border-teal-900/60 rounded-lg p-5 shadow-lg relative overflow-hidden animate-enter-workspace">
      {/* Top accent border line in teal/lime */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 via-lime-400 to-teal-500" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#1c2433]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded flex items-center justify-center bg-[#0d221f] text-teal-300 border border-teal-800/60">
            <CheckCircle className="w-4 h-4 text-lime-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-teal-400 font-bold tracking-wider">
                CH-OUT
              </span>
              <h3 className="text-sm font-mono font-bold text-slate-100 tracking-tight uppercase">
                Extracted Voice
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Isolated target speech via USEF-TFGridNet cross-attention
            </p>
          </div>
        </div>

        {/* Real Measured Metrics (Only genuine backend values) */}
        <div className="flex items-center gap-2 flex-wrap font-mono text-[11px]">
          {result.processing_time !== undefined && result.processing_time !== null && (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#0b0e14] border border-[#1e2838] text-slate-300">
              <Clock className="w-3 h-3 text-teal-400" />
              <span>{result.processing_time}s inference</span>
            </div>
          )}

          {result.extracted_duration !== undefined && result.extracted_duration !== null && (
            <div className="px-2 py-1 rounded bg-[#0b0e14] border border-[#1e2838] text-slate-300">
              <span>{result.extracted_duration}s track</span>
            </div>
          )}
        </div>
      </div>

      {/* Extracted Audio Player with custom output contour */}
      <div className="mb-4">
        <AudioWavePlayer
          audioUrl={result.output_url}
          title={result.output_filename}
          mode="extracted"
        />
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
          <span className="text-slate-200">{result.output_filename}</span>
          <span>•</span>
          <span>{result.sample_rate || 8000} Hz WAV</span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-mono bg-[#141b25] hover:bg-[#1a2332] text-slate-300 border border-[#232e40] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset & Extract Another</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded text-xs font-mono font-bold bg-[#18261e] text-lime-400 border border-lime-500/80 hover:bg-[#1f3328] hover:border-lime-400 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime-400 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download WAV</span>
          </button>
        </div>
      </div>
    </div>
  );
}
