import { Router } from 'express';
import {
    getComments,
    getComment,
    getCommentsByPublication,
    addComment,
    deleteComment
} from './comment.controller.js';
import {
    addCommentValidator,
    deleteCommentValidator,
    getCommentValidator,
    getCommentsByPublicationValidator,
    getCommentsValidator
} from '../middlewares/comment-validator.js';
import { uploadComments } from '../middlewares/multer-uploads.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         cid:
 *           type: string
 *           description: ID único del comentario
 *         text:
 *           type: string
 *           description: Texto del comentario (máximo 500 caracteres)
 *         media:
 *           type: string
 *           description: Nombre del archivo multimedia adjunto
 *         user:
 *           type: string
 *           description: ID del usuario que creó el comentario
 *         publication:
 *           type: string
 *           description: ID de la publicación a la que pertenece el comentario
 *         status:
 *           type: boolean
 *           description: Estado del comentario (activo/inactivo)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del comentario
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización del comentario
 *     CommentInput:
 *       type: object
 *       required:
 *         - publication
 *         - user
 *       properties:
 *         text:
 *           type: string
 *           maxLength: 500
 *           description: Texto del comentario
 *         publication:
 *           type: string
 *           description: ID de la publicación
 *         user:
 *           type: string
 *           description: ID del usuario
 *         media:
 *           type: string
 *           format: binary
 *           description: Archivo multimedia (opcional)
 */

/**
 * @swagger
 * /api/comments/getComments:
 *   get:
 *     summary: Obtener todos los comentarios
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: Lista de comentarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 */
router.get('/getComments', getCommentsValidator, getComments);

/**
 * @swagger
 * /api/comments/getComment/{cid}:
 *   get:
 *     summary: Obtener un comentario específico
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comentario no encontrado
 */
router.get('/getComment/:cid', getCommentValidator, getComment);

/**
 * @swagger
 * /api/comments/publication/{pid}:
 *   get:
 *     summary: Obtener comentarios de una publicación específica
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Comentarios de la publicación obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 */
router.get('/publication/:pid', getCommentsByPublicationValidator, getCommentsByPublication);

/**
 * @swagger
 * /api/comments/addComment:
 *   post:
 *     summary: Crear un nuevo comentario
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - publication
 *               - user
 *             properties:
 *               text:
 *                 type: string
 *                 maxLength: 500
 *                 description: Texto del comentario
 *               publication:
 *                 type: string
 *                 description: ID de la publicación
 *               user:
 *                 type: string
 *                 description: ID del usuario
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: Archivo multimedia (opcional)
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Error en la validación de datos
 *       401:
 *         description: Token no válido
 */
router.post('/addComment', [uploadComments.single('media'),...addCommentValidator], addComment);

/**
 * @swagger
 * /api/comments/deleteComment/{cid}:
 *   delete:
 *     summary: Eliminar un comentario
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Token no válido
 *       404:
 *         description: Comentario no encontrado
 */
router.delete('/deleteComment/:cid', deleteCommentValidator, deleteComment);

export default router;
