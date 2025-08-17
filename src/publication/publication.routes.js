import { Router } from 'express';
import {
    getPublications,
    getPublication,
    addPublication,
    updatePublication,
    deletePublication,
    getPublicationsByUser
} from './publication.controller.js';
import {
    addPublicationValidator,
    updatePublicationValidator,
    deletePublicationValidator,
    getPublicationValidator,
    getPublicationsByUserValidator,
    getPublicationsValidator
} from '../middlewares/publication-validator.js';
import { uploadPublications } from '../middlewares/multer-uploads.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Publication:
 *       type: object
 *       properties:
 *         pid:
 *           type: string
 *           description: ID único de la publicación
 *         title:
 *           type: string
 *           description: Título de la publicación
 *         description:
 *           type: string
 *           description: Descripción de la publicación
 *         media:
 *           type: string
 *           description: Nombre del archivo multimedia adjunto (opcional)
 *         user:
 *           type: object
 *           description: Usuario que creó la publicación
 *         comments:
 *           type: array
 *           items:
 *             type: object
 *           description: Comentarios asociados a la publicación
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la publicación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización de la publicación
 *     PublicationInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - user
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 200
 *           description: Título de la publicación
 *         description:
 *           type: string
 *           maxLength: 1000
 *           description: Descripción de la publicación
 *         user:
 *           type: string
 *           description: ID del usuario
 *         media:
 *           type: string
 *           format: binary
 *           description: Archivo multimedia (opcional - imagen, video o GIF)
 */

/**
 * @swagger
 * /api/publications/getPublications:
 *   get:
 *     summary: Obtener todas las publicaciones
 *     tags: [Publications]
 *     responses:
 *       200:
 *         description: Lista de publicaciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 publications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Publication'
 */
router.get('/getPublications', getPublicationsValidator, getPublications);

/**
 * @swagger
 * /api/publications/getPublication/{pid}:
 *   get:
 *     summary: Obtener una publicación específica
 *     tags: [Publications]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Publicación obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 publication:
 *                   $ref: '#/components/schemas/Publication'
 *       404:
 *         description: Publicación no encontrada
 */
router.get('/getPublication/:pid', getPublicationValidator, getPublication);

/**
 * @swagger
 * /api/publications/user/{userId}:
 *   get:
 *     summary: Obtener publicaciones de un usuario específico
 *     tags: [Publications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Publicaciones del usuario obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 publications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Publication'
 */
router.get('/user/:userId', getPublicationsByUserValidator, getPublicationsByUser);

/**
 * @swagger
 * /api/publications/addPublication:
 *   post:
 *     summary: Crear una nueva publicación
 *     tags: [Publications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - user
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 description: Título de la publicación
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Descripción de la publicación
 *               user:
 *                 type: string
 *                 description: ID del usuario
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: Archivo multimedia (opcional)
 *     responses:
 *       201:
 *         description: Publicación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 publication:
 *                   $ref: '#/components/schemas/Publication'
 *       400:
 *         description: Error en la validación de datos
 *       401:
 *         description: Token no válido
 */
router.post('/addPublication', [uploadPublications.single('media'), ...addPublicationValidator], addPublication);

/**
 * @swagger
 * /api/publications/updatePublication/{pid}:
 *   put:
 *     summary: Actualizar una publicación
 *     tags: [Publications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la publicación
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 description: Título de la publicación
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Descripción de la publicación
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: Archivo multimedia (opcional)
 *     responses:
 *       200:
 *         description: Publicación actualizada exitosamente
 *       404:
 *         description: Publicación no encontrada
 *       401:
 *         description: Token no válido
 */
router.put('/updatePublication/:pid', [uploadPublications.single('media'), ...updatePublicationValidator], updatePublication);

/**
 * @swagger
 * /api/publications/deletePublication/{pid}:
 *   delete:
 *     summary: Eliminar una publicación
 *     tags: [Publications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Publicación eliminada exitosamente
 *       404:
 *         description: Publicación no encontrada
 *       401:
 *         description: Token no válido
 */
router.delete('/deletePublication/:pid', deletePublicationValidator, deletePublication);

export default router;