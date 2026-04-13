import { redis } from "../lib/redis.js";

export async function addScore(userId,score) {
    await redis.zadd("leaderboard",score,userId);
}

export async function getTopRanks(limit=3) {
    return await redis.zrevrange("leaderboard",0,limit-1);
}


export async function getUserRank(userId) {
    return await redis.zrevrank("leaderboard",userId);
}

export async function getScoreAndRank(limit=10) {
    const result = await redis.zrevrange("leaderboard",0,limit-1,"WITHSCORES");

    const data = [];
    for(let i=0;i<result.length;i+=2){
        data.push({
            userId: result[i],
            score: Number(result[i+1])
        })
    }
    return data;
}
