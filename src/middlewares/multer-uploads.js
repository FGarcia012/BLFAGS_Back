import multer from 'multer';
import {v2 as cloudinary} from 'cloudinary';
import {randomUUID} from 'node:crypto';
import {fileTypeFromBuffer} from 'file-type';
import {fail} from '../helpers/privacy.js';
export const configureCloudinary = () => cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET});
const mb = kind => Math.min(Number(process.env[kind === 'image' ? 'MAX_IMAGE_MB':'MAX_VIDEO_MB'] || 4),4)*1000000;
const upload = profile => multer({storage:multer.memoryStorage(),limits:{fileSize:profile ? mb('image'):Math.max(mb('image'),mb('video')),files:1,fields:15,fieldSize:10000}});
export const uploadProfilePicture = upload(true);
export const uploadPublications = upload(false);
export const uploadComments = upload(false);
export async function storeUpload(req,_res,next) {
 if (!req.file) return next();
 const type = await fileTypeFromBuffer(req.file.buffer);
 const image = ['image/jpeg','image/png','image/webp','image/gif'].includes(type?.mime),video = ['video/mp4','video/quicktime','video/webm'].includes(type?.mime);
 if ((!image && !video) || (req.file.fieldname === 'profilePicture' && !image)) throw fail(400,'Tipo de archivo no permitido');
 if (req.file.size > mb(image ? 'image':'video')) throw fail(413,'El archivo supera el límite permitido');
 const resource_type = image ? 'image':'video';
 const result = await new Promise((resolve,reject) => {
  cloudinary.uploader.upload_stream({public_id:`BLFAGS/${randomUUID()}`,resource_type,transformation:[{flags:'strip_metadata'}],overwrite:false},(err,result) => err ? reject(err):resolve(result)).end(req.file.buffer);
 });
 req.file.path = result.secure_url; req.file.asset = {publicId:result.public_id,resourceType:resource_type}; next();
}
export async function destroyAsset(asset) {
 if (!asset) return;
 let publicId,resourceType;
 if (typeof asset === 'string') {
  const match = /^https:\/\/res\.cloudinary\.com\/[^/]+\/(image|video)\/upload\/(?:v\d+\/)?(.+)\.[^./]+$/.exec(asset);
  if (!match) return;
  resourceType = match[1]; publicId = match[2];
 } else ({publicId,resourceType} = asset);
 await cloudinary.uploader.destroy(publicId,{resource_type:resourceType,invalidate:true});
}
