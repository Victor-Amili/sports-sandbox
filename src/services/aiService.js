import { analyzeMatch } from "../engine/filterEngine";
import { FRAMEWORKS } from "../data/dummyData";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_KEY = process.env.REACT_APP_OPENAI_KEY;

// ============================================
// PROMPT ENGINEERING
// ============================================

function buildPrompt(match, frameworks) {
  return `You are PREDICTOR, an elite sports betting analyst AI. You evaluate football matches using strict mathematical frameworks. You do not bet with emotion. You bet with structure.

Evaluate the match below against ALL 4 frameworks. Return strict JSON.

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
Clean Sheet Drought: ${match.cleanSheetDrought}
Anchor Missing: ${match.anchorMissing}
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

FRAMEWORKS:
${Object.values(frameworks)
  .map(
    (fw) => `
[${fw.name}]
Target: ${fw.description}
${fw.filters.map((f, i) => `${i + 1}. ${f.name}: ${f.rule}`).join("\n")}
`,
  )
  .join("\n")}

RULES:
1. Evaluate ALL 4 frameworks independently.
2. Count how many of 6 filters pass per framework.
3. Pick the SINGLE best framework (highest pass count, then highest structural edge).
4. If top framework passes < 5 filters, verdict is "NO BET".
5. Write a 1-sentence "aiSummary" explaining the structural imbalance.
6. Guess "marketAlignment" — will sharp money move toward home, away, or stay stable?

Return ONLY this JSON structure:
{
  "bestFramework": "perfect_game",
  "overallVerdict": "QUALIFIED" | "NO BET",
  "overallConfidence": 0-100,
  "aiSummary": "One sentence.",
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
      "recommendation": "QUALIFIED" | "NO BET",
      "betType": "Home Win (DNB)",
      "filterBreakdown": [
        {"id":"f1","name":"...","passed":true,"reason":"..."}
      ],
      "frameworkInsight": "Why this fits or fails"
    }
  ]
}`;
}

// ============================================
// LOCAL FALLBACK AI (works without API key)
// ============================================

function generateLocalAIResult(match) {
  const frameworkIds = Object.keys(FRAMEWORKS).map((k) => FRAMEWORKS[k].id);
  const frameworkResults = frameworkIds.map((fwId) => {
    const analysis = analyzeMatch(match, fwId);

    const insights = {
      perfect_game: {
        pass: `${match.home} dominates at home (${match.homeGoalsAvg} goals/game) while ${match.away} bleeds goals away (${match.awayConcededAvg}). Structural edge is real.`,
        fail: `No structural edge. ${!analysis.results.find((r) => r.id === "f3")?.passed ? "Equal motivation neutralizes home advantage." : "Key injuries break the spine."}`,
      },
      total_chaos: {
        pass: `Both teams show defensive rot. Combined xG of ${match.combinedXG} with clean sheet droughts signals a goal-heavy affair.`,
        fail: `Defensive structures are too organized. No chaos trigger detected.`,
      },
      corner_pressure: {
        pass: `${match.home}'s wing play against ${match.away}'s low block (${match.underdogPossession}% possession) creates a corner cascade. Combined average ${(match.homeCornerAvg + match.awayCornerAvg).toFixed(1)} exceeds threshold.`,
        fail: `Tactical setup suppresses touchline pressure. Corner volume will be low.`,
      },
      midfield_mire: {
        pass: `Both teams prefer central buildup. Inverted wingers and keepers who claim crosses will strangle corner production.`,
        fail: `Direct play and wide transitions will force the ball to the touchline too often.`,
      },
    };

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
      frameworkInsight: insights[fwId][analysis.allPassed ? "pass" : "fail"],
    };
  });

  frameworkResults.sort((a, b) => b.fitScore - a.fitScore);
  const best = frameworkResults[0];

  const marketMap = {
    home_drop: {
      likelyDirection: "home_drop",
      confidence: 72,
      reasoning: `Home dominance metrics suggest sharp money is pricing in a home win.`,
    },
    stable: {
      likelyDirection: "stable",
      confidence: 45,
      reasoning: `No clear structural imbalance. Market likely priced correctly.`,
    },
    away_drop: {
      likelyDirection: "away_drop",
      confidence: 60,
      reasoning: `Away team structural rot may attract sharp money against them.`,
    },
  };

  const market =
    best.id === "perfect_game" && best.passedFilters >= 5
      ? marketMap.home_drop
      : best.id === "total_chaos" && best.passedFilters >= 5
        ? marketMap.away_drop
        : marketMap.stable;

  return {
    bestFramework: best.id,
    overallVerdict: best.recommendation,
    overallConfidence: best.fitScore,
    aiSummary: best.frameworkInsight,
    marketAlignment: market,
    frameworks: frameworkResults,
  };
}

// ============================================
// REAL AI API CALL
// ============================================

export async function analyzeWithAI(match, useRealAPI = false) {
  // If no key or not requested, use local brain immediately
  if (!useRealAPI || !OPENAI_KEY || OPENAI_KEY === "sk-your-openai-key-here") {
    console.log("[AI] Using local engine (no API key)");
    return generateLocalAIResult(match);
  }

  try {
    console.log("[AI] Calling OpenAI GPT-4o...");

    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a deterministic sports analysis engine. Always return valid JSON. Never add markdown formatting. Never explain outside the JSON.",
          },
          {
            role: "user",
            content: buildPrompt(match, FRAMEWORKS),
          },
        ],
        temperature: 0.1, // Very low = strict, repeatable, deterministic
        max_tokens: 2000,
        response_format: { type: "json_object" }, // Forces JSON output
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);

    // Validate structure
    if (!parsed.frameworks || !parsed.bestFramework) {
      throw new Error("AI returned malformed JSON structure");
    }

    console.log("[AI] OpenAI response received and parsed");
    return parsed;
  } catch (err) {
    console.warn(
      "[AI] OpenAI failed, falling back to local engine:",
      err.message,
    );
    return generateLocalAIResult(match);
  }
}
