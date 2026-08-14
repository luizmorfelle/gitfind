"use client";
import { useEffect, useState } from "react";
import { fetchUser, UserPayload } from "../lib/api";
import { getCache, setCache } from "../lib/cache";
import RepoGrid from "./RepoGrid";
import UserDetails from "./UserDetails";
import ProfileReadme from "./ProfileReadme";
import LanguageBar from "./LanguageBar";
import ContributionGraph from "./ContributionGraph";
import ContributionStats from "./ContributionStats";
import ActivityFeed from "./ActivityFeed";
import AchievementBadges from "./AchievementBadges";
import TopRepos from "./TopRepos";
import ConnectionsPanel from "./ConnectionsPanel";
import ShareButton from "./ShareButton";
import { GitHubRepo } from "../models/githubRepository";
import { isFavorite, toggleFavorite } from "../lib/favorites";
import { pushHistory } from "../lib/history";
import { vibe } from "../lib/vibe";

function totalStars(repos: GitHubRepo[]): number {
  return repos.reduce((sum, r) => sum + r.stargazers_count, 0);
}

function topLanguage(repos: GitHubRepo[]): string | null {
  const counts = new Map<string, number>();
  for (const r of repos) {
    if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  }
  let best: string | null = null;
  let max = 0;
  for (const [lang, n] of counts) {
    if (n > max) {
      max = n;
      best = lang;
    }
  }
  return best;
}

export default function UserCard({
  login,
  onClose,
  onOpen,
}: {
  login: string;
  onClose: () => void;
  onOpen: (login: string) => void;
}) {
  const [data, setData] = useState<UserPayload | null>(null);
  const [error, setError] = useState("");
  const [connections, setConnections] = useState<"followers" | "following" | null>(null);
  const [pinned, setPinned] = useState(false);
  const [langFilter, setLangFilter] = useState<string | null>(null);

  useEffect(() => setPinned(isFavorite(login)), [login]);
  useEffect(() => setLangFilter(null), [login]);

  useEffect(() => {
    let active = true;
    setData(null);
    setError("");

    // Record every viewed user in history, regardless of how it was opened.
    const remember = (p: UserPayload) =>
      pushHistory({ login: p.user.login, name: p.user.name, avatar_url: p.user.avatar_url });

    const cacheKey = `user:${login}`;
    const cached = getCache<UserPayload>(cacheKey);
    if (cached) {
      setData(cached);
      remember(cached);
      return;
    }

    fetchUser(login)
      .then((payload) => {
        if (!active) return;
        setData(payload);
        setCache(cacheKey, payload);
        remember(payload);
      })
      .catch((e) => {
        if (active) setError(e instanceof Error ? e.message : "Failed to load user.");
      });

    return () => {
      active = false;
    };
  }, [login]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-border px-6 py-2.5 font-mono text-xs">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-muted transition-colors hover:text-accent"
        >
          <span aria-hidden>←</span> back
        </button>
        <span className="text-border">·</span>
        <span className="truncate text-muted">~/{login}</span>
        {data && (
          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={() => {
                toggleFavorite({
                  login: data.user.login,
                  name: data.user.name,
                  avatar_url: data.user.avatar_url,
                });
                setPinned((p) => !p);
              }}
              className={pinned ? "text-accent" : "text-muted hover:text-accent"}
            >
              {pinned ? "★ pinned" : "☆ pin"}
            </button>
            <ShareButton
              user={data.user}
              totalStars={totalStars(data.repos)}
              contributions={data.contributions?.total ?? 0}
            />
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        {error ? (
          <p className="text-sm text-[#ff7b72]">! {error}</p>
        ) : !data ? (
          <p className="text-sm text-muted">
            loading {login}
            <span className="cursor-blink">_</span>
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              <div className="flex min-w-0 flex-col gap-6 lg:flex-1">
                <UserDetails
                  user={data.user}
                  totalStars={totalStars(data.repos)}
                  topLanguage={topLanguage(data.repos)}
                  vibe={vibe(data.user, data.repos)}
                  onConnections={setConnections}
                />
                <AchievementBadges
                  user={data.user}
                  repos={data.repos}
                  contributions={data.contributions}
                />
              </div>
              <div className="flex shrink-0 flex-col gap-5 lg:w-[47%] xl:w-[520px]">
                <LanguageBar repos={data.repos} onSelect={setLangFilter} />
                {data.contributions && (
                  <div>
                    <ContributionGraph data={data.contributions} />
                    <ContributionStats data={data.contributions} />
                  </div>
                )}
              </div>
            </div>
            <TopRepos repos={data.repos} />
            {data.profileReadme && (
              <ProfileReadme login={data.user.login} markdown={data.profileReadme} />
            )}
            <RepoGrid
              repos={data.repos}
              owner={data.user.login}
              languageFilter={langFilter}
              onClearLanguageFilter={() => setLangFilter(null)}
            />
            <ActivityFeed activity={data.activity} />
          </>
        )}
      </div>

      {connections && (
        <ConnectionsPanel
          login={login}
          type={connections}
          onOpen={(l) => {
            setConnections(null);
            onOpen(l);
          }}
          onClose={() => setConnections(null)}
        />
      )}
    </div>
  );
}
