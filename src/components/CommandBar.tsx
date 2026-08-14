"use client";
import { useEffect, useRef, useState } from "react";

// Vim-style command mode. Press ":" anywhere to run: open <user>, vs <user>,
// or back. Keeps the whole app drivable without leaving the keyboard.
export default function CommandBar({
  onOpen,
  onBack,
  onRandom,
}: {
  onOpen: (login: string) => void;
  onBack: () => void;
  onRandom: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [hint, setHint] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === ":" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    setValue("");
    setHint("");
  }

  function run() {
    const [cmd, ...rest] = value.trim().split(/\s+/);
    const arg = rest.join(" ");
    if ((cmd === "open" || cmd === "o") && arg) onOpen(arg);
    else if (cmd === "back" || cmd === "b") onBack();
    else if (cmd === "random" || cmd === "r") onRandom();
    else {
      setHint("commands: open <user> · random · back");
      return;
    }
    close();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-accent-dim bg-surface">
      <div className="flex items-center gap-2 px-4 py-2 font-mono text-sm">
        <span className="text-accent">:</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") run();
            else if (e.key === "Escape") close();
          }}
          onBlur={close}
          placeholder="open <user> · random · back"
          spellCheck={false}
          className="w-full bg-transparent text-text caret-accent outline-none placeholder:text-muted"
        />
      </div>
      {hint && <p className="px-6 pb-2 text-xs text-[#ff7b72]">{hint}</p>}
    </div>
  );
}
