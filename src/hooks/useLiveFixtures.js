import { useState, useEffect } from "react";
import {
  getFixturesByDate,
  transformFixtureToMatch,
} from "../services/footballApi";

export function useLiveFixtures() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // For now, this will fail without a real API key
        // When you add your key, uncomment this:
        /*
        const fixtures = await getFixturesByDate();
        // You'd need to fetch stats for each team too
        const transformed = fixtures.map(f => transformFixtureToMatch(f, null, null, null));
        setMatches(transformed);
        */

        // For now, fallback to dummy data
        setMatches([]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { matches, loading, error };
}
