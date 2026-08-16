import React, { useState, useMemo } from "react";
import {
  Shield,
  Flame,
  Flag,
  Minimize2,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  BarChart3,
  Calendar,
} from "lucide-react";
import { FRAMEWORKS, TODAY_MATCHES } from "./dummyData";
import { analyzeMatch } from "./filterEngine";

const ICON_MAP = {
  Shield: Shield,
  Flame: Flame,
  Flag: Flag,
  Minimize2: Minimize2,
};

export default function App() {
  const [selectedFramework, setSelectedFramework] = useState("perfect_game");
  const [expandedMatch, setExpandedMatch] = useState(null);

  // Run analysis for all matches under selected framework
  const analyses = useMemo(() => {
    return TODAY_MATCHES.map((match) => analyzeMatch(match, selectedFramework));
  }, [selectedFramework]);

  const qualifiedMatches = analyses.filter((a) => a.allPassed);
  const totalMatches = analyses.length;

  const framework = FRAMEWORKS[selectedFramework.toUpperCase()];
  const FrameworkIcon = ICON_MAP[framework.icon];

  return (
    <div className="min-h-screen bg-sp-black text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-sp-dark px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-sp-green" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                PREDICT<span className="text-sp-green">OR</span>
              </h1>
              <p className="text-xs text-sp-gray uppercase tracking-widest">
                AI Sports Intelligence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-sp-gray">
            <Calendar className="w-4 h-4" />
            <span>Aug 15, 2026</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Matches Analyzed"
            value={totalMatches}
            icon={BarChart3}
            color="text-blue-400"
          />
          <StatCard
            label="Qualified Bets"
            value={qualifiedMatches.length}
            icon={CheckCircle}
            color="text-sp-green"
          />
          <StatCard
            label="Discarded"
            value={totalMatches - qualifiedMatches.length}
            icon={XCircle}
            color="text-sp-red"
          />
        </div>

        {/* Framework Selector */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-sp-gray uppercase tracking-wider mb-4">
            Select Framework
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.values(FRAMEWORKS).map((fw) => {
              const Icon = ICON_MAP[fw.icon];
              const isActive = selectedFramework === fw.id;
              return (
                <button
                  key={fw.id}
                  onClick={() => setSelectedFramework(fw.id)}
                  className={`relative p-4 rounded-xl border transition-all duration-200 text-left group ${
                    isActive
                      ? "border-sp-green bg-sp-green/10 shadow-[0_0_20px_rgba(0,255,136,0.15)]"
                      : "border-gray-800 bg-sp-card hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-sp-green" : "text-gray-500"}`}
                    />
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-sp-green animate-pulse" />
                    )}
                  </div>
                  <h3
                    className={`font-semibold ${isActive ? "text-sp-green" : "text-white"}`}
                  >
                    {fw.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{fw.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Framework Info */}
        <div className="mb-6 p-4 rounded-lg border border-sp-green/30 bg-sp-green/5 flex items-start gap-3">
          <FrameworkIcon className="w-5 h-5 text-sp-green mt-0.5" />
          <div>
            <h3 className="font-semibold text-sp-green">
              {framework.name} Protocol Active
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Target:{" "}
              <span className="text-white font-mono">
                {framework.filters.map((f) => f.name).join(" → ")}
              </span>
            </p>
          </div>
        </div>

        {/* Match Cards */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-sp-gray uppercase tracking-wider mb-4">
            Today's Fixtures — {framework.name}
          </h2>

          {TODAY_MATCHES.map((match, idx) => {
            const analysis = analyses[idx];
            const isExpanded = expandedMatch === match.id;
            const isQualified = analysis.allPassed;

            return (
              <div
                key={match.id}
                className={`rounded-xl border overflow-hidden transition-all duration-300 ${
                  isQualified
                    ? "border-sp-green/50 bg-sp-green/5"
                    : "border-gray-800 bg-sp-card"
                }`}
              >
                {/* Match Header */}
                <div
                  className="p-5 cursor-pointer flex items-center justify-between"
                  onClick={() => setExpandedMatch(isExpanded ? null : match.id)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        isQualified
                          ? "bg-sp-green text-sp-black"
                          : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      {match.home[0]}
                      {match.away[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">
                          {match.home}
                        </span>
                        <span className="text-sp-gray">vs</span>
                        <span className="text-white font-semibold">
                          {match.away}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-sp-gray">
                        <span>{match.league}</span>
                        <span>•</span>
                        <span>{match.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div
                        className={`text-sm font-bold ${isQualified ? "text-sp-green" : "text-sp-red"}`}
                      >
                        {analysis.recommendation}
                      </div>
                      <div className="text-xs text-sp-gray">
                        {analysis.score}/{analysis.totalFilters} filters
                      </div>
                    </div>
                    <div
                      className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${
                        analysis.confidence >= 80
                          ? "border-sp-green"
                          : analysis.confidence >= 50
                            ? "border-sp-yellow"
                            : "border-sp-red"
                      }`}
                    >
                      <span className="text-sm font-bold">
                        {analysis.confidence}%
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-sp-gray transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </div>
                </div>

                {/* Expanded Filter Checklist */}
                {isExpanded && (
                  <div className="border-t border-gray-800 px-5 py-4 bg-sp-black/50">
                    <div className="grid gap-3">
                      {analysis.results.map((filter, i) => (
                        <div
                          key={filter.id}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            filter.passed
                              ? "border-sp-green/30 bg-sp-green/5"
                              : "border-sp-red/30 bg-sp-red/5"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                filter.passed
                                  ? "bg-sp-green text-sp-black"
                                  : "bg-sp-red text-white"
                              }`}
                            >
                              {i + 1}
                            </span>
                            <div>
                              <div className="text-sm font-medium text-white">
                                {filter.name}
                              </div>
                              <div className="text-xs text-sp-gray">
                                {filter.detail}
                              </div>
                            </div>
                          </div>
                          {filter.passed ? (
                            <CheckCircle className="w-5 h-5 text-sp-green" />
                          ) : (
                            <XCircle className="w-5 h-5 text-sp-red" />
                          )}
                        </div>
                      ))}
                    </div>

                    {isQualified && (
                      <div className="mt-4 p-3 rounded-lg bg-sp-green/10 border border-sp-green/50 flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-sp-green" />
                        <div>
                          <div className="text-sm font-bold text-sp-green">
                            BET SIGNAL: {analysis.betType}
                          </div>
                          <div className="text-xs text-sp-gray">
                            All 6 structural filters passed. Proceed with
                            caution.
                          </div>
                        </div>
                      </div>
                    )}

                    {!isQualified &&
                      analysis.results.some(
                        (r) => r.id === "f3" && !r.passed,
                      ) && (
                        <div className="mt-4 p-3 rounded-lg bg-sp-yellow/10 border border-sp-yellow/50 flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-sp-yellow" />
                          <div className="text-xs text-sp-yellow">
                            Filter 3 (Motivation) failed. Equal motivation = NO
                            BET per framework rules.
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-sp-card border border-gray-800 rounded-xl p-4 flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-sp-black ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-sp-gray uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  );
}
