import jwt from 'jsonwebtoken';
import User from '../user/user.model.js';

export const validateJWT = async (req, res, next) => {
    try {
        let token = (req.body && req.body.token) || req.query.token || req.headers['authorization'];

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'No existe token en la petición'
            });
        }

        token = token.replace(/^Bearer\s+/, "");

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        console.log(`Token uid: ${uid}`);

        const user = await User.findById(uid);
        console.log(`User found: ${user}`);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'El usuario no existe en la base de datos'
            });
        }

        if (!user.status) {
            return res.status(400).json({
                success: false,
                message: 'Usuario desactivado previamente'
            });
        }

        req.user = user;
        next();
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error al validar el token',
            error: err.message
        });
    }
};

export const optionalJWT = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            req.user = null;
            return next();
        }

        try {
            const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
            
            const user = await User.findById(uid);
            
            if (!user || !user.status) {
                req.user = null;
                return next();
            }
            
            req.user = user;
            next();
            
        } catch (jwtError) {
            req.user = null;
            next();
        }
        
    } catch (error) {
        req.user = null;
        next();
    }
};