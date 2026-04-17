import { Queue } from "bullmq";
import { bullRedis } from "../lib/redis.js";

export const emailQueue = new Queue("email-queue",{connection: bullRedis})

export const retryQueue = new Queue("retry-queue",{connection: bullRedis})