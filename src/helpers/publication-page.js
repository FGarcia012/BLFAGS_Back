import mongoose from 'mongoose';
import Publication from '../publication/publication.model.js';
import Reaction from '../reaction/reaction.model.js';
import Comment from '../comment/comment.model.js';
import {pagination,pageResult,visibleFilter,sameId,escapeRegex,fail} from './privacy.js';
import {emptyCounts,reactionTypes} from './reaction-helpers.js';
export async function publicationPage(req, extra = {}) {
 const {limit,cursorFilter} = pagination(req.query);
 const filters = [visibleFilter(req.user),extra,cursorFilter];
 if (req.query.search) {
  if (typeof req.query.search !== 'string' || req.query.search.trim().length < 2 || req.query.search.length > 100) throw fail(400,'Busca entre 2 y 100 caracteres');
  const regex = escapeRegex(req.query.search.trim()); filters.push({$or:[{title:{$regex:regex,$options:'i'}},{description:{$regex:regex,$options:'i'}}]});
 }
 if (req.query.filter === 'public' || req.query.filter === 'private') filters.push({visibility:req.query.filter});
 const docs = await Publication.aggregate([
 {$match:{$and:filters}},{$sort:{createdAt:-1,_id:-1}},{$limit:limit+1},
 {$lookup:{from:'users',localField:'user',foreignField:'_id',pipeline:[{$project:{username:1,profilePicture:1}}],as:'author'}},
 {$lookup:{from:'hashtags',localField:'hashtags',foreignField:'_id',pipeline:[{$match:{status:true}},{$project:{name:1}}],as:'tags'}},
 {$project:{title:1,description:1,media:1,user:1,visibility:1,status:1,createdAt:1,updatedAt:1,author:{$arrayElemAt:['$author',0]},hashtags:'$tags'}}
 ]);
 const {rows,hasMore,nextCursor} = pageResult(docs,limit),ids = rows.map(row => row._id);
 const userId = req.user ? new mongoose.Types.ObjectId(String(req.user._id)):null;
 const [reactionRows,commentRows] = await Promise.all([
 Reaction.aggregate([{$match:{publication:{$in:ids},status:true}},{$group:{_id:{publication:'$publication',type:'$type'},count:{$sum:1},mine:{$max:{$cond:[{$eq:['$user',userId]},1,0]}}}}]),
 Comment.aggregate([{$match:{publication:{$in:ids},status:true}},{$group:{_id:'$publication',count:{$sum:1}}}])
 ]);
 const reactions = new Map(),counts = new Map(commentRows.map(row => [String(row._id),row.count]));
 for (const row of reactionRows) {
  const pid = String(row._id.publication),data = reactions.get(pid) || {counts:emptyCounts(),mine:null};
  if (reactionTypes.includes(row._id.type)) {data.counts[row._id.type] = row.count; data.counts.total += row.count; if (row.mine) data.mine = row._id.type;}
  reactions.set(pid,data);
 }
 return {success:true,publications:rows.map(({author,user,...row}) => ({...row,pid:row._id,user:author || {username:'Cuenta eliminada',profilePicture:null},isMine:sameId(user,userId),commentCount:counts.get(String(row._id)) || 0,reactionCount:reactions.get(String(row._id))?.counts || emptyCounts(),userReaction:reactions.get(String(row._id))?.mine || null})),nextCursor,hasMore};
}
