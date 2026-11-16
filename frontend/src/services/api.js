/**
 * Centralized API service for USEF-TSE Target Speaker Extraction Studio.
 * Handles intelligent host discovery, health checks, smart polling, and extraction calls.
 */

// Candidate base URLs to try in priority order
const CANDIDATE_BASES = [
  "", // Relative /api (works with Vite proxy and production reverse proxies)
  "http://127.0.0.1:8000",
  "http://localhost:8000",
];

// Read environment variable if supplied
if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) {
  CANDIDATE_BASES.unshift(import.meta.env.VITE_API_URL.replace(/\/$/, ""));
}

let activeBaseUrl = "";
let hasResolvedBase = false;

/**
 * Discovers the working backend base URL by testing candidates against /api/status or /health.
 */
export async function resolveBackendBase() {
  for (const base of CANDIDATE_BASES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${base}/api/status`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        activeBaseUrl = base;
        hasResolvedBase = true;
        return base;
      }
    } catch {
      // Try next candidate
    }
  }

  // Default to relative if no candidate responded
  activeBaseUrl = "";
  return "";
}

/**
 * Checks backend and model status, returning normalized state.
 * States: "READY" | "LOADING" | "OFFLINE" | "ERROR"
 */
export async function getBackendStatus() {
  try {
    const base = hasResolvedBase ? activeBaseUrl : await resolveBackendBase();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${base}/api/status`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        state: "OFFLINE",
        isReady: false,
        detail: `Backend HTTP ${res.status}: ${res.statusText}`,
        device: "unknown",
        baseUrl: base,
      };
    }

    const data = await res.json();
    const modelStatus = (data.status || "").toLowerCase();

    if (modelStatus === "ready") {
      return {
        state: "READY",
        isReady: true,
        detail: data.detail || "USEF-TFGridNet model loaded and ready for inference.",
        device: data.device || "cpu",
        modelName: data.model_name || "USEF-TFGridNet (WSJ0-2mix)",
        sampleRate: data.sample_rate || 8000,
        baseUrl: base,
      };
    }

    if (modelStatus === "loading" || modelStatus === "uninitialized") {
      return {
        state: "LOADING",
        isReady: false,
        detail: data.detail || "Loading neural weights (15.6M parameters)...",
        device: data.device || "cpu",
        baseUrl: base,
      };
    }

    return {
      state: "ERROR",
      isReady: false,
      detail: data.detail || "Model initialization failed.",
      device: data.device || "unknown",
      baseUrl: base,
    };
  } catch (err) {
    hasResolvedBase = false; // Reset to allow re-discovery on next attempt
    return {
      state: "OFFLINE",
      isReady: false,
      detail: "Backend unreachable. Ensure FastAPI server is running on port 8000.",
      error: err.message,
      device: "offline",
      baseUrl: activeBaseUrl,
    };
  }
}

/**
 * Retrieves demo samples metadata.
 */
export async function fetchDemoSamples() {
  const base = hasResolvedBase ? activeBaseUrl : await resolveBackendBase();
  const res = await fetch(`${base}/api/samples`);
  if (!res.ok) {
    throw new Error(`Failed to fetch samples metadata (${res.status})`);
  }
  const data = await res.json();
  return {
    mixed: {
      ...data.mixed,
      fullUrl: data.mixed?.url ? `${base}${data.mixed.url}` : null,
    },
    reference: {
      ...data.reference,
      fullUrl: data.reference?.url ? `${base}${data.reference.url}` : null,
    },
  };
}

/**
 * Downloads a sample audio file as a Blob.
 */
export async function fetchSampleAudioBlob(url) {
  const base = hasResolvedBase ? activeBaseUrl : "";
  const targetUrl = url.startsWith("http") ? url : `${base}${url}`;
  const res = await fetch(targetUrl);
  if (!res.ok) {
    throw new Error(`Failed to load sample audio from ${targetUrl} (${res.status})`);
  }
  return await res.blob();
}

/**
 * Executes target speaker extraction with actual audio files.
 */
export async function extractSpeaker(mixedFile, refFile) {
  const base = hasResolvedBase ? activeBaseUrl : await resolveBackendBase();
  const formData = new FormData();
  formData.append("mixed_audio", mixedFile);
  formData.append("reference_audio", refFile);

  const res = await fetch(`${base}/api/extract`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.detail || `Extraction failed with HTTP ${res.status}`;
    throw new Error(errorMsg);
  }

  // Ensure full URL for output audio
  const outputUrl = data.output_url?.startsWith("http")
    ? data.output_url
    : `${base}${data.output_url}`;

  return {
    ...data,
    output_url: outputUrl,
    download_url: outputUrl,
  };
}
