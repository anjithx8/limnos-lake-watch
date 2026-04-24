import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import type { Feature } from "geojson";
import type maplibregl from "maplibre-gl";
import { Loader2, AlertCircle } from "lucide-react";
import { useLakes } from "@/hooks/useLakes";
import { useAnalysis } from "@/hooks/useAnalysis";
import { LakeSearch } from "@/components/LakeSearch";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { AnalysisResults } from "@/components/AnalysisResults";
import { CitySwitcher, type City } from "@/components/CitySwitcher";
import { Navbar } from "@/components/Navbar";

const LakeMap = lazy(() => import("@/components/LakeMap").then((m) => ({ default: m.LakeMap })));

const CITY_CENTERS: Record<City, { center: [number, number]; zoom: number }> = {
  bangalore: { center: [77.5946, 12.9716], zoom: 11 },
  chintamani: { center: [78.0517, 13.4005], zoom: 13 },
};

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "Analysis — Limnos" },
      { name: "description", content: "Explore lake metrics, water levels, and vegetation indices on the interactive map." },
      { property: "og:title", content: "Analysis — Limnos" },
      { property: "og:description", content: "Interactive lake monitoring dashboard." },
    ],
  }),
  component: AnalysisPage,
});

function AnalysisPage() {
  const [city, setCity] = useState<City>("bangalore");
  const { lakesData, loading, error, retry } = useLakes(city);
  const { analysisResult, isAnalysing, error: analysisError, startAnalysis, reset } = useAnalysis();

  const [selectedLakeId, setSelectedLakeId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const selectedLake = useMemo<Feature | null>(() => {
    if (!lakesData || !selectedLakeId) return null;
    return (
      (lakesData.features.find(
        (f) => (f.properties as { lake_id?: string } | null)?.lake_id === selectedLakeId,
      ) as Feature | undefined) ?? null
    );
  }, [lakesData, selectedLakeId]);

  const handleLakeSelect = useCallback((lakeId: string) => {
    reset();
    setSelectedLakeId(lakeId);
  }, [reset]);

  const handlePanelClose = useCallback(() => {
    setSelectedLakeId(null);
    reset();
  }, [reset]);

  const handleCityChange = useCallback((next: City) => {
    if (next === city) return;
    setSelectedLakeId(null);
    reset();
    setCity(next);
  }, [city, reset]);

  const handleRetry = useCallback(() => {
    if (!analysisResult && !analysisError) return;
    reset();
  }, [reset, analysisResult, analysisError]);

  const panelOpen = selectedLake !== null;

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      <Navbar />

      <div className={`pt-32 pb-10 px-6 transition-all duration-300 ${panelOpen ? "sm:pl-[440px] sm:pr-6" : ""}`}>
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              Lake Analysis
            </h1>
            <p className="mt-2 text-muted-foreground">Select a lake to view satellite-derived metrics.</p>
          </div>

          <div className="relative w-full h-[60vh] min-h-[400px] rounded-2xl overflow-hidden shadow-lg border border-border bg-card">
            {mounted && (
              <Suspense fallback={<div className="absolute inset-0 bg-muted" />}>
                <LakeMap
                  lakesData={lakesData}
                  selectedLakeId={selectedLakeId}
                  onLakeClick={handleLakeSelect}
                  mapRef={mapRef}
                  cityCenter={CITY_CENTERS[city]}
                />
              </Suspense>
            )}
          </div>

          {panelOpen && (
            <div className="mt-6">
              <AnalysisResults
                analysisResult={analysisResult}
                isAnalysing={isAnalysing}
                error={analysisError}
                onRetry={handleRetry}
                hasSelection={panelOpen}
              />
            </div>
          )}
        </div>
      </div>

      <CitySwitcher city={city} onChange={handleCityChange} />
      <LakeSearch key={city} lakesData={lakesData} onLakeSelect={handleLakeSelect} />

      <AnalysisPanel
        lake={selectedLake}
        onClose={handlePanelClose}
        isAnalysing={isAnalysing}
        onAnalyse={startAnalysis}
      />

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm pointer-events-none">
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-card shadow-md border border-border px-6 py-4 pointer-events-auto">
            <Loader2 className="animate-spin text-primary" size={24} />
            <div className="text-sm text-muted-foreground">Loading lakes...</div>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-card shadow-md border border-border px-6 py-5 max-w-sm text-center">
            <AlertCircle className="text-destructive" size={28} />
            <div className="text-sm text-foreground">{error}</div>
            <button
              type="button"
              onClick={retry}
              className="rounded-lg bg-primary hover:opacity-90 text-primary-foreground text-sm font-medium px-4 py-2"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
