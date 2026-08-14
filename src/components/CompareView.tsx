"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchUser, UserPayload } from "../lib/api";

type Metric = { label: string; a: number; b: number };

function stars(p: UserPayload): number {
  return p.repos.reduce((s, r) => s + r.stargazers_count, 0);
}

export default function CompareView({
  a,
  b,
  onClose,
}: {
  a: string;
  b: string;
  onClose: () => void;
}) {
  const [data, setData] = useState<[UserPayload, UserPayload] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setData(null);
    setError("");
    Promise.all([fetchUser(a), fetchUser(b)])
      .then((pair) => active && setData(pair))
      .catch((e) => active && setError(e instanceof Error ? e.message : "Failed to load."));
    return () => {
      active = false;
    };
  }, [a, b]);

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
        <span className="truncate text-muted">
          {a} <span className="text-accent">vs</span> {b}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        {error ? (
          <p className="text-sm text-[#ff7b72]">! {error}</p>
        ) : !data ? (
          <p className="text-sm text-muted">
            loading duel<span className="cursor-blink">_</span>
          </p>
        ) : (
          <Duel a={data[0]} b={data[1]} />
        )}
      </div>
    </div>
  );
}

function Duel({ a, b }: { a: UserPayload; b: UserPayload }) {
  const metrics: Metric[] = [
    { label: "followers", a: a.user.followers, b: b.user.followers },
    { label: "following", a: a.user.following, b: b.user.following },
    { label: "public repos", a: a.user.public_repos, b: b.user.public_repos },
    { label: "stars earned", a: stars(a), b: stars(b) },
    {
      label: "contributions",
      a: a.contributions?.total ?? 0,
      b: b.contributions?.total ?? 0,
    },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        {[a, b].map((p) => (
          <div
            key={p.user.login}
            className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface p-4 text-center"
          >
            <Image
              src={p.user.avatar_url}
              alt={p.user.login}
              width={72}
              height={72}
              className="rounded-lg border border-border"
            />
            <p className="font-bold text-text">{p.user.name || p.user.login}</p>
            <p className="text-xs text-accent">@{p.user.login}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 divide-y divide-border rounded-lg border border-border">
        {metrics.map((m) => (
          <div key={m.label} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-2.5">
            <span
              className={`text-right text-sm tabular-nums ${
                m.a >= m.b ? "font-bold text-accent" : "text-muted"
              }`}
            >
              {m.a.toLocaleString()}
            </span>
            <span className="px-3 text-center text-[11px] uppercase tracking-wider text-muted">
              {m.label}
            </span>
            <span
              className={`text-left text-sm tabular-nums ${
                m.b >= m.a ? "font-bold text-accent" : "text-muted"
              }`}
            >
              {m.b.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
