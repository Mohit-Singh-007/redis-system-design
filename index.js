import express, { json } from "express";
import { redis } from "./src/lib/redis.js";
import { getUserProfile } from "./src/caching/caching.js";
import likeRouter from "./src/routes/like.route.js";
import searchRouter from "./src/routes/search.route.js";
import leaderRouter from "./src/routes/leaderboard.route.js";
import trendingRouter from "./src/routes/trending.route.js";
import { rateLimiter } from "./src/rate-limiting/rate-limit-middleware.js";

const app = express();
app.use(json());

// ratelimit-test-middleware
app.post("/login",rateLimiter("login"),(req,res)=>{
    res.json({message:"Login OK..passed through rate-limiter"})
})

app.post("/post/comment", rateLimiter("comment"),(req,res)=>{
    res.json("SUCCSS...")
})

app.get("/login", rateLimiter("login"),(req,res)=>{
    res.json("SUCCESS...")
})

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
app.use(trendingRouter)

app.listen(3000,()=>{
    console.log("Server running on port 3000");
})