"use client";
import { useEffect, useState } from "react";

const SHORTCUTS: [string, string][] = [
  ["/", "focus search"],
  ["↑ ↓", "move selection"],
  ["enter", "open selected"],
  ["esc", "clear / close"],
  [":", "command mode"],
  [":open <user>", "open a user"],
  [":random", "surprise me"],
  ["?", "this help"],
];

export default function KeyboardHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "?" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xs rounded-lg border border-border bg-surface p-4 font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-3 text-xs uppercase tracking-wider text-muted">keyboard</p>
        <ul className="flex flex-col gap-1.5 text-sm">
          {SHORTCUTS.map(([key, desc]) => (
            <li key={key} className="flex items-center justify-between gap-4">
              <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 text-xs text-accent">
                {key}
              </kbd>
              <span className="text-muted">{desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
