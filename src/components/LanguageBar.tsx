import { GitHubRepo } from "../models/githubRepository";
import { languageColor } from "../lib/languageColors";

export default function LanguageBar({
  repos,
  onSelect,
}: {
  repos: GitHubRepo[];
  onSelect?: (lang: string) => void;
}) {
  const counts = new Map<string, number>();
  for (const r of repos) {
    if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <section>
      <p className="mb-2 text-xs text-muted">languages</p>
      <div className="flex h-2 overflow-hidden rounded-full">
        {sorted.map(([lang, count]) => (
          <span
            key={lang}
            style={{ width: `${(count / total) * 100}%`, backgroundColor: languageColor(lang) }}
            title={`${lang} · ${count}`}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        {sorted.slice(0, 6).map(([lang, count]) => (
          <button
            key={lang}
            onClick={() => onSelect?.(lang)}
            className="flex items-center gap-1.5 hover:text-text"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: languageColor(lang) }}
            />
            {lang}
            <span className="text-[10px] opacity-70">{Math.round((count / total) * 100)}%</span>
          </button>
        ))}
      </div>
    </section>
  );
}
