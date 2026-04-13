import { Router } from "express";
import { hasUserLiked, likePost, totalLikes } from "../set/likePost.js";

const likeRouter = Router();

likeRouter.post("/post/:postId/likes",async(req,res) =>{
    const {postId} = req.params;

    const userId = '2';

    const result = await likePost(userId,postId);

    if(!result.sucess) return res.status(400).json(result);

    res.json({ message: "Liked successfully" });

})


likeRouter.get("/post/:postId/liked",async (req,res)=>{
    const { postId } = req.params;
    const userId = "2";

    const result = await hasUserLiked(userId,postId);
    
    res.json({result})

})

likeRouter.get("/post/:postId/likes",async (req,res)=>{
    const { postId } = req.params;

    const count = await totalLikes(postId);

    res.json({ count });
})



export default likeRouter