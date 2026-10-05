import Comment from './comment.model.js';
import Publication from '../publication/publication.model.js';
import {fail,sameId,pagination,pageResult} from '../helpers/privacy.js';
import {destroyAsset} from '../middlewares/multer-uploads.js';
const dto = (comment,user) => ({...comment,cid:comment._id,isMine:sameId(comment.user,user?._id)});
export const getComments = async (req,res) => {
 const {limit,cursorFilter} = pagination(req.query);
 // Incluso el administrador recibe solo comentarios de publicaciones públicas.
 const comments = await Comment.aggregate([{$match:{$and:[{status:true},cursorFilter]}},{$lookup:{from:'publications',localField:'publication',foreignField:'_id',as:'parent'}},{$match:{'parent.status':true,'parent.visibility':'public'}},{$sort:{createdAt:-1,_id:-1}},{$limit:limit+1},{$project:{text:1,createdAt:1,publication:1}}]);
 const {rows,...page} = pageResult(comments,limit); res.json({success:true,comments:rows,...page});
};
export const getComment = async (req,res) => {
 const comment = await Comment.findOne({_id:req.params.cid,status:true}).populate('user','username profilePicture').lean();
 if (!comment) throw fail(404,'Comentario no encontrado');
 const publication = await Publication.findById(comment.publication);
 if (!publication?.canBeViewedBy(req.user?._id)) throw fail(404,'Comentario no encontrado');
 res.json({success:true,comment:dto(comment,req.user)});
};
export const getCommentsByPublication = async (req,res) => {
 const {limit,cursorFilter} = pagination(req.query);
 const comments = await Comment.find({$and:[{publication:req.publication.id,status:true},cursorFilter]}).populate('user','username profilePicture').sort({createdAt:-1,_id:-1}).limit(limit+1).lean();
 const {rows,...page} = pageResult(comments,limit); res.json({success:true,comments:rows.map(row => dto(row,req.user)),...page});
};
export const addComment = async (req,res) => {
 const comment = await Comment.create({text:req.body.text,publication:req.publication.id,user:req.user._id,media:req.file?.path || null});
 await Publication.updateOne({_id:req.publication.id},{$addToSet:{comments:comment._id}});
 if (req.file) req.file.asset = null;
 await comment.populate('user','username profilePicture');
 const commentCount = await Comment.countDocuments({publication:req.publication.id,status:true});
 res.status(201).json({success:true,message:'Comentario agregado',comment:dto(comment.toObject(),req.user),commentCount});
};
export const deleteComment = async (req,res) => {
 const comment = await Comment.findOne({_id:req.params.cid,status:true});
 if (!comment) throw fail(404,'Comentario no encontrado');
 if (!sameId(comment.user,req.user._id) && req.user.role !== 'ADMIN') throw fail(403,'No puedes borrar comentarios ajenos');
 const publication = await Publication.findById(comment.publication);
 if (!publication?.canBeViewedBy(req.user._id)) throw fail(404,'Comentario no encontrado');
 await destroyAsset(comment.media); comment.status = false; comment.media = null; await comment.save();
 await Publication.updateOne({_id:comment.publication},{$pull:{comments:comment.id}});
 const commentCount = await Comment.countDocuments({publication:comment.publication,status:true});
 res.json({success:true,message:'Comentario eliminado',cid:comment.id,publication:comment.publication,commentCount});
};
