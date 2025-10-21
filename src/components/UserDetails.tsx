"use client";

import { GitHubDetails } from "../models/githubDetails";
import { GitHubRepo } from "../models/githubRepository";
import { GitHubUser } from "../models/githubUser";

export default function UserDetails({user}: {user: GitHubUser}) {
  return (
    <div>
      <div className="flex flex-col items-center md:items-start mb-6">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-24 h-24 rounded-full mb-3"
        />
        <h2 className="text-xl font-bold">{user.name || user.login}</h2>
        <p className="text-gray-500">@{user.login}</p>
        {user.bio && <p className="mt-2 text-sm text-gray-700">{user.bio}</p>}
        <div className="flex gap-4 mt-3 text-sm text-gray-600">
          <span>👥 {user.followers} seguidores</span>
          <span>➡️ {user.following} seguindo</span>
        </div>
        {user.location && <p className="mt-1 text-sm">📍 {user.location}</p>}
      </div>

      <h3 className="text-lg font-semibold mb-2">Repositórios públicos</h3>
    </div>
  );
}
