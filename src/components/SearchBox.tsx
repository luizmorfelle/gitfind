"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { getCache, setCache } from "../lib/cache";
import { searchUsers } from "../lib/api";
import { getHistory, clearHistory, HistoryEntry } from "../lib/history";
import { getFavorites, FavoriteEntry } from "../lib/favorites";
import { GitHubUserSearch } from "../models/githubUserSearch";
import RateMeter from "./RateMeter";

type Status = "idle" | "typing" | "loading" | "done" | "error";

function compact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return String(n);
}

export default function SearchBox({ onSelect }: { onSelect: (login: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GitHubUserSearch[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep history + pinned in sync live: on mount, whenever the store changes
  // (pin/open from anywhere), and when the prompt returns to idle.
  useEffect(() => {
    const refresh = () => {
      setHistory(getHistory());
      setFavorites(getFavorites());
    };
    refresh();
    window.addEventListener("gitfind:store", refresh);
    return () => window.removeEventListener("gitfind:store", refresh);
  }, []);
  useEffect(() => {
    if (status === "idle") {
      setHistory(getHistory());
      setFavorites(getFavorites());
    }
  }, [status]);

  // "/" focuses the prompt from anywhere — terminal muscle memory.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setResults([]);
      setStatus(trimmed.length === 0 ? "idle" : "typing");
      return;
    }

    const cacheKey = `search:${trimmed}`;
    const cached = getCache<GitHubUserSearch[]>(cacheKey);
    if (cached) {
      setResults(cached);
      setStatus("done");
      return;
    }

    setStatus("loading");
    let active = true;
    const handler = setTimeout(async () => {
      try {
        const data = await searchUsers(trimmed);
        if (!active) return; // a newer query superseded this one
        setResults(data);
        setStatus("done");
        setCache(cacheKey, data);
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Search failed.");
        setStatus("error");
      }
    }, 500);

    return () => {
      active = false;
      clearTimeout(handler);
    };
  }, [query]);

  // The currently-shown selectable list: search results, else recent history.
  const items: HistoryEntry[] = useMemo(() => {
    if (results.length > 0) {
      return results.map((u) => ({ login: u.login, name: u.name, avatar_url: u.avatar_url }));
    }
    return status === "idle" ? history : [];
  }, [results, status, history]);

  useEffect(() => setActive(0), [items]);

  function select(entry: HistoryEntry) {
    // History is recorded centrally in UserCard on load, so every entry point
    // (search, command, deep link, connections) shows up — not just this one.
    onSelect(entry.login);
  }

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      if (items[active]) select(items[active]);
    } else if (e.key === "Escape") {
      setQuery("");
    }
  }

  return (
    <section className="flex h-full flex-col overflow-hidden border-border bg-surface font-mono text-[13px] sm:border-r">
      {/* Terminal title bar */}
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        <span className="ml-1 text-[11px] text-muted">gitfind — zsh</span>
      </div>

      {/* Prompt */}
      <div
        className="flex cursor-text items-center gap-1.5 border-b border-border px-3 py-2.5"
        onClick={() => inputRef.current?.focus()}
      >
        <span className="shrink-0 select-none font-bold text-accent">❯</span>
        <input
          ref={inputRef}
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder="find a user…  ( / )"
          spellCheck={false}
          className="w-full bg-transparent text-text caret-accent outline-none placeholder:text-muted"
        />
        {query.length === 0 && (
          <span className="cursor-blink -ml-1 h-4 w-[7px] shrink-0 bg-accent" aria-hidden />
        )}
      </div>

      {/* Output */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        {status === "typing" && <p className="px-1 text-muted">need ≥ 3 characters</p>}
        {status === "loading" && (
          <p className="px-1 text-muted">
            searching<span className="cursor-blink">_</span>
          </p>
        )}
        {status === "error" && <p className="px-1 text-[#ff7b72]">! {error}</p>}
        {status === "done" && results.length === 0 && (
          <p className="px-1 text-muted">no matches for “{query.trim()}”</p>
        )}

        {/* Search results */}
        {results.length > 0 && (
          <ul className="flex flex-col">
            {results.map((u, i) => (
              <li key={u.login}>
                <button
                  onClick={() =>
                    select({ login: u.login, name: u.name, avatar_url: u.avatar_url })
                  }
                  onMouseEnter={() => setActive(i)}
                  className={`group flex w-full items-center gap-2.5 rounded px-1.5 py-1.5 text-left ${
                    i === active ? "bg-surface-2" : ""
                  }`}
                >
                  <Image
                    src={u.avatar_url}
                    alt=""
                    width={24}
                    height={24}
                    className="rounded-full border border-border"
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate ${i === active ? "text-accent" : "text-text"}`}
                    >
                      {u.login}
                    </span>
                    {u.name && (
                      <span className="block truncate text-[11px] text-muted">{u.name}</span>
                    )}
                  </span>
                  <span className="shrink-0 text-[11px] text-muted">{compact(u.followers)} ★</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Pinned favorites (shown when the prompt is empty) */}
        {status === "idle" && favorites.length > 0 && (
          <div className="mb-2">
            <span className="block px-1.5 pb-1 pt-1 text-[11px] uppercase tracking-wider text-muted">
              pinned
            </span>
            <ul className="flex flex-col">
              {favorites.map((f) => (
                <li key={f.login}>
                  <button
                    onClick={() => select(f)}
                    className="group flex w-full items-center gap-2.5 rounded px-1.5 py-1.5 text-left hover:bg-surface-2"
                  >
                    <span className="text-accent">★</span>
                    <Image
                      src={f.avatar_url}
                      alt=""
                      width={20}
                      height={20}
                      className="rounded-full border border-border"
                    />
                    <span className="truncate text-text group-hover:text-accent">{f.login}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* History (shown when the prompt is empty) */}
        {status === "idle" && history.length > 0 && (
          <div>
            <div className="flex items-center justify-between px-1.5 pb-1 pt-1">
              <span className="text-[11px] uppercase tracking-wider text-muted">history</span>
              <button
                onClick={() => {
                  clearHistory();
                  setHistory([]);
                }}
                className="text-[11px] text-muted hover:text-[#ff7b72]"
              >
                clear
              </button>
            </div>
            <ul className="flex flex-col">
              {history.map((h, i) => (
                <li key={h.login}>
                  <button
                    onClick={() => select(h)}
                    onMouseEnter={() => setActive(i)}
                    className={`group flex w-full items-center gap-2.5 rounded px-1.5 py-1.5 text-left ${
                      i === active ? "bg-surface-2" : ""
                    }`}
                  >
                    <span className={i === active ? "text-accent" : "text-muted"}>↺</span>
                    <Image
                      src={h.avatar_url}
                      alt=""
                      width={20}
                      height={20}
                      className="rounded-full border border-border"
                    />
                    <span
                      className={`truncate ${i === active ? "text-text" : "text-muted"}`}
                    >
                      {h.login}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Status line — tmux-style, always visible. */}
      <footer className="flex items-center justify-between border-t border-border px-3 py-1.5 text-[11px] text-muted">
        <span>
          <span className="text-accent">◆</span> KneadyCode · 2026
        </span>
        <RateMeter />
      </footer>
    </section>
  );
}
