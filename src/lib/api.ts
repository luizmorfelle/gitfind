import { GitHubUser } from "../models/githubUser";
import { GitHubRepo } from "../models/githubRepository";
import { GitHubUserSearch } from "../models/githubUserSearch";

export interface ContributionDay {
  color: string;
  count: number;
  date: string;
}

export interface Contributions {
  total: number;
  weeks: ContributionDay[][];
}

export interface ActivityEntry {
  verb: string;
  repo: string;
  at: string;
}

export interface UserPayload {
  user: GitHubUser;
  repos: GitHubRepo[];
  profileReadme: string | null;
  contributions: Contributions | null;
  activity: ActivityEntry[];
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function searchUsers(query: string): Promise<GitHubUserSearch[]> {
  return getJson(`/api/search?q=${encodeURIComponent(query)}`);
}

export function fetchUser(login: string): Promise<UserPayload> {
  return getJson(`/api/user?login=${encodeURIComponent(login)}`);
}

export interface Connection {
  login: string;
  avatar_url: string;
}

export function fetchConnections(
  login: string,
  type: "followers" | "following",
): Promise<Connection[]> {
  return getJson(`/api/connections?login=${encodeURIComponent(login)}&type=${type}`);
}

export async function fetchRepoReadme(owner: string, repo: string): Promise<string> {
  const res = await fetch(
    `/api/repo-readme?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
  );
  if (!res.ok) throw new Error("No README found for this repository.");
  return res.text();
}
