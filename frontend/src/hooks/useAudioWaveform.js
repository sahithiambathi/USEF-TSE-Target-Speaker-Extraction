import { useState, useEffect } from "react";

// In-memory cache for decoded peak data by URL
const waveformCache = new Map();

let sharedAudioCtx = null;
function getAudioContext() {
  if (!sharedAudioCtx && typeof window !== "undefined") {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      sharedAudioCtx = new AudioCtx();
    }
  }
  return sharedAudioCtx;
}

/**
 * Custom hook to decode REAL audio data into normalized waveform amplitude peaks.
 * Uses the Web Audio API to analyze genuine PCM samples.
 *
 * @param {string|null} audioUrl - URL or blob URL of the audio file.
 * @param {number} barCount - Number of waveform bars to compute (default: 44).
 * @returns {{ peaks: number[], duration: number, isLoading: boolean, error: string|null }}
 */
export function useAudioWaveform(audioUrl, barCount = 44) {
  const [peaks, setPeaks] = useState([]);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!audioUrl) {
      setPeaks([]);
      setDuration(0);
      setIsLoading(false);
      setError(null);
      return;
    }

    const cacheKey = `${audioUrl}_${barCount}`;
    if (waveformCache.has(cacheKey)) {
      const cached = waveformCache.get(cacheKey);
      setPeaks(cached.peaks);
      setDuration(cached.duration);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    async function extractRealWaveform() {
      try {
        const response = await fetch(audioUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch audio stream (${response.status})`);
        }
        const arrayBuffer = await response.arrayBuffer();

        const audioCtx = getAudioContext();
        if (!audioCtx) {
          throw new Error("Web Audio API is not supported in this environment");
        }

        // decodeAudioData consumes the arrayBuffer, so we clone it if needed
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        if (isCancelled) return;

        const rawData = audioBuffer.getChannelData(0); // Left channel or mono
        const totalSamples = rawData.length;
        const blockSize = Math.floor(totalSamples / barCount);
        const computedPeaks = [];

        let maxVal = 0;

        for (let i = 0; i < barCount; i++) {
          const start = i * blockSize;
          const end = Math.min(start + blockSize, totalSamples);
          let sumSquares = 0;
          let peakVal = 0;

          for (let j = start; j < end; j++) {
            const val = Math.abs(rawData[j]);
            if (val > peakVal) peakVal = val;
            sumSquares += val * val;
          }

          const rms = Math.sqrt(sumSquares / (end - start || 1));
          // Weighted mix of RMS and peak gives a natural studio waveform appearance
          const amplitude = rms * 0.6 + peakVal * 0.4;
          computedPeaks.push(amplitude);
          if (amplitude > maxVal) {
            maxVal = amplitude;
          }
        }

        // Normalize between 0.12 (min bar height) and 1.0 (max peak)
        const normalizedPeaks = computedPeaks.map((val) => {
          if (maxVal === 0) return 0.12;
          const norm = val / maxVal;
          return Math.max(0.12, Math.min(1.0, norm));
        });

        const trackDuration = audioBuffer.duration;

        waveformCache.set(cacheKey, {
          peaks: normalizedPeaks,
          duration: trackDuration,
        });

        if (!isCancelled) {
          setPeaks(normalizedPeaks);
          setDuration(trackDuration);
          setIsLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn("Waveform decoding fallback:", err);
          setError(err.message);
          setIsLoading(false);
        }
      }
    }

    extractRealWaveform();

    return () => {
      isCancelled = true;
    };
  }, [audioUrl, barCount]);

  return { peaks, duration, isLoading, error };
}
