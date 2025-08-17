import Publication from './publication.model.js';
import { processPublicationHashtags, removePublicationFromHashtags } from '../helpers/hashtag-helpers.js';

export const getPublications = async (req, res) => {
    try {
        const userId = req.user?._id;
        const userRole = req.user?.role;

        let filter = { status: true };

        if (userRole !== 'ADMIN') {
            filter.$or = [
                { visibility: 'public' },
                { user: userId } 
            ];
        }

        const publications = await Publication.find(filter)
            .populate('user', 'username profilePicture')
            .populate('hashtags', 'name')
            .populate({
                path: 'comments',
                match: { status: true }, 
                populate: {
                    path: 'user',
                    select: 'username profilePicture'
                }
            })
            .populate({
                path: 'reactions',
                match: { status: true },
                populate: {
                    path: 'user',
                    select: 'username'
                }
            })
            .sort({ createdAt: -1 });

        if(!publications || publications.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron publicaciones'
            });
        }

        const publicationsWithReactionCount = publications.map(pub => {
            const pubObj = pub.toObject();
            const reactionCount = {
                like: 0,
                love: 0,
                laugh: 0,
                sad: 0,
                angry: 0,
                total: 0
            };

            if (pubObj.reactions) {
                pubObj.reactions.forEach(reaction => {
                    if (reaction.type && reactionCount.hasOwnProperty(reaction.type)) {
                        reactionCount[reaction.type]++;
                        reactionCount.total++;
                    }
                });
            }

            pubObj.reactionCount = reactionCount;
            
            let userReaction = null;
            if (userId && pubObj.reactions) {
                const userReactionObj = pubObj.reactions.find(r => 
                    r.user && r.user._id.toString() === userId.toString()
                );
                userReaction = userReactionObj ? userReactionObj.type : null;
            }
            pubObj.userReaction = userReaction;

            return pubObj;
        });

        return res.status(200).json({
            success: true,
            message: 'Publicaciones obtenidas exitosamente',
            publications: publicationsWithReactionCount
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener las publicaciones',
            error: err.message
        });
    }
};

export const getPublication = async (req, res) => {
    try {
        const { pid } = req.params;
        const userId = req.user?._id;
        const userRole = req.user?.role;

        const publication = await Publication.findById(pid)
            .populate('user', 'username profilePicture')
            .populate('hashtags', 'name')
            .populate({
                path: 'comments',
                match: { status: true }, 
                populate: {
                    path: 'user',
                    select: 'username profilePicture'
                },
                options: { sort: { createdAt: -1 } } 
            })
            .populate({
                path: 'reactions',
                match: { status: true },
                populate: {
                    path: 'user',
                    select: 'username'
                }
            });

        if(!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        if (!publication.canBeViewedBy(userId, userRole)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para ver esta publicación'
            });
        }

        const pubObj = publication.toObject();
        const reactionCount = {
            like: 0,
            love: 0,
            laugh: 0,
            sad: 0,
            angry: 0,
            total: 0
        };

        if (pubObj.reactions) {
            pubObj.reactions.forEach(reaction => {
                if (reaction.type && reactionCount.hasOwnProperty(reaction.type)) {
                    reactionCount[reaction.type]++;
                    reactionCount.total++;
                }
            });
        }

        pubObj.reactionCount = reactionCount;
        
        let userReaction = null;
        if (userId && pubObj.reactions) {
            const userReactionObj = pubObj.reactions.find(r => 
                r.user && r.user._id.toString() === userId.toString()
            );
            userReaction = userReactionObj ? userReactionObj.type : null;
        }
        pubObj.userReaction = userReaction;

        return res.status(200).json({
            success: true,
            message: 'Publicación obtenida exitosamente',
            publication: pubObj
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener la publicación',
            error: err.message
        });
    }
};export const addPublication = async (req, res) => {
    try {
        const data = req.body;
        let media = req.file ? req.file.filename : null;
        data.media = media;

        if (data.visibility && !['public', 'private'].includes(data.visibility)) {
            return res.status(400).json({
                success: false,
                message: 'Visibilidad inválida. Debe ser "public" o "private"'
            });
        }

        const publication = await Publication.create(data);

        const hashtagIds = await processPublicationHashtags(data.description, publication._id);
        
        publication.hashtags = hashtagIds;
        await publication.save();

        const completePublication = await Publication.findById(publication._id)
            .populate('user', 'username profilePicture')
            .populate('hashtags', 'name');

        return res.status(201).json({
            success: true,
            message: 'Publicación creada exitosamente',
            publication: completePublication
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: 'Error al crear la publicación',
            error: err.message
        });
    }
};

