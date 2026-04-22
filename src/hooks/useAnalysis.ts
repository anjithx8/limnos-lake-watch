import { useCallback, useEffect, useRef, useState } from "react";
import type { AnalysisRequest, AnalysisResult } from "@/types";
import { fetchResults, triggerAnalysis } from "@/services/api";

export function useAnalysis() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const startAnalysis = useCallback(
    async (request: AnalysisRequest) => {
      stopPolling();
      setError(null);
      setAnalysisResult(null);
      setIsAnalysing(true);
      try {
        const { analysis_id } = await triggerAnalysis(request);
        pollRef.current = setInterval(async () => {
          try {
            const result = await fetchResults(analysis_id);
            if (result.status === "complete") {
              stopPolling();
              setAnalysisResult(result);
              setIsAnalysing(false);
            } else if (result.status === "error") {
              stopPolling();
              setError(result.error_message ?? "Analysis failed");
              setAnalysisResult(result);
              setIsAnalysing(false);
            }
          } catch (e: unknown) {
            stopPolling();
            setError(e instanceof Error ? e.message : "Polling failed");
            setIsAnalysing(false);
          }
        }, 1500);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to start analysis");
        setIsAnalysing(false);
      }
    },
    [stopPolling],
  );

  const reset = useCallback(() => {
    stopPolling();
    setAnalysisResult(null);
    setError(null);
    setIsAnalysing(false);
  }, [stopPolling]);

  return { analysisResult, isAnalysing, error, startAnalysis, reset };
}
