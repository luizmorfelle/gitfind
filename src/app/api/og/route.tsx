import { ImageResponse } from "next/og";
import { getOctokit } from "@/src/lib/github";
import { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Satori ships no monospace font, so `fontFamily: "monospace"` silently fell
// back to sans and the terminal card didn't read as a terminal. Read once per
// instance; next.config.ts traces the .ttf files into the deployment.
const fontDir = join(process.cwd(), "src/app/api/og/fonts");
const fonts = Promise.all([
  readFile(join(fontDir, "JetBrainsMono-Regular.ttf")),
  readFile(join(fontDir, "JetBrainsMono-Bold.ttf")),
]).then(([regular, bold]) => [
  { name: "JetBrains Mono", data: regular, weight: 400 as const, style: "normal" as const },
  { name: "JetBrains Mono", data: bold, weight: 700 as const, style: "normal" as const },
]);

type OgUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  followers: number;
  public_repos: number;
};

// Satori renders with Noto Sans and has no canvas, so the rain is built from
// plain spans using the ASCII half of MatrixRain's glyph set — katakana would
// come out as tofu boxes. Deterministic per login: the same card every time.
const CHARS = "0123456789<>[]{}/\\|=+*#$@ABCDEF";
const COLUMNS = 46;
const COLUMN_WIDTH = 1200 / COLUMNS;
const LINE_HEIGHT = 26;

function seedFrom(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// mulberry32 — tiny seeded PRNG, enough to place glyphs reproducibly.
function rng(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function MatrixBackdrop({ seed }: { seed: string }) {
  const rand = rng(seedFrom(seed));
  const columns = Array.from({ length: COLUMNS }, (_, i) => {
    const length = 8 + Math.floor(rand() * 14);
    const top = Math.floor(rand() * 760) - LINE_HEIGHT * length * 0.8;
    const glyphs = Array.from({ length }, () => CHARS[Math.floor(rand() * CHARS.length)]);
    return { i, top, glyphs };
  });

  return (
    <div style={{ display: "flex", position: "absolute", top: 0, left: 0, width: 1200, height: 630 }}>
      {columns.map(({ i, top, glyphs }) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            left: i * COLUMN_WIDTH,
            top,
          }}
        >
          {glyphs.map((char, g) => {
            // Head of the trail is brightest; the tail fades into the background.
            const depth = (g + 1) / glyphs.length;
            return (
              <span
                key={g}
                style={{
                  fontSize: 20,
                  lineHeight: `${LINE_HEIGHT}px`,
                  color: g === glyphs.length - 1 ? "#b9f6ca" : "#39d353",
                  opacity: 0.14 + depth * 0.62,
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export async function GET(req: NextRequest) {
  const login = req.nextUrl.searchParams.get("u")?.trim();
  let user: OgUser | null = null;
  if (login) {
    try {
      const res = await getOctokit().request("GET /users/{username}", { username: login });
      user = res.data as OgUser;
    } catch {
      user = null;
    }
  }

  const green = "#39d353";
  // Mono is far wider than the sans Satori used to fall back to, so a long
  // name would run off the card. 832px is what's left beside the avatar, and
  // JetBrains Mono advances 0.6em per glyph.
  const nameSize = (name: string) => Math.max(28, Math.min(64, Math.floor(832 / (name.length * 0.6))));
  const stat = (value: string, label: string) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontSize: 48, fontWeight: 700, color: "#e6edf3" }}>{value}</span>
      <span style={{ fontSize: 24, color: "#8b949e" }}>{label}</span>
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0d1117",
          padding: 64,
          fontFamily: "JetBrains Mono",
          position: "relative",
        }}
      >
        <MatrixBackdrop seed={login || "gitfind"} />
        {/* Scrim so the rain never fights the text for contrast. */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            background:
              "linear-gradient(90deg, rgba(13,17,23,0.9) 0%, rgba(13,17,23,0.74) 50%, rgba(13,17,23,0.3) 100%)",
          }}
        />
        <div style={{ display: "flex", color: green, fontSize: 34, fontWeight: 700 }}>
          gitfind ~ %
        </div>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar_url}
              width={200}
              height={200}
              alt=""
              style={{ borderRadius: 24, border: `4px solid ${green}` }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: nameSize(user.name || user.login), fontWeight: 700, color: "#e6edf3" }}>
                {user.name || user.login}
              </span>
              <span style={{ fontSize: 34, color: green }}>@{user.login}</span>
              <div style={{ display: "flex", gap: 56, marginTop: 20 }}>
                {stat(user.followers.toLocaleString(), "followers")}
                {stat(user.public_repos.toLocaleString(), "repos")}
              </div>
            </div>
          </div>
        ) : (
          <span style={{ fontSize: 72, fontWeight: 700, color: green }}>
            find any github user
          </span>
        )}
        <div style={{ display: "flex", color: "#8b949e", fontSize: 26 }}>KneadyCode · 2026</div>
      </div>
    ),
    { width: 1200, height: 630, fonts: await fonts },
  );
}
