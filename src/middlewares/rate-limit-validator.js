import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 1000,
})

export default apiLimiter;