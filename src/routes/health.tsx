import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Droplets, Leaf, Activity, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [
      { title: "Health — Limnos" },
      { name: "description", content: "Overview of lake health indicators and ecological status." },
      { property: "og:title", content: "Health — Limnos" },
      { property: "og:description", content: "Lake health indicators and ecological status." },
    ],
  }),
  component: HealthPage,
});

const indicators = [
  { icon: Droplets, title: "Water Quality", desc: "MNDWI and turbidity tracked across seasons.", value: "Good" },
  { icon: Leaf, title: "Vegetation Cover", desc: "NDVI of surrounding catchment area.", value: "Stable" },
  { icon: Activity, title: "Chlorophyll-a", desc: "Algal bloom risk indicator.", value: "Moderate" },
  { icon: AlertTriangle, title: "Encroachment", desc: "Change detection on lake boundary.", value: "Low" },
];

function HealthPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-32 pb-16 px-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            Lake Health
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            A holistic view of ecological indicators derived from satellite observations and field data.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {indicators.map(({ icon: Icon, title, desc, value }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {value}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
