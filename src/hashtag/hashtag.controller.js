import Hashtag from './hashtag.model.js';
import {publicationPage} from '../helpers/publication-page.js';
import {visibleFilter,fail,escapeRegex} from '../helpers/privacy.js';
const visibleTags = req => Hashtag.find({status:true}).populate({path:'publications',match:visibleFilter(req.user),select:'title createdAt',options:{limit:30}}).limit(100).lean();
export const getHashtags = async (req,res) => res.json({success:true,hashtags:(await visibleTags(req)).filter(h => h.publications.length).map(h => ({...h,hid:h._id}))});
export const getHashtag = async (req,res) => {
 const hashtag = await Hashtag.findOne({_id:req.params.hid,status:true}).populate({path:'publications',match:visibleFilter(req.user),select:'title createdAt',options:{limit:30}}).lean();
 if (!hashtag?.publications.length) throw fail(404,'Hashtag no encontrado');
 res.json({success:true,hashtag:{...hashtag,hid:hashtag._id}});
};
export const searchHashtags = async (req,res) => {
 const query = req.query.query;
 if (typeof query !== 'string' || query.trim().length < 2 || query.length > 100) throw fail(400,'Busca entre 2 y 100 caracteres');
 const hashtags = await Hashtag.find({status:true,name:{$regex:escapeRegex(query.trim()),$options:'i'}}).populate({path:'publications',match:visibleFilter(req.user),select:'title createdAt',options:{limit:30}}).limit(30).lean();
 res.json({success:true,hashtags:hashtags.filter(h => h.publications.length).map(h => ({...h,hid:h._id}))});
};
export const getPublicationsByHashtag = async (req,res) => {
 const hashtag = await Hashtag.findOne({name:req.params.name.toLowerCase(),status:true}).select('_id');
 if (!hashtag) return res.json({success:true,publications:[],nextCursor:null,hasMore:false});
 res.json(await publicationPage(req,{hashtags:hashtag._id}));
};
export const addHashtag = async (req,res) => res.status(201).json({success:true,hashtag:await Hashtag.create({name:req.body.name})});
export const deleteHashtag = async (req,res) => {
 const hashtag = await Hashtag.findByIdAndUpdate(req.params.hid,{$set:{status:false}},{new:true});
 if (!hashtag) throw fail(404,'Hashtag no encontrado'); res.json({success:true,message:'Hashtag eliminado'});
};
