import { Queue } from "bullmq";
import { bullRedis } from "../lib/redis.js";

export const queue = new Queue("demo-queue",{connection: bullRedis})
export const dlq = new Queue("dlq-queue",{connection: bullRedis})