export const updatePublication = async (req, res) => {
    try {
        const { pid } = req.params;
        const data = req.body;
        
        if(req.file) {
            data.media = req.file.filename;
        }

        const currentPublication = await Publication.findById(pid);
        if(!currentPublication) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        let newHashtagIds = currentPublication.hashtags;
        if (data.description) {
            newHashtagIds = await processPublicationHashtags(
                data.description, 
                pid, 
                currentPublication.hashtags
            );
            data.hashtags = newHashtagIds;
        }

        const publication = await Publication.findByIdAndUpdate(pid, data, { new: true })
            .populate('user', 'username profilePicture')
            .populate('hashtags', 'name')
            .populate({
                path: 'comments',
                match: { status: true },
                populate: {
                    path: 'user',
                    select: 'username profilePicture'
                }
            });

        return res.status(200).json({
            success: true,
            message: 'Publicación actualizada exitosamente',
            publication
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar la publicación',
            error: err.message
        });
    }
};

export const deletePublication = async (req, res) => {
    try {
        const { pid } = req.params;

        const publication = await Publication.findById(pid);
        
        if(!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        if (publication.hashtags && publication.hashtags.length > 0) {
            await removePublicationFromHashtags(publication.hashtags, pid);
        }

        await Publication.findByIdAndUpdate(pid, { status: false }, { new: true });

        return res.status(200).json({
            success: true,
            message: 'Publicación eliminada exitosamente',
            publication
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar la publicación',
            error: err.message
        });
    }
};

export const getPublicationsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const requestingUserId = req.user?._id;
        const requestingUserRole = req.user?.role;

        let filter = { user: userId, status: true };

        if (requestingUserRole !== 'ADMIN' && 
            (!requestingUserId || requestingUserId.toString() !== userId.toString())) {
            filter.visibility = 'public';
        }

        const publications = await Publication.find(filter)
            .populate('user', 'username profilePicture')
            .populate('hashtags', 'name')
            .populate({
                path: 'comments',
                match: { status: true }, 
                populate: {
                    path: 'user',
                    select: 'username profilePicture'
                }
            })
            .populate({
                path: 'reactions',
                match: { status: true },
                populate: {
                    path: 'user',
                    select: 'username'
                }
            })
            .sort({ createdAt: -1 });

        if(!publications || publications.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron publicaciones para este usuario'
            });
        }

        const publicationsWithReactionCount = publications.map(pub => {
            const pubObj = pub.toObject();
            const reactionCount = {
                like: 0,
                love: 0,
                laugh: 0,
                sad: 0,
                angry: 0,
                total: 0
            };

            if (pubObj.reactions) {
                pubObj.reactions.forEach(reaction => {
                    if (reaction.type && reactionCount.hasOwnProperty(reaction.type)) {
                        reactionCount[reaction.type]++;
                        reactionCount.total++;
                    }
                });
            }

            pubObj.reactionCount = reactionCount;
            
            let userReaction = null;
            if (requestingUserId && pubObj.reactions) {
                const userReactionObj = pubObj.reactions.find(r => 
                    r.user && r.user._id.toString() === requestingUserId.toString()
                );
                userReaction = userReactionObj ? userReactionObj.type : null;
            }
            pubObj.userReaction = userReaction;

            return pubObj;
        });

        return res.status(200).json({
            success: true,
            message: 'Publicaciones del usuario obtenidas exitosamente',
            publications: publicationsWithReactionCount
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener las publicaciones del usuario',
            error: err.message
        });
    }
};