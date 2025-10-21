export function setCache(key: string, value: any, ttl = 1000 * 60 * 5) {
  const item = { value, expiry: Date.now() + ttl };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getCache(key: string) {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  const item = JSON.parse(cached);
  if (Date.now() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}
