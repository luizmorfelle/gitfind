import { getOctokit } from "@/src/lib/github";
import { NextRequest, NextResponse } from "next/server";

type Octo = ReturnType<typeof getOctokit>;

// The special repo whose name matches the login holds the profile README that
// GitHub renders at the top of the user's page.
async function fetchProfileReadme(octokit: Octo, login: string): Promise<string | null> {
  try {
    const res = await octokit.request("GET /repos/{owner}/{repo}/readme", {
      owner: login,
      repo: login,
      mediaType: { format: "raw" },
    });
    return res.data as unknown as string;
  } catch {
    return null; // no profile README — perfectly normal
  }
}

const CONTRIB_QUERY = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date color contributionCount } }
        }
      }
    }
  }
`;

type ContribGraph = {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: { contributionDays: { date: string; color: string; contributionCount: number }[] }[];
      };
    } | null;
  };
};

// GitHub returns the real theme color per day, so we reuse its palette as-is.
async function fetchContributions(octokit: Octo, login: string) {
  try {
    const data = await octokit.graphql<ContribGraph>(CONTRIB_QUERY, { login });
    const cal = data.user.contributionsCollection?.contributionCalendar;
    if (!cal) return null;
    return {
      total: cal.totalContributions,
      weeks: cal.weeks.map((w) =>
        w.contributionDays.map((d) => ({
          color: d.color,
          count: d.contributionCount,
          date: d.date,
        })),
      ),
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const login = req.nextUrl.searchParams.get("login")?.trim() ?? "";
  if (!login) {
    return NextResponse.json({ error: "Missing user login." }, { status: 400 });
  }

  try {
    const octokit = getOctokit();
    const [userRes, reposRes, profileReadme, contributions] = await Promise.all([
      octokit.request("GET /users/{username}", { username: login }),
      octokit.request("GET /users/{username}/repos", {
        username: login,
        sort: "updated",
        per_page: 100,
      }),
      fetchProfileReadme(octokit, login),
      fetchContributions(octokit, login),
    ]);
    return NextResponse.json({
      user: userRes.data,
      repos: reposRes.data,
      profileReadme,
      contributions,
    });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    const message =
      status === 404
        ? "User not found."
        : status === 403
          ? "GitHub rate limit reached. Try again in a minute."
          : "Could not reach GitHub. Try again.";
    return NextResponse.json({ error: message }, { status });
  }
}
