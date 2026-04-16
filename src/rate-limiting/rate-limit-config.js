export const RATE_LIMIT_CONFIG = {
    default:{
        limit: 5,
        windowSec: 60
    },
    login:{
        limit: 3,
        windowSec: 60
    },
    post:{
        limit: 10,
        windowSec: 60
    },
    comment:{
        limit: 10,
        windowSec: 60
    }
}