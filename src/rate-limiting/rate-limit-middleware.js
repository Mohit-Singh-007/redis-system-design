import { RATE_LIMIT_CONFIG } from "./rate-limit-config.js"
import { sldingWindowPipeline } from "./rate-limit-service.js"

export function rateLimiter(type="default") {
    
    return async (req,res,next) =>{

        const config = RATE_LIMIT_CONFIG[type]

         if (!config) {
            return res.status(500).json({
                error: "Rate limit config missing"
            });
        }

        const id = req.user?.id || req.ip

        const key = `rl:${type}:user:${id}`

        const result = await sldingWindowPipeline({
            key,
            limit: config.limit,
            windowSec: config.windowSec
        })

        if(!result.allowed){
          return res.status(429).json({
          error: "Too many requests",
        });
        }

        // set headers
        res.set("X-RateLimit-Limit",config.limit)
        res.set("X-RateLimit-Remaining", result.remaining);
        res.set("X-Retry-After", config.windowSec)

        next();
    }
}