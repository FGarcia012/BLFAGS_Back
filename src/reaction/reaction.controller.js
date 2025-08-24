import Reaction from './reaction.model.js';
import Publication from '../publication/publication.model.js';
import { 
    getReactionStats, 
    getUserReactionForPublication, 
    getPublicationReactionsWithUsers,
    isValidReactionType 
} from '../helpers/reaction-helpers.js';

export const addOrUpdateReaction = async (req, res) => {
    try {
        const { pid } = req.params;
        const { type } = req.body;
        const userId = req.user._id;

        if (!isValidReactionType(type)) {
            return res.status(400).json({
                success: false,
                message: 'Tipo de reacción inválido'
            });
        }

        const publication = await Publication.findById(pid);
        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        if (!publication.canReactBy(userId, req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para reaccionar a esta publicación'
            });
        }

        let reaction = await Reaction.findOne({
            user: userId,
            publication: pid,
            status: true
        });

        if (reaction) {
            reaction.type = type;
            await reaction.save();
            
            return res.status(200).json({
                success: true,
                message: 'Reacción actualizada exitosamente',
                reaction
            });
        } else {
            reaction = await Reaction.create({
                user: userId,
                publication: pid,
                type
            });

            await Publication.findByIdAndUpdate(
                pid,
                { $push: { reactions: reaction._id } }
            );

            const populatedReaction = await Reaction.findById(reaction._id)
                .populate('user', 'username profilePicture');

            return res.status(201).json({
                success: true,
                message: 'Reacción agregada exitosamente',
                reaction: populatedReaction
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error al procesar la reacción',
            error: err.message
        });
    }
};

export const removeReaction = async (req, res) => {
    try {
        const { pid } = req.params;
        const userId = req.user._id;

        const publication = await Publication.findById(pid);
        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        const reaction = await Reaction.findOne({
            user: userId,
            publication: pid,
            status: true
        });

        if (!reaction) {
            return res.status(404).json({
                success: false,
                message: 'No tienes reacción en esta publicación'
            });
        }

        await Reaction.findByIdAndDelete(reaction._id);

        await Publication.findByIdAndUpdate(
            pid,
            { $pull: { reactions: reaction._id } }
        );

        return res.status(200).json({
            success: true,
            message: 'Reacción eliminada exitosamente'
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar la reacción',
            error: err.message
        });
    }
};

export const getPublicationReactions = async (req, res) => {
    try {
        const { pid } = req.params;
        const userId = req.user?._id;
        const userRole = req.user?.role;

        const publication = await Publication.findById(pid);
        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        if (userId && !publication.canBeViewedBy(userId, userRole)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para ver las reacciones de esta publicación'
            });
        }

        const [counts, reactions] = await Promise.all([
            getReactionStats(pid),
            getPublicationReactionsWithUsers(pid)
        ]);

        let userReaction = null;
        if (userId) {
            userReaction = reactions.find(reaction => 
                reaction.user._id.toString() === userId.toString()
            );
        }

        return res.status(200).json({
            success: true,
            message: 'Reacciones obtenidas exitosamente',
            data: {
                reactions,
                counts,
                userReaction: userReaction ? userReaction.type : null
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener las reacciones',
            error: err.message
        });
    }
};

export const getUserReaction = async (req, res) => {
    try {
        const { pid } = req.params;
        const userId = req.user._id;

        const publication = await Publication.findById(pid);
        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        if (!publication.canBeViewedBy(userId, req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para ver esta publicación'
            });
        }

        const reaction = await getUserReactionForPublication(pid, userId);

        if (!reaction) {
            return res.status(404).json({
                success: false,
                message: 'No tienes reacción en esta publicación'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Reacción del usuario obtenida exitosamente',
            data: reaction
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener la reacción del usuario',
            error: err.message
        });
    }
};
