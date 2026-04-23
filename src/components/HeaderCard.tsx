import { useState } from "react";
import { Info, X } from "lucide-react";

interface HeaderCardProps {
  lakeCount: number;
}

export function HeaderCard({ lakeCount }: HeaderCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="absolute top-4 left-4 z-40 rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-slate-100 pl-3 pr-3.5 py-1.5 flex items-center gap-2 hover:bg-white transition-colors"
        aria-label="Show app info"
      >
        <span
          className="text-lg text-slate-800 leading-none"
          style={{ fontFamily: '"DM Serif Display", serif' }}
        >
          Limnos
        </span>
        <Info size={14} className="text-slate-400" />
      </button>
    );
  }

  return (
    <div className="absolute top-4 left-4 z-40 rounded-2xl bg-white/95 backdrop-blur-sm shadow-md border border-slate-100 px-4 py-3 w-[240px]">
      <div className="flex items-start justify-between">
        <div
          className="text-2xl text-slate-800 leading-none"
          style={{ fontFamily: '"DM Serif Display", serif' }}
        >
          Limnos
        </div>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="-mr-1 -mt-1 rounded-full p-1 text-slate-400 hover:bg-slate-100"
          aria-label="Collapse"
        >
          <X size={14} />
        </button>
      </div>
      <div className="text-xs text-slate-500 mt-1">Bangalore Lake Monitor</div>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-sky-300" />
          <span className="text-xs text-slate-600">Lake</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-sky-500" />
          <span className="text-xs text-slate-600">Selected</span>
        </div>
      </div>
      <div className="text-xs text-slate-400 mt-2">{lakeCount} lakes monitored</div>
    </div>
  );
}

export default HeaderCard;
