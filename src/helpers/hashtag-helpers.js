import Hashtag from '../hashtag/hashtag.model.js';

export const extractHashtags = (text) => {
    if (!text || typeof text !== 'string') return [];
    
    const hashtagRegex = /#([a-záéíóúüñA-ZÁÉÍÓÚÜÑ0-9_]+)/g;
    const hashtags = [];
    let match;
    
    while ((match = hashtagRegex.exec(text)) !== null) {
        const normalizedHashtag = match[1].toLowerCase().trim();
        
        if (!hashtags.includes(normalizedHashtag)) {
            hashtags.push(normalizedHashtag);
        }
    }
    
    return hashtags;
};

export const processHashtags = async (hashtagNames, publicationId) => {
    const hashtagIds = [];
    
    for (const name of hashtagNames) {
        try {
            const normalizedName = name.toLowerCase().trim();
            
            let hashtag = await Hashtag.findOne({ name: normalizedName });
            
            if (hashtag) {
                if (!hashtag.publications.includes(publicationId)) {
                    hashtag = await Hashtag.findByIdAndUpdate(
                        hashtag._id,
                        { $addToSet: { publications: publicationId } },
                        { new: true }
                    );
                }
            } else {
                hashtag = await Hashtag.create({
                    name: normalizedName,
                    publications: [publicationId]
                });
            }
            
            hashtagIds.push(hashtag._id);
        } catch (error) {
            console.error(`Error procesando hashtag "${name}":`, error);
        }
    }
    
    return hashtagIds;
};

export const removePublicationFromHashtags = async (hashtagIds, publicationId) => {
    try {
        await Hashtag.updateMany(
            { _id: { $in: hashtagIds } },
            { $pull: { publications: publicationId } }
        );
        
        await Hashtag.deleteMany({
            _id: { $in: hashtagIds },
            publications: { $size: 0 }
        });
    } catch (error) {
        console.error('Error removiendo publicación de hashtags:', error);
    }
};

export const processPublicationHashtags = async (description, publicationId, previousHashtagIds = []) => {
    try {
        const hashtagNames = extractHashtags(description);
        
        if (previousHashtagIds.length > 0) {
            await removePublicationFromHashtags(previousHashtagIds, publicationId);
        }
        
        const newHashtagIds = await processHashtags(hashtagNames, publicationId);
        
        return newHashtagIds;
    } catch (error) {
        console.error('Error procesando hashtags de publicación:', error);
        return [];
    }
};
