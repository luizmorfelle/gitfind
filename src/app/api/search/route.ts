import { getOctokit } from "@/src/lib/github";
import { NextRequest, NextResponse } from "next/server";

// GraphQL lets us pull name + follower count in a single request, instead of
// the REST search (login only) plus one /users call per result.
const SEARCH_QUERY = `
  query ($q: String!) {
    search(query: $q, type: USER, first: 10) {
      nodes {
        ... on User {
          login
          name
          avatarUrl
          url
          followers { totalCount }
        }
      }
    }
  }
`;

type GraphNode = {
  login?: string;
  name?: string | null;
  avatarUrl?: string;
  url?: string;
  followers?: { totalCount: number };
};

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 3) {
    return NextResponse.json([]);
  }

  try {
    const octokit = getOctokit();
    // Sort by followers so the notable account surfaces first for common handles.
    const data = await octokit.graphql<{ search: { nodes: GraphNode[] } }>(SEARCH_QUERY, {
      q: `${q} in:login sort:followers-desc`,
    });

    const items = data.search.nodes
      .filter((n): n is Required<GraphNode> => Boolean(n.login))
      .map((n) => ({
        login: n.login,
        name: n.name ?? null,
        avatar_url: n.avatarUrl,
        html_url: n.url,
        followers: n.followers?.totalCount ?? 0,
      }));
    return NextResponse.json(items);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    const message =
      status === 403
        ? "GitHub rate limit reached. Try again in a minute."
        : "Could not reach GitHub. Try again.";
    return NextResponse.json({ error: message }, { status });
  }
}
