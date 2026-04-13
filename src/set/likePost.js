
export async function likePost(userId , postId) {
    const key = `post:${postId}:likes`;

    const result = await redis.sadd(key,userId);

    if(result == 0){
        console.log("User already liked...");
        return {sucess:false,message:"Already liked..."}
    }
    return {sucess:true}
}

export async function hasUserLiked(userId,postId) {
    const key = `post:${postId}:likes`;
    const result = await redis.sismember(key,userId);
    return result === 1;
}

export async function totalLikes(postId) {
    const key = `post:${postId}:likes`;
    const count = await redis.scard(key);
    return count;
}