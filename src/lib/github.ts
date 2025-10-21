import { Octokit } from "@octokit/core";

let octokitInstance: Octokit | null = null;

export function getOctokit(): Octokit {
  if (!octokitInstance) {
    octokitInstance = new Octokit({
      auth: process.env.GITHUB_TOKEN,
      userAgent: "gitfind"
    });
  }

  return octokitInstance;
}
