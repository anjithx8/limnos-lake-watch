// src/services/api.ts
import type { FeatureCollection } from "geojson";
import type { AnalysisRequest, AnalysisResult } from "@/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export async function fetchLakes(city?: string): Promise<FeatureCollection> {
  const url = city
    ? `${BASE_URL}/api/lakes?city=${encodeURIComponent(city)}`
    : `${BASE_URL}/api/lakes`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch lakes: ${res.statusText}`);
  return res.json();
}

export async function triggerAnalysis(
  request: AnalysisRequest,
): Promise<{ analysis_id: string; status: string }> {
  const res = await fetch(`${BASE_URL}/api/analyze`, {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify({
      lake_id   : request.lake_id,
      start_date: request.start_date,
      end_date  : request.end_date,
    }),
  });
  if (!res.ok) throw new Error(`Failed to trigger analysis: ${res.statusText}`);
  return res.json();
}

export async function fetchResults(
  analysisId: string,
): Promise<AnalysisResult> {
  const res = await fetch(`${BASE_URL}/api/results/${analysisId}`);
  if (!res.ok) throw new Error(`Failed to fetch results: ${res.statusText}`);
  return res.json();
}
