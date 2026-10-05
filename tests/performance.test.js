import {beforeAll,afterAll,it,expect} from 'vitest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import express from 'express';
import request from 'supertest';
import {hash} from 'argon2';
import {writeFileSync,mkdirSync} from 'node:fs';
import User from '../src/user/user.model.js';
import Publication from '../src/publication/publication.model.js';
import Comment from '../src/comment/comment.model.js';
import Reaction from '../src/reaction/reaction.model.js';
import '../src/hashtag/hashtag.model.js';
import {publicationPage} from '../src/helpers/publication-page.js';
import {loginLimiter} from '../src/middlewares/rate-limit-validator.js';
let db,user; const metrics = [];
beforeAll(async()=>{db = await MongoMemoryServer.create(); await mongoose.connect(db.getUri()); user = await User.create({username:'semilla',email:'semilla@example.invalid',password:await hash('Ficticia!123')});});
afterAll(async()=>{mongoose.set('debug',false); await mongoose.disconnect(); await db.stop();mkdirSync('tests/results',{recursive:true});writeFileSync('tests/results/backend-metrics.json',JSON.stringify(metrics,null,2));});
for (const count of [20,50]) it(`pagina ${count} publicaciones con tres consultas`,async()=>{
 await Promise.all([Publication.deleteMany({}),Comment.deleteMany({}),Reaction.deleteMany({})]);
 for (let i=0;i<count;i++) {
  const post=await Publication.create({user:user.id,title:'Historia '+i,description:'Una historia ficticia'});
  const comment=await Comment.create({publication:post.id,user:user.id,text:'Comentario ficticio'});
  const reaction=await Reaction.create({publication:post.id,user:user.id,type:'like'});
  await Publication.updateOne({_id:post.id},{$push:{comments:comment.id,reactions:reaction.id}});
 }
 const baselineStart=performance.now();
 const legacy = await Publication.find({status:true}).populate('user','username profilePicture').populate('hashtags','name').populate({path:'comments',match:{status:true},populate:{path:'user',select:'username profilePicture'}}).populate({path:'reactions',match:{status:true},populate:{path:'user',select:'username'}}).sort({createdAt:-1});
 const beforeMs=performance.now()-baselineStart,beforeBytes=Buffer.byteLength(JSON.stringify({success:true,publications:legacy.map(doc=>({...doc.toObject(),reactionCount:{like:1,love:0,laugh:0,sad:0,angry:0,total:1},userReaction:null}))}));
 let queries=0; mongoose.set('debug',()=>{queries++;});
 const start=performance.now(),page=await publicationPage({query:{},user:null}); const afterMs=performance.now()-start;
 mongoose.set('debug',false); expect(queries).toBe(3);expect(page.publications.length).toBe(20); expect(page.hasMore).toBe(count>20);
 for(const row of page.publications) {expect(row.comments).toBeUndefined();expect(row.reactions).toBeUndefined();expect(row.commentCount).toBe(1);expect(row.reactionCount.total).toBe(1);}
 const afterBytes=Buffer.byteLength(JSON.stringify(page));expect(afterBytes).toBeLessThan(beforeBytes);
 if(page.hasMore) {const second=await publicationPage({query:{cursor:page.nextCursor},user:null});expect(second.publications.length).toBe(20);expect(new Set([...page.publications,...second.publications].map(p=>String(p._id))).size).toBe(40);}
 metrics.push({seeded:count,beforeBytes,afterBytes,beforeMs:Math.round(beforeMs*100)/100,afterMs:Math.round(afterMs*100)/100,queries});
});
it('el sexto intento de login fallido devuelve 429 con RateLimit',async()=>{
 const app=express();app.post('/login',loginLimiter,(_req,res)=>res.status(401).json({success:false,message:'Credenciales inválidas'}));
 for(let i=0;i<5;i++) expect((await request(app).post('/login')).status).toBe(401);
 const response=await request(app).post('/login');expect(response.status).toBe(429);expect(response.headers.ratelimit).toBeTruthy();expect(response.headers['ratelimit-policy']).toBeTruthy();expect(response.body.success).toBe(false);
});
