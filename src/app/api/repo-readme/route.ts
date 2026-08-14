import { getOctokit } from "@/src/lib/github";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const owner = req.nextUrl.searchParams.get("owner")?.trim() ?? "";
  const repo = req.nextUrl.searchParams.get("repo")?.trim() ?? "";
  if (!owner || !repo) {
    return NextResponse.json({ error: "Missing owner/repo." }, { status: 400 });
  }

  try {
    const octokit = getOctokit();
    const res = await octokit.request("GET /repos/{owner}/{repo}/readme", {
      owner,
      repo,
      mediaType: { format: "raw" },
    });
    return new NextResponse(res.data as unknown as string, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return NextResponse.json({ error: "No README found." }, { status: 404 });
  }
}
