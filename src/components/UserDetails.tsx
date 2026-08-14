"use client";

import Image from "next/image";
import { GitHubUser } from "../models/githubUser";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className="text-muted">
      <span className="font-bold text-text">{value.toLocaleString()}</span> {label}
    </span>
  );
}

export default function UserDetails({
  user,
  totalStars,
  topLanguage,
  onConnections,
}: {
  user: GitHubUser;
  totalStars: number;
  topLanguage: string | null;
  onConnections: (type: "followers" | "following") => void;
}) {
  const joined = new Date(user.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
  });

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <Image
        src={user.avatar_url}
        alt={user.login}
        width={96}
        height={96}
        priority
        className="h-24 w-24 rounded-lg border border-border"
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted">// profile</p>
        <h2 className="mt-1 text-2xl font-bold text-text">{user.name || user.login}</h2>
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

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <button onClick={() => onConnections("followers")} className="hover:text-accent">
            <Stat label="followers" value={user.followers} />
          </button>
          <button onClick={() => onConnections("following")} className="hover:text-accent">
            <Stat label="following" value={user.following} />
          </button>
          <Stat label="repos" value={user.public_repos} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-text">
            ★ {totalStars.toLocaleString()} earned
          </span>
          {topLanguage && (
            <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-text">
              mostly {topLanguage}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
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
