import {body,param,validationResult} from 'express-validator';
import Publication from '../publication/publication.model.js';
import {fail,sameId} from '../helpers/privacy.js';
export const id = field => param(field).isMongoId().withMessage('Identificador inválido');
export const username = () => body('username').isString().bail().trim().matches(/^[a-zA-Z0-9_]{3,20}$/).withMessage('El alias debe tener 3–20 letras, números o guiones bajos');
export const email = () => body('email').isString().bail().trim().isEmail().bail().isLength({max:254}).toLowerCase().withMessage('Correo inválido');
export const password = field => body(field).isString().bail().isLength({min:8,max:128}).isStrongPassword({minLength:8}).withMessage('Usa 8–128 caracteres con mayúscula, minúscula, número y símbolo');
export const validate = (req,_res,next) => { if (!validationResult(req).isEmpty()) return next(fail(400,'Datos inválidos. Revisa los campos del formulario')); next(); };
export function rejectUnsafeKeys(req,_res,next) {
 const unsafe = obj => obj && typeof obj === 'object' && Object.entries(obj).some(([key,val]) => key.startsWith('$') || key.includes('.') || unsafe(val));
 if (unsafe(req.body) || unsafe(req.query)) return next(fail(400,'Datos inválidos')); next();
}
export const owner = (req,_res,next) => { if (!sameId(req.params.uid,req.user?._id)) return next(fail(403,'No tienes permiso para modificar esta cuenta')); next(); };
export const loadPublication = async (req,_res,next) => {
 const publication = await Publication.findById(req.params.pid || req.body.publication);
 if (!publication || !publication.canBeViewedBy(req.user?._id)) throw fail(404,'Publicación no encontrada');
 req.publication = publication; next();
};
export const editPublication = (req,_res,next) => { if (!req.publication.canBeEditedBy(req.user?._id,req.user?.role)) return next(fail(403,'No tienes permiso para modificar esta publicación')); next(); };
export const errorHandler = async (err,req,res,_next) => {
 if (req.file?.asset) { try { const {destroyAsset} = await import('./multer-uploads.js'); await destroyAsset(req.file.asset); } catch { console.error('Fallo al limpiar un archivo'); } }
 if (res.headersSent) return;
 const status = err.status || (err.code === 11000 ? 409:['ValidationError','CastError','MulterError'].includes(err.name) ? 400:500);
 if (status >= 500) console.error('Error interno:',err.name);
 res.status(status).json({success:false,message:status >= 500 ? 'Ocurrió un error en el servidor':err.code === 11000 ? 'No se puede usar ese alias o correo':err.status ? err.message:'Datos inválidos'});
};
