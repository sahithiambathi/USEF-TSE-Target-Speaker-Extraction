import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import ExtractionWorkspace from "./components/ExtractionWorkspace";
import OutputSection from "./components/OutputSection";
import AboutResearchSection from "./components/AboutResearchSection";
import Footer from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";
import { getBackendStatus, fetchDemoSamples, fetchSampleAudioBlob, extractSpeaker } from "./services/api";

function MainStudio() {
  const [mixedFile, setMixedFile] = useState(null);
  const [mixedAudioUrl, setMixedAudioUrl] = useState(null);
  const [mixedDuration, setMixedDuration] = useState(0);

  const [refFile, setRefFile] = useState(null);
  const [refAudioUrl, setRefAudioUrl] = useState(null);
  const [refDuration, setRefDuration] = useState(0);

  const [backendState, setBackendState] = useState({
    state: "LOADING",
    isReady: false,
    detail: "Connecting to USEF-TSE engine...",
    device: "cpu",
  });

  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);
  const [error, setError] = useState(null);

  // Helper to extract audio duration and URL from File
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

  // Smart Backend Status Polling
  const checkStatus = useCallback(async () => {
    const status = await getBackendStatus();
    setBackendState(status);
    return status;
  }, []);

  useEffect(() => {
    checkStatus();

    // Auto-poll: every 2.5s if not ready (to pick up model load completion automatically),
    // and every 15s once ready (heartbeat)
    const interval = setInterval(async () => {
      const status = await checkStatus();
      if (status.isReady) {
        // Model is ready, switch to slow heartbeat
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [checkStatus]);

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

  // Load Built-in Demo Samples
  const handleLoadSample = async () => {
    try {
      setError(null);
      setIsExtracting(false);
      setExtractionResult(null);

      const samplesData = await fetchDemoSamples().catch(() => ({
        mixed: { fullUrl: "/api/samples/mixed_speaker.wav", name: "mixed_speaker.wav" },
        reference: { fullUrl: "/api/samples/speaker_a_ref.wav", name: "speaker_a_ref.wav" },
      }));

      const mixUrl = samplesData.mixed?.fullUrl || "/api/samples/mixed_speaker.wav";
      const refUrl = samplesData.reference?.fullUrl || "/api/samples/speaker_a_ref.wav";
      const mixFilename = samplesData.mixed?.name || "mixed_speaker.wav";
      const refFilename = samplesData.reference?.name || "speaker_a_ref.wav";

      const [mixBlob, refBlob] = await Promise.all([
        fetchSampleAudioBlob(mixUrl),
        fetchSampleAudioBlob(refUrl),
      ]);

      const sampleMixFile = new File([mixBlob], mixFilename, { type: "audio/wav" });
      const sampleRefFile = new File([refBlob], refFilename, { type: "audio/wav" });

      await handleSelectMixed(sampleMixFile);
      await handleSelectRef(sampleRefFile);

      // Scroll to workspace
      const el = document.getElementById("workspace");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Error loading demo audio samples:", err);
      setError(`Failed to load demo samples: ${err.message}. Is the backend running?`);
    }
  };

  // Real Model Inference Extraction
  const handleExtract = async () => {
    if (!mixedFile || !refFile) {
      setError("Please provide both a Mixture Recording and a Target Voice Reference.");
      return;
    }

    setError(null);
    setIsExtracting(true);
    setExtractionResult(null);

    try {
      const data = await extractSpeaker(mixedFile, refFile);
      setExtractionResult(data);

      // Smooth scroll to output
      setTimeout(() => {
        const outEl = document.getElementById("result");
        if (outEl) outEl.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } catch (err) {
      console.error("Extraction failed:", err);
      setError(err.message || "Target speaker extraction failed on the inference server.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleReset = () => {
    setExtractionResult(null);
    setError(null);
    const el = document.getElementById("workspace");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToWorkspace = () => {
    const el = document.getElementById("workspace");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const canExtract = Boolean(mixedFile && refFile);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Top Navbar matching reference design */}
      <Navbar
        onLoadSample={handleLoadSample}
        isExtracting={isExtracting}
        backendState={backendState}
      />

      <main className="flex-1">
        {/* Hero Section with Brutalist Heading & Cinematic Waveform Canvas */}
        <HeroSection
          onStartExtracting={scrollToWorkspace}
          onLoadSample={handleLoadSample}
          isExtracting={isExtracting}
        />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Main Extraction Workspace Studio Chassis */}
        <ExtractionWorkspace
          mixedFile={mixedFile}
          mixedAudioUrl={mixedAudioUrl}
          mixedDuration={mixedDuration}
          refFile={refFile}
          refAudioUrl={refAudioUrl}
          refDuration={refDuration}
          onSelectMixed={handleSelectMixed}
          onRemoveMixed={handleRemoveMixed}
          onSelectRef={handleSelectRef}
          onRemoveRef={handleRemoveRef}
          isExtracting={isExtracting}
          canExtract={canExtract}
          onExtract={handleExtract}
          error={error}
          onClearError={() => setError(null)}
          backendState={backendState}
          onRecheckBackend={checkStatus}
          onLoadSample={handleLoadSample}
        />

        {/* Extracted Speech Output Section */}
        <OutputSection
          result={extractionResult}
          mixedAudioUrl={mixedAudioUrl}
          mixedFile={mixedFile}
          onReset={handleReset}
        />

        {/* Academic Foundation & Architecture Section */}
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
