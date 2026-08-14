"use client";
import { useEffect, useRef } from "react";
import BootLog from "./BootLog";

// GitHub's contribution-graph greens, empty → brightest.
const LEVELS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
const CELL = 15;
const GAP = 4;
const STEP = CELL + GAP;

// A living contribution graph: cells ripple through the five greens in a
// diagonal wave. It's the one signature moment for the empty right pane.
export default function EmptyState({ onSurprise }: { onSurprise: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cols = 0;
    let rows = 0;
    let raf = 0;

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / STEP);
      rows = Math.ceil(h / STEP);
    };

    const draw = (t: number) => {
      const { clientWidth: w, clientHeight: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      const cx = cols / 2;
      const cy = rows / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const wave =
            Math.sin(c * 0.55 + t) +
            Math.sin(r * 0.5 - t * 0.8) +
            Math.sin((c + r) * 0.4 + t * 1.3);
          // Fade toward the edges so the text stays readable in the middle.
          const dist = Math.hypot((c - cx) / cols, (r - cy) / rows);
          const intensity = (wave / 3) * 0.5 + 0.5 - dist * 0.5;
          const level = Math.max(0, Math.min(4, Math.round(intensity * 4)));
          ctx.fillStyle = LEVELS[level];
          roundRect(ctx, c * STEP, r * STEP, CELL, CELL, 3);
          ctx.fill();
        }
      }
    };

    resize();
    if (reduced) {
      draw(0);
    } else {
      const start = performance.now();
      const loop = () => {
        draw((performance.now() - start) / 1000);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    const observer = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0);
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-40"
        aria-hidden
      />
      <BootLog />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 48% at center, var(--color-bg) 0%, color-mix(in srgb, var(--color-bg) 82%, transparent) 42%, transparent 72%)",
        }}
      />
      <div className="relative flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="pixel-hero pixel-blink text-[clamp(2rem,7vw,4.5rem)] leading-none">
          gitfind
        </h1>
        <p className="pixel-hero text-[clamp(0.6rem,1.5vw,0.9rem)] leading-relaxed">
          find a github user<span className="cursor-blink">_</span>
        </p>
        <button
          onClick={onSurprise}
          className="mt-2 inline-flex items-center gap-2 rounded-md border border-border bg-surface/70 px-4 py-2 font-mono text-sm text-muted transition-colors hover:border-accent-dim hover:text-accent"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none" />
            <circle cx="16" cy="8" r="1.3" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
            <circle cx="8" cy="16" r="1.3" fill="currentColor" stroke="none" />
            <circle cx="16" cy="16" r="1.3" fill="currentColor" stroke="none" />
          </svg>
          surprise me
        </button>
      </div>
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}
