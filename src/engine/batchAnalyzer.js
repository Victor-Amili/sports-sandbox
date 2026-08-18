import { analyzeMatch } from "./filterEngine";
import { FRAMEWORKS } from "../data/dummyData";

const MIN_PASS_THRESHOLD = 5; // Must pass at least 5/6 filters to qualify

export function batchAnalyzeMatches(matches, minPassThreshold = 5) {
  const qualifiedMatches = [];
  const discardedMatches = [];

  for (const match of matches) {
    const frameworkIds = Object.keys(FRAMEWORKS).map(k => FRAMEWORKS[k].id);
    const frameworkScores = [];

    for (const fwId of frameworkIds) {
      const analysis = analyzeMatch(match, fwId);
      
      if (analysis.score >= minPassThreshold) {
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

    if (frameworkScores.length > 0) {
      frameworkScores.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.confidence - a.confidence;
      });
      
      const best = frameworkScores[0];
      qualifiedMatches.push({
        match,
        bestFramework: best,
        allQualifiedFrameworks: frameworkScores,
        overallConfidence: best.confidence,
      });
    } else {
      // Find the CLOSEST framework (best attempt) for debugging
      const allAttempts = frameworkIds.map(fwId => {
        const analysis = analyzeMatch(match, fwId);
        return {
          frameworkId: fwId,
          frameworkName: FRAMEWORKS[fwId.toUpperCase()].name,
          frameworkIcon: FRAMEWORKS[fwId.toUpperCase()].icon,
          betType: analysis.betType,
          score: analysis.score,
          confidence: analysis.confidence,
          results: analysis.results,
          allPassed: analysis.allPassed,
        };
      });
      
      allAttempts.sort((a, b) => b.score - a.score);
      const closest = allAttempts[0]; // Best failed attempt

      discardedMatches.push({
        match,
        closestFramework: closest,
        allAttempts,
        failReason: closest.score === 0 ? 'No structural alignment anywhere' : `Best: ${closest.frameworkName} (${closest.score}/6 passed)`,
      });
    }
  }

  qualifiedMatches.sort((a, b) => b.overallConfidence - a.overallConfidence);

  return {
    totalScanned: matches.length,
    qualifiedCount: qualifiedMatches.length,
    discardedCount: discardedMatches.length,
    matches: qualifiedMatches,
    discarded: discardedMatches,
    timestamp: new Date().toISOString(),
    threshold: minPassThreshold,
  };
}

  // Sort by confidence — highest edge first

