import { getOctokit } from "@/src/lib/github";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const octokit = getOctokit();
  const username = req.nextUrl.searchParams.get("username") || "";

  try {
    const result = await octokit.request("GET /search/users", {
      q: `${username} in:login`,
      per_page: 10,
    });

    return NextResponse.json(result.data.items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
