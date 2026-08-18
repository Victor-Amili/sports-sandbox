import { useState, useEffect, useCallback } from "react";
import { TODAY_MATCHES } from "../data/dummyData";

const STORAGE_KEY = "predictor_custom_matches_v1";

export function useCustomMatches() {
  const [customMatches, setCustomMatches] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customMatches));
  }, [customMatches]);

  const addMatch = useCallback((match) => {
    setCustomMatches((prev) => [
      ...prev,
      { ...match, id: Date.now() + Math.random() },
    ]);
  }, []);

  const removeMatch = useCallback((id) => {
    setCustomMatches((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setCustomMatches([]);
  }, []);

  // Combined list: custom matches + dummy data (for testing)
  const allMatches = [...TODAY_MATCHES, ...customMatches];

  return {
    customMatches,
    allMatches,
    addMatch,
    removeMatch,
    clearAll,
  };
}
