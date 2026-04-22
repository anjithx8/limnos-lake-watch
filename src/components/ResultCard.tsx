interface ResultCardProps {
  icon: string;
  label: string;
  value: string;
  subvalue?: string;
  highlight?: "red" | "green" | "none";
}

export function ResultCard({ icon, label, value, subvalue, highlight = "none" }: ResultCardProps) {
  const valueColor =
    highlight === "red"
      ? "text-red-500"
      : highlight === "green"
        ? "text-emerald-500"
        : "text-slate-800";
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white border border-slate-100 shadow-sm p-3">
      <div className="text-2xl leading-none mt-0.5" aria-hidden="true">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-slate-500">{label}</div>
        <div className={`text-lg font-semibold ${valueColor}`}>{value}</div>
        {subvalue && <div className="text-xs text-slate-500 mt-0.5">{subvalue}</div>}
      </div>
    </div>
  );
}

export default ResultCard;
