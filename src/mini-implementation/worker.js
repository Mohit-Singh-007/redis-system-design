import { Worker } from "bullmq";
import { bullRedis, redis } from "../lib/redis.js";

const emailWorker = new Worker("send-mail-queue",async(job)=>{
    const {name,email} = job.data;

    // lock + idempotency
    const lockKey = `lock:email:${name}:${email}`
    const key = `done:welcome:email:${name}:${email}`

    const lock = await redis.set(lockKey, "1", "NX", "EX", 30);
if (!lock) {
  console.log("Another worker is processing:", email);
  return;
}

try {
  const isSet = await redis.get(key);
  if (isSet) {
    console.log("Already processed:", email);
    return;
  }

  console.log("PROCESSING:", job.id, email);

  await new Promise(res => setTimeout(res, 2000));
console.log("SUCCESS:", job.id, email);
  await redis.set(key, "1", "EX", 3600);

} finally {
  await redis.del(lockKey);
}
},{connection:bullRedis,
    concurrency: 3,
    limiter:{
    max:2,
    duration: 5000
}})