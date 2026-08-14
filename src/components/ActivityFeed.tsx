import { ActivityEntry } from "../lib/api";

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// Public event stream rendered as terminal log lines — the profile's heartbeat.
export default function ActivityFeed({ activity }: { activity: ActivityEntry[] }) {
  if (activity.length === 0) return null;
  return (
    <section>
      <p className="mb-2 text-xs text-muted">recent activity</p>
      <div className="rounded-lg border border-border bg-bg p-3 font-mono text-[13px]">
        {activity.map((a, i) => (
          <p key={i} className="truncate py-0.5 text-muted">
            <span className="text-accent">&gt;</span> {a.verb}{" "}
            <a
              href={`https://github.com/${a.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text hover:text-accent"
            >
              {a.repo}
            </a>
            <span className="text-muted/60"> · {timeAgo(a.at)}</span>
          </p>
        ))}
      </div>
    </section>
  );
}
