export type City = "bangalore" | "chintamani";

interface CitySwitcherProps {
  city: City;
  onChange: (city: City) => void;
}

const CITIES: { id: City; label: string }[] = [
  { id: "bangalore", label: "Bangalore" },
  { id: "chintamani", label: "Chintamani" },
];

export function CitySwitcher({ city, onChange }: CitySwitcherProps) {
  return (
    <div className="absolute top-4 left-44 z-40 rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-slate-100 p-1 flex">
      {CITIES.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onChange(c.id)}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
            city === c.id
              ? "bg-sky-500 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

export default CitySwitcher;
