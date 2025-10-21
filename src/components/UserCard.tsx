"use client";
import { useEffect, useState } from "react";
import { getOctokit } from "../lib/github";
import { getCache, setCache } from "../lib/cache";
import RepoGrid from "./RepoGrid";
import UserDetails from "./UserDetails";
import { GitHubUser } from "../models/githubUser";
import { GitHubRepo } from "../models/githubRepository";


export default function UserCard({ user }: { user: GitHubUser }) {
  const [details, setDetails] = useState<GitHubUser>();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const cacheKey = `user:${user.login}`;
      const cached = getCache(cacheKey);
      if (cached) {
        setDetails(cached.details);
        setRepos(cached.repos);
        return;
      }

      const octokit = getOctokit();
      const [userRes, reposRes] = await Promise.all([
        octokit.request("GET /users/{username}", { username: user.login ?? '' }),
        octokit.request("GET /users/{username}/repos", {
          username: user.login ?? '',
          sort: "updated",
          // per_page: 12,
        }),
      ]);

      const repos = reposRes.data as GitHubRepo[];
      const userData = userRes.data as GitHubUser;
      setDetails(userData);
      setRepos(repos);
      setCache(cacheKey, { details: userData, repos });
    };

    fetchData();
  }, [user]);

  if (!details) return <p>Carregando detalhes...</p>;

  return (
    <div className="flex flex-col gap-4 bg-[#2E3240] rounded-xl p-4 shadow-lg h-full">
      <UserDetails user={details} />
      <RepoGrid repos={repos} />
    </div>
  );
}
