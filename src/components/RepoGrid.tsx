import { GitHubRepo } from "../models/githubRepository";

export default function RepoGrid({ repos }: { repos: GitHubRepo[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full overflow-y-auto px-2">
      {repos.map((repo) => (
        <a
          key={repo.id}
          href={repo.html_url ?? ''}
          target="_blank"
          className="bg-[#252A34] max-h-[20vh] border border-[#08D9D6] rounded-lg p-3 hover:bg-[#303548] transition flex flex-col gap-2"
        >
          <h3 className="text-[#08D9D6] font-bold">{repo.name}</h3>
          <p className="text-sm text-white">{repo.description || "Sem descrição"}</p>
          <div className="flex gap-2 mt-2">
            {repo.language && (
              <span className="text-xs bg-[#08D9D6] text-black px-2 py-1 rounded-full">
                {repo.language}
              </span>
            )}
            <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded-full">
              ⭐ {repo.stargazers_count}
            </span>
            <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded-full">
              🍴 {repo.forks_count}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
