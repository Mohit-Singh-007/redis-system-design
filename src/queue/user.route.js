import { Router } from "express";
import { emailQueue, retryQueue } from "./queue.js";

const queueRouter = Router();

queueRouter.post("/signup",async (req,res)=>{
    
    const {name,email} = req.body;

    /* USER FLOW */

    // add to queue
    await emailQueue.add("send-email",{
        name,
        email 
    })


    res.json({message:"User created, Email will be sent"})
})


queueRouter.post("/retry",async (req,res)=>{
    
    const {name,email} = req.body;

    /* USER FLOW */

    // add to queue
    await retryQueue.add("send-retry",{
        name,
        email 
    },{
        attempts: 3, // retry 3 times
        backoff:{
            type:"exponential",
            delay: 1000
        }
    })


    res.json({message:"Retry route hit, Worker will now execute it..."})
})

export default queueRouter;