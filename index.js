import 'dotenv/config';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {initServer} from './configs/server.js';
import {createApp} from './configs/server.js';
import {validateEnv} from './configs/env.js';
import {dbConnection} from './configs/mongo.js';
import {configureCloudinary} from './src/middlewares/multer-uploads.js';
let ready;
export default async function handler(req,res) {
 try {
  ready ||= (async()=>{validateEnv();configureCloudinary();await dbConnection();return createApp();})();
  const app=await ready;return app(req,res);
 } catch {ready=null;console.error('Error de inicialización');return res.status(503).json({success:false,message:'Servicio temporalmente no disponible'});}
}
if (!process.env.VERCEL && process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) initServer().catch(() => {console.error('No se pudo iniciar el servidor. Revisa la configuración y la conexión'); process.exitCode = 1;});
