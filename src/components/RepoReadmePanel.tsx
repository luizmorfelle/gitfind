"use client";
import { useEffect, useState } from "react";
import { fetchRepoReadme } from "../lib/api";
import MarkdownReadme from "./MarkdownReadme";

export default function RepoReadmePanel({
  owner,
  repo,
  onClose,
}: {
  owner: string;
  repo: string;
  onClose: () => void;
}) {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchRepoReadme(owner, repo)
      .then((md) => active && setMarkdown(md))
      .catch((e) => active && setError(e instanceof Error ? e.message : "Failed."));
    return () => {
      active = false;
    };
  }, [owner, repo]);

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
        className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5 font-mono text-xs">
          <span className="truncate text-muted">
            {owner}/{repo} · README.md
          </span>
          <button onClick={onClose} className="shrink-0 text-muted hover:text-accent">
            esc ✕
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {error ? (
            <p className="text-sm text-[#ff7b72]">! {error}</p>
          ) : markdown === null ? (
            <p className="text-sm text-muted">
              loading<span className="cursor-blink">_</span>
            </p>
          ) : (
            <MarkdownReadme owner={owner} repo={repo} markdown={markdown} />
          )}
        </div>
      </div>
    </div>
  );
}
