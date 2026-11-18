import React, { useState, useEffect, useRef, useCallback } from "react";
import { Users, Mic, Sparkles } from "lucide-react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import AudioUploadCard from "./components/AudioUploadCard";
import ExtractionAction from "./components/ExtractionAction";
import OutputSection from "./components/OutputSection";
import InsideExtractionProcess from "./components/InsideExtractionProcess";
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
      setError("Please provide both a Mixture Audio recording and a Target Reference sample.");
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

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        onLoadSample={handleLoadSample}
        isExtracting={isExtracting}
        modelStatus={modelStatus}
      />

      <main className="flex-1">
        {/* 1. Hero Section matching Reference 1 */}
        <HeroSection
          onStartExtracting={scrollToWorkspace}
          onLoadSample={handleLoadSample}
          isExtracting={isExtracting}
        />

        {/* 2. How It Works Section (User Workflow - placed before Extraction Workspace) */}
        <HowItWorksSection />

        {/* 3. Main Extraction Workspace Section */}
        <section id="workspace" ref={workspaceRef} className="py-16 sm:py-20 border-b border-[var(--border-subtle)] relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Workspace Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <h2 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-[var(--text-primary)]">
                  Extract Target Speech
                </h2>
                <p className="mt-1 text-xs text-[var(--text-secondary)] font-sans">
                  Upload a mixed recording and provide a reference sample to isolate the voice you want.
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={handleLoadSample}
                  disabled={isExtracting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono font-medium bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/50 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                  title="Auto-fill with tested demo recordings"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                  <span>Load Demo Samples</span>
                </button>
              </div>
            </div>

            {/* Two-Column Audio Upload Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Mixture Audio */}
              <AudioUploadCard
                id="mixture-audio-input"
                label="Mixture Audio"
                channelCode="MIX"
                subtitle="The recording containing multiple speakers."
                hint="Provide a recording where multiple people are speaking or overlapping."
                icon={Users}
                variant="mixture"
                file={mixedFile}
                audioUrl={mixedAudioUrl}
                duration={mixedDuration}
                onFileSelect={handleSelectMixed}
                onRemove={handleRemoveMixed}
                isExtracting={isExtracting}
              />

              {/* Card 2: Target Reference */}
              <AudioUploadCard
                id="reference-audio-input"
                label="Target Reference"
                channelCode="REF"
                subtitle="A short sample of the speaker you want."
                hint="Provide a clean 1 to 5 second audio snippet of the target voice to guide extraction."
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

            {/* Extraction Trigger Action with In-Button Loading State */}
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

        {/* 4. Inside the Extraction Process Section */}
        <InsideExtractionProcess />

        {/* 5. About / Research Paper Section */}
        <AboutResearchSection />
      </main>

      {/* 6. Footer */}
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
