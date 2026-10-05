import {vi,it,expect} from 'vitest';
vi.mock('cloudinary',()=>({v2:{config:vi.fn(),uploader:{upload_stream:vi.fn((options,callback)=>({end:()=>callback(null,{secure_url:'https://res.cloudinary.com/test/image/upload/v1/'+options.public_id+'.gif',public_id:options.public_id})})),destroy:vi.fn(async()=>({result:'ok'}))}}}));
import {v2 as cloudinary} from 'cloudinary';
import {storeUpload,destroyAsset} from '../src/middlewares/multer-uploads.js';
it('genera identificadores aleatorios y solicita quitar metadatos',async()=>{
 const file={buffer:Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7','base64'),size:42,fieldname:'media',originalname:'archivo_original_ficticio.gif'};
 const req={file},next=vi.fn();await storeUpload(req,null,next);
 const options=cloudinary.uploader.upload_stream.mock.calls[0][0];expect(options.public_id).toMatch(/^BLFAGS\/[a-f0-9-]{36}$/);expect(options.public_id).not.toContain('original');expect(options.transformation).toEqual([{flags:'strip_metadata'}]);expect(next).toHaveBeenCalledOnce();
 await destroyAsset(req.file.asset);expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(options.public_id,{resource_type:'image',invalidate:true});
});
it('rechaza un archivo cuya firma real no está permitida',async()=>{
 await expect(storeUpload({file:{buffer:Buffer.from('contenido ficticio'),size:18,fieldname:'media'}},null,vi.fn())).rejects.toMatchObject({status:400});
});
