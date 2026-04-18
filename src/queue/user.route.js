import { Router } from "express";
import { concurrencyQueue, cronQueue, delayQueue, emailQueue, idempotencyQueue, lockQueue, retryQueue } from "./queue.js";

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


queueRouter.post("/delay",async(req,res)=>{

    console.log("HIT DELAY ROUTE")

    const user = {id:"1",name:"Mohit"}
    await delayQueue.add("send-delay-email",{
        id: user.id,
        name: user.name
    },{delay: 5000,
        
        attempts:3,
        backoff:{
            type:"exponential",
            delay: 1000
        }
    })
    res.json({ message: "Job scheduled after 5 seconds" });
})



queueRouter.post("/cron",async(req,res)=>{

    
    await cronQueue.add("cron-job",{},{
        jobId:"cron-logs-job",
        repeat:{
            pattern: "*/10 * * * * *"
        },
        attempts: 3,
        backoff:{
            type:"exponential",
            delay: 1000
        }
    })
    res.json({ message: "CronJob scheduled after 10 seconds" });
})



queueRouter.post("/concurrent",async(req,res)=>{

    
    await concurrencyQueue.add("concurrency-job",{},{
        attempts: 3,
        backoff:{
            type:"exponential",
            delay: 1000
        }
    })
    res.json({ message: "concurrency jobs by a worker" });
})


queueRouter.post("/idem/signup",async(req,res)=>{

    const {email} = req.body;

    await idempotencyQueue.add("idempotency-job",{
        email
    },{
        attempts: 3,
        backoff:{
            type:"exponential",
            delay: 1000
        }
    })
    res.json({ message: "IDEMPOTENCY QUEUE -> Mail sent" });
})

queueRouter.post("/lock/signup",async(req,res)=>{

    const {email} = req.body;

    await lockQueue.add("lock-job",{
        email
    },{
        attempts: 3,
        backoff:{
            type:"exponential",
            delay: 1000
        }
    })
    res.json({ message: "LOCK QUEUE -> Mail sent" });
})

export default queueRouter;