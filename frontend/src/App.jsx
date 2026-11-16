import React, { useState, useEffect, useRef, useCallback } from "react";
import { Users, Mic, Sparkles, Sliders } from "lucide-react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import AudioUploadCard from "./components/AudioUploadCard";
import ExtractionAction from "./components/ExtractionAction";
import OutputSection from "./components/OutputSection";
import AboutResearchSection from "./components/AboutResearchSection";
import Footer from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";

function MainStudio() {
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

  const workspaceRef = useRef(null);

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/status");
      if (res.ok) {
        const data = await res.json();
        setModelStatus(data);
      } else {
        setModelStatus({ status: "error", detail: "Backend responded with error status" });
      }
    } catch (err) {
      console.warn("Backend status check failed:", err);
      setModelStatus({ status: "error", detail: "Cannot connect to backend server" });
    }
  }, []);

  // Check backend model status on mount
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Helper to extract duration and create URL from File
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
    if (mixedAudioUrl) URL.revokeObjectURL(mixedAudioUrl);
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
    if (refAudioUrl) URL.revokeObjectURL(refAudioUrl);
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

      // Default sample endpoints
      let mixUrl = "/api/samples/mixed_speaker.wav";
      let refUrl = "/api/samples/speaker_a_ref.wav";
      let mixFilename = "mixed_speaker.wav";
      let refFilename = "speaker_a_ref.wav";

      // Query /api/samples to resolve configured filenames
      try {
        const samplesRes = await fetch("/api/samples");
        if (samplesRes.ok) {
          const samplesData = await samplesRes.json();
          if (samplesData.mixed?.url) mixUrl = samplesData.mixed.url;
          if (samplesData.mixed?.name) mixFilename = samplesData.mixed.name;
          if (samplesData.reference?.url) refUrl = samplesData.reference.url;
          else if (samplesData.speaker_a?.url) refUrl = samplesData.speaker_a.url;
          if (samplesData.reference?.name) refFilename = samplesData.reference.name;
          else if (samplesData.speaker_a?.name) refFilename = samplesData.reference.name;
        }
      } catch (metaErr) {
        console.warn("Falling back to direct demo endpoints:", metaErr);
      }

      // Fetch the two bundled audio files
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

      // Smooth scroll down to workspace
      const el = document.getElementById("workspace");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Error loading demo samples:", err);
      setError("Failed to fetch demo samples: " + err.message);
    }
  };

  const handleExtract = async () => {
    if (!mixedFile || !refFile) {
      setError("Please provide both a Mixture Recording and a Target Speaker Reference.");
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
        throw new Error(data.detail || "Speaker extraction failed on server.");
      }

      setExtractionResult(data);

      // Smooth scroll to output
      setTimeout(() => {
        const outEl = document.getElementById("output-result");
        if (outEl) outEl.scrollIntoView({ behavior: "smooth" });
      }, 100);
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

  const scrollToWorkspace = () => {
    const el = document.getElementById("workspace");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const canExtract = Boolean(
    mixedFile && refFile && (!modelStatus || modelStatus.status === "ready")
  );

  const isModelReady = modelStatus?.status === "ready";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        onLoadSample={handleLoadSample}
        isExtracting={isExtracting}
        modelStatus={modelStatus}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onStartExtracting={scrollToWorkspace}
          onLoadSample={handleLoadSample}
          isExtracting={isExtracting}
        />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Main Extraction Workspace Section */}
        <section id="workspace" ref={workspaceRef} className="py-16 sm:py-24 border-b border-[var(--border-subtle)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Workspace Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-[var(--border-subtle)]">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-[var(--accent-lime-dim)] text-[var(--accent-lime)] border border-[var(--accent-lime)]/30 mb-2">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>STUDIO WORKSPACE</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-[var(--text-primary)]">
                  Extract your target speaker
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)] font-sans">
                  Upload a conversation and provide a reference recording to isolate the voice you want.
                </p>
              </div>

              {/* Status and Action Toolbar */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Real-time backend status badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-xs font-mono">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isModelReady ? "bg-[var(--accent-lime)] shadow-[0_0_8px_var(--accent-lime)] animate-pulse" : "bg-amber-400"
                    }`}
                  />
                  <span className="text-[var(--text-primary)] font-semibold">
                    {isModelReady ? "Model Online (8 kHz)" : "Connecting to Engine..."}
                  </span>
                  {modelStatus?.device && (
                    <span className="text-[var(--text-muted)]">[{modelStatus.device}]</span>
                  )}
                </div>

                {/* Load Demo Sample Button */}
                <button
                  type="button"
                  onClick={handleLoadSample}
                  disabled={isExtracting}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-mono font-semibold bg-[var(--bg-surface-1)] hover:bg-[var(--bg-surface-2)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-lime)]/50 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                  title="Auto-fill with tested demo recordings"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
                  <span>Load Demo Samples</span>
                </button>
              </div>
            </div>

            {/* Two-Column Audio Upload Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Mixture Recording */}
              <AudioUploadCard
                id="mixture-audio-input"
                label="Mixture Recording"
                channelCode="CH-01"
                subtitle="Multi-speaker overlapping conversation"
                hint="Provide a recording where the target speaker is talking alongside other people or background interference."
                icon={Users}
                variant="mixture"
                file={mixedFile}
                audioUrl={mixedAudioUrl}
                duration={mixedDuration}
                onFileSelect={handleSelectMixed}
                onRemove={handleRemoveMixed}
                isExtracting={isExtracting}
              />

              {/* Card 2: Target Speaker Reference */}
              <AudioUploadCard
                id="reference-audio-input"
                label="Target Speaker Reference"
                channelCode="REF-01"
                subtitle="Solo voice prompt of the speaker to isolate"
                hint="Provide a clean 1 to 5 second audio snippet of the desired speaker speaking alone to guide extraction."
                icon={Mic}
                variant="reference"
                file={refFile}
                audioUrl={refAudioUrl}
                duration={refDuration}
                onFileSelect={handleSelectRef}
                onRemove={handleRemoveRef}
                isExtracting={isExtracting}
              />
            </div>

            {/* Extraction Trigger Action */}
            <ExtractionAction
              canExtract={canExtract}
              isExtracting={isExtracting}
              onExtract={handleExtract}
              error={error}
              onClearError={() => setError(null)}
            />

            {/* Extracted Audio Output Section */}
            <div id="output-result" className="mt-8">
              <OutputSection
                result={extractionResult}
                mixedAudioUrl={mixedAudioUrl}
                mixedFile={mixedFile}
                onReset={handleReset}
              />
            </div>
          </div>
        </section>

        {/* Academic / Research Section */}
        <AboutResearchSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainStudio />
    </ThemeProvider>
  );
}
