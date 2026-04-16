import { redis } from "../lib/redis.js";

export async function sldingWindowPipeline({key,limit,windowSec}) {

    const now = Date.now();
    const windowStart = now - windowSec*1000;

    const pipe = redis.pipeline();

    pipe.zremrangebyscore(key,0,windowStart) //remove old req
    pipe.zcard(key) //count current req
    pipe.zadd(key,now,`${now} - ${Math.random()}`) //add req
    pipe.expire(key,windowSec) //set TTL

    const res = await pipe.exec();

    const count = res[1][1] //count

    return{
        allowed: count < limit,
        current: count,
        remaining: Math.max(0, limit - count - 1)
    }
    
}



