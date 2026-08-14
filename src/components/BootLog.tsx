"use client";
import { useEffect, useState } from "react";

const LINES = [
  "> booting gitfind…",
  "> GET api.github.com … 200 ok",
  "> graphql handshake … ok",
  "> awaiting query_",
];

// Ambient boot sequence in the corner while the logo holds center stage.
export default function BootLog() {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(LINES.length);
      return;
    }
    const id = setInterval(() => {
      setShown((n) => {
        if (n >= LINES.length) {
          clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, 450);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-none absolute left-4 top-4 z-10 font-mono text-[11px] leading-relaxed text-muted">
      {LINES.slice(0, shown).map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}
