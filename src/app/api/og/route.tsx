import { ImageResponse } from "next/og";
import { getOctokit } from "@/src/lib/github";
import { NextRequest } from "next/server";

type OgUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  followers: number;
  public_repos: number;
};

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
          fontFamily: "monospace",
        }}
      >
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
              <span style={{ fontSize: 64, fontWeight: 800, color: "#e6edf3" }}>
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
          <span style={{ fontSize: 72, fontWeight: 800, color: green }}>
            find any github user
          </span>
        )}
        <div style={{ display: "flex", color: "#8b949e", fontSize: 26 }}>KneadyCode · 2026</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
