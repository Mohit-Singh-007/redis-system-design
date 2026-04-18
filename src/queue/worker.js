import { Worker } from "bullmq";
import { bullRedis } from "../lib/redis.js";

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
  console.log("DATA: ",job.data)
},{connection: bullRedis})



// concurrency -> 1 worker in parallel -> multiple jobs
const concurrencyWorker = new Worker("concurrency-queue",async(job)=>{
  console.log("EXECUTING JOB: ",job.name)
},{connection: bullRedis,concurrency: 5}) 