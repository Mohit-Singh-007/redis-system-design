import Redis from "ioredis";

export const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,

  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});


export const bullRedis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null, // required
});

bullRedis.on("connect", () => {
  console.log("🚀 BullMQ Redis connected");
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});