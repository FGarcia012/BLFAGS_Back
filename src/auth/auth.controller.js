import {hash,verify} from 'argon2';
import {randomBytes} from 'node:crypto';
import User from '../user/user.model.js';
import {generateJWT} from '../helpers/generate-jwt.js';
import {sendWelcomeEmail} from '../helpers/email-sender.js';
import {publicUser} from '../helpers/privacy.js';
const dummyHash = hash(randomBytes(32).toString('hex'));
export const register = async (req,res) => {
 const {username,email,password} = req.body;
 const user = await User.create({username,email,password:await hash(password),role:'USER',status:true,profilePicture:null});
 await sendWelcomeEmail(user.email,user.username);
 res.status(201).json({success:true,message:'Usuario creado exitosamente',user:{uid:user.id,username:user.username}});
};
export const login = async (req,res) => {
 const {email,username,password} = req.body;
 const user = await User.findOne(email ? {email:email.trim().toLowerCase()}:{username}).collation({locale:'en',strength:2});
 const valid = await verify(user?.password || await dummyHash,password);
 if (!user?.status || !valid) return res.status(401).json({success:false,message:'Credenciales inválidas'});
 res.json({success:true,message:'Sesión iniciada',userDetails:publicUser(user),token:generateJWT(user.id)});
};
