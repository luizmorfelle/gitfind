import { getOctokit } from "@/src/lib/github";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const login = req.nextUrl.searchParams.get("login")?.trim() ?? "";
  const type = req.nextUrl.searchParams.get("type") === "following" ? "following" : "followers";
  if (!login) {
    return NextResponse.json({ error: "Missing user login." }, { status: 400 });
  }

  try {
    const octokit = getOctokit();
    const res =
      type === "following"
        ? await octokit.request("GET /users/{username}/following", {
            username: login,
            per_page: 50,
          })
        : await octokit.request("GET /users/{username}/followers", {
            username: login,
            per_page: 50,
          });
    const items = (res.data as { login: string; avatar_url: string }[]).map((u) => ({
      login: u.login,
      avatar_url: u.avatar_url,
    }));
    return NextResponse.json(items);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return NextResponse.json({ error: "Could not load connections." }, { status });
  }
}
