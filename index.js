import express, { json } from "express";
import { redis } from "./src/lib/redis.js";
import { getUserProfile } from "./src/caching/caching.js";
import likeRouter from "./src/routes/like.route.js";
import searchRouter from "./src/routes/search.route.js";
import leaderRouter from "./src/routes/leaderboard.route.js";

const app = express();
app.use(json());

// incr view on each page visit
app.get("/post/:id", async (req,res)=>{
    const {id} = req.params;

    const key =  `post:${id}:views`;

    const views = await redis.incr(key);

    res.json({views})

})


// user profile mock redis_DB hit
app.get("/user/:id/profile",async (req,res) =>{
    const {id}  = req.params;

    try {
        const user = await getUserProfile(id);
        res.json(user);
        
    } catch (error) {
        res.status(500).json({error:"Failed to fetch..."})
    }
})

app.use(likeRouter)
app.use(searchRouter)
app.use(leaderRouter)


app.listen(3000,()=>{
    console.log("Server running on port 3000");
})