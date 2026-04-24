interface PipelineChipProps {
  pipeline: "dry_season" | "wet_season" | null;
}

export function PipelineChip({ pipeline }: PipelineChipProps) {
  if (!pipeline) return null;
  if (pipeline === "dry_season") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 text-warning text-xs font-medium px-2.5 py-1">
        ☀️ Dry Season
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs font-medium px-2.5 py-1">
      🌧️ Wet Season
    </span>
  );
}

export default PipelineChip;
