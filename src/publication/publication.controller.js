import mongoose from 'mongoose';
import Publication from './publication.model.js';
import Comment from '../comment/comment.model.js';
import Reaction from '../reaction/reaction.model.js';
import {processPublicationHashtags,removePublicationFromHashtags} from '../helpers/hashtag-helpers.js';
import {publicationPage} from '../helpers/publication-page.js';
import {destroyAsset} from '../middlewares/multer-uploads.js';
export const getPublications = async (req,res) => res.json(await publicationPage(req));
export const getPublicationsByUser = async (req,res) => res.json(await publicationPage(req,{user:new mongoose.Types.ObjectId(req.params.userId)}));
export const getPublication = async (req,res) => {
 const data = await publicationPage({...req,query:{limit:1}},{_id:req.publication._id});
 res.json({success:true,publication:data.publications[0]});
};
export const addPublication = async (req,res) => {
 const {title,description,visibility} = req.body;
 const publication = await Publication.create({title,description,visibility,user:req.user._id,media:req.file?.path || null});
 publication.hashtags = await processPublicationHashtags(description,publication._id); await publication.save();
 res.status(201).json({success:true,message:'Publicación creada',publication});
};
export const updatePublication = async (req,res) => {
 const publication = req.publication,previousMedia = publication.media;
 for (const key of ['title','description','visibility']) if (req.body[key] !== undefined) publication[key] = req.body[key];
 if (req.file) publication.media = req.file.path;
 if (req.body.description !== undefined) publication.hashtags = await processPublicationHashtags(publication.description,publication.id,publication.hashtags);
 await publication.save();
 if (req.file && previousMedia) await destroyAsset(previousMedia);
 res.json({success:true,message:'Publicación actualizada',publication});
};
export const deletePublication = async (req,res) => {
 const publication = req.publication;
 const comments = await Comment.find({publication:publication.id,status:true}).select('media').lean();
 await destroyAsset(publication.media); for (const comment of comments) await destroyAsset(comment.media);
 await removePublicationFromHashtags(publication.hashtags,publication.id);
 await Comment.updateMany({publication:publication.id},{$set:{status:false}});
 await Reaction.updateMany({publication:publication.id},{$set:{status:false}});
 publication.status = false; publication.media = null; await publication.save();
 res.json({success:true,message:'Publicación eliminada',pid:publication.id});
};
