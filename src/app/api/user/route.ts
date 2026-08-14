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

type GhEvent = {
  type: string | null;
  repo?: { name: string };
  payload?: { size?: number; action?: string; ref_type?: string };
  created_at?: string | null;
};

// Turn the public event stream into terminal-log-style activity lines.
function describeEvent(e: GhEvent): { verb: string; repo: string; at: string } | null {
  const repo = e.repo?.name ?? "";
  const at = e.created_at ?? "";
  const p = e.payload ?? {};
  switch (e.type) {
    case "PushEvent":
      return { verb: `pushed ${p.size ?? 1} commit${(p.size ?? 1) === 1 ? "" : "s"} to`, repo, at };
    case "WatchEvent":
      return { verb: "starred", repo, at };
    case "ForkEvent":
      return { verb: "forked", repo, at };
    case "CreateEvent":
      return { verb: `created ${p.ref_type ?? "repo"}`, repo, at };
    case "PullRequestEvent":
      return { verb: `${p.action ?? "updated"} PR in`, repo, at };
    case "IssuesEvent":
      return { verb: `${p.action ?? "updated"} issue in`, repo, at };
    case "IssueCommentEvent":
      return { verb: "commented on", repo, at };
    case "ReleaseEvent":
      return { verb: "released", repo, at };
    case "PublicEvent":
      return { verb: "open-sourced", repo, at };
    default:
      return null;
  }
}

async function fetchActivity(octokit: Octo, login: string) {
  try {
    const res = await octokit.request("GET /users/{username}/events/public", {
      username: login,
      per_page: 30,
    });
    return (res.data as GhEvent[])
      .map(describeEvent)
      .filter((x): x is { verb: string; repo: string; at: string } => x !== null)
      .slice(0, 12);
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const login = req.nextUrl.searchParams.get("login")?.trim() ?? "";
  if (!login) {
    return NextResponse.json({ error: "Missing user login." }, { status: 400 });
  }

  try {
    const octokit = getOctokit();
    const [userRes, reposRes, profileReadme, contributions, activity] = await Promise.all([
      octokit.request("GET /users/{username}", { username: login }),
      // ponytail: first 100 repos only; totalStars/topLanguage/LanguageBar are
      // computed over this page, so heavy accounts under-report. Paginate if it matters.
      octokit.request("GET /users/{username}/repos", {
        username: login,
        sort: "updated",
        per_page: 100,
      }),
      fetchProfileReadme(octokit, login),
      fetchContributions(octokit, login),
      fetchActivity(octokit, login),
    ]);
    return NextResponse.json({
      user: userRes.data,
      repos: reposRes.data,
      profileReadme,
      contributions,
      activity,
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
