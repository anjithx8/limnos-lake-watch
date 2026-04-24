import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import heroImage from "@/assets/hero-lake.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Limnos — Lake Health Monitoring" },
      { name: "description", content: "Track and analyze lake health across India with satellite-based insights." },
      { property: "og:title", content: "Limnos — Lake Health Monitoring" },
      { property: "og:description", content: "Real-time lake monitoring for NGOs and researchers." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img
        src={heroImage}
        alt="Aerial view of a lake surrounded by forested mountains at golden hour"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

      <Navbar />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1
          className="text-5xl sm:text-7xl md:text-8xl italic font-bold text-white leading-[1.05] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Sustainable Waters
          <br />
          Start Here
        </h1>
        <p className="mt-6 max-w-2xl text-base sm:text-lg text-white/90 italic font-light drop-shadow">
          Limnos brings satellite-grade insights on lake health to NGOs, researchers,
          and communities — so we can protect freshwater ecosystems together.
        </p>

        <Link
          to="/analysis"
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 shadow-xl transition-transform hover:scale-105"
        >
          Explore Analysis
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">→</span>
        </Link>
      </main>
    </div>
  );
}
