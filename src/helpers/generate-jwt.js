import jwt from 'jsonwebtoken';
export const generateJWT = uid => jwt.sign({uid:String(uid)},process.env.SECRETORPRIVATEKEY,{algorithm:'HS256',expiresIn:'5h'});
