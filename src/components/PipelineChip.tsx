interface PipelineChipProps {
  pipeline: "dry_season" | "wet_season" | null;
}

export function PipelineChip({ pipeline }: PipelineChipProps) {
  if (!pipeline) return null;
  if (pipeline === "dry_season") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1">
        ☀️ Dry Season
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1">
      🌧️ Wet Season
    </span>
  );
}

export default PipelineChip;
