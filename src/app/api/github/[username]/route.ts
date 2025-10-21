import { getOctokit } from "@/src/lib/github";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
) {
  const username = req.nextUrl.searchParams.get("username") || "";

  try {
    const octokit = getOctokit();
    const user = await octokit.request("GET /users/{username}", { username });
    const repos = await octokit.request("GET /users/{username}/repos", {
      username,
      per_page: 50,
      sort: "updated",
    });

    return NextResponse.json({
      user: user.data,
      repos: repos.data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
