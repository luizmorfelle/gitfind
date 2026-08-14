import { GitHubUser } from "../models/githubUser";
import { GitHubRepo } from "../models/githubRepository";
import { Contributions } from "../lib/api";

function compact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return String(n);
}

// Unlockable-style badges derived from public stats — a bit of gamified flair.
export default function AchievementBadges({
  user,
  repos,
  contributions,
}: {
  user: GitHubUser;
  repos: GitHubRepo[];
  contributions: Contributions | null;
}) {
  const stars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const years = Math.max(0, new Date().getFullYear() - new Date(user.created_at).getFullYear());
  const langs = new Set(repos.filter((r) => r.language).map((r) => r.language)).size;

  const badges: string[] = [];
  if (stars >= 1000) badges.push(`★ ${compact(stars)} stars`);
  if (user.followers >= 1000) badges.push(`◈ ${compact(user.followers)} followers`);
  if (contributions && contributions.total >= 1000)
    badges.push(`⚡ ${compact(contributions.total)} contributions`);
  if (user.public_repos >= 100) badges.push("⬢ 100+ repos");
  else if (user.public_repos >= 30) badges.push("⬢ prolific");
  if (langs >= 5) badges.push("❖ polyglot");
  if (years >= 8) badges.push(`⌂ ${years}y veteran`);
  else if (years >= 3) badges.push(`⌂ ${years}y on github`);

  if (badges.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-xs text-muted">achievements</p>
      <div className="flex flex-wrap gap-2">
        {badges.map((b) => (
          <span
            key={b}
            className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-text"
          >
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}
