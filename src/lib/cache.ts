type CacheItem<T> = { value: T; expiry: number };

export function setCache<T>(key: string, value: T, ttl = 1000 * 60 * 5): void {
  if (typeof window === "undefined") return;
  const item: CacheItem<T> = { value, expiry: Date.now() + ttl };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  const item = JSON.parse(cached) as CacheItem<T>;
  if (Date.now() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}
