import Publication from '../publication/publication.model.js';

export const validatePublicationOwnership = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        if (userRole === 'ADMIN') {
            return next();
        }

        const publication = await Publication.findById(pid);
        
        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        if (publication.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Solo puedes modificar tus propias publicaciones'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al validar propiedad de publicación',
            error: error.message
        });
    }
};
