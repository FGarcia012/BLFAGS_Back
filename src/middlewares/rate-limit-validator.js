import {rateLimit} from 'express-rate-limit';
const number = (name,fallback) => Number(process.env[name] || fallback);
const limiter = (windowMs,limit,options = {}) => rateLimit({windowMs,limit,standardHeaders:'draft-7',legacyHeaders:false,message:{success:false,message:'Demasiadas solicitudes. Inténtalo más tarde'},...options});
export default limiter(60000,number('GLOBAL_RATE_LIMIT',600));
export const loginLimiter = limiter(15*60000,number('LOGIN_RATE_LIMIT',5),{skipSuccessfulRequests:true});
export const registerLimiter = limiter(3600000,number('REGISTER_RATE_LIMIT',3));
export const writeLimiter = limiter(60000,number('WRITE_RATE_LIMIT',20),{keyGenerator:req => String(req.user._id)});
export const uploadLimiter = limiter(3600000,number('UPLOAD_RATE_LIMIT',10),{keyGenerator:req => String(req.user._id),skip:req => !req.is('multipart/form-data')});
