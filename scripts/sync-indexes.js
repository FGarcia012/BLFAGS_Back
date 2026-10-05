import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/user/user.model.js';
import Publication from '../src/publication/publication.model.js';
import Comment from '../src/comment/comment.model.js';
import Reaction from '../src/reaction/reaction.model.js';
import Hashtag from '../src/hashtag/hashtag.model.js';
try {
 if (!process.env.URI_MONGO) throw new Error('Falta URI_MONGO');
 await mongoose.connect(process.env.URI_MONGO,{autoIndex:false});
 const duplicates = await User.aggregate([{$group:{_id:'$username',count:{$sum:1}}},{$match:{count:{$gt:1}}},{$count:'total'}]).collation({locale:'en',strength:2});
 const count = duplicates[0]?.total || 0;
 console.log('Grupos de aliases duplicados:',count);
 if (count) throw new Error('Resuelve duplicados antes de sincronizar');
 for (const model of [User,Publication,Comment,Reaction,Hashtag]) {
  const diff = await model.diffIndexes(); console.log(model.modelName,'Índices por crear:',diff.toCreate.length,'por retirar:',diff.toDrop.length);
  if (process.argv.includes('--apply')) await model.syncIndexes();
 }
 if (!process.argv.includes('--apply')) console.log('Simulación. No se modificaron índices.');
} catch {console.error('No se pudieron sincronizar los índices; revisa la configuración o los duplicados'); process.exitCode = 1;}
finally {await mongoose.disconnect();}
