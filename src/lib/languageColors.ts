// GitHub's own linguist colors for the most common languages.
// Drives the repo cards' language dots — the detail that makes the
// list read as GitHub and not a generic card grid.
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Lua: "#000080",
  Scala: "#c22d40",
  Perl: "#0298c3",
  R: "#198CE7",
  Obj:"#438eff",
  "Jupyter Notebook": "#DA5B0B",
  Dockerfile: "#384d54",
  MDX: "#fcb32c",
};

export function languageColor(language: string | null | undefined): string {
  if (!language) return "#8b949e"; // muted, for "no language"
  return LANGUAGE_COLORS[language] ?? "#8b949e";
}
