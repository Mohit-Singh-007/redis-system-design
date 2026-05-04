import { Worker } from "bullmq";
import { bullRedis } from "../lib/redis.js";

export const emailWorker = new Worker(
  "demo-queue",
  async (job) => {
    console.log("Processing:", job.data);

    // simulate failure
    if (Math.random() < 0.7) {
      throw new Error("Random failure");
    }

    return "Email sent";
  },
  { connection: bullRedis }
);

emailWorker.on("failed", async (job, err) => {
  console.log(` Failed ${job.id} attempt ${job.attemptsMade}`);

  if (job.attemptsMade === job.opts.attempts) {
    console.log(" Moving to DLQ:", job.data.email);

    await dlqQueue.add(
      "failed-job",
      {
        originalJobId: job.id,
        data: job.data,
        error: {
          message: err.message,
          stack: err.stack,
        },
        attemptsMade: job.attemptsMade,
        failedAt: new Date().toISOString(),
      },
      {
        jobId: `dlq-${job.id}`, // deduplication prevention
      }
    );
  }
});

export const dlqWorker = new Worker(
  "dlq-queue",
  async (job) => {
    console.log("🚨 DLQ JOB RECEIVED");
    console.log(job.data);

    // alert / store / notify
  },
  { connection: bullRedis }
);