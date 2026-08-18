export function analyzeMatch(match, frameworkId) {
  const results = [];
  let score = 0;

  switch (frameworkId) {
    case "perfect_game":
      // F1: Goals Ratio
      const f1 = match.homeGoalsAvg >= 1.75 && match.awayConcededAvg >= 1.2;
      results.push({
        id: "f1",
        name: "1.75 / 1.2 Goals Ratio",
        passed: f1,
        detail: `${match.homeGoalsAvg} vs ${match.awayConcededAvg}`,
      });
      if (f1) score++;

      // F2: Fortress
      const f2 = match.homeUnbeatenStreak >= 4 && match.homeCleanSheets >= 2;
      results.push({
        id: "f2",
        name: "Fortress Test",
        passed: f2,
        detail: `${match.homeUnbeatenStreak}/5 unbeaten, ${match.homeCleanSheets} CS`,
      });
      if (f2) score++;

      // F3: Motivation
      const f3 = match.motivation === "high";
      results.push({
        id: "f3",
        name: "Motivation Audit",
        passed: f3,
        detail:
          match.motivation === "equal"
            ? "Equal motivation = NO BET"
            : match.motivation,
      });
      if (f3) score++;

      // F4: Injury Core
      const f4 = match.injuries.length === 0;
      results.push({
        id: "f4",
        name: "Injury Core Check",
        passed: f4,
        detail: match.injuries.length
          ? `Missing: ${match.injuries.join(", ")}`
          : "All core fit",
      });
      if (f4) score++;

      // F5: xG
      const f5 = match.xGHome > match.xGAway;
      results.push({
        id: "f5",
        name: "xG Verification",
        passed: f5,
        detail: `xG: ${match.xGHome} vs ${match.xGAway}`,
      });
      if (f5) score++;

      // F6: Derby
      const f6 = !match.isDerby;
      results.push({
        id: "f6",
        name: "Derby Exclusion",
        passed: f6,
        detail: match.isDerby ? "DERBY - VOID" : "Not a derby",
      });
      if (f6) score++;
      break;

    case "perfect_game_away":
      // F1: Away 1.75 / Home concedes 1.2
      const pga1 = match.awayGoalsAvg >= 1.75 && match.homeConcededAvg >= 1.2;
      results.push({
        id: "f1",
        name: "1.75 / 1.2 Goals Ratio (Away)",
        passed: pga1,
        detail: `${match.awayGoalsAvg} away vs ${match.homeConcededAvg} home conceded`,
      });
      if (pga1) score++;

      // F2: Road Warrior
      const pga2 = match.awayUnbeatenStreak >= 4 && match.awayCleanSheets >= 2;
      results.push({
        id: "f2",
        name: "Road Warrior Test",
        passed: pga2,
        detail: `${match.awayUnbeatenStreak}/5 unbeaten away, ${match.awayCleanSheets} CS`,
      });
      if (pga2) score++;

      // F3: Away Motivation
      const awayMot = match.awayMotivation || match.motivation;
      const pga3 = awayMot === "high";
      results.push({
        id: "f3",
        name: "Motivation Audit (Away)",
        passed: pga3,
        detail: awayMot === "equal" ? "Equal motivation = NO BET" : awayMot,
      });
      if (pga3) score++;

      // F4: Away Injury Check
      const awayInj = match.awayInjuries || [];
      const pga4 = awayInj.length === 0;
      results.push({
        id: "f4",
        name: "Injury Core Check (Away)",
        passed: pga4,
        detail: awayInj.length
          ? `Away missing: ${awayInj.join(", ")}`
          : "Away spine fit",
      });
      if (pga4) score++;

      // F5: xG Away > Home
      const pga5 = match.xGAway > match.xGHome;
      results.push({
        id: "f5",
        name: "xG Verification (Away)",
        passed: pga5,
        detail: `xG: ${match.xGAway} away vs ${match.xGHome} home`,
      });
      if (pga5) score++;

      // F6: Derby
      const pga6 = !match.isDerby;
      results.push({
        id: "f6",
        name: "Derby Exclusion",
        passed: pga6,
        detail: match.isDerby ? "DERBY - VOID" : "Not a derby",
      });
      if (pga6) score++;
      break;

    case "total_lock":
      // F1: Combined xG <= 1.8
      const tl1 = match.combinedXG <= 1.8;
      results.push({
        id: "f1",
        name: "1.8 Combined xG Ceiling",
        passed: tl1,
        detail: `Combined: ${match.combinedXG}`,
      });
      if (tl1) score++;

      // F2: Both kept CS in 3/5
      const tl2 = match.homeCleanSheets >= 3 && match.awayCleanSheets >= 3;
      results.push({
        id: "f2",
        name: "Clean Sheet Fortress",
        passed: tl2,
        detail: `Home: ${match.homeCleanSheets} CS, Away: ${match.awayCleanSheets} CS`,
      });
      if (tl2) score++;

      // F3: Patient Buildup (no fast break, no attacking wings)
      const tl3 = match.patientBuildup === true;
      results.push({
        id: "f3",
        name: "Patient Buildup Filter",
        passed: tl3,
        detail: tl3 ? "Slow buildup / low block" : "Transition threat detected",
      });
      if (tl3) score++;

      // F4: Both spines intact
      const tl4 = match.bothSpinesIntact === true;
      results.push({
        id: "f4",
        name: "Anchor Presence",
        passed: tl4,
        detail: tl4 ? "Both spines intact" : "Defensive anchor missing",
      });
      if (tl4) score++;

      // F5: H2H Under 2.5
      const tl5 = match.h2hUnder25 === true;
      results.push({
        id: "f5",
        name: "H2H Under History",
        passed: tl5,
        detail: tl5 ? "Last 3 all Under 2.5" : "H2H had overs",
      });
      if (tl5) score++;

      // F6: Dry Pitch
      const tl6 = match.dryPitch === true;
      results.push({
        id: "f6",
        name: "Dry Pitch Modifier",
        passed: tl6,
        detail: tl6
          ? "Dry conditions = Green Light"
          : "Rain forecast = chaos risk",
      });
      if (tl6) score++;
      break;

    case "total_chaos":
      const c1 = match.combinedXG >= 3.0;
      results.push({
        id: "f1",
        name: "Combined 3.0 xG",
        passed: c1,
        detail: `Combined: ${match.combinedXG}`,
      });
      if (c1) score++;

      const c2 = match.cleanSheetDrought;
      results.push({
        id: "f2",
        name: "Clean Sheet Drought",
        passed: c2,
        detail: c2 ? "Both failing CS" : "One team kept CS",
      });
      if (c2) score++;

      const c3 = match.anchorMissing;
      results.push({
        id: "f3",
        name: "Anchor Absence",
        passed: c3,
        detail: c3 ? "Defensive spine out" : "Spine intact",
      });
      if (c3) score++;

      const c4 = match.transitionStyle;
      results.push({
        id: "f4",
        name: "Transition Style",
        passed: c4,
        detail: c4 ? "Wings/Fast break" : "Not transition-heavy",
      });
      if (c4) score++;

      const c5 = match.h2hOver25;
      results.push({
        id: "f5",
        name: "H2H Over 2.5",
        passed: c5,
        detail: c5 ? "Last 3 over 2.5" : "H2H low scoring",
      });
      if (c5) score++;

      const c6 = match.rainForecast;
      results.push({
        id: "f6",
        name: "Wet Pitch",
        passed: c6,
        detail: c6 ? "Rain forecast = Green Light" : "Dry pitch",
      });
      if (c6) score++;
      break;

    case "corner_pressure":
      const co1 = match.homeCornerAvg + match.awayCornerAvg >= 11.0;
      results.push({
        id: "f1",
        name: "11.0 Combined Avg",
        passed: co1,
        detail: `Combined: ${(match.homeCornerAvg + match.awayCornerAvg).toFixed(1)}`,
      });
      if (co1) score++;

      const co2 = match.traditionalWingers;
      results.push({
        id: "f2",
        name: "Traditional Winger",
        passed: co2,
        detail: co2 ? "Wingers hug line" : "Inverted wingers",
      });
      if (co2) score++;

      const co3 = match.favShotsRank <= 5 && match.underdogBlocksRank <= 5;
      results.push({
        id: "f3",
        name: "Shot-to-Block",
        passed: co3,
        detail: `Fav shots #${match.favShotsRank}, Blocks #${match.underdogBlocksRank}`,
      });
      if (co3) score++;

      const co4 = match.underdogPossession < 42;
      results.push({
        id: "f4",
        name: "Low Block",
        passed: co4,
        detail: `Possession: ${match.underdogPossession}%`,
      });
      if (co4) score++;

      const co5 = match.lateMotivation;
      results.push({
        id: "f5",
        name: "Late Motivation",
        passed: co5,
        detail: co5 ? "Needs 90 min attack" : "Comfortable lead possible",
      });
      if (co5) score++;

      const co6 = match.narrowPitch;
      results.push({
        id: "f6",
        name: "Pitch Width",
        passed: co6,
        detail: co6 ? "Narrow pitch" : "Wide pitch",
      });
      if (co6) score++;
      break;

    case "midfield_mire":
      const m1 = match.crossesRank >= 15; // Bottom 5 in a 20-team league
      results.push({
        id: "f1",
        name: "Surgical Offense",
        passed: m1,
        detail: `Crosses rank: #${match.crossesRank}`,
      });
      if (m1) score++;

      const m2 = match.invertedWingers;
      results.push({
        id: "f2",
        name: "Inverted Winger",
        passed: m2,
        detail: m2 ? "Both inverted" : "Traditional wingers",
      });
      if (m2) score++;

      const m3 = match.possession > 52;
      results.push({
        id: "f3",
        name: "Tiki-Taka",
        passed: m3,
        detail: `Possession: ${match.possession}%`,
      });
      if (m3) score++;

      const m4 = match.interceptionsHigh;
      results.push({
        id: "f4",
        name: "Clean Clearance",
        passed: m4,
        detail: m4 ? "High INT, low blocks" : "Panic defending",
      });
      if (m4) score++;

      const m5 = match.keeperCatches;
      results.push({
        id: "f5",
        name: "Keeper Catch",
        passed: m5,
        detail: m5 ? "Claims crosses" : "Parries/punches",
      });
      if (m5) score++;

      const m6 = match.h2hCornerAvg < 8;
      results.push({
        id: "f6",
        name: "H2H Bore Factor",
        passed: m6,
        detail: `Avg: ${match.h2hCornerAvg} corners`,
      });
      if (m6) score++;
      break;

    default:
      break;
  }

  const allPassed = results.every((r) => r.passed);
  const confidence = Math.round((score / 6) * 100);

  return {
    matchId: match.id,
    framework: frameworkId,
    results,
    score,
    totalFilters: 6,
    allPassed,
    confidence,
    recommendation: allPassed ? "QUALIFIED" : "NO BET",
    betType: getBetType(frameworkId),
  };
}

function getBetType(frameworkId) {
  const map = {
    perfect_game: 'Home Win (DNB)',
    perfect_game_away: 'Away Win (DNB)',
    total_chaos: 'Over 2.5 Goals',
    total_lock: 'Under 2.5 Goals',
    corner_pressure: 'Over 9.5 Corners',
    midfield_mire: 'Under 8.5 Corners',
  };
  return map[frameworkId] || 'Unknown';
}

