import { Contributions } from "../lib/api";

// The real GitHub contribution calendar — same greens the empty-state
// animation hints at, now backed by the user's actual commit history.
// GitHub's API always returns light-theme colors, so a day with no
// contributions comes back as #ebedf0 and reads as a white square against
// this dark UI. Empty days use the surface token instead.
export default function ContributionGraph({ data }: { data: Contributions }) {
  return (
    <section>
      <p className="mb-2 text-xs text-muted">
        contributions <span className="text-text">({data.total.toLocaleString()} this year)</span>
      </p>
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-[3px]">
          {data.weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <span
                  key={day.date}
                  title={`${day.count} on ${day.date}`}
                  className="h-[11px] w-[11px] rounded-[2px]"
                  style={{ backgroundColor: day.count ? day.color : "var(--color-surface)" }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
