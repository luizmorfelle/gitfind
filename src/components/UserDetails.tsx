"use client";

import Image from "next/image";
import { GitHubUser } from "../models/githubUser";

function StatTile({
  label,
  value,
  onClick,
}: {
  label: string;
  value: number;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <span className="text-lg font-bold text-text tabular-nums">{value.toLocaleString()}</span>
      <span className="text-[11px] uppercase tracking-wider text-muted">{label}</span>
    </>
  );
  const cls =
    "flex min-w-[84px] flex-col rounded-lg border border-border bg-surface px-3 py-2 text-left";
  return onClick ? (
    <button onClick={onClick} className={`${cls} transition-colors hover:border-accent-dim`}>
      {inner}
    </button>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export default function UserDetails({
  user,
  totalStars,
  topLanguage,
  vibe,
  onConnections,
}: {
  user: GitHubUser;
  totalStars: number;
  topLanguage: string | null;
  vibe: string;
  onConnections: (type: "followers" | "following") => void;
}) {
  const joined = new Date(user.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
  });

  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-start">
      <Image
        src={user.avatar_url}
        alt={user.login}
        width={132}
        height={132}
        priority
        className="h-28 w-28 shrink-0 rounded-xl border border-border shadow-[0_0_0_4px_var(--color-surface)] sm:h-32 sm:w-32"
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted">// profile</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="text-2xl font-bold text-text">{user.name || user.login}</h2>
          <span
            title="a playful label derived from public stats"
            className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] text-accent"
          >
            {vibe}
          </span>
          {topLanguage && (
            <span className="rounded-full border border-accent-dim/40 px-2 py-0.5 text-[11px] text-accent">
              mostly {topLanguage}
            </span>
          )}
        </div>
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-accent hover:underline"
        >
          @{user.login}
        </a>

        {user.bio && (
          <p className="mt-3 max-w-prose font-sans text-sm leading-relaxed text-text">
            {user.bio}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <StatTile
            label="followers"
            value={user.followers}
            onClick={() => onConnections("followers")}
          />
          <StatTile
            label="following"
            value={user.following}
            onClick={() => onConnections("following")}
          />
          <StatTile label="repos" value={user.public_repos} />
          <StatTile label="stars" value={totalStars} />
        </div>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
          {user.location && <span>◆ {user.location}</span>}
          {user.company && <span>⌂ {user.company}</span>}
          {user.twitter_username && <span>✦ @{user.twitter_username}</span>}
          {user.blog && (
            <a
              href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              ↗ {user.blog.replace(/^https?:\/\//, "")}
            </a>
          )}
          <span>◷ joined {joined}</span>
        </div>
      </div>
    </header>
  );
}
