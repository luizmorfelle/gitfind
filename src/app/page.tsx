"use client";
import { useCallback, useEffect, useState } from "react";
import SearchBox from "../components/SearchBox";
import UserCard from "../components/UserCard";
import EmptyState from "../components/EmptyState";
import CommandBar from "../components/CommandBar";
import KeyboardHelp from "../components/KeyboardHelp";
import { randomNotable } from "../lib/notableUsers";

function loginFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get("u");
}

export default function Page() {
  const [login, setLogin] = useState<string | null>(null);
  const [mobileSearch, setMobileSearch] = useState(false);

  useEffect(() => {
    setLogin(loginFromUrl());
    const onPop = () => setLogin(loginFromUrl());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const open = useCallback((next: string) => {
    setLogin(next);
    setMobileSearch(false);
    window.history.pushState(null, "", `?u=${encodeURIComponent(next)}`);
  }, []);

  const clear = useCallback(() => {
    setLogin(null);
    window.history.pushState(null, "", window.location.pathname);
  }, []);

  return (
    <main className="relative flex h-screen flex-col sm:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden shrink-0 sm:block sm:h-full sm:w-64 lg:w-72">
        <SearchBox onSelect={open} />
      </aside>

      {/* Content */}
      <div className="min-h-0 flex-1">
        {login ? (
          <UserCard login={login} onClose={clear} onOpen={open} />
        ) : (
          <EmptyState onSurprise={() => open(randomNotable())} />
        )}
      </div>

      {/* Mobile: floating trigger that opens search, then gets out of the way */}
      <button
        onClick={() => setMobileSearch(true)}
        className="fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-accent-dim bg-surface px-5 py-2.5 font-mono text-sm text-accent shadow-lg sm:hidden"
      >
        <span aria-hidden>❯</span> search a user
      </button>

      {/* Mobile: full-screen search drawer */}
      {mobileSearch && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <SearchBox onSelect={open} />
          <button
            onClick={() => setMobileSearch(false)}
            className="fixed right-3 top-2.5 z-50 font-mono text-sm text-muted hover:text-accent"
          >
            esc ✕
          </button>
        </div>
      )}

      <CommandBar onOpen={open} onBack={clear} onRandom={() => open(randomNotable())} />
      <KeyboardHelp />
    </main>
  );
}
