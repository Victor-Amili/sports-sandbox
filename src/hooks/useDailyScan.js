import { useState, useEffect, useCallback } from "react";
import { batchAnalyzeMatches } from "../engine/batchAnalyzer";

const STORAGE_KEY = "predictor_daily_scan_v3";

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

export function useDailyScan() {
  const [scanResult, setScanResult] = useState(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return parsed;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
    }
    return null;
  });

  const [isScanning, setIsScanning] = useState(false);
  const [strictMode, setStrictMode] = useState(() => {
    return localStorage.getItem("predictor_strict_mode") === "true";
  });
  const [hasNewMatches, setHasNewMatches] = useState(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (!cached) return true;
    try {
      const parsed = JSON.parse(cached);
      return parsed.savedAt?.split("T")[0] !== getTodayString();
    } catch {
      return true;
    }
  });

  useEffect(() => {
    localStorage.setItem("predictor_strict_mode", strictMode);
  }, [strictMode]);

  const runScan = useCallback(
    (matches) => {
      setIsScanning(true);
      setHasNewMatches(false);

      const result = batchAnalyzeMatches(matches, strictMode ? 6 : 5);

      const payload = {
        ...result,
        savedAt: new Date().toISOString(),
        strictMode,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setScanResult(payload);
      setIsScanning(false);
    },
    [strictMode],
  );

  const clearCache = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setScanResult(null);
    setHasNewMatches(true);
  }, []);

  return {
    scanResult,
    isScanning,
    runScan,
    strictMode,
    setStrictMode,
    hasNewMatches,
    clearCache,
  };
}
