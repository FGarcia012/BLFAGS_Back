import Reaction from '../reaction/reaction.model.js';
import mongoose from 'mongoose';
export const reactionTypes = ['like','love','laugh','sad','angry'];
export const emptyCounts = () => ({like:0,love:0,laugh:0,sad:0,angry:0,total:0});
export const isValidReactionType = type => reactionTypes.includes(type);
export const getReactionStats = async publicationId => {
 const rows = await Reaction.aggregate([{$match:{publication:new mongoose.Types.ObjectId(String(publicationId)),status:true}},{$group:{_id:'$type',count:{$sum:1}}}]);
 const counts = emptyCounts(); for (const row of rows) if (reactionTypes.includes(row._id)) {counts[row._id] = row.count; counts.total += row.count;} return counts;
};
export const getUserReactionForPublication = (publication,user) => Reaction.findOne({publication,user,status:true}).select('type -_id').lean();
