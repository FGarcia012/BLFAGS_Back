import 'dotenv/config';
import mongoose from 'mongoose';
try {
 if (!process.env.URI_MONGO) throw new Error('Falta URI_MONGO');
 await mongoose.connect(process.env.URI_MONGO,{autoIndex:false});
 const collection = mongoose.connection.collection('users');
 const count = await collection.countDocuments({name:{$exists:true}});
 console.log('Documentos que requieren migración:',count);
 if (process.argv.includes('--apply')) {const result = await collection.updateMany({name:{$exists:true}},{$unset:{name:1}}); console.log('Documentos modificados:',result.modifiedCount);}
 else console.log('Simulación. No se modificaron datos. Usa --apply tras respaldar la base.');
} catch {console.error('No se pudo completar la migración'); process.exitCode = 1;}
finally {await mongoose.disconnect();}
