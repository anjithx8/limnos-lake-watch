export interface LakeProperties {
  lake_id: string;
  name: string;
  area_sqm: number;
  centroid_lon: number;
  centroid_lat: number;
  water_type: string;
}

export interface AnalysisRequest {
  lake_id: string;
  start_date: string;
  end_date: string;
}

export interface ChlorophyllResult {
  value: number | null;
  level: string;
  label: string;
}

export interface MacrophyteResult {
  coverage_pct: number | null;
  level: string;
  label: string;
}

export interface AnalysisResult {
  analysis_id: string;
  lake_id: string;
  lake_name: string;
  status: "processing" | "complete" | "error";
  pipeline: "dry_season" | "wet_season" | null;
  start_date: string;
  end_date: string;
  image_date: string | null;
  cloud_cover_pct: number | null;
  water_area_sqm: number | null;
  boundary_area_sqm: number | null;
  area_deficit_sqm: number | null;
  area_deficit_pct: number | null;
  otsu_threshold: number | null;
  mndwi_mean: number | null;
  mndwi_std: number | null;
  chlorophyll: ChlorophyllResult | null;
  macrophyte: MacrophyteResult | null;
  error_message: string | null;
  created_at: string | null;
}
