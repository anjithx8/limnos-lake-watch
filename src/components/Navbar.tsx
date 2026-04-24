import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { to: "/", label: "Home" },
  { to: "/analysis", label: "Analysis" },
  { to: "/health", label: "Health" },
] as const;

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 px-6 pt-5">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/20 bg-black/30 px-6 py-3 backdrop-blur-md shadow-lg">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Limnos
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2 text-sm font-medium text-white/80 rounded-full transition-colors hover:text-white hover:bg-white/10"
              activeProps={{ className: "px-4 py-2 text-sm font-medium rounded-full bg-white text-slate-900" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <ThemeToggle />
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden mx-auto mt-3 flex max-w-6xl items-center justify-center gap-1 rounded-full border border-white/20 bg-black/30 px-2 py-2 backdrop-blur-md shadow-lg">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="px-3 py-1.5 text-xs font-medium text-white/80 rounded-full transition-colors hover:text-white hover:bg-white/10"
            activeProps={{ className: "px-3 py-1.5 text-xs font-medium rounded-full bg-white text-slate-900" }}
            activeOptions={{ exact: true }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
