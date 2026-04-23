import { useEffect, useMemo, useState } from "react";
import type { Feature } from "geojson";
import { X, Loader2 } from "lucide-react";
import { format, subDays, differenceInDays, parseISO } from "date-fns";
import type { AnalysisRequest } from "@/types";

interface AnalysisPanelProps {
  lake: Feature | null;
  onClose: () => void;
  isAnalysing: boolean;
  onAnalyse: (request: AnalysisRequest) => void;
}

const numberFormatter = new Intl.NumberFormat("en-IN");

export function AnalysisPanel({
  lake,
  onClose,
  isAnalysing,
  onAnalyse,
}: AnalysisPanelProps) {
  const today = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const defaultStart = useMemo(() => format(subDays(new Date(), 30), "yyyy-MM-dd"), []);
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(today);
  const [validationError, setValidationError] = useState<string | null>(null);

  const props = (lake?.properties ?? {}) as {
    lake_id?: string;
    name?: string;
    area_sqm?: number;
  };

  // reset dates when lake changes
  useEffect(() => {
    if (lake) {
      setStartDate(defaultStart);
      setEndDate(today);
      setValidationError(null);
    }
  }, [lake, defaultStart, today]);

  function handleAnalyse() {
    setValidationError(null);
    if (!props.lake_id) return;
    try {
      const s = parseISO(startDate);
      const e = parseISO(endDate);
      if (e <= s) {
        setValidationError("End date must be after start date.");
        return;
      }
      if (differenceInDays(e, s) < 7) {
        setValidationError("Date range must be at least 7 days.");
        return;
      }
    } catch {
      setValidationError("Invalid dates.");
      return;
    }
    onAnalyse({ lake_id: props.lake_id, start_date: startDate, end_date: endDate });
  }

  const open = lake !== null;

  return (
    <div
      className={`fixed z-20 overflow-y-auto transition-transform duration-300 ease-out
        sm:top-0 sm:right-0 sm:h-full sm:w-[420px] sm:rounded-none
        bottom-0 left-0 right-0 h-[55vh] rounded-t-2xl sm:rounded-t-none
        ${open ? "translate-y-0 sm:translate-x-0 bg-white shadow-2xl pointer-events-auto" : "translate-y-full sm:translate-y-0 sm:translate-x-full bg-transparent shadow-none pointer-events-none"}`}
      aria-hidden={!open}
    >
      {lake && (
        <div className="flex flex-col">
          {/* HEADER */}
          <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-slate-100">
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-slate-800 truncate">
                {props.name ?? "Lake"}
              </h2>
              <div className="text-xs text-slate-500 mt-0.5">
                {props.lake_id} ·{" "}
                {typeof props.area_sqm === "number"
                  ? `${numberFormatter.format(Math.round(props.area_sqm))} m²`
                  : "—"}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
              aria-label="Close panel"
            >
              <X size={18} />
            </button>
          </div>

          {/* DATE RANGE */}
          <div className="px-5 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-medium text-slate-600">Start Date</span>
                <input
                  type="date"
                  value={startDate}
                  max={endDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-600">End Date</span>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  max={today}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400"
                />
              </label>
            </div>
            {validationError && (
              <div className="text-xs text-red-500">{validationError}</div>
            )}

            <button
              type="button"
              onClick={handleAnalyse}
              disabled={isAnalysing}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 transition-colors"
            >
              {isAnalysing && <Loader2 size={16} className="animate-spin" />}
              {isAnalysing ? "Analysing..." : "Analyse"}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalysisPanel;
