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

retryWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

retryWorker.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed: ${err.message}`);
});