import React, { useState } from "react";
import {
  Activity,
  Brain,
  ChevronDown,
  Sparkles,
  BarChart3,
  Zap,
  Settings,
} from "lucide-react";
import { TODAY_MATCHES } from "./data/dummyData";
import { analyzeWithAI } from "./services/aiService";
import AIAnalysisResult from "./components/AIAnalysisResult";

export default function App() {
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [useRealAI, setUseRealAI] = useState(false);

  const selectedMatch = TODAY_MATCHES.find(
    (m) => m.id === Number(selectedMatchId),
  );

  const handleAnalyze = async () => {
    if (!selectedMatch) return;
    setLoading(true);
    setResult(null);

    // Simulate network delay for realism
    await new Promise((r) => setTimeout(r, 800));

    try {
      const aiResult = await analyzeWithAI(selectedMatch, useRealAI);
      setResult(aiResult);
    } catch (err) {
      console.error(err);
      // Fallback to local
      const aiResult = await analyzeWithAI(selectedMatch, false);
      setResult(aiResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sp-black text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-sp-dark px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity className="w-8 h-8 text-sp-green" />
              <Sparkles className="w-3 h-3 text-sp-yellow absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                PREDICT<span className="text-sp-green">OR</span>
              </h1>
              <p className="text-xs text-sp-gray uppercase tracking-widest">
                AI Framework Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setUseRealAI(!useRealAI)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                useRealAI
                  ? "border-sp-green bg-sp-green/10 text-sp-green"
                  : "border-gray-700 text-sp-gray hover:border-gray-500"
              }`}
            >
              <Brain className="w-3 h-3" />
              {useRealAI ? "Live AI Mode" : "Local AI Mode"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Input Section */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">
            Find the <span className="text-sp-green">Structural Edge</span>
          </h2>
          <p className="text-sp-gray mb-8">
            Select a match. Our AI evaluates it against 4 proprietary frameworks
            and tells you which structural imbalance — if any — exists.
          </p>

          <div className="bg-sp-card border border-gray-800 rounded-2xl p-2 flex items-center gap-2">
            <div className="relative flex-1">
              <select
                value={selectedMatchId}
                onChange={(e) => {
                  setSelectedMatchId(e.target.value);
                  setResult(null);
                }}
                className="w-full bg-sp-black border border-gray-700 rounded-xl px-4 py-3.5 text-white appearance-none focus:border-sp-green focus:outline-none cursor-pointer"
              >
                <option value="">Select today's match...</option>
                {TODAY_MATCHES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.home} vs {m.away} — {m.league}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-sp-gray absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!selectedMatch || loading}
              className={`px-6 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                !selectedMatch || loading
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-sp-green text-sp-black hover:bg-sp-green-dim shadow-[0_0_20px_rgba(0,255,136,0.3)]"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-sp-black border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Run Analysis
                </>
              )}
            </button>
          </div>

          {useRealAI && (
            <div className="mt-3 p-3 rounded-lg bg-sp-yellow/10 border border-sp-yellow/30 text-xs text-sp-yellow text-left max-w-2xl mx-auto">
              <strong>Live AI Mode:</strong> Uncomment the fetch block in{" "}
              <code>aiService.js</code> and add your OpenAI API key. Until then,
              it falls back to Local AI.
            </div>
          )}
        </div>

        {/* Results */}
        {result && selectedMatch && (
          <AIAnalysisResult result={result} match={selectedMatch} />
        )}

        {/* Empty State */}
        {!result && !loading && (
          <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4 opacity-40">
            <div className="bg-sp-card border border-gray-800 rounded-xl p-6 text-center">
              <BarChart3 className="w-8 h-8 text-sp-green mx-auto mb-3" />
              <div className="text-sm font-medium text-white">Perfect Game</div>
              <div className="text-xs text-sp-gray">
                Home fortress vs away rot
              </div>
            </div>
            <div className="bg-sp-card border border-gray-800 rounded-xl p-6 text-center">
              <Zap className="w-8 h-8 text-sp-red mx-auto mb-3" />
              <div className="text-sm font-medium text-white">Total Chaos</div>
              <div className="text-xs text-sp-gray">
                Defensive collapse prediction
              </div>
            </div>
            <div className="bg-sp-card border border-gray-800 rounded-xl p-6 text-center">
              <Activity className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-sm font-medium text-white">
                Corner Pressure
              </div>
              <div className="text-xs text-sp-gray">Failed attack volume</div>
            </div>
            <div className="bg-sp-card border border-gray-800 rounded-xl p-6 text-center">
              <Settings className="w-8 h-8 text-sp-gray mx-auto mb-3" />
              <div className="text-sm font-medium text-white">
                Midfield Mire
              </div>
              <div className="text-xs text-sp-gray">Tactical stagnation</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
