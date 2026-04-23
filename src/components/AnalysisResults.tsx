import { Loader2, AlertCircle, Inbox } from "lucide-react";
import type { AnalysisResult } from "@/types";
import { ResultCard } from "./ResultCard";
import { PipelineChip } from "./PipelineChip";

interface AnalysisResultsProps {
  analysisResult: AnalysisResult | null;
  isAnalysing: boolean;
  error: string | null;
  onRetry: () => void;
  hasSelection: boolean;
}

const numberFormatter = new Intl.NumberFormat("en-IN");

function fmtArea(sqm: number | null) {
  if (sqm === null) return "—";
  return `${numberFormatter.format(Math.round(sqm))} m²`;
}

export function AnalysisResults({
  analysisResult,
  isAnalysing,
  error,
  onRetry,
  hasSelection,
}: AnalysisResultsProps) {
  if (!hasSelection) return null;

  return (
    <div className="rounded-2xl bg-white shadow-md border border-slate-200 p-5">
      {analysisResult?.status === "complete" && !isAnalysing && (
        <div className="mb-4">
          <PipelineChip pipeline={analysisResult.pipeline} />
        </div>
      )}

      {!isAnalysing && !error && !analysisResult && (
        <div className="flex flex-col items-center justify-center text-center py-8 text-slate-500">
          <Inbox size={28} className="mb-2 text-slate-300" />
          <p className="text-sm">Press Analyse to see results here</p>
        </div>
      )}

      {isAnalysing && (
        <div className="flex flex-col items-center justify-center text-center py-8 text-slate-500">
          <Loader2 size={28} className="mb-2 animate-spin text-sky-500" />
          <p className="text-sm">Fetching satellite data...</p>
        </div>
      )}

      {error && !isAnalysing && (
        <div className="flex flex-col items-center justify-center text-center py-8">
          <AlertCircle size={28} className="mb-2 text-red-500" />
          <p className="text-sm text-red-500 mb-3">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-slate-800 text-white text-sm font-medium px-4 py-2 hover:bg-slate-700"
          >
            Try Again
          </button>
        </div>
      )}

      {analysisResult?.status === "complete" && !isAnalysing && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          <ResultCard
            icon="💧"
            label="Water Surface Area"
            value={fmtArea(analysisResult.water_area_sqm)}
            subvalue={
              analysisResult.mndwi_mean !== null
                ? `MNDWI mean ${analysisResult.mndwi_mean.toFixed(3)}`
                : undefined
            }
          />
          <ResultCard
            icon="🗺️"
            label="Mapped Boundary Area"
            value={fmtArea(analysisResult.boundary_area_sqm)}
          />
          <ResultCard
            icon="📉"
            label="Area Deficit"
            value={fmtArea(analysisResult.area_deficit_sqm)}
            subvalue={
              analysisResult.area_deficit_pct !== null
                ? `${analysisResult.area_deficit_pct.toFixed(2)}% of boundary`
                : undefined
            }
            highlight={
              analysisResult.area_deficit_sqm !== null &&
              analysisResult.area_deficit_sqm > 0
                ? "red"
                : "green"
            }
          />
          <ResultCard
            icon="🌿"
            label="Macrophyte Coverage"
            value={
              analysisResult.macrophyte?.coverage_pct !== null &&
              analysisResult.macrophyte?.coverage_pct !== undefined
                ? `${analysisResult.macrophyte.coverage_pct.toFixed(1)}%`
                : "—"
            }
            subvalue={analysisResult.macrophyte?.label}
          />
          <ResultCard
            icon="🦠"
            label="Chlorophyll-a Proxy"
            value={
              analysisResult.chlorophyll?.value !== null &&
              analysisResult.chlorophyll?.value !== undefined
                ? `${analysisResult.chlorophyll.value.toFixed(1)} µg/L`
                : "—"
            }
            subvalue={analysisResult.chlorophyll?.label}
          />
          <ResultCard
            icon="🛰️"
            label="Satellite Image Date"
            value={analysisResult.image_date ?? "—"}
          />
          <ResultCard
            icon="☁️"
            label="Cloud Cover"
            value={
              analysisResult.cloud_cover_pct !== null
                ? `${analysisResult.cloud_cover_pct.toFixed(1)}%`
                : "—"
            }
          />
        </div>
      )}
    </div>
  );
}

export default AnalysisResults;
