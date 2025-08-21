export const validateUserOwnership = (req, res, next) => {
    try {
        const { uid } = req.params; 
        const userRole = req.user.role; 
        const authenticatedUserId = req.user._id.toString();

        if (userRole === 'ADMIN') {
            return next();
        }

        if (userRole === 'USER' && authenticatedUserId === uid) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: 'No tienes permisos para acceder a esta información'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error en la validación de permisos',
            error: error.message
        });
    }
};