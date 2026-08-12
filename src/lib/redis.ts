import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

declare global {
  // eslint-disable-next-line no-var
  var __redis: Redis | undefined;
}

function createRedisClient(): Redis {
  const client = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null, // required for BullMQ
    enableReadyCheck: false,
    // Fail fast when Redis is unreachable so BullMQ jobs don't hang requests
    // (queue.add() would otherwise buffer commands offline forever).
    enableOfflineQueue: false,
    lazyConnect: true,
  });

  client.on("error", (err) => {
    console.error("Redis error:", err.message);
  });

  client.on("connect", () => {
    console.log("✅ Redis connected");
  });

  return client;
}

// Singleton across hot reloads in development
const redis: Redis = global.__redis ?? createRedisClient();
if (process.env.NODE_ENV !== "production") {
  global.__redis = redis;
}

export default redis;
