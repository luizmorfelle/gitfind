// Pinned users — an explicit, persistent shortlist, separate from the
// automatic recent history.
export interface FavoriteEntry {
  login: string;
  name: string | null;
  avatar_url: string;
}

const KEY = "gitfind:favorites";

export function getFavorites(): FavoriteEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as FavoriteEntry[];
  } catch {
    return [];
  }
}

export function isFavorite(login: string): boolean {
  return getFavorites().some((f) => f.login === login);
}

export function toggleFavorite(entry: FavoriteEntry): FavoriteEntry[] {
  const current = getFavorites();
  const next = current.some((f) => f.login === entry.login)
    ? current.filter((f) => f.login !== entry.login)
    : [entry, ...current];
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("gitfind:store"));
  return next;
}
