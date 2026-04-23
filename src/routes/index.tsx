import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import type { Feature } from "geojson";
import type maplibregl from "maplibre-gl";
import { Loader2, AlertCircle } from "lucide-react";
import { useLakes } from "@/hooks/useLakes";
import { useAnalysis } from "@/hooks/useAnalysis";
const LakeMap = lazy(() => import("@/components/LakeMap").then((m) => ({ default: m.LakeMap })));
import { HeaderCard } from "@/components/HeaderCard";
import { LakeSearch } from "@/components/LakeSearch";
import { AnalysisPanel } from "@/components/AnalysisPanel";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { lakesData, loading, error, retry } = useLakes();
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

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-slate-100 text-slate-800"
      style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
    >
      {/* Centered map container, below search bar */}
      <div className="absolute inset-0 flex justify-center pt-40 pb-6 px-6 sm:pr-[440px]">
        <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
          {mounted && (
            <Suspense fallback={<div className="absolute inset-0 bg-slate-50" />}>
              <LakeMap
                lakesData={lakesData}
                selectedLakeId={selectedLakeId}
                onLakeClick={handleLakeSelect}
                mapRef={mapRef}
              />
            </Suspense>
          )}
        </div>
      </div>

      <HeaderCard lakeCount={lakesData?.features.length ?? 0} />
      <LakeSearch lakesData={lakesData} onLakeSelect={handleLakeSelect} />

      <AnalysisPanel
        lake={selectedLake}
        onClose={handlePanelClose}
        analysisResult={analysisResult}
        isAnalysing={isAnalysing}
        error={analysisError}
        onAnalyse={startAnalysis}
        onReset={reset}
      />

      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm pointer-events-none">
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-white shadow-md border border-slate-100 px-6 py-4 pointer-events-auto">
            <Loader2 className="animate-spin text-sky-500" size={24} />
            <div className="text-sm text-slate-600">Loading Bangalore lakes...</div>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
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
  );
}
