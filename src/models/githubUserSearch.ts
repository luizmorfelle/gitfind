// A single row in the search results list.
export interface GitHubUserSearch {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  followers: number;
}
