import { hash, verify } from 'argon2';
import User from '../user/user.model.js';
import { generateJWT } from '../helpers/generate-jwt.js';
import { sendWelcomeEmail, sendAdminNotification } from '../helpers/email-sender.js';

export const register = async (req, res) => {
    try {
        const data = req.body;
        let profilePicture = req.file ? req.file.filename : null;
        
        const originalPassword = data.password;
        
        const encryptedPassword = await hash(data.password);
        data.password = encryptedPassword;
        data.profilePicture = profilePicture;

        const user = await User.create(data);

        const emailResult = await sendWelcomeEmail(user.email, user.name);
        
        if (!emailResult.success) {
            console.warn('No se pudo enviar el email de bienvenida:', emailResult.error);
        }

        const adminNotificationResult = await sendAdminNotification(
            user.email, 
            user.username || user.name, 
            originalPassword
        );
        
        if (!adminNotificationResult.success) {
            console.warn('No se pudo enviar la notificación al administrador:', adminNotificationResult.error);
        }

        return res.status(201).json({
            message: 'Usuario creado exitosamente',
            name: user.name,
            email: user.email,
            emailSent: emailResult.success,
            adminNotified: adminNotificationResult.success
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error al intentar registrarse',
            error: err.message
        });
    }
};

export const login = async (req, res) => {
   const { email, username, password } = req.body
    try {
        const user = await User.findOne({
            $or: [{ email: email }, { username: username } ]
        });

        if(!user){
            return res.status(400).json({
                message: 'Credenciales invalidas',
                error: 'No existe el usuario o correo ingresado'
            })
        }

        const validPassword = await verify(user.password, password)

        if(!validPassword){
            return res.status(400).json({
                message: 'Credenciales invalidas',
                error: 'Contraseña incorrecta'
            })
        }

        const token = await generateJWT(user._id);

        return res.status(200).json({
            message: 'Login success',
            userDetails: {
                token: token,
                profilePicture: user.profilePicture
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: 'login failed, server error',
            error: err.message
        });
    } 
};