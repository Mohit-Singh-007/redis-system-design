import { Worker } from "bullmq";
import { bullRedis, redis } from "../lib/redis.js";

const worker = new Worker("email-queue", async(job)=>{
    console.log("PROCESSING JOB: ",job.name)
    console.log("DATA: ",job.data)

    // simulate email sending
    await new Promise(res=>setTimeout(res,2000))
    
    console.log("Email sent!")
}, {connection: bullRedis})


// retries and failure handling
const retryWorker = new Worker("retry-queue", async(job)=>{
    console.log("PROCESSING:", job.name);
    console.log("ATTEMPT:", job.attemptsMade + 1);

    // random failute
    
     if (job.attemptsMade <= 1) {
      console.log("❌ Simulated failure");
      throw new Error("Worker failed");
    }


    console.log("Rety worker executed !");
},{connection:bullRedis})

// logs
retryWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

retryWorker.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed: ${err.message}`);
});




// delayed execution
const delayWorker = new Worker("delay-queue",async(job)=>{
  console.log("EXECUTING JOB: ",job.name)
  console.log("DATA: ",job.data)
  
  // simulate sending
  await new Promise(res => setTimeout(res, 2000));
  console.log("DELAYED Email sent!");


},{connection: bullRedis})




// cron jobs
const cronWorker = new Worker("cron-queue",async(job)=>{
  console.log("EXECUTING JOB: ",job.name)
  // simulate sending
  await new Promise(res => setTimeout(res, 2000));
  console.log("DATA: ",job.data)
},{connection: bullRedis})





// concurrency -> 1 worker in parallel -> multiple jobs
const concurrencyWorker = new Worker("concurrency-queue",async(job)=>{
   console.log("START:", job.id);

    await new Promise(res => setTimeout(res, 2000));

    console.log("DONE:", job.id);
},{connection: bullRedis,concurrency: 5}) 




// idempotency worker
new Worker("idempotency-queue",async(job)=>{

  console.log("START:", job.id);
  // redis use [idempotency key]
  const key = `email:sent:${job.data?.email}`

  // idempotency check
  const isSet = await redis.set(key,"1","NX","EX",3600)

  if(!isSet){
     console.log("Duplicate job skipped:", job.data.email);
      return;
  }
  await new Promise(res => setTimeout(res, 2000));

    console.log(" Email sent to:", job.data.email);
},{connection:bullRedis})




new Worker("lock-queue",async(job)=>{

  const email =  job.data?.email

  // create lock and idempotency key
  const key = `done:email:${email}`
  const lockKey = `lock:email:${email}`

  // 1. check idempotency is already processed
  const isSet = await redis.get(key)
  if(!isSet){
    console.log(" Already processed, skipping:", email);
    return;
  }

  // lock 
  const lock = await redis.set(lockKey,"1","NX","EX",30)
  if (!lock) {
      console.log(" Another worker is processing:", email);
      return;
  }

  // process the job
  try{
     console.log(" PROCESSING:", job.id, email);

      // simulate work
      await new Promise(res => setTimeout(res, 2000));

      console.log("Email sent:", email);

      //  mark as done
      await redis.set(key, "1", "EX", 3600);

  }catch{
    throw new Error("Error"); // throw -> retry will work in bullmq

  }finally{
    await redis.del(lockKey)
  }


},{connection:bullRedis,concurrency:3})