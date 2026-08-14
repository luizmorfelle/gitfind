"use client";
import { useEffect, useRef } from "react";

const CHARS = "アイウエオカキクケコサシスセソ0123456789<>[]{}/\\|=+*#$@ABCDEF";

// Classic green digital rain — the payoff for typing ":matrix".
export default function MatrixRain({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const font = 16;
    let columns = 0;
    let drops: number[] = [];
    let raf = 0;
    let last = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / font);
      drops = Array(columns).fill(1);
    };

    const draw = () => {
      ctx.fillStyle = "rgba(13, 17, 23, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#39d353";
      ctx.font = `${font}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(char, i * font, drops[i] * font);
        if (drops[i] * font > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    resize();
    const loop = (now: number) => {
      if (now - last >= 45) {
        last = now;
        draw();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("resize", resize);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] bg-bg" onClick={onClose}>
      <canvas ref={canvasRef} className="h-full w-full" />
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-accent/70">
        click or esc to exit
      </p>
    </div>
  );
}
