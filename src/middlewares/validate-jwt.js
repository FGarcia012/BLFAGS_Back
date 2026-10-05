import jwt from 'jsonwebtoken';
import User from '../user/user.model.js';
const unauthorized = res => res.status(401).json({success:false,message:'Sesión inválida o expirada'});
export const validateJWT = async (req,res,next) => {
 const match = /^Bearer ([^\s]+)$/.exec(req.get('Authorization') || '');
 if (!match) return unauthorized(res);
 let uid; try { ({uid} = jwt.verify(match[1],process.env.SECRETORPRIVATEKEY,{algorithms:['HS256']})); } catch { return unauthorized(res); }
 try {
  if (typeof uid !== 'string' || !/^[a-f\d]{24}$/i.test(uid)) return unauthorized(res);
  const user = await User.findById(uid).select('_id username role status profilePicture');
  if (!user?.status) return unauthorized(res);
  req.user = user; next();
 } catch(err) { next(err); }
};
export const optionalJWT = (req,res,next) => req.get('Authorization') ? validateJWT(req,res,next):next();
