"use client";
import { useMemo, useState } from "react";
import { GitHubRepo } from "../models/githubRepository";
import { languageColor } from "../lib/languageColors";
import RepoReadmePanel from "./RepoReadmePanel";

type Sort = "updated" | "stars";
type Tab = "all" | "sources" | "forks";

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export default function RepoGrid({
  repos,
  owner,
  languageFilter,
  onClearLanguageFilter,
}: {
  repos: GitHubRepo[];
  owner: string;
  languageFilter: string | null;
  onClearLanguageFilter: () => void;
}) {
  const [sort, setSort] = useState<Sort>("updated");
  const [filter, setFilter] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [readmeRepo, setReadmeRepo] = useState<string | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const counts = useMemo(
    () => ({
      all: repos.length,
      sources: repos.filter((r) => !r.fork).length,
      forks: repos.filter((r) => r.fork).length,
    }),
    [repos],
  );

  const shown = useMemo(() => {
    const q = filter.trim().toLowerCase();
    let list = repos;
    if (tab === "sources") list = list.filter((r) => !r.fork);
    else if (tab === "forks") list = list.filter((r) => r.fork);
    if (languageFilter) list = list.filter((r) => r.language === languageFilter);
    if (q) list = list.filter((r) => r.name.toLowerCase().includes(q));
    return [...list].sort((a, b) =>
      sort === "stars"
        ? b.stargazers_count - a.stargazers_count
        : new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
  }, [repos, sort, filter, tab, languageFilter]);

  if (repos.length === 0) {
    return <p className="mt-6 text-sm text-muted">› no public repositories</p>;
  }

  function copyClone(repo: GitHubRepo) {
    navigator.clipboard
      ?.writeText(`git clone https://github.com/${owner}/${repo.name}.git`)
      .then(() => {
        setCopied(repo.id);
        setTimeout(() => setCopied((c) => (c === repo.id ? null : c)), 1500);
      }, () => undefined);
  }

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center gap-1 border-b border-border text-xs">
        {(["all", "sources", "forks"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-3 py-2 ${
              tab === t
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            {t} <span className="opacity-60">{counts[t]}</span>
          </button>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="text-xs text-muted">
          showing <span className="text-text">{shown.length}</span>
        </p>
        {languageFilter && (
          <button
            onClick={onClearLanguageFilter}
            className="flex items-center gap-1.5 rounded-full border border-accent-dim px-2 py-0.5 text-xs text-accent"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: languageColor(languageFilter) }}
            />
            {languageFilter} ✕
          </button>
        )}
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
              className={sort === s ? "text-accent" : "text-muted hover:text-text"}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid auto-rows-min gap-3 sm:grid-cols-2">
        {shown.map((repo) => (
          <div
            key={repo.id}
            className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-3 transition-colors hover:border-accent-dim"
          >
            <div className="flex items-center justify-between gap-2">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate font-bold text-accent hover:underline"
              >
                {repo.name}
                {repo.fork && <span className="ml-2 text-xs font-normal text-muted">fork</span>}
              </a>
              <div className="flex shrink-0 items-center gap-2 text-[11px] text-muted">
                <button onClick={() => setReadmeRepo(repo.name)} className="hover:text-accent">
                  readme
                </button>
                <button onClick={() => copyClone(repo)} className="hover:text-accent">
                  {copied === repo.id ? "copied ✓" : "clone"}
                </button>
              </div>
            </div>
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
          </div>
        ))}
      </div>

      {readmeRepo && (
        <RepoReadmePanel owner={owner} repo={readmeRepo} onClose={() => setReadmeRepo(null)} />
      )}
    </section>
  );
}
