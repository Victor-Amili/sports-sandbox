import React, { useState, useCallback } from "react";
import {
  Activity,
  Scan,
  BarChart3,
  Brain,
  Settings,
  Calendar,
  Zap,
} from "lucide-react";
import { TODAY_MATCHES } from "./data/dummyData";
import { batchAnalyzeMatches } from "./engine/batchAnalyzer";
import DailyScan from "./components/DailyScan";
import AIAnalysisResult from "./components/AIAnalysisResult"; // Keep for deep-dive
import { getTodaysFixtures, transformFixture } from "./services/footballApi";

export default function App() {
  const [activeTab, setActiveTab] = useState("daily"); // 'daily' | 'deep'
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedMatchForDeepDive, setSelectedMatchForDeepDive] =
    useState(null);
  const [deepDiveResult, setDeepDiveResult] = useState(null);

  // ============================================
  // THE DAILY SCAN — Batch run all frameworks
  // ============================================
  const runDailyScan = useCallback(async () => {
    setIsScanning(true);

    try {
      // Try to fetch real fixtures
      const apiFixtures = await getTodaysFixtures();

      // If API returns data, transform it. If empty/fails, fall back to dummy
      const fixtures =
        apiFixtures.length > 0
          ? apiFixtures.map(transformFixture)
          : TODAY_MATCHES;

      const result = batchAnalyzeMatches(fixtures);
      setScanResult(result);

      // Save to localStorage
      localStorage.setItem(
        "predictor_daily_scan",
        JSON.stringify({
          ...result,
          savedAt: new Date().toISOString(),
        }),
      );
    } catch (err) {
      console.warn("API failed, using dummy data:", err.message);
      const result = batchAnalyzeMatches(TODAY_MATCHES);
      setScanResult(result);
    } finally {
      setIsScanning(false);
    }
  }, []);

  // ============================================
  // DEEP DIVE — Single match, all frameworks ranked
  // ============================================
  const runDeepDive = useCallback(async (match) => {
    setSelectedMatchForDeepDive(match);
    setDeepDiveResult(null);
    setActiveTab("deep");

    // This would call the AI service with real API if toggled
    const { analyzeWithAI } = await import("./services/aiService");
    const result = await analyzeWithAI(match, false); // false = local engine
    setDeepDiveResult(result);
  }, []);

  return (
    <div className="min-h-screen bg-sp-black text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-sp-dark px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-sp-green" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                PREDICT<span className="text-sp-green">OR</span>
              </h1>
              <p className="text-xs text-sp-gray uppercase tracking-widest">
                Daily Structural Edge Detection
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-sp-black rounded-lg p-1 border border-gray-800">
            <button
              onClick={() => setActiveTab("daily")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "daily"
                  ? "bg-sp-green text-sp-black"
                  : "text-sp-gray hover:text-white"
              }`}
            >
              <Scan className="w-4 h-4" />
              Daily Scan
            </button>
            <button
              onClick={() => setActiveTab("deep")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "deep"
                  ? "bg-sp-green text-sp-black"
                  : "text-sp-gray hover:text-white"
              }`}
            >
              <Brain className="w-4 h-4" />
              Deep Dive
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-sp-gray">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {activeTab === "daily" ? (
          <DailyScan
            scanResult={scanResult}
            onRunScan={runDailyScan}
            isScanning={isScanning}
          />
        ) : (
          <DeepDiveView
            match={selectedMatchForDeepDive}
            result={deepDiveResult}
            onSelectMatch={runDeepDive}
            matches={TODAY_MATCHES}
          />
        )}
      </main>
    </div>
  );
}

// ============================================
// DEEP DIVE VIEW — Single match analyzer (your old UI)
// ============================================
function DeepDiveView({ match, result, onSelectMatch, matches }) {
  const [selectedId, setSelectedId] = useState(match?.id || "");

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Brain className="w-12 h-12 text-sp-gray mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">
          Deep Dive Analysis
        </h3>
        <p className="text-sm text-sp-gray mb-6">
          Select a match to run a full AI analysis across all 4 frameworks with
          detailed reasoning.
        </p>

        <div className="bg-sp-card border border-gray-800 rounded-xl p-2 max-w-md mx-auto">
          <select
            value={selectedId}
            onChange={(e) => {
              const id = Number(e.target.value);
              setSelectedId(id);
              const m = matches.find((m) => m.id === id);
              if (m) onSelectMatch(m);
            }}
            className="w-full bg-sp-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-sp-green focus:outline-none"
          >
            <option value="">Select a match...</option>
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                {m.home} vs {m.away}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => onSelectMatch(null)}
        className="text-sm text-sp-gray hover:text-white flex items-center gap-1"
      >
        ← Back to selector
      </button>
      <AIAnalysisResult result={result} match={match} />
    </div>
  );
}
