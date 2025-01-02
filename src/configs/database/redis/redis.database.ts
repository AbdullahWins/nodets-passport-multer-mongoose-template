//src/configs/database/redis.config.ts
import Redis from "ioredis";
import { errorLogger, infoLogger } from "../../../cores";
import { environment } from "../../environment";

let retryAttempts = 0;

//export redis instance
export const redis = new Redis(environment.db.REDIS_URI, {
  retryStrategy: (times) => {
    retryAttempts++;
    if (retryAttempts >= 3) {
      errorLogger.error(
        `Redis retry failed after ${retryAttempts} attempts. No more retries.`
      );
      return null;
    }
    const delay = Math.min(times * 100, 2000);
    errorLogger.warn(`Retrying Redis connection in ${delay}ms...`);
    return delay;
  },
});

//handle Redis errors
redis.on("error", (err) => {
  errorLogger.error(`Redis error: ${err.message}`);
});

//handle Redis connection retries
redis.on("reconnecting", (time: number) => {
  errorLogger.warn(`Reconnecting to Redis in ${time}ms...`);
});

//handle Redis connection established
redis.on("connect", () => {
  infoLogger.info("Redis connection established.");
});

export const connectToRedis = async () => {
  try {
    const response = await redis.ping();
    infoLogger.info(`Connected to Redis: ${response}`);
  } catch (error) {
    errorLogger.error(
      `Error connecting to Redis: ${
        error instanceof Error ? error.message : "unknown"
      }`
    );
    process.exit(1);
  }
};
