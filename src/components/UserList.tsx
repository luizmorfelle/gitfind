"use client";

export default function UserList({
  users,
  onSelect,
}: {
  users: any[];
  onSelect: (username: string) => void;
}) {
  return (
    <ul className="space-y-2">
      {users.map((u) => (
        <li
          key={u.id}
          onClick={() => onSelect(u.login)}
          className="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100"
        >
          <img
            src={u.avatar_url}
            alt={u.login}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="font-medium">{u.login}</div>
        </li>
      ))}
    </ul>
  );
}
