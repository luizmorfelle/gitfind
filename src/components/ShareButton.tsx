"use client";
import { useState } from "react";
import { GitHubUser } from "../models/githubUser";

// Draws a branded share card on a canvas (no external images, so it never
// taints) and downloads it as PNG; also copies the deep link.
function drawCard(user: GitHubUser, totalStars: number, contributions: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#0d1117";
  ctx.fillRect(0, 0, 1200, 630);
  ctx.fillStyle = "#161b22";
  ctx.fillRect(40, 40, 1120, 550);
  ctx.strokeStyle = "#30363d";
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, 1120, 550);

  ctx.fillStyle = "#39d353";
  ctx.font = "700 34px monospace";
  ctx.fillText("gitfind ~ %", 80, 120);

  ctx.fillStyle = "#e6edf3";
  ctx.font = "800 72px sans-serif";
  ctx.fillText(user.name || user.login, 80, 230);
  ctx.fillStyle = "#39d353";
  ctx.font = "400 36px monospace";
  ctx.fillText(`@${user.login}`, 80, 285);

  const stats: [string, string][] = [
    [user.followers.toLocaleString(), "followers"],
    [user.public_repos.toLocaleString(), "repos"],
    [totalStars.toLocaleString(), "stars"],
    [contributions.toLocaleString(), "contribs"],
  ];
  stats.forEach(([value, label], i) => {
    const x = 80 + i * 270;
    ctx.fillStyle = "#e6edf3";
    ctx.font = "800 52px sans-serif";
    ctx.fillText(value, x, 430);
    ctx.fillStyle = "#8b949e";
    ctx.font = "400 26px monospace";
    ctx.fillText(label, x, 465);
  });

  ctx.fillStyle = "#8b949e";
  ctx.font = "400 24px monospace";
  ctx.fillText("◆ KneadyCode · 2026", 80, 550);

  return canvas.toDataURL("image/png");
}

export default function ShareButton({
  user,
  totalStars,
  contributions,
}: {
  user: GitHubUser;
  totalStars: number;
  contributions: number;
}) {
  const [copied, setCopied] = useState(false);

  function share() {
    const url = `${window.location.origin}/?u=${encodeURIComponent(user.login)}`;
    navigator.clipboard?.writeText(url).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => undefined,
    );
    const dataUrl = drawCard(user, totalStars, contributions);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `gitfind-${user.login}.png`;
    a.click();
  }

  return (
    <button
      onClick={share}
      className="flex items-center gap-1.5 text-muted transition-colors hover:text-accent"
    >
      {copied ? "link copied ✓" : "↗ share"}
    </button>
  );
}
