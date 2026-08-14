import { getOctokit } from "@/src/lib/github";
import { NextResponse } from "next/server";

// GET /rate_limit is free (doesn't consume quota) — perfect for the meter.
export async function GET() {
  try {
    const octokit = getOctokit();
    const res = await octokit.request("GET /rate_limit");
    const core = res.data.resources.core;
    return NextResponse.json({ remaining: core.remaining, limit: core.limit });
  } catch {
    return NextResponse.json({ remaining: null, limit: null });
  }
}
