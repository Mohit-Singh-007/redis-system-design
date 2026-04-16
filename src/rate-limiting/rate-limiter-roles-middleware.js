import { REDIS_ROLE_CONFIG } from "./rate-limit-config.js"
import { sldingWindowPipeline } from "./rate-limit-service.js"

export function roleRateLimiter(type="api"){
    
    return async(req,res,next) =>{

        // hardcoded user rn
        const user = {
            id:"1",
            email:"demo@mail.com",
            role:"user"
        }

        const roleConfig = REDIS_ROLE_CONFIG[type]
        const config = roleConfig?.[user.role]
        if (!config) {
            return res.status(500).json({
                error: `Rate limit config missing for ${type}:${user.role}`
            });
        }

        const id = user?.id || req.ip
        const key = `rl:${type}:${user.role}:${id}`
        const result = await sldingWindowPipeline({
            key,
            limit: config.limit,
            windowSec: config.windowSec
        });

         if (!result.allowed) {
            return res.status(429).json({
                error: "Too many requests",
            });
        }


        res.set("X-RateLimit-Limit", config.limit);
        res.set("X-RateLimit-Remaining", result.remaining);
        res.set("X-RateLimit-Role", user.role);

        next();
    }
}