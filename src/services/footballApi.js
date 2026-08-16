const RAPID_API_KEY = process.env.REACT_APP_RAPIDAPI_KEY; // your e25... key
const RAPID_API_HOST = "api-football-v1.p.rapidapi.com";

async function fetchFromAPI(endpoint, params = {}) {
  const url = new URL(`https://${RAPID_API_HOST}/v3${endpoint}`);
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) url.searchParams.append(key, val);
  });

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": RAPID_API_HOST,
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.response; // API-Football wraps everything in `response`
}

export async function getTodaysFixtures() {
  const today = new Date().toISOString().split("T")[0];
  return fetchFromAPI("/fixtures", { date: today, timezone: "Europe/London" });
}

// Minimal transformer — maps API shape to your app shape
export function transformFixture(apiFixture) {
  return {
    id: apiFixture.fixture.id,
    home: apiFixture.teams.home.name,
    away: apiFixture.teams.away.name,
    league: apiFixture.league.name,
    time: new Date(apiFixture.fixture.date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    // Defaults for framework data — you'll fill these from other endpoints later
    homeGoalsAvg: 1.5,
    awayConcededAvg: 1.2,
    homeUnbeatenStreak: 3,
    homeCleanSheets: 1,
    motivation: "equal",
    injuries: [],
    isDerby: false,
    xGHome: 1.4,
    xGAway: 1.1,
    combinedXG: 2.5,
    cleanSheetDrought: false,
    anchorMissing: false,
    transitionStyle: false,
    h2hOver25: false,
    rainForecast: false,
    homeCornerAvg: 5.0,
    awayCornerAvg: 4.0,
    traditionalWingers: true,
    favShotsRank: 5,
    underdogBlocksRank: 5,
    underdogPossession: 45,
    lateMotivation: true,
    narrowPitch: true,
    crossesRank: 10,
    invertedWingers: false,
    possession: 50,
    interceptionsHigh: false,
    keeperCatches: false,
    h2hCornerAvg: 8,
  };
}
