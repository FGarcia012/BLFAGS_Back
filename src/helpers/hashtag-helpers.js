import Hashtag from '../hashtag/hashtag.model.js';
export const extractHashtags = text => typeof text === 'string' ? [...new Set([...text.matchAll(/#([a-záéíóúüñA-ZÁÉÍÓÚÜÑ0-9_]{1,40})/g)].map(m => m[1].toLowerCase()))].slice(0,10):[];
export const processHashtags = async (names,publication) => Promise.all(names.map(async name => {
 try {return (await Hashtag.findOneAndUpdate({name},{$set:{status:true},$addToSet:{publications:publication}},{upsert:true,new:true}))._id;}
 catch(err) {if (err.code !== 11000) throw err; return (await Hashtag.findOneAndUpdate({name},{$set:{status:true},$addToSet:{publications:publication}},{new:true}))._id;}
}));
export const removePublicationFromHashtags = (ids,publication) => Hashtag.updateMany({_id:{$in:ids}},{$pull:{publications:publication}});
export const processPublicationHashtags = async (description,publication,previous = []) => {if (previous.length) await removePublicationFromHashtags(previous,publication); return processHashtags(extractHashtags(description),publication);};
