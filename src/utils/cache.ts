interface CacheItem<T> {
  value: T;
  expiry: number;
}

export function getCache<T>(key: string): T | null {
  const item = localStorage.getItem(key);

  if (!item) {
    return null;
  }

  const parsed = JSON.parse(item) as CacheItem<T>;

  if (Date.now() > parsed.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return parsed.value;
}

export function setCache<T>(key: string, value: T, ttlMs: number) {
  const item: CacheItem<T> = {
    value,
    expiry: Date.now() + ttlMs,
  };

  localStorage.setItem(key, JSON.stringify(item));
}