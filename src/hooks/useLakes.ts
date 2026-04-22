import { useEffect, useState } from "react";
import type { FeatureCollection } from "geojson";
import { fetchLakes } from "@/services/api";

export function useLakes() {
  const [lakesData, setLakesData] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchLakes()
      .then((data) => {
        if (!cancelled) setLakesData(data);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load lakes");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return { lakesData, loading, error, retry: () => setReloadKey((k) => k + 1) };
}
