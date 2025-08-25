import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100000,
})

export default apiLimiter;