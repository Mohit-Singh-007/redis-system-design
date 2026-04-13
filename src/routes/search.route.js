import { Router } from "express";
import { addSearch, getRecentSearches } from "../list/search.js";

const searchRouter = Router();

searchRouter.post("/search",async(req,res)=>{
    const userId = "1";
    const {term} = req.body;

    await addSearch(userId,term);
    res.json({message:"Saved in redis..."})
})

searchRouter.get("/search",async (req,res)=>{
    const userId = "1";
    const result = await getRecentSearches(userId);
    res.json(result);
})

export default searchRouter;