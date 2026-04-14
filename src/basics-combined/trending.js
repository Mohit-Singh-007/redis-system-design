import { redis } from "../lib/redis.js";


// recent + popular = trending

// recent -> high rank
// more likes -> high rank
// old post -> goes down slowly [time decay]

// sorted set
/*post:{id}:likes        → String (count)
post:{id}:createdAt    → String (timestamp)
trending:posts         → Sorted Set */

export async function createPost(postId) {
    const now = Date.now();

    await redis.set(`post:${postId}:likes`,0)
    await redis.set(`post:${postId}:createdAt`,now)

    // initial score [new post boost] -> score [sorted sets]
    await redis.zadd(`trending:posts`,now,postId)

}

export async function userLikedAPost(postId) {
    const now = Date.now();

    // inc likes
    const likes = await redis.incr(`post:${postId}:likes`);

    // createdAt lele
    const createdAt = await redis.get(`post:${postId}:createdAt`)


    // calc time decay 
    const age = (now - createdAt) /1000
    const score = likes / (age+1);

    // update sorted set
    await redis.zadd("trending:posts",score,postId)
}


export async function getTrendingPosts(limit = 10) {
  const result = await redis.zrevrange("trending:posts", 0, limit - 1,"WITHSCORES");

  const data = []
  for(let i=0;i<result.length;i+=2){
    data.push({
        postId: result[i],
        score: Number(result[i+1])
    })
  }
  return data

}