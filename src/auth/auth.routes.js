import { Router } from 'express';
import { register, login } from './auth.controller.js';
import { registerValidator, loginValidator } from '../middlewares/user-validators.js';
import { uploadProfilePicture } from '../middlewares/multer-uploads.js';
import { trackAuth } from '../middlewares/speed-insights.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre completo del usuario
 *           example: "Juan Pérez"
 *         username:
 *           type: string
 *           description: Nombre de usuario único
 *           example: "juanperez123"
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *           example: "juan@example.com"
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario (mínimo 8 caracteres, 1 minúscula, 1 mayúscula, 1 número y 1 símbolo)
 *           example: "MiPassword123!"
 *         profilePicture:
 *           type: string
 *           format: binary
 *           description: Imagen de perfil del usuario
 *     
 *     LoginRequest:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario (opcional si se proporciona username)
 *           example: "juan@example.com"
 *         username:
 *           type: string
 *           description: Nombre de usuario (opcional si se proporciona email)
 *           example: "juanperez123"
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *           example: "MiPassword123!"
 *     
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Usuario creado exitosamente"
 *         name:
 *           type: string
 *           example: "Juan Pérez"
 *         email:
 *           type: string
 *           example: "juan@example.com"
 *     
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Login success"
 *         userDetails:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: JWT token para autenticación
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             profilePicture:
 *               type: string
 *               description: Nombre del archivo de la imagen de perfil
 *               example: "profile-123456789.jpg"
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Error al intentar registrarse"
 *         error:
 *           type: string
 *           example: "Detalles del error"
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre completo del usuario
 *                 example: "Juan Pérez"
 *               username:
 *                 type: string
 *                 description: Nombre de usuario único
 *                 example: "juanperez123"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *                 example: "juan@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario (mínimo 8 caracteres, 1 minúscula, 1 mayúscula, 1 número y 1 símbolo)
 *                 example: "MiPassword123!"
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil del usuario (opcional)
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/register", trackAuth, uploadProfilePicture.single("profilePicture"), registerValidator, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Autenticación]
 *     description: Permite a un usuario iniciar sesión usando su email o nombre de usuario junto con su contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             login_with_email:
 *               summary: Login con email
 *               value:
 *                 email: "juan@example.com"
 *                 password: "MiPassword123!"
 *             login_with_username:
 *               summary: Login con username
 *               value:
 *                 username: "juanperez123"
 *                 password: "MiPassword123!"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Credenciales invalidas"
 *                 error:
 *                   type: string
 *                   example: "No existe el usuario o correo ingresado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "login failed, server error"
 *                 error:
 *                   type: string
 *                   example: "Detalles del error"
 */
router.post("/login", trackAuth, loginValidator, login);

export default router;