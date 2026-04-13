import { redis } from "../lib/redis.js";

export async function addSearch(userId,term) {
    const key = `user:${userId}:searches`;

    await redis.lpush(key,term);
    await redis.ltrim(key,0,9); // 10 hi rkhne h total

    return true;
}

export async function getRecentSearches(userId) {
    const key = `user:${userId}:searches`;
    return await redis.lrange(key,0,9);
}