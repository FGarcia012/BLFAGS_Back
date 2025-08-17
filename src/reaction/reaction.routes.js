import { Router } from 'express';
import { 
    addOrUpdateReaction, 
    removeReaction, 
    getPublicationReactions,
    getUserReaction 
} from './reaction.controller.js';
import { 
    addOrUpdateReactionValidator,
    removeReactionValidator,
    getPublicationReactionsValidator,
    getUserReactionValidator
} from '../middlewares/reaction-validator.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Reaction:
 *       type: object
 *       required:
 *         - type
 *         - user
 *         - publication
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único de la reacción
 *         type:
 *           type: string
 *           enum: [like, love, laugh, sad, angry]
 *           description: Tipo de reacción
 *         user:
 *           type: string
 *           description: ID del usuario que reaccionó
 *         publication:
 *           type: string
 *           description: ID de la publicación
 *         status:
 *           type: boolean
 *           description: Estado de la reacción
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de actualización
 *     ReactionRequest:
 *       type: object
 *       required:
 *         - type
 *       properties:
 *         type:
 *           type: string
 *           enum: [like, love, laugh, sad, angry]
 *           description: Tipo de reacción
 *           example: like
 *     ReactionResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica si la operación fue exitosa
 *         message:
 *           type: string
 *           description: Mensaje descriptivo
 *         data:
 *           $ref: '#/components/schemas/Reaction'
 *     ReactionsListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica si la operación fue exitosa
 *         message:
 *           type: string
 *           description: Mensaje descriptivo
 *         data:
 *           type: object
 *           properties:
 *             reactions:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reaction'
 *             counts:
 *               type: object
 *               properties:
 *                 like:
 *                   type: number
 *                 love:
 *                   type: number
 *                 laugh:
 *                   type: number
 *                 sad:
 *                   type: number
 *                 angry:
 *                   type: number
 *                 total:
 *                   type: number
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /reactions/addOrUpdateReaction/{pid}:
 *   post:
 *     summary: Agregar o actualizar una reacción a una publicación
 *     tags: [Reactions]
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
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReactionRequest'
 *     responses:
 *       200:
 *         description: Reacción actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReactionResponse'
 *       201:
 *         description: Reacción creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReactionResponse'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Publicación no encontrada
 */
router.post('/addOrUpdateReaction/:pid', addOrUpdateReactionValidator, addOrUpdateReaction);

/**
 * @swagger
 * /reactions/removeReaction/{pid}:
 *   delete:
 *     summary: Eliminar una reacción de una publicación
 *     tags: [Reactions]
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
 *         description: Reacción eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Reacción eliminada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reacción no encontrada
 */
router.delete('/removeReaction/:pid', removeReactionValidator, removeReaction);

/**
 * @swagger
 * /reactions/getPublicationReactions/{pid}:
 *   get:
 *     summary: Obtener todas las reacciones de una publicación
 *     tags: [Reactions]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Lista de reacciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReactionsListResponse'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Publicación no encontrada
 */
router.get('/getPublicationReactions/:pid', getPublicationReactionsValidator, getPublicationReactions);

/**
 * @swagger
 * /reactions/getUserReaction/{pid}:
 *   get:
 *     summary: Obtener la reacción específica del usuario logueado para una publicación
 *     tags: [Reactions]
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
 *         description: Reacción del usuario obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReactionResponse'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reacción no encontrada
 */
router.get('/getUserReaction/:pid', getUserReactionValidator, getUserReaction);

export default router;
