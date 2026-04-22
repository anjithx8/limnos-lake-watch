
# Limnos — Bangalore Lake Monitoring Dashboard

A single-page lake monitoring app for NGOs and researchers, with an interactive Bangalore map, lake search, and a slide-in analysis panel that simulates satellite-based water quality results.

## ⚠️ One framework note
Your spec asks for "plain React + Vite only," but this project is locked to **TanStack Start** (the only supported stack here). I'll deliver the **exact same app, components, behavior, and styling** as specified — just mounted inside a single TanStack route (`src/routes/index.tsx`) instead of a custom `main.tsx`. No routing, no auth, no extra pages. Functionally identical to your spec.

## What gets built

### Mock backend (no real server)
- `src/services/mockData.ts` — hardcoded GeoJSON for **Bellandur, Ulsoor, Agara, Hebbal, Sankey** lakes (5 polygons) with realistic Bangalore coordinates.
- `src/services/mockApi.ts`:
  - `fetchLakes()` — 1–2s delay, returns FeatureCollection
  - `triggerAnalysis()` — generates UUID, stores "processing" in memory
  - `fetchResults()` — returns "processing" for ~3s, then a "complete" result with randomized but realistic MNDWI, area deficit, macrophyte coverage, chlorophyll, cloud cover, dry/wet pipeline based on month

### Hooks
- `useLakes` — loads lakes on mount, returns `{ lakesData, loading, error }`
- `useAnalysis` — `startAnalysis`, polls every 1.5s until complete/error, exposes `reset()`

### Components (exact file structure from spec)
- **LakeMap** — MapLibre GL, OSM basemap, lake fill/outline/selected layers, hover popup, click-to-select, `fitBounds` on selection, Streets/Light basemap toggle (top-right)
- **HeaderCard** — top-left floating card: "Limnos" (DM Serif Display), subtitle, color legend, lake count
- **LakeSearch** — used **verbatim** as provided, top-center floating
- **AnalysisPanel** — right-side slide-in (420px desktop, bottom sheet 75vh on mobile): header, date range picker (default last 30 days, ≥7-day validation), Analyse button with spinner, PipelineChip, ResultCards for water area, boundary area, area deficit (red if >0), macrophyte %, chlorophyll, image date, cloud cover; empty/loading/error states
- **PipelineChip** — amber dry / blue wet pill
- **ResultCard** — icon + label + value + optional subvalue, red/green highlight support

### Styling & polish
- DM Sans + DM Serif Display loaded via Google Fonts
- Light scientific palette: white bg, sky-500 primary, teal-600 secondary, slate text
- Floating cards: `rounded-2xl`, `shadow-md`, `border-slate-100`, `backdrop-blur-sm`
- Indian locale (`en-IN`) number formatting throughout
- CSS transition for panel slide-in; map stays interactive while panel is open
- Centered loader on initial lake fetch; error card with Retry on failure

### Wiring
- `src/routes/index.tsx` mounts the full `App` (state for `selectedLakeId`, `selectedLake`, `isPanelOpen`, `mapRef`)
- MapLibre CSS imported once at app entry
- Page meta: title "Limnos — Bangalore Lake Monitor"

### Dependencies to add
`maplibre-gl` (and its types). `lucide-react` and `date-fns` are already installed.
