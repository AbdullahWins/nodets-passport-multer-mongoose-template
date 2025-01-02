import { redis } from "../../configs";

// Set cache with TTL
export const setCache = async <T>(
  key: string,
  value: T,
  ttl: number
): Promise<void> => {
  try {
    const serializedValue = JSON.stringify(value);
    console.log("Setting cache for key:", key);
    await redis.set(key, serializedValue, "EX", ttl);
  } catch (error) {
    console.error("Error setting cache:", error);
    // Optionally log or fallback to DB if Redis is down
  }
};

// Get cache for a given key
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const cachedValue = await redis.get(key);
    console.log("Getting cache for key:", key);
    return cachedValue ? (JSON.parse(cachedValue) as T) : null;
  } catch (error) {
    console.error("Error getting cache:", error);
    return null; // Optionally fallback to DB or similar
  }
};

// Delete cache for a given key
export const deleteCache = async (key: string): Promise<void> => {
  try {
    console.log("Deleting cache for key:", key);
    await redis.del(key);
  } catch (error) {
    console.error("Error deleting cache:", error);
  }
};

// Cache Database Query Utility
export const cacheDatabaseQuery = async <T>(
  cacheKey: string,
  ttl: number,
  fetchDbData: () => Promise<T>
): Promise<T> => {
  // Check if the data is already cached
  const cachedData = await getCache<T>(cacheKey);
  if (cachedData) {
    console.log("Cache hit for key:", cacheKey);
    return cachedData; // Return cached data
  }

  // Cache miss - fetch from database and set cache
  console.log("Cache miss for key:", cacheKey);
  const dbData = await fetchDbData();
  await setCache(cacheKey, dbData, ttl); // Set the fetched data in cache with TTL
  return dbData;
};

// Use SCAN instead of KEYS for pattern-based cache deletion to prevent blocking Redis in production
export const clearCacheByPattern = async (pattern: string): Promise<void> => {
  try {
    let cursor = "0"; // Start cursor for SCAN
    let result;
    do {
      result = await redis.scan(cursor, "MATCH", pattern);
      const keys = result[1];
      if (keys.length) {
        await redis.del(...keys);
      }
      cursor = result[0];
    } while (cursor !== "0"); // Continue until cursor returns to "0"
    console.log("Cleared cache for pattern:", pattern);
  } catch (error) {
    console.error("Error clearing cache by pattern:", error);
  }
};

// Invalidate cache for a specific entity after update/delete
export const invalidateCacheAfterUpdate = async (
  entity: string,
  school_uid: string,
  itemId: string | undefined
): Promise<void> => {
  if (!itemId) return;

  // Invalidate individual cache for the specific entity
  const entityCacheKey = `${entity}:${school_uid}:${itemId}`;
  await deleteCache(entityCacheKey);
  console.log(
    `Cache invalidated for ${entity} with ID ${itemId} at key: ${entityCacheKey}`
  );

  // Invalidate all paginated list caches for this entity
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
        // Add or update the cache for the specific entity and item ID
        await setCache(`${entity}:${school_uid}:${itemId}`, data, 3600); // 1 hour TTL
        await invalidateCacheAfterUpdate(entity, school_uid, itemId);
        break;
      case "delete":
        // Delete the cache for the specific entity and item ID
        await deleteCache(`${entity}:${school_uid}:${itemId}`);
        await invalidateCacheAfterUpdate(entity, school_uid, itemId);
        break;
      default:
        console.log("Invalid action");
        break;
    }
  } catch (error) {
    console.error("Error during cache update:", error);
  }
};
