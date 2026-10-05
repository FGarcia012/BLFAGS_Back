import { beforeAll, afterAll, describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { hash } from 'argon2';
import jwt from 'jsonwebtoken';
vi.mock('../src/helpers/email-sender.js', () => ({ sendWelcomeEmail: vi.fn(async () => ({ success: true })) }));
import auth from '../src/auth/auth.routes.js';
import users from '../src/user/user.routes.js';
import publications from '../src/publication/publication.routes.js';
import comments from '../src/comment/comment.routes.js';
import reactions from '../src/reaction/reaction.routes.js';
import hashtags from '../src/hashtag/hashtag.routes.js';
import User from '../src/user/user.model.js';
import Publication from '../src/publication/publication.model.js';
import Comment from '../src/comment/comment.model.js';
import Reaction from '../src/reaction/reaction.model.js';
import Hashtag from '../src/hashtag/hashtag.model.js';
import {errorHandler,rejectUnsafeKeys} from '../src/middlewares/security.js';
const app = express(); app.use(express.json()); app.use(rejectUnsafeKeys);
const prefix = '/BLFAGS/v1';
for (const [path, router] of Object.entries({auth, user:users, publication:publications, comment:comments, reactions, hashtag:hashtags})) app.use(`${prefix}/${path}`, router);
app.use(errorHandler);
let db, a, b, admin, privatePost, publicPost, privateComment, publicComment, tag, passwordHash;
const secret = 'clave-exclusiva-ficticia-para-pruebas-'.repeat(2);
const token = user => jwt.sign({uid:user.id}, secret, {algorithm:'HS256'});
const get = (path, user) => { const r = request(app).get(prefix + path); return user ? r.set('Authorization', `Bearer ${token(user)}`) : r; };
const sensitive = value => {
  if (!value || typeof value !== 'object') return;
  for (const [key, item] of Object.entries(value)) { expect(['email','password'].includes(key), key).toBe(false); if (key === 'name') expect(typeof item).not.toBe('string'); sensitive(item); }
};
beforeAll(async () => {
  process.env.NODE_ENV = 'test'; process.env.SECRETORPRIVATEKEY = secret;
  db = await MongoMemoryServer.create(); await mongoose.connect(db.getUri());
  passwordHash = await hash('Ficticia!123');
  [a,b,admin] = await User.create(['alpha','beta','moderador'].map((username,i) => ({ username,email:`${username}@example.invalid`,password:passwordHash,role:i === 2 ? 'ADMIN':'USER' })));
  privatePost = await Publication.create({title:'Privado',description:'#reservado',user:a.id,visibility:'private'});
  publicPost = await Publication.create({title:'Público',description:'Contenido ficticio',user:a.id});
  privateComment = await Comment.create({text:'Privado',publication:privatePost.id,user:a.id});
  publicComment = await Comment.create({text:'Público',publication:publicPost.id,user:a.id});
  const reaction = await Reaction.create({publication:privatePost.id,user:a.id,type:'like'});
  await Publication.updateOne({_id:privatePost.id},{$push:{comments:privateComment.id,reactions:reaction.id}});
  tag = await Hashtag.create({name:'reservado',publications:[privatePost.id]});
  await Publication.updateOne({_id:privatePost.id},{$push:{hashtags:tag.id}});
}, 120000);
afterAll(async () => { await mongoose.disconnect(); await db?.stop(); });
describe('Privacidad y permisos reales con MongoDB aislado', () => {
  for (const viewer of [null, 'b']) for (const kind of ['publication','comment','comments','reactions','userReaction']) it(`oculta ${kind} privado a ${viewer || 'anónimo'}`, async () => {
    const paths = {publication:`/publication/getPublication/${privatePost.id}`,comment:`/comment/getComment/${privateComment.id}`,comments:`/comment/publication/${privatePost.id}`,reactions:`/reactions/getPublicationReactions/${privatePost.id}`,userReaction:`/reactions/getUserReaction/${privatePost.id}`};
    const r = await get(paths[kind], viewer ? b:null); expect(r.status).toBe(kind === 'userReaction' && !viewer ? 401:404);
  });
  it('el dueño abre su publicación privada', async () => { expect((await get(`/publication/getPublication/${privatePost.id}`,a)).status).toBe(200); });
  it('registro ignora privilegios y no devuelve identidad', async () => {
    const r = await request(app).post(prefix+'/auth/register').send({username:'nuevo',email:'nuevo@example.invalid',password:'Ficticia!123',role:'ADMIN',status:false});
    expect(r.status).toBe(201); expect((await User.findOne({username:'nuevo'})).role).toBe('USER'); sensitive(r.body);
  });
  it('las credenciales inválidas tienen la misma respuesta', async () => {
    const one = await request(app).post(prefix+'/auth/login').send({username:'nadie',password:'Ficticia!000'});
    const two = await request(app).post(prefix+'/auth/login').send({username:'alpha',password:'Ficticia!000'});
    expect(one.status).toBe(401); expect(one.body).toEqual(two.body);
  });
  it('no permite borrar comentarios ajenos',async () => { expect((await request(app).delete(prefix+`/comment/deleteComment/${publicComment.id}`).set('Authorization',`Bearer ${token(b)}`)).status).toBe(403); });
  it('no permite comentar en publicaciones privadas ajenas',async () => { expect((await request(app).post(prefix+'/comment/addComment').set('Authorization',`Bearer ${token(b)}`).send({publication:privatePost.id,text:'No'})).status).toBe(404); });
  for (const path of ['/publication/addPublication','/comment/addComment']) it(`autentica antes de subir ${path}`,async () => { expect((await request(app).post(prefix+path)).status).toBe(401); });
  it('autentica antes de subir foto',async () => { expect((await request(app).patch(prefix+`/user/updateProfilePicture/${a.id}`)).status).toBe(401); });
  it('actualizar perfil no cambia privilegios ni contraseña', async () => {
    const r = await request(app).put(prefix+`/user/updateUser/${b.id}`).set('Authorization',`Bearer ${token(b)}`).send({role:'ADMIN',status:false,password:'SinHash'});
    expect(r.status).toBe(200); const u = await User.findById(b.id); expect(u.role).toBe('USER'); expect(u.status).toBe(true); expect(u.password).toBe(passwordHash);
  });
  it('no revela identidad de otros usuarios, tampoco al administrador',async () => {
    for (const viewer of [null,b,admin]) for (const path of ['/publication/getPublications',`/reactions/getPublicationReactions/${publicPost.id}`,`/comment/publication/${publicPost.id}`,`/user/getUser/${a.id}`]) { const r = await get(path,viewer); sensitive(r.body); }
    sensitive((await get('/user/getUsers',admin)).body);
  });
  it('hashtags no revelan títulos privados', async () => {
    for (const viewer of [null,b]) for (const path of ['/hashtag/getHashtags',`/hashtag/getHashtag/${tag.id}`,'/hashtag/search?query=reservado','/hashtag/publications/reservado']) { const r = await get(path,viewer); expect(JSON.stringify(r.body)).not.toContain('Privado'); }
  });
  it('ignora el autor enviado al crear publicaciones y comentarios',async()=>{
    const created=await request(app).post(prefix+'/publication/addPublication').set('Authorization',`Bearer ${token(b)}`).send({title:'Autor real de sesión',description:'Ficticio',user:a.id});
    expect(created.status).toBe(201);expect(String((await Publication.findById(created.body.publication.pid)).user)).toBe(b.id);
    const comment=await request(app).post(prefix+'/comment/addComment').set('Authorization',`Bearer ${token(b)}`).send({publication:publicPost.id,text:'Ficticio',user:a.id});
    expect(comment.status).toBe(201);expect(comment.body.comment.isMine).toBe(true);expect(comment.body.comment.user.username).toBe(b.username);
  });
  it('no acepta tokens en query o body, ni firmas inválidas',async()=>{
    expect((await request(app).post(prefix+'/publication/addPublication?token='+token(a)).send({token:token(a)})).status).toBe(401);
    expect((await get('/publication/getPublications').set('Authorization','Bearer invalid-token-ficticio')).status).toBe(401);
  });
  it('solo el dueño recibe su correo',async()=>{
    const own=await get(`/user/getUser/${a.id}`,a);expect(own.body.user.email).toBe('alpha@example.invalid');
    for(const viewer of [null,b,admin]) expect((await get(`/user/getUser/${a.id}`,viewer)).body.user.email).toBeUndefined();
  });
  it('las reacciones concurrentes no crean duplicados',async()=>{
    const responses=await Promise.all(Array.from({length:3},()=>request(app).post(prefix+`/reactions/addOrUpdateReaction/${publicPost.id}`).set('Authorization',`Bearer ${token(b)}`).send({type:'love'})));
    responses.forEach(response=>expect(response.status).toBe(200));expect(await Reaction.countDocuments({publication:publicPost.id,user:b.id})).toBe(1);
  });
  it('las búsquedas son literales y los cursores inválidos responden 400',async()=>{
    const search=await get('/publication/getPublications?search='+encodeURIComponent('.*'));expect(search.status).toBe(200);expect(search.body.publications).toEqual([]);
    expect((await get('/publication/getPublications?cursor=incorrecto')).status).toBe(400);
  });
  it('rechaza inyección en campos y no expone detalles de errores',async()=>{
    const response=await request(app).post(prefix+'/auth/login').send({username:{$ne:null},password:'Ficticia!123'});expect(response.status).toBe(400);expect(response.body.error).toBeUndefined();
  });
});
