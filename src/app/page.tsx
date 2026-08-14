"use client";
import { useCallback, useEffect, useState } from "react";
import SearchBox from "../components/SearchBox";
import UserCard from "../components/UserCard";
import EmptyState from "../components/EmptyState";
import CompareView from "../components/CompareView";
import CommandBar from "../components/CommandBar";
import KeyboardHelp from "../components/KeyboardHelp";
import { randomNotable } from "../lib/notableUsers";

function paramsFromUrl(): { u: string | null; vs: string | null } {
  const p = new URLSearchParams(window.location.search);
  return { u: p.get("u"), vs: p.get("vs") };
}

export default function Page() {
  const [login, setLogin] = useState<string | null>(null);
  const [vs, setVs] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const { u, vs } = paramsFromUrl();
      setLogin(u);
      setVs(u ? vs : null);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const open = useCallback((next: string) => {
    setLogin(next);
    setVs(null);
    window.history.pushState(null, "", `?u=${encodeURIComponent(next)}`);
  }, []);

  const compare = useCallback(
    (other: string) => {
      // vs needs a base user already open; otherwise just open the target.
      if (!login) {
        open(other);
        return;
      }
      setVs(other);
      window.history.pushState(
        null,
        "",
        `?u=${encodeURIComponent(login)}&vs=${encodeURIComponent(other)}`,
      );
    },
    [login, open],
  );

  const clear = useCallback(() => {
    setLogin(null);
    setVs(null);
    window.history.pushState(null, "", window.location.pathname);
  }, []);

  return (
    <main className="flex h-screen flex-col sm:flex-row">
      <div className="h-2/5 shrink-0 sm:h-full sm:w-64 lg:w-72">
        <SearchBox onSelect={open} />
      </div>
      <div className="min-h-0 flex-1">
        {login && vs ? (
          <CompareView a={login} b={vs} onClose={clear} />
        ) : login ? (
          <UserCard login={login} onClose={clear} onOpen={open} onCompare={compare} />
        ) : (
          <EmptyState onSurprise={() => open(randomNotable())} />
        )}
      </div>
      <CommandBar
        onOpen={open}
        onVs={compare}
        onBack={clear}
        onRandom={() => open(randomNotable())}
      />
      <KeyboardHelp />
    </main>
  );
}
