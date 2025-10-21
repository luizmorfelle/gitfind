import { getOctokit } from "@/src/lib/github";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  const octokit = getOctokit();
  const { username } = params;

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
