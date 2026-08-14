import { Contributions } from "../lib/api";
import { computeStreaks } from "../lib/streaks";

function Tile({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-surface px-3 py-2">
      <span className="text-lg font-bold text-accent tabular-nums">{value}</span>
      <span className="text-[11px] uppercase tracking-wider text-muted">{label}</span>
    </div>
  );
}

// "Wrapped"-style highlights derived from the contribution calendar.
export default function ContributionStats({ data }: { data: Contributions }) {
  const { current, longest, busiest, activeDays } = computeStreaks(data);
  const busiestLabel = busiest.date
    ? new Date(busiest.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "—";

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <Tile value={`${current}d`} label="current streak" />
      <Tile value={`${longest}d`} label="longest streak" />
      <Tile value={String(activeDays)} label="active days" />
      <Tile value={`${busiest.count} · ${busiestLabel}`} label="busiest day" />
    </div>
  );
}
