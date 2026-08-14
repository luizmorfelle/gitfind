"use client";
import BootLog from "./BootLog";
import ContributionCanvas from "./ContributionCanvas";

export default function EmptyState({ onSurprise }: { onSurprise: () => void }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <ContributionCanvas
        className="absolute inset-0 h-full w-full"
        opacity={0.4}
        fps={60}
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
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
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
