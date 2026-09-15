type CachedResponse = Record<string, unknown>;
const memoryCache = new Map<string, CachedResponse>();

export function getCachedResponse(key: string) {
  return memoryCache.get(key);
}

export function setCachedResponse(key: string, response: CachedResponse) {
  memoryCache.set(key, response);
}
