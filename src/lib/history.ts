// Recently opened users, newest first, persisted so the terminal keeps a
// command history between sessions.
export interface HistoryEntry {
  login: string;
  name: string | null;
  avatar_url: string;
}

const KEY = "gitfind:history";
const MAX = 8;

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as HistoryEntry[];
  } catch {
    return [];
  }
}

export function pushHistory(entry: HistoryEntry): HistoryEntry[] {
  const next = [entry, ...getHistory().filter((e) => e.login !== entry.login)].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("gitfind:store"));
  return next;
}

export function clearHistory(): void {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("gitfind:store"));
}
