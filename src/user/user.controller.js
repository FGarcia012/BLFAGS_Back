import { hash, verify } from 'argon2';
import User from './user.model.js';
import fs from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const updatePassword = async (req, res) => {
    try {
        const { uid } = req.params;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(uid);

        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const isCurrentPasswordValid = await verify(user.password, currentPassword);

        if(!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña actual es incorrecta'
            });
        }

        const isNewPasswordSameAsOld = await verify(user.password, newPassword);

        if (isNewPasswordSameAsOld) {
            return res.status(400).json({
                success: false,
                message: 'La nueva contraseña no puede ser la misma que la anterior'
            });
        }

        const encryptedPassword = await hash(newPassword);

        await User.findByIdAndUpdate(uid, { password: encryptedPassword }, { new: true });

        return res.status(200).json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error al intentar actualizar la contraseña',
            error: err.message
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const data = req.body;

        const user = await User.findByIdAndUpdate(uid, data, { new: true });

        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            user
        });
    }catch(err) {
        return res.status(500).json({
            success: false,
            message: 'Error al intentar actualizar el usuario',
            error: err.message
        });
    }
};

export const updateProfilePicture = async (req, res) =>{
    try{
        const {uid} = req.params
        let newProfilePicture = req.file ? req.file.filename : null

        const user = await User.findById(uid)
        if(!newProfilePicture){
            return res.status(400).json({
                success: false,
                message: 'No se proporciono ningun archivo'
            });
        }
        if(user.profilePicture){
            const oldProfilePicture = join(__dirname, '../../public/uploads/profile-picture', user.profilePicture)
            await fs.unlink(oldProfilePicture)
        }
        user.profilePicture = newProfilePicture
        await user.save()

        res.status(200).json({
            success: true,
            message: 'Foto de perfil actualizada exitosamente',
            user
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar el usuario',
            error: err.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params;

        const user = await User.findByIdAndUpdate( uid, { status: false }, { new: true });

        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Usuario eliminado exitosamente',
            user
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error al intentar eliminar el usuario',
            error: err.message
        });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        if(!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron usuarios'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Usuarios obtenidos exitosamente',
            users
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error al intentar obtener los usuarios',
            error: err.message
        });
    }
};

export const getUser = async (req, res) => {
    try {
        const { uid } = req.params;

        const user = await User.findById(uid);

        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Usuario obtenido exitosamente',
            user
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error al intentar obtener el usuario',
            error: err.message
        });
    }
};