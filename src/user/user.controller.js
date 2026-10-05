import {hash,verify} from 'argon2';
import {randomBytes} from 'node:crypto';
import User from './user.model.js';
import Publication from '../publication/publication.model.js';
import Comment from '../comment/comment.model.js';
import Reaction from '../reaction/reaction.model.js';
import {publicUser,sameId,fail} from '../helpers/privacy.js';
import {destroyAsset} from '../middlewares/multer-uploads.js';
export const updatePassword = async (req,res) => {
 const user = await User.findById(req.params.uid);
 if (!user?.status) throw fail(404,'Usuario no encontrado');
 if (!await verify(user.password,req.body.currentPassword)) throw fail(400,'La contraseña actual es incorrecta');
 user.password = await hash(req.body.newPassword); await user.save();
 res.json({success:true,message:'Contraseña actualizada'});
};
export const updateUser = async (req,res) => {
 const data = {}; for (const key of ['username','email']) if (req.body[key] !== undefined) data[key] = req.body[key];
 const user = await User.findOneAndUpdate({_id:req.params.uid,status:true},{$set:data},{new:true,runValidators:true});
 if (!user) throw fail(404,'Usuario no encontrado');
 res.json({success:true,message:'Perfil actualizado',user:publicUser(user)});
};
export const updateProfilePicture = async (req,res) => {
 if (!req.file) throw fail(400,'Selecciona una imagen');
 const user = await User.findOne({_id:req.params.uid,status:true}); if (!user) throw fail(404,'Usuario no encontrado');
 const previous = user.profilePicture; user.profilePicture = req.file.path; await user.save(); req.file.asset = null; await destroyAsset(previous);
 res.json({success:true,message:'Foto actualizada',user:publicUser(user)});
};
export const deleteUser = async (req,res) => {
 const user = await User.findOne({_id:req.params.uid,status:true}); if (!user) throw fail(404,'Usuario no encontrado');
 const publications = await Publication.find({user:user.id}).select('_id media').lean();
 const comments = await Comment.find({$or:[{user:user.id},{publication:{$in:publications.map(p => p._id)}}]}).select('_id media').lean();
 await destroyAsset(user.profilePicture);
 for (const item of [...publications,...comments]) await destroyAsset(item.media);
 await Publication.updateMany({user:user.id},{$set:{status:false,media:null}});
 await Comment.updateMany({_id:{$in:comments.map(c => c._id)}},{$set:{status:false,media:null}});
 await Reaction.updateMany({$or:[{user:user.id},{publication:{$in:publications.map(p => p._id)}}]},{$set:{status:false}});
 user.email = `deleted-${user.id}@deleted.invalid`; user.username = `deleted_${randomBytes(6).toString('hex')}`; user.password = await hash(randomBytes(48).toString('hex')); user.profilePicture = null; user.status = false;
 await user.save(); res.json({success:true,message:'Cuenta anonimizada'});
};
export const getUsers = async (_req,res) => res.json({success:true,users:(await User.find().select('_id username role status createdAt').limit(100).lean()).map(publicUser)});
export const getUser = async (req,res) => {
 const user = await User.findOne({_id:req.params.uid,status:true}).select('_id username email profilePicture role status createdAt');
 if (!user) throw fail(404,'Usuario no encontrado');
 const dto = publicUser(user); if (sameId(user._id,req.user?._id)) dto.email = user.email;
 res.json({success:true,user:dto});
};
