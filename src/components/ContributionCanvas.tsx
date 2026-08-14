"use client";
import { useEffect, useRef } from "react";

// GitHub's contribution-graph greens, empty → brightest.
const LEVELS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
const CELL = 15;
const GAP = 4;
const STEP = CELL + GAP;

// A living contribution graph rendered on canvas. Reused as the loud home
// signature and, softened, as the app-wide background behind profiles.
export default function ContributionCanvas({
  className = "",
  opacity = 1,
  fps = 60,
}: {
  className?: string;
  opacity?: number;
  fps?: number;
}) {
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
    let last = 0;
    const frameGap = 1000 / fps;

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
          const dist = Math.hypot((c - cx) / cols, (r - cy) / rows);
          const intensity = (wave / 3) * 0.5 + 0.5 - dist * 0.5;
          const level = Math.max(0, Math.min(4, Math.round(intensity * 4)));
          ctx.fillStyle = LEVELS[level];
          ctx.beginPath();
          ctx.roundRect(c * STEP, r * STEP, CELL, CELL, 3);
          ctx.fill();
        }
      }
    };

    resize();
    if (reduced) {
      draw(0);
    } else {
      const start = performance.now();
      const loop = (now: number) => {
        if (now - last >= frameGap) {
          last = now;
          draw((now - start) / 1000);
        }
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
  }, [fps]);

  return <canvas ref={canvasRef} className={className} style={{ opacity }} aria-hidden />;
}
