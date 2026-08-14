"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchConnections, Connection } from "../lib/api";

export default function ConnectionsPanel({
  login,
  type,
  onOpen,
  onClose,
}: {
  login: string;
  type: "followers" | "following";
  onOpen: (login: string) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<Connection[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchConnections(login, type)
      .then((data) => active && setItems(data))
      .catch((e) => active && setError(e instanceof Error ? e.message : "Failed."));
    return () => {
      active = false;
    };
  }, [login, type]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[70vh] w-full max-w-sm flex-col overflow-hidden rounded-lg border border-border bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5 font-mono text-xs">
          <span className="text-muted">
            {login}/{type}
          </span>
          <button onClick={onClose} className="text-muted hover:text-accent">
            esc ✕
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {error ? (
            <p className="p-2 text-sm text-[#ff7b72]">! {error}</p>
          ) : !items ? (
            <p className="p-2 text-sm text-muted">
              loading<span className="cursor-blink">_</span>
            </p>
          ) : items.length === 0 ? (
            <p className="p-2 text-sm text-muted">nobody here</p>
          ) : (
            <ul className="flex flex-col">
              {items.map((c) => (
                <li key={c.login}>
                  <button
                    onClick={() => onOpen(c.login)}
                    className="flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-left text-sm hover:bg-surface-2"
                  >
                    <Image
                      src={c.avatar_url}
                      alt=""
                      width={24}
                      height={24}
                      className="rounded-full border border-border"
                    />
                    <span className="truncate text-text">{c.login}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
