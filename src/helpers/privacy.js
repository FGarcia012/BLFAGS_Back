import mongoose from 'mongoose';
export const fail = (status,message) => Object.assign(new Error(message),{status});
export const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export const sameId = (a,b) => Boolean(a && b && String(a._id || a) === String(b._id || b));
export const publicUser = user => user ? {uid:user._id || user.uid,username:user.username,profilePicture:user.profilePicture || null,role:user.role,status:user.status,createdAt:user.createdAt}:null;
export const visibleFilter = user => ({status:true,...(user ? {$or:[{visibility:'public'},{user:user._id}]}:{visibility:'public'})});
export function pagination(query) {
 const limit = query.limit === undefined ? 20:Number(query.limit);
 if (!Number.isInteger(limit) || limit < 1) throw fail(400,'Límite inválido');
 let cursorFilter = {};
 if (query.cursor) { try {
  if (typeof query.cursor !== 'string' || query.cursor.length > 256) throw Error();
  const {date,id} = JSON.parse(Buffer.from(query.cursor,'base64url').toString());
  const createdAt = new Date(date);
  if (!mongoose.isValidObjectId(id) || !Number.isFinite(createdAt.getTime())) throw Error();
  cursorFilter = {$or:[{createdAt:{$lt:createdAt}},{createdAt,_id:{$lt:new mongoose.Types.ObjectId(id)}}]};
 } catch { throw fail(400,'Cursor inválido'); } }
 return {limit:Math.min(limit,30),cursorFilter};
}
export function pageResult(items,limit) {
 const hasMore = items.length > limit, rows = items.slice(0,limit),last = rows.at(-1);
 return {rows,hasMore,nextCursor:hasMore ? Buffer.from(JSON.stringify({date:last.createdAt,id:last._id})).toString('base64url'):null};
}
export const asyncRoute = fn => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next);
