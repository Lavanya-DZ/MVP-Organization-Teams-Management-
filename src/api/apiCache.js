const ORGANIZATION_CACHE_TTL_MS = 30 * 1000;
const TEAM_CACHE_TTL_MS = 30 * 1000;

const organizationsCache = new Map();
const teamsCache = new Map();

const isFresh = (cacheEntry) =>
  Boolean(cacheEntry?.data && cacheEntry.expiresAt > Date.now());

const getWithCache = ({ cacheMap, cacheKey, ttlMs, forceRefresh, fetcher }) => {
  const existingEntry = cacheMap.get(cacheKey);

  if (!forceRefresh && isFresh(existingEntry)) {
    return Promise.resolve(existingEntry.data);
  }

  if (existingEntry?.promise) {
    return existingEntry.promise;
  }

  const requestPromise = fetcher()
    .then((data) => {
      cacheMap.set(cacheKey, {
        data,
        expiresAt: Date.now() + ttlMs,
        promise: null,
      });
      return data;
    })
    .catch((error) => {
      const currentEntry = cacheMap.get(cacheKey);
      if (currentEntry) {
        cacheMap.set(cacheKey, {
          ...currentEntry,
          promise: null,
        });
      }
      throw error;
    });

  cacheMap.set(cacheKey, {
    data: existingEntry?.data || null,
    expiresAt: existingEntry?.expiresAt || 0,
    promise: requestPromise,
  });

  return requestPromise;
};

export const makeTeamsCacheKey = (tokenKey, organizationId) =>
  `${tokenKey}::${organizationId}`;

export const getOrganizationsCached = ({ tokenKey, forceRefresh = false, fetcher }) =>
  getWithCache({
    cacheMap: organizationsCache,
    cacheKey: tokenKey,
    ttlMs: ORGANIZATION_CACHE_TTL_MS,
    forceRefresh,
    fetcher,
  });

export const getTeamsCached = ({ tokenKey, organizationId, forceRefresh = false, fetcher }) =>
  getWithCache({
    cacheMap: teamsCache,
    cacheKey: makeTeamsCacheKey(tokenKey, organizationId),
    ttlMs: TEAM_CACHE_TTL_MS,
    forceRefresh,
    fetcher,
  });

export const invalidateOrganizationsCache = (tokenKey) => {
  organizationsCache.delete(tokenKey);
};

export const invalidateTeamCache = (tokenKey, organizationId) => {
  teamsCache.delete(makeTeamsCacheKey(tokenKey, organizationId));
};

export const invalidateAllTeamCacheForToken = (tokenKey) => {
  const tokenPrefix = `${tokenKey}::`;
  Array.from(teamsCache.keys()).forEach((key) => {
    if (key.startsWith(tokenPrefix)) {
      teamsCache.delete(key);
    }
  });
};

export const resetApiCache = () => {
  organizationsCache.clear();
  teamsCache.clear();
};