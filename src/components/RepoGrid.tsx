"use client";
import { useMemo, useState } from "react";
import { GitHubRepo } from "../models/githubRepository";
import { languageColor } from "../lib/languageColors";

type Sort = "updated" | "stars";

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export default function RepoGrid({ repos }: { repos: GitHubRepo[] }) {
  const [sort, setSort] = useState<Sort>("updated");
  const [filter, setFilter] = useState("");

  const shown = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const list = q ? repos.filter((r) => r.name.toLowerCase().includes(q)) : repos;
    return [...list].sort((a, b) =>
      sort === "stars"
        ? b.stargazers_count - a.stargazers_count
        : new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
  }, [repos, sort, filter]);

  if (repos.length === 0) {
    return <p className="mt-6 text-sm text-muted">› no public repositories</p>;
  }

  return (
    <section className="mt-6">
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="text-xs text-muted">
          ~/repos <span className="text-text">({shown.length})</span>
        </p>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="grep name…"
          spellCheck={false}
          className="w-32 rounded border border-border bg-surface px-2 py-1 text-xs text-text caret-accent outline-none placeholder:text-muted focus:border-accent-dim"
        />
        <div className="ml-auto flex items-center gap-1 text-xs">
          <span className="text-muted">sort:</span>
          {(["updated", "stars"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={
                sort === s ? "text-accent" : "text-muted hover:text-text"
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid auto-rows-min gap-3 sm:grid-cols-2">
        {shown.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-3 transition-colors hover:border-accent-dim"
          >
            <h3 className="truncate font-bold text-accent">
              {repo.name}
              {repo.fork && <span className="ml-2 text-xs font-normal text-muted">fork</span>}
            </h3>
            <p className="line-clamp-2 flex-1 font-sans text-sm text-muted">
              {repo.description || "No description"}
            </p>
            {repo.topics && repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {repo.topics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-accent"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
              {repo.language && (
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: languageColor(repo.language) }}
                  />
                  {repo.language}
                </span>
              )}
              <span>★ {repo.stargazers_count.toLocaleString()}</span>
              <span>⑂ {repo.forks_count.toLocaleString()}</span>
              <span className="ml-auto">{timeAgo(repo.updated_at)}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
