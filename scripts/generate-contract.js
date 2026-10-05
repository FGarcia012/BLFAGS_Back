import {readFileSync,writeFileSync} from 'node:fs';
const paths={},items=[],table=['| Método | Ruta | Sesión | Límite |','|---|---|---|---|'];
const operationDetails={
 register:'Crear una cuenta USER y enviar una sola bienvenida',login:'Iniciar sesión sin revelar si existe una cuenta',
 getPublications:'Feed por cursor con conteos e isMine; sin listas de comentarios ni reacciones',getPublication:'Leer una publicación visible',
 getPublicationsByUser:'Publicaciones visibles de un usuario, por cursor',getCommentsByPublication:'Comentarios visibles por cursor',
 getPublicationReactions:'Conteos y reacción propia; sin identidades',getUserReaction:'Solo el tipo de reacción propia',getUser:'Perfil público; correo únicamente para su propietario',getUsers:'Hasta 100 aliases y metadatos de moderación, sin datos personales'
};
for(const module of ['auth','user','publication','comment','reaction','hashtag']) {
 const source=readFileSync(`src/${module}/${module}.routes.js`,'utf8');
 for(const match of source.matchAll(/router\.(get|post|put|patch|delete)\('([^']+)',([^\n]+)\);/g)) {
  const [,method,route,middlewares]=match,controller=middlewares.split(',').at(-1).trim();
  const path='/'+(module==='reaction'?'reactions':module)+route.replace(/:([A-Za-z]+)/g,'{$1}');
  const admin=middlewares.includes("hasRoles('ADMIN')"),auth=middlewares.includes('validateJWT') || admin;
  const paginated=['getPublications','getPublicationsByUser','getPublicationsByHashtag','getCommentsByPublication','getComments'].includes(controller);
  const parameters=[...path.matchAll(/\{([^}]+)\}/g)].map(m=>({in:'path',name:m[1],required:true,schema:{type:'string'}}));
  if(paginated) parameters.push({in:'query',name:'limit',schema:{type:'integer',minimum:1,maximum:30,default:20}},{in:'query',name:'cursor',schema:{type:'string'}});
  if(controller==='getPublications') parameters.push({in:'query',name:'search',schema:{type:'string',minLength:2,maxLength:100}},{in:'query',name:'filter',schema:{type:'string',enum:['all','public','private']}});
  if(controller==='searchHashtags') parameters.push({in:'query',name:'query',required:true,schema:{type:'string',minLength:2,maxLength:100}});
  const operation={summary:operationDetails[controller] || controller,tags:[module],parameters,security:auth ? [{bearerAuth:[]}]:[],responses:{200:{description:'Operación completada'},400:{description:'Datos inválidos'},401:{description:'Sesión inválida o expirada'},404:{description:'Recurso no disponible'},429:{description:'Demasiadas solicitudes'}}};
  if(method==='post') operation.responses[201]={description:'Recurso creado cuando corresponde'};
  if(['post','put','patch'].includes(method)) operation.requestBody={content:{[middlewares.includes('.single(') ? 'multipart/form-data':'application/json']:{schema:{$ref:'#/components/schemas/'+(controller==='register' ? 'RegisterInput':controller==='login' ? 'LoginInput':controller.includes('Publication') ? 'PublicationInput':controller==='addComment' ? 'CommentInput':controller==='addOrUpdateReaction' ? 'ReactionInput':controller==='updatePassword' ? 'PasswordInput':controller==='updateUser' ? 'UserInput':'FileInput')}}}};
  paths[path]={...paths[path],[method]:operation};
  const rate=controller==='login'?'5 fallos/15 min':controller==='register'?'3/h':method==='get'?'global 600/min':'20/min por usuario; archivos 10/h';
  table.push(`| ${method.toUpperCase()} | \`${path}\` | ${admin?'ADMIN':auth?'JWT':'Opcional / pública'} | ${rate} |`);
  const fields={register:{username:'{{username}}',email:'{{email}}',password:'{{password}}'},login:{username:'{{username}}',password:'{{password}}'},addPublication:{title:'{{title}}',description:'{{description}}',visibility:'public'},updatePublication:{title:'{{title}}',description:'{{description}}',visibility:'public'},addComment:{publication:'{{pid}}',text:'{{text}}'},addOrUpdateReaction:{type:'like'},updatePassword:{currentPassword:'{{currentPassword}}',newPassword:'{{newPassword}}'},updateUser:{username:'{{username}}'},deleteUser:{confirm:'Si'},addHashtag:{name:'{{hashtag}}'}}[controller] || {};
  const multipart=middlewares.includes('.single(');
  const input=method==='get' ? {} : {body:multipart ? {mode:'formdata',formdata:[...Object.entries(fields).map(([key,value])=>({key,value,type:'text'})),{key:controller==='updateProfilePicture'?'profilePicture':'media',type:'file',src:[],disabled:controller!=='updateProfilePicture'}]}:{mode:'raw',raw:JSON.stringify(fields,null,2),options:{raw:{language:'json'}}}};
  const suffix=paginated?'?limit=20':controller==='searchHashtags'?'?query={{query}}':'';
  items.push({name:operation.summary,request:{method:method.toUpperCase(),auth:auth ? {type:'bearer',bearer:[{key:'token',value:'{{token}}',type:'string'}]}:{type:'noauth'},url:{raw:'{{baseUrl}}'+path.replace(/\{([^}]+)\}/g,'{{$1}}')+suffix,host:['{{baseUrl}}'],path:path.slice(1).split('/')},...input}});
 }
}
const object=properties=>({type:'object',properties});
const string={type:'string'};
const schemas={
 RegisterInput:{...object({username:{type:'string',pattern:'^[a-zA-Z0-9_]{3,20}$'},email:{type:'string',format:'email'},password:{type:'string',minLength:8,maxLength:128}}),required:['username','email','password']},
 LoginInput:object({username:string,email:{type:'string',format:'email'},password:{type:'string',maxLength:128}}),
 PublicationInput:object({title:{type:'string',maxLength:200},description:{type:'string',maxLength:1000},visibility:{type:'string',enum:['public','private']},media:{type:'string',format:'binary'}}),
 CommentInput:object({publication:string,text:{type:'string',maxLength:500},media:{type:'string',format:'binary'}}),
 ReactionInput:object({type:{type:'string',enum:['like','love','laugh','sad','angry']}}),
 UserInput:object({username:string,email:{type:'string',format:'email'}}),PasswordInput:object({currentPassword:string,newPassword:{type:'string',minLength:8,maxLength:128}}),FileInput:object({profilePicture:{type:'string',format:'binary'}}),
 Counts:object(Object.fromEntries(['like','love','laugh','sad','angry','total'].map(k=>[k,{type:'integer',minimum:0}]))),
 Feed:object({success:{type:'boolean'},publications:{type:'array',items:{type:'object',properties:{pid:string,title:string,description:string,isMine:{type:'boolean'},commentCount:{type:'integer'},reactionCount:{$ref:'#/components/schemas/Counts'},userReaction:{type:'string',nullable:true}}}},nextCursor:{type:'string',nullable:true},hasMore:{type:'boolean'}})
};
paths['/publication/getPublications'].get.responses[200].content={'application/json':{schema:{$ref:'#/components/schemas/Feed'}}};
paths['/reactions/getPublicationReactions/{pid}'].get.responses[200].content={'application/json':{schema:object({success:{type:'boolean'},counts:{$ref:'#/components/schemas/Counts'},userReaction:{type:'string',nullable:true}})}};
paths['/reactions/getUserReaction/{pid}'].get.responses[200].content={'application/json':{schema:object({type:{type:'string',nullable:true}})}};
writeFileSync('configs/openapi.json',JSON.stringify({openapi:'3.0.3',info:{title:'BLFAGS — blog con alias',version:'2.0.0'},servers:[{url:'/BLFAGS/v1'}],paths,components:{securitySchemes:{bearerAuth:{type:'http',scheme:'bearer',bearerFormat:'JWT'}},schemas}},null,2));
writeFileSync('configs/BLFAGS.postman_collection.json',JSON.stringify({info:{name:'BLFAGS — contrato seguro',schema:'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'},variable:[{key:'baseUrl',value:'http://localhost:3020/BLFAGS/v1'},{key:'token',value:''}],item:items},null,2));
writeFileSync('docs/endpoints.md',table.join('\n')+'\n');
console.log('Contrato y colección generados:',items.length,'endpoints');
