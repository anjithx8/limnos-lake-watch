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
        className="absolute top-4 left-4 z-40 rounded-full bg-card/90 backdrop-blur-sm shadow-md border border-border pl-3 pr-3.5 py-1.5 flex items-center gap-2 hover:bg-card transition-colors"
        aria-label="Show app info"
      >
        <span
          className="text-lg text-card-foreground leading-none"
          style={{ fontFamily: '"DM Serif Display", serif' }}
        >
          Limnos
        </span>
        <Info size={14} className="text-muted-foreground" />
      </button>
    );
  }

  return (
    <div className="absolute top-4 left-4 z-40 rounded-2xl bg-card/95 backdrop-blur-sm shadow-md border border-border px-4 py-3 w-[240px]">
      <div className="flex items-start justify-between">
        <div
          className="text-2xl text-card-foreground leading-none"
          style={{ fontFamily: '"DM Serif Display", serif' }}
        >
          Limnos
        </div>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="-mr-1 -mt-1 rounded-full p-1 text-muted-foreground hover:bg-muted"
          aria-label="Collapse"
        >
          <X size={14} />
        </button>
      </div>
      <div className="text-xs text-muted-foreground mt-1">Bangalore Lake Monitor</div>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-sky-300" />
          <span className="text-xs text-foreground">Lake</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-sky-500" />
          <span className="text-xs text-foreground">Selected</span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-2">{lakeCount} lakes monitored</div>
    </div>
  );
}

export default HeaderCard;
