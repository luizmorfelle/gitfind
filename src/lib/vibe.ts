import { GitHubUser } from "../models/githubUser";
import { GitHubRepo } from "../models/githubRepository";

// A playful, deterministic personality label derived purely from public stats.
// No AI, no randomness — same input always gives the same vibe.
export function vibe(user: GitHubUser, repos: GitHubRepo[]): string {
  const stars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const forks = repos.filter((r) => r.fork).length;
  const forkRatio = repos.length ? forks / repos.length : 0;
  const followRatio = user.following ? user.followers / user.following : user.followers;

  if (stars >= 50_000) return "open-source royalty";
  if (user.followers >= 20_000) return "certified rockstar";
  if (stars >= 5_000) return "star magnet";
  if (forkRatio >= 0.6 && repos.length >= 5) return "fork collector";
  if (user.public_repos >= 200) return "prolific builder";
  if (followRatio >= 20 && user.followers >= 500) return "the influencer";
  if (user.following >= 500 && followRatio < 1) return "friendly explorer";
  if (user.public_repos <= 2 && user.followers < 10) return "stealth mode";
  if (repos.length && stars < 5) return "quiet crafter";
  return "curious dev";
}
