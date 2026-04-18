import { Queue } from "bullmq";
import { bullRedis } from "../lib/redis.js";

export const emailQueue = new Queue("send-mail-queue",{connection: bullRedis})