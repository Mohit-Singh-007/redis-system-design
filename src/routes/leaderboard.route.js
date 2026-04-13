import {  Router } from "express";
import { addScore, getScoreAndRank, getTopRanks, getUserRank } from "../sorted-set/leaderboard.js";


const leaderRouter = Router();

leaderRouter.post("/add/score",async(req,res)=>{
    const {userId,score} = req.body;

    await addScore(userId,score)
    res.json({ message: "Score updated" });
})


leaderRouter.get("/ranking",async(req,res)=>{
   const users =  await getTopRanks(4);
   res.json({users});
})

leaderRouter.get("/ranking/:id",async(req,res)=>{
    const {id} = req.params;
    const rank = await getUserRank(id);
    res.json({rank})
})

leaderRouter.get("/rankings/all",async(req,res)=>{
   
    const data = await getScoreAndRank(3);
    res.json({data})
})
export default leaderRouter;