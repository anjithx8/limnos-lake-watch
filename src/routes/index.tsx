import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import type { Feature } from "geojson";
import type maplibregl from "maplibre-gl";
import { Loader2, AlertCircle } from "lucide-react";
import { useLakes } from "@/hooks/useLakes";
import { useAnalysis } from "@/hooks/useAnalysis";
const LakeMap = lazy(() => import("@/components/LakeMap").then((m) => ({ default: m.LakeMap })));
import { LakeSearch } from "@/components/LakeSearch";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { ThemeToggle } from "@/components/theme-toggle";
import { AnalysisResults } from "@/components/AnalysisResults";
import { CitySwitcher, type City } from "@/components/CitySwitcher";

const CITY_CENTERS: Record<City, { center: [number, number]; zoom: number }> = {
  bangalore: { center: [77.5946, 12.9716], zoom: 11 },
  chintamani: { center: [78.0517, 13.4005], zoom: 13 },
};

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
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

  const handleLakeSelect = useCallback(
    (lakeId: string) => {
      reset();
      setSelectedLakeId(lakeId);
    },
    [reset],
  );

  const handlePanelClose = useCallback(() => {
    setSelectedLakeId(null);
    reset();
  }, [reset]);

  const handleCityChange = useCallback(
    (next: City) => {
      if (next === city) return;
      setSelectedLakeId(null);
      reset();
      setCity(next);
    },
    [city, reset],
  );

  const handleRetry = useCallback(() => {
    if (!analysisResult && !analysisError) return;
    reset();
  }, [reset, analysisResult, analysisError]);

  const panelOpen = selectedLake !== null;

  return (
    <>
      <img
        src="/lake-background.png"
        alt=""
        className="fixed inset-0 z-0 w-full h-full object-cover"
        style={{
          filter: 'brightness(0.7) contrast(1.1)',
        }}
      />
      <div
        className="fixed inset-0 z-0 w-full h-full bg-gradient-to-b from-blue-900/30 via-blue-800/40 to-slate-900/50"
      />
      <div
        className="relative min-h-screen w-screen overflow-x-hidden text-foreground z-10"
        style={{
          fontFamily: 'var(--font-body)',
        }}
      >
        {/* Map area: shifted right when panel is open on desktop */}
        <div
          className={`pt-[19rem] pb-6 px-6 transition-all duration-300 ${
            panelOpen ? "sm:pl-[440px] sm:pr-6" : "sm:px-6"
          }`}
        >
          <div className="mx-auto w-full max-w-5xl">
            <div className="relative w-full h-[60vh] min-h-[400px] rounded-2xl overflow-hidden shadow-lg border border-border bg-card">
            {mounted && (
              <Suspense fallback={<div className="absolute inset-0 bg-slate-50" />}>
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

          {/* Analysis results below the map */}
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

        {!panelOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 top-10 z-30 text-center px-4">
            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Limnos
            </h1>
            <h2 className="mx-auto mt-4 max-w-3xl text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              Track Lake Health Across Bangalore
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base sm:text-lg text-slate-100/95 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              Real-time insights on water levels, vegetation, and quality
            </p>
          </div>
        )}
        <ThemeToggle />
        <CitySwitcher city={city} onChange={handleCityChange} />
        <LakeSearch key={city} lakesData={lakesData} onLakeSelect={handleLakeSelect} />

      <AnalysisPanel
        lake={selectedLake}
        onClose={handlePanelClose}
        isAnalysing={isAnalysing}
        onAnalyse={startAnalysis}
      />

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm pointer-events-none">
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-white shadow-md border border-slate-100 px-6 py-4 pointer-events-auto">
            <Loader2 className="animate-spin text-sky-500" size={24} />
            <div className="text-sm text-slate-600">Loading lakes...</div>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white shadow-md border border-slate-100 px-6 py-5 max-w-sm text-center">
            <AlertCircle className="text-red-500" size={28} />
            <div className="text-sm text-slate-700">{error}</div>
            <button
              type="button"
              onClick={retry}
              className="rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-4 py-2"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
