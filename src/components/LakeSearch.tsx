import { useEffect, useMemo, useRef, useState } from "react";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { Search, X } from "lucide-react";

interface LakeProperties {
  lake_id: string;
  name: string;
  area_sqm: number;
  centroid_lon: number;
  centroid_lat: number;
}

type LakeFeature = Feature<Geometry, Partial<LakeProperties>>;

interface LakeSearchProps {
  lakesData: FeatureCollection | null;
  onLakeSelect: (lakeId: string) => void;
}

const numberFormatter = new Intl.NumberFormat("en-IN");

export function LakeSearch({ lakesData, onLakeSelect }: LakeSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!lakesData || trimmed.length === 0) return [];
    return lakesData.features
      .filter((f: Feature) => {
        const props = (f.properties ?? {}) as Partial<LakeProperties>;
        const name = props.name ?? "";
        if (name.toLowerCase().startsWith("unnamed lake")) return false;
        const id = (props.lake_id ?? "").toLowerCase();
        return (
          name.toLowerCase().includes(trimmed) ||
          id.toLowerCase().includes(trimmed)
        );
      })
      .slice(0, 8) as LakeFeature[];
  }, [lakesData, query]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  function selectLake(lakeId: string) {
    onLakeSelect(lakeId);
    setQuery("");
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
      return;
    }
    if (event.key === "ArrowDown") {
      if (results.length === 0) return;
      event.preventDefault();
      setOpen(true);
      setActiveIndex((prev) => (prev + 1) % results.length);
      return;
    }
    if (event.key === "ArrowUp") {
      if (results.length === 0) return;
      event.preventDefault();
      setOpen(true);
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
      return;
    }
    if (event.key === "Enter") {
      if (results.length === 0) return;
      event.preventDefault();
      const idx = activeIndex >= 0 ? activeIndex : 0;
      const feature = results[idx];
      const props = (feature?.properties ?? {}) as Partial<LakeProperties>;
      if (props.lake_id) selectLake(props.lake_id);
    }
  }

  function clearQuery() {
    setQuery("");
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className="absolute left-1/2 -translate-x-1/2 top-60 z-40 w-[380px] max-w-[calc(100%-2rem)]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(e.target.value.length >= 1);
          }}
          onFocus={() => {
            if (query.length >= 1) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search lakes by name..."
          className="h-11 w-full rounded-full bg-background shadow-md border border-border pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring"
        />
        {query.length > 0 && (
          <button type="button" onClick={clearQuery} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full hover:bg-muted p-1 text-muted-foreground">
            <X size={16} />
          </button>
        )}
      </div>
      {open && query.length >= 1 && (
        <div className="mt-2 w-full rounded-2xl bg-popover shadow-lg border border-border overflow-hidden">
          {results.length > 0 ? (
            <ul id="lake-search-listbox" role="listbox" className="max-h-[360px] overflow-y-auto">
              {results.map((feature, i) => {
                const props = (feature.properties ?? {}) as Partial<LakeProperties>;
                const isActive = i === activeIndex;
                const area = typeof props.area_sqm === "number" ? numberFormatter.format(Math.round(props.area_sqm)) : "—";
                return (
                  <li
                    key={props.lake_id ?? i}
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      if (props.lake_id) selectLake(props.lake_id);
                    }}
                    className={`px-4 py-2.5 cursor-pointer ${isActive ? "bg-accent" : "hover:bg-muted"}`}
                  >
                    <div className="font-semibold text-foreground text-sm">{props.name}</div>
                    <div className="text-xs text-muted-foreground">{props.lake_id} · {area} m²</div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-muted-foreground italic">No lakes found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default LakeSearch;
