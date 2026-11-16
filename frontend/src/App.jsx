import React, { useState, useEffect } from "react";
import { Mic, Users, Headphones, Volume2, Sparkles, RefreshCw } from "lucide-react";
import Header from "./components/Header";
import AudioUploadCard from "./components/AudioUploadCard";
import ExtractionAction from "./components/ExtractionAction";
import OutputSection from "./components/OutputSection";
import ResearchModal from "./components/ResearchModal";

export default function App() {
  const [mixedFile, setMixedFile] = useState(null);
  const [mixedAudioUrl, setMixedAudioUrl] = useState(null);
  const [mixedDuration, setMixedDuration] = useState(0);

  const [refFile, setRefFile] = useState(null);
  const [refAudioUrl, setRefAudioUrl] = useState(null);
  const [refDuration, setRefDuration] = useState(0);

  const [modelStatus, setModelStatus] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);
  const [error, setError] = useState(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Check model status on mount
  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const res = await fetch("/api/status");
      if (res.ok) {
        const data = await res.json();
        setModelStatus(data);
      } else {
        setModelStatus({ status: "error", detail: "Backend responded with error" });
      }
    } catch (err) {
      console.warn("Status check failed:", err);
      setModelStatus({ status: "error", detail: "Cannot connect to backend server" });
    }
  };

  // Helper to extract duration from an audio file
  const getAudioDuration = (file) => {
    return new Promise((resolve) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      audio.src = url;
      audio.onloadedmetadata = () => {
        resolve({ duration: audio.duration, url });
      };
      audio.onerror = () => {
        resolve({ duration: 0, url });
      };
    });
  };

  const handleSelectMixed = async (file) => {
    setError(null);
    if (!file) return;
    const { duration, url } = await getAudioDuration(file);
    setMixedFile(file);
    setMixedAudioUrl(url);
    setMixedDuration(duration);
  };

  const handleRemoveMixed = () => {
    if (mixedAudioUrl) URL.revokeObjectURL(mixedAudioUrl);
    setMixedFile(null);
    setMixedAudioUrl(null);
    setMixedDuration(0);
    setExtractionResult(null);
  };

  const handleSelectRef = async (file) => {
    setError(null);
    if (!file) return;
    const { duration, url } = await getAudioDuration(file);
    setRefFile(file);
    setRefAudioUrl(url);
    setRefDuration(duration);
  };

  const handleRemoveRef = () => {
    if (refAudioUrl) URL.revokeObjectURL(refAudioUrl);
    setRefFile(null);
    setRefAudioUrl(null);
    setRefDuration(0);
    setExtractionResult(null);
  };

  const handleLoadSample = async () => {
    try {
      setError(null);
      setIsExtracting(false);
      setExtractionResult(null);

      // Default to actual filenames found in backend/samples
      let mixUrl = "/api/samples/mixed_speaker.wav";
      let refUrl = "/api/samples/speaker_a_ref.wav";
      let mixFilename = "mixed_speaker.wav";
      let refFilename = "speaker_a_ref.wav";

      // Dynamically query /api/samples if available to resolve paths
      try {
        const samplesRes = await fetch("/api/samples");
        if (samplesRes.ok) {
          const samplesData = await samplesRes.json();
          if (samplesData.mixed?.url) mixUrl = samplesData.mixed.url;
          if (samplesData.mixed?.name) mixFilename = samplesData.mixed.name;
          if (samplesData.reference?.url) refUrl = samplesData.reference.url;
          else if (samplesData.speaker_a?.url) refUrl = samplesData.speaker_a.url;
          if (samplesData.reference?.name) refFilename = samplesData.reference.name;
          else if (samplesData.speaker_a?.name) refFilename = samplesData.speaker_a.name;
        }
      } catch (metaErr) {
        console.warn("Could not retrieve sample metadata, falling back to direct endpoints", metaErr);
      }

      // Fetch the two actual audio files
      const [mixRes, refRes] = await Promise.all([
        fetch(mixUrl),
        fetch(refUrl),
      ]);

      if (!mixRes.ok) {
        throw new Error(`Failed to load mixture recording from ${mixUrl} (${mixRes.status})`);
      }
      if (!refRes.ok) {
        throw new Error(`Failed to load reference recording from ${refUrl} (${refRes.status})`);
      }

      const mixBlob = await mixRes.blob();
      const refBlob = await refRes.blob();

      const sampleMixFile = new File([mixBlob], mixFilename, {
        type: "audio/wav",
      });
      const sampleRefFile = new File([refBlob], refFilename, {
        type: "audio/wav",
      });

      await handleSelectMixed(sampleMixFile);
      await handleSelectRef(sampleRefFile);
    } catch (err) {
      console.error("Error loading demo samples:", err);
      setError("Failed to fetch demo samples: " + err.message);
    }
  };

  const handleExtract = async () => {
    if (!mixedFile || !refFile) {
      setError("Please provide both Mixture Recording and Target Speaker Reference.");
      return;
    }

    setError(null);
    setIsExtracting(true);
    setExtractionResult(null);

    const formData = new FormData();
    formData.append("mixed_audio", mixedFile);
    formData.append("reference_audio", refFile);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Speaker extraction failed.");
      }

      setExtractionResult(data);
    } catch (err) {
      console.error("Extraction error:", err);
      setError(err.message || "Failed to process target speaker extraction.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleReset = () => {
    setExtractionResult(null);
    setError(null);
  };

  const canExtract = Boolean(
    mixedFile && refFile && (!modelStatus || modelStatus.status === "ready")
  );

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 flex flex-col selection:bg-teal-500/20 selection:text-teal-200">
      {/* Clean Header without redundant status badges */}
      <Header
        onOpenAbout={() => setIsAboutOpen(true)}
        onLoadSample={handleLoadSample}
        isExtracting={isExtracting}
      />

      {/* Main Research Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Compact Hero Section */}
          <div className="text-center max-w-2xl mx-auto space-y-2 animate-enter-hero">
            {/* Subtle animated waveform graphic near heading */}
            <div className="flex items-center justify-center gap-1 h-5 mb-1 opacity-80" aria-hidden="true">
              <span className="w-1 h-2 bg-slate-600 rounded-full" />
              <span className="w-1 h-3.5 bg-teal-400 rounded-full animate-pulse" />
              <span className="w-1 h-5 bg-teal-300 rounded-full animate-pulse" style={{ animationDelay: "100ms" }} />
              <span className="w-1 h-2.5 bg-slate-500 rounded-full" />
              <span className="w-1 h-4.5 bg-lime-400 rounded-full animate-pulse" style={{ animationDelay: "200ms" }} />
              <span className="w-1 h-3 bg-lime-300 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
              <span className="w-1 h-1.5 bg-slate-600 rounded-full" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-slate-100">
              One voice. Hidden in the mix.
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
              Identify a speaker using a short reference recording, then extract their voice from overlapping speech.
            </p>
          </div>

          {/* Audio Input Workspace (Side by side on desktop, stacked on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-enter-workspace">
            {/* Input 1: Mixture Recording */}
            <AudioUploadCard
              id="mixture-audio-input"
              label="Mixture Recording"
              channelCode="CH-01"
              subtitle="Audio stream containing overlapping speakers"
              hint="Provide an audio recording where two or more individuals speak simultaneously."
              icon={Users}
              variant="mixture"
              file={mixedFile}
              audioUrl={mixedAudioUrl}
              duration={mixedDuration}
              onFileSelect={handleSelectMixed}
              onRemove={handleRemoveMixed}
            />

            {/* Input 2: Target Speaker Reference */}
            <AudioUploadCard
              id="reference-audio-input"
              label="Target Speaker Reference"
              channelCode="REF-01"
              subtitle="Solo recording of the specific target voice"
              hint="Provide a short isolated voice sample of the desired speaker to guide extraction."
              icon={Mic}
              variant="reference"
              file={refFile}
              audioUrl={refAudioUrl}
              duration={refDuration}
              onFileSelect={handleSelectRef}
              onRemove={handleRemoveRef}
            />
          </div>

          {/* Extraction Action & Convergence Animation */}
          <ExtractionAction
            canExtract={canExtract}
            isExtracting={isExtracting}
            onExtract={handleExtract}
            error={error}
            onClearError={() => setError(null)}
          />

          {/* Dedicated Output Section: Extracted Voice */}
          <OutputSection result={extractionResult} onReset={handleReset} />
        </div>

        {/* Minimalist Research Tool Footer */}
        <footer className="mt-10 pt-4 border-t border-[#171e2c] text-center text-[11px] font-mono text-slate-500 space-y-1">
          <p>
            USEF-TSE Laboratory Platform • Reference-Guided Target Speaker Extraction
          </p>
          <p className="text-[10px] text-slate-600">
            WSJ0-2mix Benchmark Architecture • 8 kHz TFGridNet Neural Backbone
          </p>
        </footer>
      </main>

      {/* Architecture & Verified Model Info Modal */}
      <ResearchModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
