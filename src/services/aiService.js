import { analyzeMatch } from "../engines/filterEngine";
import { FRAMEWORKS } from "../data/dummyData";

// ============================================
// PROMPT ENGINEERING — This is the secret sauce
// ============================================

function buildPrompt(match, frameworks) {
  return `
You are "PREDICTOR", an elite sports betting analyst AI. Your job is to evaluate football matches using strict mathematical frameworks. You do not bet with emotion. You bet with structure.

MATCH DATA:
Home: ${match.home}
Away: ${match.away}
League: ${match.league}
Home Goals (last 8 home): ${match.homeGoalsAvg}
Away Conceded (last 8 away): ${match.awayConcededAvg}
Home Unbeaten Streak: ${match.homeUnbeatenStreak}/5
Home Clean Sheets: ${match.homeCleanSheets}
Motivation: ${match.motivation}
Injuries: ${match.injuries.join(", ") || "None"}
Derby: ${match.isDerby}
xG Home: ${match.xGHome}
xG Away: ${match.xGAway}
Combined xG: ${match.combinedXG}
Clean Sheet Drought (both): ${match.cleanSheetDrought}
Defensive Anchor Missing: ${match.anchorMissing}
Transition Style: ${match.transitionStyle}
H2H Over 2.5: ${match.h2hOver25}
Rain Forecast: ${match.rainForecast}
Home Corner Avg: ${match.homeCornerAvg}
Away Corner Avg: ${match.awayCornerAvg}
Traditional Wingers: ${match.traditionalWingers}
Favorite Shots Rank: ${match.favShotsRank}
Underdog Blocks Rank: ${match.underdogBlocksRank}
Underdog Possession: ${match.underdogPossession}%
Late Motivation: ${match.lateMotivation}
Narrow Pitch: ${match.narrowPitch}
Crosses Rank: ${match.crossesRank}
Inverted Wingers: ${match.invertedWingers}
Possession: ${match.possession}%
Interceptions High: ${match.interceptionsHigh}
Keeper Catches: ${match.keeperCatches}
H2H Corner Avg: ${match.h2hCornerAvg}

FRAMEWORKS TO EVALUATE:
${Object.values(frameworks)
  .map(
    (fw) => `
[${fw.name.toUpperCase()}]
Target: ${fw.description}
Filters:
${fw.filters.map((f, i) => `${i + 1}. ${f.name}: ${f.rule}`).join("\n")}
`,
  )
  .join("\n")}

RULES:
1. Evaluate the match against ALL 4 frameworks independently.
2. For each framework, determine how many of the 6 filters pass.
3. Identify the SINGLE best framework (highest fit score).
4. If NO framework scores 6/6, the verdict is "NO BET".
5. Provide a 1-sentence "AI Insight" explaining the structural imbalance (or lack thereof).
6. Include a "Market Alignment" guess based on the data.

Return ONLY valid JSON in this exact structure:
{
  "bestFramework": "perfect_game",
  "overallVerdict": "NO BET" | "QUALIFIED",
  "overallConfidence": 0-100,
  "aiSummary": "One sentence insight",
  "marketAlignment": {
    "likelyDirection": "home_drop" | "away_drop" | "stable",
    "confidence": 0-100,
    "reasoning": "..."
  },
  "frameworks": [
    {
      "id": "perfect_game",
      "name": "Perfect Game",
      "fitScore": 0-100,
      "passedFilters": 0-6,
      "recommendation": "NO BET" | "QUALIFIED",
      "filterBreakdown": [
        {"id":"f1","name":"...","passed":true,"reason":"..."}
      ],
      "frameworkInsight": "Why this framework does or doesn't fit"
    }
  ]
}
`;
}

// ============================================
// MOCK AI — Local brain, no API costs
// ============================================

function generateAIInsight(match, fwId, analysis) {
  const insights = {
    perfect_game: {
      pass: `${match.home} shows structural dominance at home with ${match.homeGoalsAvg} goals/game and a fortress record. The away side concedes ${match.awayConcededAvg}, creating a mathematical edge.`,
      fail: `The structural alignment breaks down due to ${!analysis.results.find((r) => r.id === "f3")?.passed ? "equal motivation neutralizing home advantage" : "key injuries disrupting the spine"}. No edge exists.`,
    },
    total_chaos: {
      pass: `Both teams exhibit defensive rot. Combined xG of ${match.combinedXG} with clean sheet droughts suggests a high-variance goal fest.`,
      fail: `Defensive structures remain too organized. The combined xG floor isn't met, and tactical discipline suppresses chaos.`,
    },
    corner_pressure: {
      pass: `The underdog's low block (${match.underdogPossession}% possession) invites relentless wing play. Combined corner average of ${(match.homeCornerAvg + match.awayCornerAvg).toFixed(1)} exceeds the threshold.`,
      fail: `Inverted wingers and wide pitch dimensions reduce touchline pressure. Corner volume will be suppressed.`,
    },
    midfield_mire: {
      pass: `Both teams prefer surgical buildup through the center. High possession, low cross volume, and keepers who claim crosses will strangle corner production.`,
      fail: `One or both teams rely on wing play and direct transitions. The ball will reach the touchline too often.`,
    },
  };

  const isPass = analysis.allPassed;
  return insights[fwId][isPass ? "pass" : "fail"];
}

function generateMarketAlignment(match) {
  // Simple heuristic mock
  if (match.homeGoalsAvg > 2.0 && match.awayConcededAvg > 1.5) {
    return {
      likelyDirection: "home_drop",
      confidence: 72,
      reasoning: `Home dominance metrics suggest sharp money may already be pricing in a home win.`,
    };
  }
  return {
    likelyDirection: "stable",
    confidence: 45,
    reasoning: `No clear structural imbalance detected. Market likely priced correctly.`,
  };
}

export async function analyzeWithAI(match, useRealAPI = false, apiKey = null) {
  // If user wants real AI and has a key, this is where you'd call OpenAI
  if (useRealAPI && apiKey) {
    const prompt = buildPrompt(match, FRAMEWORKS);

    // Example fetch for OpenAI (commented out — paste your key to activate)
    /*
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.2, // Low temp = strict, deterministic
        response_format: { type: 'json_object' }
      })
    });
    const data = await res.json();
    return JSON.parse(data.choices[0].message.content);
    */

    throw new Error(
      "Real API mode selected but no valid key provided. Switching to local AI.",
    );
  }

  // ============================================
  // LOCAL AI MODE — Uses your filterEngine as the brain
  // ============================================

  const frameworkIds = Object.keys(FRAMEWORKS).map((k) => FRAMEWORKS[k].id);
  const frameworkResults = frameworkIds.map((fwId) => {
    const analysis = analyzeMatch(match, fwId);
    return {
      id: fwId,
      name: FRAMEWORKS[fwId.toUpperCase()].name,
      fitScore: analysis.confidence,
      passedFilters: analysis.score,
      recommendation: analysis.recommendation,
      betType: analysis.betType,
      filterBreakdown: analysis.results.map((r) => ({
        id: r.id,
        name: r.name,
        passed: r.passed,
        reason: r.detail,
      })),
      frameworkInsight: generateAIInsight(match, fwId, analysis),
    };
  });

  // Rank by fit score
  frameworkResults.sort((a, b) => b.fitScore - a.fitScore);
  const best = frameworkResults[0];
  const market = generateMarketAlignment(match);

  return {
    bestFramework: best.id,
    overallVerdict: best.recommendation,
    overallConfidence: best.fitScore,
    aiSummary: best.frameworkInsight,
    marketAlignment: market,
    frameworks: frameworkResults,
  };
}
