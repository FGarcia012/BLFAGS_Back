import Reaction from './reaction.model.js';
import Publication from '../publication/publication.model.js';
import {getReactionStats,getUserReactionForPublication} from '../helpers/reaction-helpers.js';
export const addOrUpdateReaction = async (req,res) => {
 const filter = {user:req.user._id,publication:req.publication._id},update = {$set:{type:req.body.type,status:true}};
 let reaction;
 try {reaction = await Reaction.findOneAndUpdate(filter,update,{upsert:true,new:true,runValidators:true});}
 catch(err) {if (err.code !== 11000) throw err; reaction = await Reaction.findOneAndUpdate(filter,update,{new:true,runValidators:true});}
 await Publication.updateOne({_id:req.publication._id},{$addToSet:{reactions:reaction._id}});
 res.json({success:true,type:reaction.type,userReaction:reaction.type,counts:await getReactionStats(req.publication._id)});
};
export const removeReaction = async (req,res) => {
 const reaction = await Reaction.findOneAndUpdate({user:req.user._id,publication:req.publication._id},{$set:{status:false}},{new:true});
 if (reaction) await Publication.updateOne({_id:req.publication._id},{$pull:{reactions:reaction._id}});
 res.json({success:true,type:null,userReaction:null,counts:await getReactionStats(req.publication._id)});
};
export const getPublicationReactions = async (req,res) => {
 const [counts,reaction] = await Promise.all([getReactionStats(req.publication._id),req.user ? getUserReactionForPublication(req.publication._id,req.user._id):null]);
 res.json({success:true,counts,userReaction:reaction?.type || null});
};
export const getUserReaction = async (req,res) => res.json({type:(await getUserReactionForPublication(req.publication._id,req.user._id))?.type || null});
