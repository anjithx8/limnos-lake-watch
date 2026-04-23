import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import type { Feature, FeatureCollection, Polygon, MultiPolygon, Position } from "geojson";

interface LakeMapProps {
  lakesData: FeatureCollection | null;
  selectedLakeId: string | null;
  onLakeClick: (lakeId: string) => void;
  mapRef: React.MutableRefObject<maplibregl.Map | null>;
}

const BASEMAPS = {
  streets: {
    label: "Streets",
    tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
    attribution: "© OpenStreetMap contributors",
  },
  light: {
    label: "Light",
    tiles: ["https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"],
    attribution: "© OpenStreetMap contributors, Humanitarian OSM Team",
  },
} as const;

type BasemapKey = keyof typeof BASEMAPS;

function buildStyle(key: BasemapKey): maplibregl.StyleSpecification {
  const bm = BASEMAPS[key];
  return {
    version: 8,
    sources: {
      basemap: {
        type: "raster",
        tiles: [...bm.tiles],
        tileSize: 256,
        attribution: bm.attribution,
      },
    },
    layers: [{ id: "basemap", type: "raster", source: "basemap" }],
  };
}

function getBounds(geometry: Polygon | MultiPolygon): [[number, number], [number, number]] {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  const rings: Position[][] =
    geometry.type === "Polygon"
      ? geometry.coordinates
      : geometry.coordinates.flat();
  for (const ring of rings) {
    for (const [x, y] of ring) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  return [
    [minX, minY],
    [maxX, maxY],
  ];
}

export function LakeMap({ lakesData, selectedLakeId, onLakeClick, mapRef }: LakeMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const [basemap, setBasemap] = useState<BasemapKey>("streets");
  const [styleReady, setStyleReady] = useState(0);
  const onLakeClickRef = useRef(onLakeClick);
  onLakeClickRef.current = onLakeClick;

  // Init map once (delayed to ensure DOM is ready)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let map: maplibregl.Map | null = null;
    const timer = setTimeout(() => {
      if (!containerRef.current || mapRef.current) return;
      map = new maplibregl.Map({
        container: containerRef.current,
        style: buildStyle("streets"),
        center: [77.5946, 12.9716],
        zoom: 11,
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
      map.once("load", () => setStyleReady((n) => n + 1));
      mapRef.current = map;
    }, 100);
    return () => {
      clearTimeout(timer);
      if (map) {
        map.remove();
        mapRef.current = null;
      }
    };
  }, [mapRef]);

  // Switch basemap (skip first run since init already uses the default)
  const isFirstBasemap = useRef(true);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (isFirstBasemap.current) {
      isFirstBasemap.current = false;
      return;
    }
    const apply = () => {
      map.setStyle(buildStyle(basemap));
      map.once("styledata", () => setStyleReady((n) => n + 1));
    };
    if (map.isStyleLoaded()) {
      apply();
    } else {
      map.once("idle", apply);
    }
  }, [basemap, mapRef]);

  // Add lake layers when data + style ready
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !lakesData) return;
    if (!map.isStyleLoaded()) {
      const handler = () => addLayers();
      map.once("idle", handler);
      return () => {
        map.off("idle", handler);
      };
    }
    addLayers();

    function addLayers() {
      if (!map) return;
      if (map.getLayer("lakes-selected")) map.removeLayer("lakes-selected");
      if (map.getLayer("lakes-outline")) map.removeLayer("lakes-outline");
      if (map.getLayer("lakes-fill")) map.removeLayer("lakes-fill");
      if (map.getSource("lakes-source")) map.removeSource("lakes-source");

      map.addSource("lakes-source", { type: "geojson", data: lakesData! });
      map.addLayer({
        id: "lakes-fill",
        type: "fill",
        source: "lakes-source",
        paint: {
          "fill-color": "#0EA5E9",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.5,
            0.25,
          ],
        },
      });
      map.addLayer({
        id: "lakes-outline",
        type: "line",
        source: "lakes-source",
        paint: { "line-color": "#0EA5E9", "line-width": 1 },
      });
      map.addLayer({
        id: "lakes-selected",
        type: "fill",
        source: "lakes-source",
        filter: ["==", ["get", "lake_id"], selectedLakeId ?? "__none__"],
        paint: {
          "fill-color": "#0EA5E9",
          "fill-opacity": 0.8,
          "fill-outline-color": "#0EA5E9",
        },
      });

      let hoverId: string | number | null = null;
      const onEnter = (e: maplibregl.MapLayerMouseEvent) => {
        map.getCanvas().style.cursor = "pointer";
        const f = e.features?.[0];
        if (!f) return;
        const props = (f.properties ?? {}) as { name?: string; lake_id?: string };
        if (popupRef.current) popupRef.current.remove();
        popupRef.current = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 8,
        })
          .setLngLat(e.lngLat)
          .setHTML(
            `<div style="font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;color:#1E293B">${props.name ?? "Lake"}</div>`,
          )
          .addTo(map);
        if (f.id !== undefined) {
          hoverId = f.id as string | number;
          map.setFeatureState({ source: "lakes-source", id: hoverId }, { hover: true });
        }
      };
      const onMove = (e: maplibregl.MapLayerMouseEvent) => {
        if (popupRef.current) popupRef.current.setLngLat(e.lngLat);
      };
      const onLeave = () => {
        map.getCanvas().style.cursor = "";
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
        if (hoverId !== null) {
          map.setFeatureState({ source: "lakes-source", id: hoverId }, { hover: false });
          hoverId = null;
        }
      };
      const onClick = (e: maplibregl.MapLayerMouseEvent) => {
        const f = e.features?.[0];
        const props = (f?.properties ?? {}) as { lake_id?: string };
        if (props.lake_id) onLakeClickRef.current(props.lake_id);
      };

      map.on("mouseenter", "lakes-fill", onEnter);
      map.on("mousemove", "lakes-fill", onMove);
      map.on("mouseleave", "lakes-fill", onLeave);
      map.on("click", "lakes-fill", onClick);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lakesData, styleReady]);

  // Update selected filter + fly to bounds
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !lakesData) return;
    if (map.getLayer("lakes-selected")) {
      map.setFilter("lakes-selected", [
        "==",
        ["get", "lake_id"],
        selectedLakeId ?? "__none__",
      ]);
    }
    if (selectedLakeId) {
      const feature = lakesData.features.find(
        (f) => (f.properties as { lake_id?: string } | null)?.lake_id === selectedLakeId,
      ) as Feature<Polygon | MultiPolygon> | undefined;
      if (feature) {
        const bounds = getBounds(feature.geometry);
        map.fitBounds(bounds, { padding: 80, duration: 800, maxZoom: 16 });
      }
    }
  }, [selectedLakeId, lakesData, mapRef, styleReady]);

  return (
    <>
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute top-4 right-4 z-30 flex flex-col items-end gap-1">
        <div className="rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-slate-100 p-1 flex">
          {(Object.keys(BASEMAPS) as BasemapKey[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setBasemap(k)}
              title={
                k === "streets"
                  ? "Standard street map view"
                  : "Minimal light map view"
              }
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                basemap === k
                  ? "bg-sky-500 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {BASEMAPS[k].label}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-slate-500 bg-white/70 backdrop-blur-sm rounded px-1.5 py-0.5">
          Map style
        </span>
      </div>
    </>
  );
}

export default LakeMap;
