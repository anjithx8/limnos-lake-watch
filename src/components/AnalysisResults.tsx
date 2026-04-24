import { Loader2, AlertCircle, Inbox } from "lucide-react";
import type { AnalysisResult } from "@/types";
import { ResultCard } from "./ResultCard";
import { PipelineChip } from "./PipelineChip";
import { formatSatelliteDate, analyzeLakeStatus } from "@/lib/utils";

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

function Insight({ analysisResult, isAnalysing }: { analysisResult: AnalysisResult | null; isAnalysing: boolean }) {
  if (!analysisResult || isAnalysing) return null;
  const { status, summary } = analyzeLakeStatus(analysisResult);
  const statusEmoji = status === "critical" ? "🔴" : status === "moderate" ? "🟡" : "🟢";
  const statusColor = status === "critical" ? "text-destructive" : status === "moderate" ? "text-warning" : "text-success";
  
  return (
    <div>
      <PipelineChip pipeline={analysisResult.pipeline} />
      <div className="mt-3 p-4 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{statusEmoji}</span>
          <span className={`text-sm font-semibold capitalize ${statusColor}`}>{status}</span>
        </div>
        <p className="text-sm text-foreground">{summary}</p>
      </div>
    </div>
  );
}

function LoadingState({ isAnalysing, hasSelection, analysisResult, error, onRetry }: { isAnalysing: boolean; hasSelection: boolean; analysisResult: AnalysisResult | null; error: string | null; onRetry: () => void }) {
  if (hasSelection && (isAnalysing || error || !analysisResult)) {
    if (isAnalysing) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-8 animate-in fade-in duration-300">
          <Loader2 size={28} className="mb-2 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Fetching satellite data...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-8 animate-in fade-in duration-300">
          <AlertCircle size={28} className="mb-2 text-destructive" />
          <p className="text-sm text-destructive mb-3">{error}</p>
          <button type="button" onClick={onRetry} className="rounded-lg bg-secondary text-secondary-foreground text-sm font-medium px-4 py-2 hover:bg-secondary/80 transition-colors">Try Again</button>
        </div>
      );
    }
    if (!analysisResult) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-8 animate-in fade-in duration-300">
          <Inbox size={28} className="mb-2 text-muted" />
          <p className="text-sm text-muted-foreground">Press Analyse to see results here</p>
        </div>
      );
    }
  }
  return null;
}

function ResultsGrid({ analysisResult, isAnalysing }: { analysisResult: AnalysisResult | null; isAnalysing: boolean }) {
  if (!analysisResult || analysisResult.status !== "complete" || isAnalysing) return null;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 animate-in fade-in duration-500">
      <ResultCard icon="💧" label="Water Surface Area" value={fmtArea(analysisResult.water_area_sqm)} subvalue={analysisResult.mndwi_mean !== null ? `MNDWI mean ${analysisResult.mndwi_mean.toFixed(3)}` : undefined} description="Total water surface detected from satellite imagery" priority={analysisResult.water_area_sqm && analysisResult.water_area_sqm > 0 ? "normal" : "warning"} />
      
      <ResultCard icon="🗺️" label="Mapped Boundary Area" value={fmtArea(analysisResult.boundary_area_sqm)} description="Total area within the lake's mapped boundary" priority="normal" />
      
      <ResultCard icon="📉" label="Area Deficit" value={fmtArea(analysisResult.area_deficit_sqm)} subvalue={analysisResult.area_deficit_pct !== null ? `${analysisResult.area_deficit_pct.toFixed(2)}% of boundary` : undefined} description="Difference between boundary and water area" priority={analysisResult.area_deficit_pct && analysisResult.area_deficit_pct > 60 ? "critical" : analysisResult.area_deficit_pct && analysisResult.area_deficit_pct > 30 ? "warning" : "normal"} alert={analysisResult.area_deficit_pct && analysisResult.area_deficit_pct > 60 ? "Critical water loss detected!" : undefined} />
      
      <ResultCard icon="🌿" label="Macrophyte Coverage" value={analysisResult.macrophyte?.coverage_pct !== null && analysisResult.macrophyte?.coverage_pct !== undefined ? `${analysisResult.macrophyte.coverage_pct.toFixed(1)}%` : "—"} subvalue={analysisResult.macrophyte?.label} description="Aquatic vegetation percentage" priority={analysisResult.macrophyte?.coverage_pct && analysisResult.macrophyte.coverage_pct > 50 ? "critical" : analysisResult.macrophyte?.coverage_pct && analysisResult.macrophyte.coverage_pct > 20 ? "warning" : "normal"} alert={analysisResult.macrophyte?.coverage_pct && analysisResult.macrophyte.coverage_pct > 50 ? "Heavy vegetation detected" : undefined} />
      
      <ResultCard icon="🦠" label="Chlorophyll-a Proxy" value={analysisResult.chlorophyll?.value !== null && analysisResult.chlorophyll?.value !== undefined ? `${analysisResult.chlorophyll.value.toFixed(1)} µg/L` : "—"} subvalue={analysisResult.chlorophyll?.label} description="Algae concentration indicator" priority={analysisResult.chlorophyll?.value && analysisResult.chlorophyll.value > 30 ? "critical" : analysisResult.chlorophyll?.value && analysisResult.chlorophyll.value > 10 ? "warning" : "normal"} alert={analysisResult.chlorophyll?.value && analysisResult.chlorophyll.value > 30 ? "High algae levels!" : undefined} />
      
      <ResultCard icon="🛰️" label="Satellite Image Date" value={formatSatelliteDate(analysisResult.image_date)} description="When the satellite image was captured" priority="normal" />
      
      <ResultCard icon="☁️" label="Cloud Cover" value={analysisResult.cloud_cover_pct !== null ? `${analysisResult.cloud_cover_pct.toFixed(1)}%` : "—"} description="Image obscured by clouds" priority={analysisResult.cloud_cover_pct && analysisResult.cloud_cover_pct > 70 ? "warning" : "normal"} alert={analysisResult.cloud_cover_pct && analysisResult.cloud_cover_pct > 70 ? "High cloud cover" : undefined} />
    </div>
  );
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
    <div className="rounded-2xl bg-card shadow-md border border-border p-5 space-y-4">
      <Insight analysisResult={analysisResult} isAnalysing={isAnalysing} />
      <LoadingState isAnalysing={isAnalysing} hasSelection={hasSelection} analysisResult={analysisResult} error={error} onRetry={onRetry} />
      <ResultsGrid analysisResult={analysisResult} isAnalysing={isAnalysing} />
    </div>
  );
}

export default AnalysisResults;
