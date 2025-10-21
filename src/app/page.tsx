"use client";
import { useState } from "react";
import SearchBox from "../components/SearchBox";
import UserCard from "../components/UserCard";
import { GitHubUser } from "../models/githubUser";


export default function Page() {
  const [selectedUser, setSelectedUser] = useState<GitHubUser>();

  return (
    <main className="min-h-screen h-screen flex flex-col sm:flex-row items-start justify-center gap-8 p-6 bg-[#252A34]">
      <div className="sm:w-1/3 w-full">
        <SearchBox onSelect={setSelectedUser} />
      </div>
      <div className="sm:w-2/3 w-full h-full">
        {selectedUser ? <UserCard user={selectedUser} /> : <p>Selecione um usuário...</p>}
      </div>
    </main>
  );
}
