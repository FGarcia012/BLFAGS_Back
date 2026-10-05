import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import {dbConnection} from './mongo.js';
import {validateEnv} from './env.js';
import auth from '../src/auth/auth.routes.js';
import user from '../src/user/user.routes.js';
import hashtag from '../src/hashtag/hashtag.routes.js';
import comment from '../src/comment/comment.routes.js';
import publication from '../src/publication/publication.routes.js';
import reactions from '../src/reaction/reaction.routes.js';
import apiLimiter from '../src/middlewares/rate-limit-validator.js';
import {rejectUnsafeKeys,errorHandler} from '../src/middlewares/security.js';
import {swaggerDocs,swaggerUi} from './swagger.js';
import {configureCloudinary} from '../src/middlewares/multer-uploads.js';
export function createApp() {
 const app = express(); app.disable('x-powered-by'); app.set('trust proxy',1);
 app.use(helmet()); app.use(cors({origin:(origin,callback) => callback(null,!origin || (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map(s => s.trim()).includes(origin))}));
 app.use(apiLimiter); app.use(express.urlencoded({extended:false,limit:'100kb'})); app.use(express.json({limit:'100kb'})); app.use(rejectUnsafeKeys);
 app.use((req,res,next) => {res.set('Cache-Control','no-store'); res.vary('Authorization'); next();});
 if (process.env.NODE_ENV !== 'production') app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));
 for (const [path,router] of Object.entries({auth,user,hashtag,comment,publication,reactions})) app.use(`/BLFAGS/v1/${path}`,router);
 app.use((_req,res) => res.status(404).json({success:false,message:'Ruta no encontrada'})); app.use(errorHandler); return app;
}
export async function initServer() {validateEnv(); configureCloudinary(); await dbConnection(); const app = createApp(); return app.listen(process.env.PORT || 3020,() => console.log('Servidor iniciado'));}
