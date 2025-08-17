import Reaction from '../reaction/reaction.model.js';

export const getReactionStats = async (publicationId) => {
    try {
        const reactions = await Reaction.find({
            publication: publicationId,
            status: true
        });

        const stats = {
            like: 0,
            love: 0,
            laugh: 0,
            sad: 0,
            angry: 0,
            total: 0
        };

        reactions.forEach(reaction => {
            if (stats.hasOwnProperty(reaction.type)) {
                stats[reaction.type]++;
                stats.total++;
            }
        });

        return stats;
    } catch (error) {
        console.error('Error al obtener estadísticas de reacciones:', error);
        return {
            like: 0,
            love: 0,
            laugh: 0,
            sad: 0,
            angry: 0,
            total: 0
        };
    }
};

export const getUserReactionForPublication = async (publicationId, userId) => {
    try {
        return await Reaction.findOne({
            publication: publicationId,
            user: userId,
            status: true
        }).populate('user', 'username name');
    } catch (error) {
        console.error('Error al obtener reacción del usuario:', error);
        return null;
    }
};

export const isValidReactionType = (type) => {
    const validTypes = ['like', 'love', 'laugh', 'sad', 'angry'];
    return validTypes.includes(type);
};

export const getPublicationReactionsWithUsers = async (publicationId) => {
    try {
        return await Reaction.find({
            publication: publicationId,
            status: true
        })
        .populate('user', 'username name')
        .sort({ createdAt: -1 });
    } catch (error) {
        console.error('Error al obtener reacciones con usuarios:', error);
        return [];
    }
};
