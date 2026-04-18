import { Queue } from "bullmq";
import { bullRedis } from "../lib/redis.js";

export const emailQueue = new Queue("email-queue",{connection: bullRedis})

export const retryQueue = new Queue("retry-queue",{connection: bullRedis})

export const delayQueue = new Queue("delay-queue",{connection: bullRedis})

export const cronQueue = new Queue("cron-queue",{connection: bullRedis})

export const concurrencyQueue = new Queue("concurrency-queue",{connection: bullRedis})


export const idempotencyQueue = new Queue("idempotency-queue",{connection: bullRedis})
