import { analyzeMatch } from "./filterEngine";
import { FRAMEWORKS } from "../data/dummyData";

const MIN_PASS_THRESHOLD = 5; // Must pass at least 5/6 filters to qualify

export function batchAnalyzeMatches(matches) {
  const qualifiedMatches = [];

  for (const match of matches) {
    const frameworkScores = [];

    // Run ALL 4 frameworks on this match
    const frameworkIds = Object.keys(FRAMEWORKS).map((k) => FRAMEWORKS[k].id);

    for (const fwId of frameworkIds) {
      const analysis = analyzeMatch(match, fwId);

      if (analysis.score >= MIN_PASS_THRESHOLD) {
        frameworkScores.push({
          frameworkId: fwId,
          frameworkName: FRAMEWORKS[fwId.toUpperCase()].name,
          frameworkIcon: FRAMEWORKS[fwId.toUpperCase()].icon,
          betType: analysis.betType,
          score: analysis.score,
          confidence: analysis.confidence,
          results: analysis.results,
          allPassed: analysis.allPassed,
        });
      }
    }

    // If at least one framework qualified...
    if (frameworkScores.length > 0) {
      // Pick the BEST framework (highest score, then highest confidence)
      frameworkScores.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.confidence - a.confidence;
      });

      const best = frameworkScores[0];

      qualifiedMatches.push({
        match,
        bestFramework: best,
        allQualifiedFrameworks: frameworkScores, // In case you want to show alternates
        overallConfidence: best.confidence,
      });
    }
  }

  // Sort by confidence — highest edge first
  qualifiedMatches.sort((a, b) => b.overallConfidence - a.overallConfidence);

  return {
    totalScanned: matches.length,
    qualifiedCount: qualifiedMatches.length,
    discardedCount: matches.length - qualifiedMatches.length,
    matches: qualifiedMatches,
    timestamp: new Date().toISOString(),
  };
}
