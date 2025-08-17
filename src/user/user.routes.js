import { Router } from 'express';
import { 
    updatePassword,
    updateUser,
    updateProfilePicture, 
    deleteUser,
    getUsers,
    getUser
} from './user.controller.js';
import {
    updatePasswordValidator,
    updateUserValidator,
    updateProfilePictureValidator,
    deleteUserValidator,
    confirmDeleteUserValidator,
    getUserValidator,
    getUsersValidator
} from '../middlewares/user-validators.js';
import { uploadProfilePicture } from '../middlewares/multer-uploads.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         uid:
 *           type: string
 *           description: ID único del usuario
 *         name:
 *           type: string
 *           description: Nombre completo del usuario
 *         username:
 *           type: string
 *           description: Nombre de usuario único
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         profilePicture:
 *           type: string
 *           description: Nombre del archivo de la foto de perfil
 *         role:
 *           type: string
 *           enum: [ADMIN, USER]
 *           description: Rol del usuario
 *         status:
 *           type: boolean
 *           description: Estado activo/inactivo del usuario
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *       example:
 *         uid: "507f1f77bcf86cd799439011"
 *         name: "Juan Pérez"
 *         username: "juanperez"
 *         email: "juan.perez@email.com"
 *         profilePicture: "profile-1234567890.jpg"
 *         role: "USER"
 *         status: true
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 *     
 *     UpdatePasswordRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           description: Contraseña actual del usuario
 *         newPassword:
 *           type: string
 *           description: Nueva contraseña del usuario
 *       example:
 *         currentPassword: "contraseñaActual123"
 *         newPassword: "nuevaContraseña456"
 *     
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre completo del usuario
 *         username:
 *           type: string
 *           description: Nombre de usuario único
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         role:
 *           type: string
 *           enum: [ADMIN, USER]
 *           description: Rol del usuario
 *       example:
 *         name: "Juan Carlos Pérez"
 *         username: "juancarlos"
 *         email: "juan.carlos@email.com"
 *         role: "USER"
 *     
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica si la operación fue exitosa
 *         message:
 *           type: string
 *           description: Mensaje descriptivo de la operación
 *         data:
 *           description: Datos de respuesta (variable según el endpoint)
 *         error:
 *           type: string
 *           description: Mensaje de error (solo en caso de fallo)
 *   
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /user/updatePassword/{uid}:
 *   put:
 *     summary: Actualizar contraseña del usuario
 *     description: Permite a un usuario cambiar su contraseña proporcionando la contraseña actual y la nueva
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del usuario
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePasswordRequest'
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Contraseña actualizada exitosamente"
 *       400:
 *         description: Error en la validación o contraseña incorrecta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "La contraseña actual es incorrecta"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Error al intentar actualizar la contraseña"
 *               error: "Error message"
 */
router.put('/updatePassword/:uid', updatePasswordValidator, updatePassword);

/**
 * @swagger
 * /user/updateUser/{uid}:
 *   put:
 *     summary: Actualizar datos del usuario
 *     description: Permite actualizar la información básica de un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del usuario
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: "Usuario actualizado exitosamente"
 *               data:
 *                 uid: "507f1f77bcf86cd799439011"
 *                 name: "Juan Carlos Pérez"
 *                 username: "juancarlos"
 *                 email: "juan.carlos@email.com"
 *                 role: "USER"
 *                 status: true
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Error al intentar actualizar el usuario"
 *               error: "Error message"
 */
router.put('/updateUser/:uid', updateUserValidator, updateUser);

/**
 * @swagger
 * /user/updateProfilePicture/{uid}:
 *   patch:
 *     summary: Actualizar foto de perfil del usuario
 *     description: Permite subir o cambiar la foto de perfil de un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del usuario
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen para la foto de perfil (JPG, PNG, JPEG)
 *             required:
 *               - profilePicture
 *     responses:
 *       200:
 *         description: Foto de perfil actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: "Foto de perfil actualizada exitosamente"
 *               user:
 *                 uid: "507f1f77bcf86cd799439011"
 *                 name: "Juan Pérez"
 *                 username: "juanperez"
 *                 email: "juan.perez@email.com"
 *                 profilePicture: "profile-1234567890.jpg"
 *                 role: "USER"
 *                 status: true
 *       400:
 *         description: No se proporcionó ningún archivo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "No se proporciono ningun archivo"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Error al actualizar el usuario"
 *               error: "Error message"
 */
router.patch('/updateProfilePicture/:uid', uploadProfilePicture.single('profilePicture'), updateProfilePictureValidator, updateProfilePicture);

/**
 * @swagger
 * /user/deleteUser/{uid}:
 *   delete:
 *     summary: Eliminar usuario (soft delete)
 *     description: Marca un usuario como inactivo cambiando su status a false
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del usuario a eliminar
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: "Usuario eliminado exitosamente"
 *               data:
 *                 uid: "507f1f77bcf86cd799439011"
 *                 name: "Juan Pérez"
 *                 username: "juanperez"
 *                 email: "juan.perez@email.com"
 *                 profilePicture: "profile-1234567890.jpg"
 *                 role: "USER"
 *                 status: false
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Error al intentar eliminar el usuario"
 *               error: "Error message"
 */
router.delete('/deleteUser/:uid', deleteUserValidator, confirmDeleteUserValidator, deleteUser);

/**
 * @swagger
 * /user/getUser/{uid}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     description: Obtiene la información de un usuario específico mediante su ID único
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID único del usuario
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: "Usuario obtenido exitosamente"
 *               data:
 *                 uid: "507f1f77bcf86cd799439011"
 *                 name: "Juan Pérez"
 *                 username: "juanperez"
 *                 email: "juan.perez@email.com"
 *                 profilePicture: "profile-1234567890.jpg"
 *                 role: "USER"
 *                 status: true
 *                 createdAt: "2023-01-01T00:00:00.000Z"
 *                 updatedAt: "2023-01-01T00:00:00.000Z"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Error al intentar obtener el usuario"
 *               error: "Error message"
 */
router.get('/getUser/:uid', getUserValidator, getUser);

/**
 * @swagger
 * /user/getUsers:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Obtiene una lista de todos los usuarios registrados en el sistema
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuarios obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: "Usuarios obtenidos exitosamente"
 *               data: [
 *                 {
 *                   uid: "507f1f77bcf86cd799439011",
 *                   name: "Juan Pérez",
 *                   username: "juanperez",
 *                   email: "juan.perez@email.com",
 *                   profilePicture: "profile-1234567890.jpg",
 *                   role: "USER",
 *                   status: true,
 *                   createdAt: "2023-01-01T00:00:00.000Z",
 *                   updatedAt: "2023-01-01T00:00:00.000Z"
 *                 },
 *                 {
 *                   uid: "507f1f77bcf86cd799439012",
 *                   name: "María García",
 *                   username: "mariagarcia",
 *                   email: "maria.garcia@email.com",
 *                   profilePicture: null,
 *                   role: "ADMIN",
 *                   status: true,
 *                   createdAt: "2023-01-02T00:00:00.000Z",
 *                   updatedAt: "2023-01-02T00:00:00.000Z"
 *                 }
 *               ]
 *       404:
 *         description: No se encontraron usuarios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "No se encontraron usuarios"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Error al intentar obtener los usuarios"
 *               error: "Error message"
 */
router.get('/getUsers', getUsersValidator, getUsers);

export default router;