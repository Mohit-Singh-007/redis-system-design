
import { getUserProfileFromDB } from "../fake/db.js";
import { redis } from "../lib/redis.js";

export async function getUserProfile(userId) {
    const key = `user:${userId}:profile`;

    //check redis
    const cachedUser = await redis.get(key);
    if(cachedUser){
        console.log("CACHE HIT : GET_USER_PROFILE")
        return JSON.parse(cachedUser)
    }

    // fetch from DB
    const user = await getUserProfileFromDB(userId)
    // store in redis
    await redis.set(key,JSON.stringify(user),"EX",60);
    console.log("CACHED TO REDIS...")

    return user;
}

