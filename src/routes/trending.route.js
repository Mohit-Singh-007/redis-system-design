import { Router } from "express";
import { createPost, getTrendingPosts, userLikedAPost } from "../basics-combined/trending.js";

const trendingRouter = Router();

trendingRouter.post("/post/:id",async(req,res)=>{
    const {id} = req.params;
    await createPost(id)
    res.json({ message: "Post created" });
})

trendingRouter.post("/post/:id/like",async(req,res)=>{
    const {id} = req.params
    await userLikedAPost(id)
    res.json({ message: "Liked" });
})

trendingRouter.get("/trending-post",async(req,res)=>{
   const posts = await getTrendingPosts(3)
   console.log(posts)
   res.json({posts})
})

export default trendingRouter