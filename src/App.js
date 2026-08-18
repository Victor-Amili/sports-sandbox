import React, { useState, useCallback } from "react";
import { Activity, Scan, Brain, Calendar, Zap, Plus, X } from "lucide-react";
import { useDailyScan } from "./hooks/useDailyScan";
import { useCustomMatches } from "./hooks/useCustomMatches";
import { TODAY_MATCHES } from "./data/dummyData";
import DailyScan from "./components/DailyScan";
import MatchInputForm from "./components/MatchInputForm";
import AIAnalysisResult from "./components/AIAnalysisResult";

export default function App() {
  const [activeTab, setActiveTab] = useState("daily");
  const [showForm, setShowForm] = useState(false);
  const [deepMatch, setDeepMatch] = useState(null);
  const [deepResult, setDeepResult] = useState(null);

  const { allMatches, addMatch, removeMatch, customMatches } =
    useCustomMatches();

  const {
    scanResult,
    isScanning,
    runScan,
    strictMode,
    setStrictMode,
    hasNewMatches,
    clearCache,
  } = useDailyScan();

  const handleRunScan = useCallback(() => {
    runScan(allMatches);
  }, [runScan, allMatches]);

  const handleAddMatch = (match) => {
    addMatch(match);
    setShowForm(false);
    setTimeout(() => runScan([...allMatches, match]), 100);
  };

  const handleDeepDive = async (match) => {
    setDeepMatch(match);
    setActiveTab("deep");
    const { analyzeWithAI } = await import("./services/aiService");
    const result = await analyzeWithAI(match, false);
    setDeepResult(result);
  };

  const handleBackFromDeepDive = () => {
    setDeepResult(null);
    setDeepMatch(null);
  };

  return (
    <div className="min-h-screen bg-sp-black text-gray-100">
      <header className="border-b border-gray-800 bg-sp-dark px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-sp-green" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                PREDICT<span className="text-sp-green">OR</span>
              </h1>
              <p className="text-xs text-sp-gray uppercase tracking-widest">
                {strictMode ? "PERFECT MODE (6/6)" : "STANDARD MODE (5/6)"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setStrictMode(!strictMode);
                clearCache();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                strictMode
                  ? "border-sp-green bg-sp-green/10 text-sp-green"
                  : "border-gray-700 text-sp-gray hover:border-gray-500"
              }`}
            >
              {strictMode ? "6/6 STRICT" : "5/6 STANDARD"}
            </button>

            {hasNewMatches && scanResult && (
              <span className="px-2 py-1 rounded bg-sp-yellow/20 text-sp-yellow text-xs font-bold animate-pulse">
                New Data — Re-Scan
              </span>
            )}

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
                })}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {activeTab === "daily" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-6 h-6 text-sp-green" />
                  Today's Edge
                </h2>
                <p className="text-sm text-sp-gray mt-1">
                  {scanResult
                    ? `${scanResult.qualifiedCount} edges from ${scanResult.totalScanned} matches`
                    : "Run the daily scan to analyze all fixtures"}
                  {customMatches.length > 0 &&
                    ` (${customMatches.length} custom)`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {scanResult && (
                  <button
                    onClick={clearCache}
                    className="px-3 py-2 text-xs text-sp-gray hover:text-white border border-gray-700 rounded-lg hover:border-gray-500 transition-all"
                  >
                    Clear Cache
                  </button>
                )}
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-sp-card border border-gray-700 text-white rounded-xl hover:border-sp-green transition-all text-sm font-medium"
                >
                  {showForm ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {showForm ? "Close Form" : "Add Match"}
                </button>
                <button
                  onClick={handleRunScan}
                  disabled={isScanning}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    isScanning
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                      : "bg-sp-green text-sp-black hover:bg-sp-green-dim shadow-[0_0_20px_rgba(0,255,136,0.2)]"
                  }`}
                >
                  {isScanning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-sp-black border-t-transparent rounded-full animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4" />
                      {scanResult ? "Re-Scan" : "Run Scan"}
                    </>
                  )}
                </button>
              </div>
            </div>

            {showForm && (
              <MatchInputForm
                onSave={handleAddMatch}
                onCancel={() => setShowForm(false)}
              />
            )}

            {customMatches.length > 0 && (
              <div className="bg-sp-card border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">
                    Custom Matches
                  </h3>
                  <button
                    onClick={() => {
                      if (window.confirm("Clear all custom matches?")) {
                        removeMatch("all");
                      }
                    }}
                    className="text-xs text-sp-red hover:text-red-400"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customMatches.map((m) => (
                    <span
                      key={m.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sp-black border border-gray-700 text-xs text-white"
                    >
                      {m.home} vs {m.away}
                      <button
                        onClick={() => removeMatch(m.id)}
                        className="text-sp-gray hover:text-sp-red"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {scanResult &&
              scanResult.savedAt?.split("T")[0] !==
                new Date().toISOString().split("T")[0] && (
                <div className="p-3 rounded-lg bg-sp-yellow/10 border border-sp-yellow/30 flex items-center gap-3">
                  <Zap className="w-5 h-5 text-sp-yellow" />
                  <div className="text-sm text-sp-yellow">
                    Scan is from{" "}
                    {new Date(scanResult.savedAt).toLocaleDateString()}. Re-scan
                    to analyze with current data.
                  </div>
                </div>
              )}

            <DailyScan
              scanResult={scanResult}
              onRunScan={handleRunScan}
              isScanning={isScanning}
            />
          </div>
        ) : (
          <DeepDive
            match={deepMatch}
            result={deepResult}
            onSelect={handleDeepDive}
            onBack={handleBackFromDeepDive}
            matches={scanResult?.matches?.map((m) => m.match) || TODAY_MATCHES}
          />
        )}
      </main>
    </div>
  );
}

function DeepDive({ match, result, onSelect, onBack, matches }) {
  const [selectedId, setSelectedId] = useState("");

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Brain className="w-12 h-12 text-sp-gray mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">
          Deep Dive Analysis
        </h3>
        <p className="text-sm text-sp-gray mb-6">
          Select a qualified match for full AI reasoning across all 6
          frameworks.
        </p>
        <div className="bg-sp-card border border-gray-800 rounded-xl p-2 max-w-md mx-auto">
          <select
            value={selectedId}
            onChange={(e) => {
              const id = Number(e.target.value);
              setSelectedId(id);
              const m = matches.find((x) => x.id === id);
              if (m) onSelect(m);
            }}
            className="w-full bg-sp-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-sp-green focus:outline-none"
          >
            <option value="">
              {matches.length ? "Select a match..." : "Run Daily Scan first"}
            </option>
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
        onClick={onBack}
        className="text-sm text-sp-gray hover:text-white flex items-center gap-1"
      >
        ← Back
      </button>
      <AIAnalysisResult result={result} match={match} />
    </div>
  );
}
