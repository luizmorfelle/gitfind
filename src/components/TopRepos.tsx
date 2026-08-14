import { GitHubRepo } from "../models/githubRepository";
import { languageColor } from "../lib/languageColors";

// The user's most-starred repositories — GitHub's "pinned" idea, auto-picked.
export default function TopRepos({ repos }: { repos: GitHubRepo[] }) {
  const top = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 3);
  if (top.length === 0 || top[0].stargazers_count === 0) return null;

  return (
    <section className="mt-6">
      <p className="mb-2 text-xs text-muted">top repositories</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {top.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-3 transition-colors hover:border-accent-dim"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-bold text-accent">{repo.name}</span>
              <span className="shrink-0 text-xs text-muted">
                ★ {repo.stargazers_count.toLocaleString()}
              </span>
            </div>
            <p className="line-clamp-1 font-sans text-sm text-muted">
              {repo.description || "No description"}
            </p>
            {repo.language && (
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: languageColor(repo.language) }}
                />
                {repo.language}
              </span>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
