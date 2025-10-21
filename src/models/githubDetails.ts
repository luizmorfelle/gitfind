import { GitHubRepo } from "./githubRepository";
import { GitHubUser } from "./githubUser";

export class GitHubDetails {
  user: GitHubUser | undefined;
  repos: GitHubRepo[] | [];

    constructor(data: Partial<GitHubDetails>) {
      this.repos = data.repos ?? [];
      this.user = data.user;
    }
}