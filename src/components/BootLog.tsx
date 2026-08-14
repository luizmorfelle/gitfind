"use client";
import { useEffect, useState } from "react";

// Generic-looking console output that fills the pane like a booting machine.
const LINES = [
  "$ gitfind --boot",
  "> loading kernel modules … ok",
  "> mount /dev/git … ok",
  "[  0.001] init: starting runtime v1.0.0",
  "[  0.014] net: resolving api.github.com …",
  "[  0.061] net: 140.82.121.6:443 connected",
  "> tls handshake … TLSv1.3 AES_256_GCM",
  "> GET /rate_limit … 200 (4998/5000)",
  "> graphql: schema fetch … 1.2MB cached",
  "npm run start",
  "  ▲ next start",
  "  ✓ ready in 312ms",
  "> compiling routes … 4/4",
  "  ○ /            static",
  "  ƒ /api/search  dynamic",
  "  ƒ /api/user    dynamic",
  "[  0.220] cache: warmed 128 keys",
  "> spawning workers … 8 threads",
  "worker[0] online   worker[1] online",
  "worker[2] online   worker[3] online",
  "> hydrating client bundle … 210kB",
  "> registering key handlers: / : ? ↑ ↓",
  "> GET /users/torvalds … 200 in 84ms",
  "> GET /users/torvalds/repos … 200",
  "> parsing contribution calendar … 371 days",
  "0xDEAD 0xBEEF 0xCAFE 0xF00D 0x1337",
  "sha256: 9f86d081884c7d659a2feaa0c55ad015",
  "commit a1b2c3d  refactor: trim payloads",
  "commit e4f5061  feat: terminal redesign",
  "> diff --stat 40 files +3830 -1891",
  "> lint … 0 errors  0 warnings",
  "> typecheck … ok",
  "> gc: freed 12.4MB in 3ms",
  "> heap 41MB / 128MB   rss 96MB",
  "[  0.512] scheduler: 0 tasks pending",
  "> websocket /_next/webpack-hmr … open",
  "GET 200  GET 200  GET 304  GET 200",
  "> render <EmptyState /> … 8ms",
  "> raf loop @60fps … stable",
  "GET 304  GET 200  GET 200  GET 304",
  "> prefetch /_next/static/chunks … ok",
  "> serviceWorker: skipped (dev)",
  "> env: NODE_ENV=production",
  "> octokit: @octokit/core v7.0.7",
  "> ratelimit core: 4998/5000 remaining",
  "> ratelimit graphql: 4991/5000",
  "info  - Loaded env from .env.local",
  "> image optimizer: sharp 0.33 ready",
  "> route /api/connections … registered",
  "> route /api/rate … registered",
  "trace  - build 3711 modules in 3.0s",
  "> memory: v8 heap snapshot skipped",
  "> tick 000123  drift 0.4ms",
  "> keepalive: 30s  pool: 8/16",
  "> flushing logs …",
  "> idle — press / to search",
  "> awaiting query_",
];

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
    }, 90);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 columns-1 gap-8 overflow-hidden p-4 font-mono text-[11px] leading-[1.35] text-muted/55 sm:columns-2 lg:columns-3"
    >
      {LINES.slice(0, shown).map((line, i) => (
        <p key={i} className="truncate">
          {line}
        </p>
      ))}
      {shown < LINES.length && <span className="cursor-blink text-accent/50">█</span>}
    </div>
  );
}
