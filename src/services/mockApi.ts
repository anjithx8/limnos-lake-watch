import type { FeatureCollection } from "geojson";
import type { AnalysisRequest, AnalysisResult } from "@/types";
import { BANGALORE_LAKES } from "./mockData";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface JobState {
  request: AnalysisRequest;
  startedAt: number;
  lakeName: string;
  boundaryArea: number;
}

const jobs = new Map<string, JobState>();
const PROCESSING_MS = 3000;

export async function fetchLakes(): Promise<FeatureCollection> {
  await delay(1000 + Math.random() * 800);
  return BANGALORE_LAKES;
}

export async function triggerAnalysis(
  request: AnalysisRequest,
): Promise<{ analysis_id: string; status: string }> {
  await delay(600 + Math.random() * 400);
  const lake = BANGALORE_LAKES.features.find(
    (f) => (f.properties as { lake_id?: string } | null)?.lake_id === request.lake_id,
  );
  const props = (lake?.properties ?? {}) as { name?: string; area_sqm?: number };
  const id = uuid();
  jobs.set(id, {
    request,
    startedAt: Date.now(),
    lakeName: props.name ?? "Unknown Lake",
    boundaryArea: props.area_sqm ?? 100000,
  });
  return { analysis_id: id, status: "processing" };
}

function pickPipeline(endDate: string): "dry_season" | "wet_season" {
  const month = new Date(endDate).getMonth() + 1; // 1-12
  // Bangalore monsoon ~Jun-Oct
  return month >= 6 && month <= 10 ? "wet_season" : "dry_season";
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export async function fetchResults(analysisId: string): Promise<AnalysisResult> {
  await delay(400 + Math.random() * 300);
  const job = jobs.get(analysisId);
  if (!job) {
    return {
      analysis_id: analysisId,
      lake_id: "",
      lake_name: "",
      status: "error",
      pipeline: null,
      start_date: "",
      end_date: "",
      image_date: null,
      cloud_cover_pct: null,
      water_area_sqm: null,
      boundary_area_sqm: null,
      area_deficit_sqm: null,
      area_deficit_pct: null,
      otsu_threshold: null,
      mndwi_mean: null,
      mndwi_std: null,
      chlorophyll: null,
      macrophyte: null,
      error_message: "Analysis not found",
      created_at: null,
    };
  }

  const elapsed = Date.now() - job.startedAt;
  const baseStub: AnalysisResult = {
    analysis_id: analysisId,
    lake_id: job.request.lake_id,
    lake_name: job.lakeName,
    status: "processing",
    pipeline: null,
    start_date: job.request.start_date,
    end_date: job.request.end_date,
    image_date: null,
    cloud_cover_pct: null,
    water_area_sqm: null,
    boundary_area_sqm: null,
    area_deficit_sqm: null,
    area_deficit_pct: null,
    otsu_threshold: null,
    mndwi_mean: null,
    mndwi_std: null,
    chlorophyll: null,
    macrophyte: null,
    error_message: null,
    created_at: null,
  };

  if (elapsed < PROCESSING_MS) {
    return baseStub;
  }

  const pipeline = pickPipeline(job.request.end_date);
  const boundary = job.boundaryArea;
  const deficitPct = pipeline === "dry_season" ? rand(8, 35) : rand(-5, 12);
  const waterArea = Math.max(0, boundary * (1 - deficitPct / 100));
  const deficitSqm = boundary - waterArea;

  const macroPct = rand(5, 55);
  const macroLevel = macroPct < 15 ? "low" : macroPct < 35 ? "moderate" : "high";
  const macroLabel =
    macroLevel === "low"
      ? "Low coverage"
      : macroLevel === "moderate"
        ? "Moderate coverage"
        : "High coverage — possible eutrophication";

  const chlValue = rand(2, 60);
  const chlLevel = chlValue < 10 ? "low" : chlValue < 25 ? "moderate" : "high";
  const chlLabel =
    chlLevel === "low"
      ? "Low — clear water"
      : chlLevel === "moderate"
        ? "Moderate — typical urban lake"
        : "High — algal bloom likely";

  // image date within last 14 days from end_date
  const end = new Date(job.request.end_date);
  end.setDate(end.getDate() - Math.floor(rand(0, 14)));
  const imageDate = end.toISOString().slice(0, 10);

  return {
    ...baseStub,
    status: "complete",
    pipeline,
    image_date: imageDate,
    cloud_cover_pct: Number(rand(0, 18).toFixed(1)),
    water_area_sqm: Math.round(waterArea),
    boundary_area_sqm: Math.round(boundary),
    area_deficit_sqm: Math.round(deficitSqm),
    area_deficit_pct: Number(deficitPct.toFixed(2)),
    otsu_threshold: Number(rand(-0.05, 0.15).toFixed(3)),
    mndwi_mean: Number(rand(0.05, 0.45).toFixed(3)),
    mndwi_std: Number(rand(0.05, 0.2).toFixed(3)),
    chlorophyll: {
      value: Number(chlValue.toFixed(1)),
      level: chlLevel,
      label: chlLabel,
    },
    macrophyte: {
      coverage_pct: Number(macroPct.toFixed(1)),
      level: macroLevel,
      label: macroLabel,
    },
    error_message: null,
    created_at: new Date().toISOString(),
  };
}
