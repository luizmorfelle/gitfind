"use client";
import { useState } from "react";
import SearchBox from "../components/SearchBox";
import UserCard from "../components/UserCard";
import { GitHubUser } from "../models/githubUser";


export default function Page() {
  const [selectedUser, setSelectedUser] = useState<GitHubUser>();
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen max-h-screen h-screen flex flex-col sm:flex-row items-start justify-center bg-[#252A34]">
      <div className="sm:w-1/3 w-full sm:h-full h-1/12">
        <SearchBox onSelect={setSelectedUser} onLoadingChange={setLoading} />
      </div>
      <div className="sm:w-2/3 w-full sm:h-full h-11/12 sm:p-4 p-0">
        {loading ? (
          <p className="p-6">Carregando...</p>
        ) : selectedUser ? (
          <UserCard user={selectedUser} />
        ) : (
          <p className="p-6">Selecione um usuário...</p>
        )}
      </div>
    </main>
  );
}
