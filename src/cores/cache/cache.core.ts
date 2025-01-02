import { redis } from "../../configs";
import { ApiError } from "../error_handler";

// Set cache with TTL
export const setCache = async <T>(
  key: string,
  value: T,
  ttl: number
): Promise<void> => {
  try {
    const serializedValue = JSON.stringify(value);
    await redis.set(key, serializedValue, "EX", ttl);
  } catch (error) {
    throw new ApiError(500, "Error setting cache");
  }
};

// Get cache for a given key
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const cachedValue = await redis.get(key);
    return cachedValue ? (JSON.parse(cachedValue) as T) : null;
  } catch (error) {
    throw new ApiError(500, "Error getting cache");
  }
};

// Delete cache for a given key
export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redis.del(key);
  } catch (error) {
    throw new ApiError(500, "Error deleting cache");
  }
};

// Cache Database Query Utility
export const cacheDatabaseQuery = async <T>(
  cacheKey: string,
  ttl: number,
  fetchDbData: () => Promise<T>
): Promise<T> => {
  const cachedData = await getCache<T>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const dbData = await fetchDbData();
  await setCache(cacheKey, dbData, ttl);
  return dbData;
};

// Use SCAN instead of KEYS for pattern-based cache deletion to prevent blocking Redis in production
export const clearCacheByPattern = async (pattern: string): Promise<void> => {
  try {
    let cursor = "0";
    let result;
    do {
      result = await redis.scan(cursor, "MATCH", pattern);
      const keys = result[1];
      if (keys.length) {
        await redis.del(...keys);
      }
      cursor = result[0];
    } while (cursor !== "0");
  } catch (error) {
    throw new ApiError(500, "Error clearing cache by pattern");
  }
};

// Invalidate cache for a specific entity after update/delete
export const invalidateCacheAfterUpdate = async (
  entity: string,
  school_uid: string,
  itemId: string | undefined
): Promise<void> => {
  if (!itemId) return;

  const entityCacheKey = `${entity}:${school_uid}:${itemId}`;
  await deleteCache(entityCacheKey);

  const listCachePattern = `${entity}:${school_uid}:page:*:limit:*`;
  await clearCacheByPattern(listCachePattern);
};

// Generalized function to handle add/update/delete and cache invalidation
export const handleAddUpdateDelete = async (
  action: string,
  entity: string,
  school_uid: string,
  itemId: string | undefined,
  data: any = null
): Promise<void> => {
  if (!itemId) return;

  try {
    switch (action) {
      case "add":
      case "update":
        await setCache(`${entity}:${school_uid}:${itemId}`, data, 3600);
        await invalidateCacheAfterUpdate(entity, school_uid, itemId);
        break;
      case "delete":
        await deleteCache(`${entity}:${school_uid}:${itemId}`);
        await invalidateCacheAfterUpdate(entity, school_uid, itemId);
        break;
      default:
        break;
    }
  } catch (error) {
    throw new ApiError(500, `Error ${action}ing ${entity}`);
  }
};
