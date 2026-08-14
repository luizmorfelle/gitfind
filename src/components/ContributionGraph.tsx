import { Contributions } from "../lib/api";

// The real GitHub contribution calendar — same greens the empty-state
// animation hints at, now backed by the user's actual commit history.
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
                  style={{ backgroundColor: day.color }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
