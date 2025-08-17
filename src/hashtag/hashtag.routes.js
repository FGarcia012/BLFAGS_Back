import { Router } from "express";
import {
    getHashtags,
    getHashtag,
    addHashtag,
    deleteHashtag,
    getPublicationsByHashtag,
    searchHashtags
} from './hashtag.controller.js';
import {
    addHashtagValidator,
    deleteHashtagValidator
} from '../middlewares/hashtag-validator.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Hashtag:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         hid:
 *           type: string
 *           description: ID único del hashtag
 *         name:
 *           type: string
 *           description: Nombre del hashtag (sin #)
 *           example: "tecnologia"
 *         publications:
 *           type: array
 *           items:
 *             type: object
 *           description: Publicaciones asociadas al hashtag
 *         status:
 *           type: boolean
 *           description: Estado del hashtag (activo/inactivo)
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     HashtagInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del hashtag
 *           example: "tecnologia"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           description: Mensaje de error
 *         error:
 *           type: string
 *           description: Detalles del error
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/hashtags/getHashtags:
 *   get:
 *     summary: Obtener todos los hashtags
 *     description: Obtiene una lista de todos los hashtags activos con sus publicaciones asociadas
 *     tags: [Hashtags]
 *     responses:
 *       200:
 *         description: Lista de hashtags obtenida exitosamente
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
 *                   example: "Hashtags obtenidos exitosamente"
 *                 hashtags:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hashtag'
 *       404:
 *         description: No se encontraron hashtags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No se encontraron hashtags"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/getHashtags', getHashtags);

/**
 * @swagger
 * /api/hashtags/getHashtag/{hid}:
 *   get:
 *     summary: Obtener un hashtag específico
 *     description: Obtiene un hashtag por su ID con sus publicaciones asociadas
 *     tags: [Hashtags]
 *     parameters:
 *       - in: path
 *         name: hid
 *         required: true
 *         description: ID del hashtag
 *         schema:
 *           type: string
 *           example: "64a7b8f123456789abcdef12"
 *     responses:
 *       200:
 *         description: Hashtag obtenido exitosamente
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
 *                   example: "Hashtag obtenido exitosamente"
 *                 hashtag:
 *                   $ref: '#/components/schemas/Hashtag'
 *       404:
 *         description: Hashtag no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Hashtag no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/getHashtag/:hid', getHashtag);

/**
 * @swagger
 * /api/hashtags/search:
 *   get:
 *     summary: Buscar hashtags
 *     description: Busca hashtags por nombre usando una consulta de texto
 *     tags: [Hashtags]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: Término de búsqueda para encontrar hashtags
 *         schema:
 *           type: string
 *           example: "tecno"
 *     responses:
 *       200:
 *         description: Hashtags encontrados exitosamente
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
 *                   example: 'Hashtags encontrados para "tecno"'
 *                 hashtags:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hashtag'
 *       400:
 *         description: Término de búsqueda requerido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Debe proporcionar un término de búsqueda"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/search', searchHashtags);

/**
 * @swagger
 * /api/hashtags/publications/{name}:
 *   get:
 *     summary: Obtener publicaciones por hashtag
 *     description: Obtiene todas las publicaciones asociadas a un hashtag específico por su nombre
 *     tags: [Hashtags]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: Nombre del hashtag (sin el símbolo #)
 *         schema:
 *           type: string
 *           example: "tecnologia"
 *     responses:
 *       200:
 *         description: Publicaciones obtenidas exitosamente
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
 *                   example: "Publicaciones para el hashtag #tecnologia obtenidas exitosamente"
 *                 hashtag:
 *                   type: string
 *                   example: "tecnologia"
 *                 publications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Publicación con información del usuario y comentarios
 *       404:
 *         description: No se encontraron publicaciones para el hashtag
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No se encontraron publicaciones para el hashtag #tecnologia"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/publications/:name', getPublicationsByHashtag);

/**
 * @swagger
 * /api/hashtags/addHashtag:
 *   post:
 *     summary: Agregar un nuevo hashtag
 *     description: Crea un nuevo hashtag en el sistema (requiere autenticación)
 *     tags: [Hashtags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HashtagInput'
 *     responses:
 *       201:
 *         description: Hashtag creado exitosamente
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
 *                   example: "Hashtag agregado exitosamente"
 *                 hashtag:
 *                   $ref: '#/components/schemas/Hashtag'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "El nombre es obligatorio"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Token de acceso requerido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Token de acceso requerido"
 *       403:
 *         description: No tienes permisos para realizar esta acción
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No tienes permisos para realizar esta acción"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/addHashtag', addHashtagValidator, addHashtag);

/**
 * @swagger
 * /api/hashtags/deleteHashtag/{hid}:
 *   delete:
 *     summary: Eliminar un hashtag
 *     description: Elimina un hashtag del sistema (soft delete - cambiar status a false). Solo administradores pueden realizar esta acción.
 *     tags: [Hashtags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hid
 *         required: true
 *         description: ID del hashtag a eliminar
 *         schema:
 *           type: string
 *           example: "64a7b8f123456789abcdef12"
 *     responses:
 *       200:
 *         description: Hashtag eliminado exitosamente
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
 *                   example: "Hashtag eliminado exitosamente"
 *                 hashtag:
 *                   $ref: '#/components/schemas/Hashtag'
 *       400:
 *         description: ID de hashtag inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "El ID de hashtag no es válido"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Token de acceso requerido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Token de acceso requerido"
 *       403:
 *         description: Solo administradores pueden eliminar hashtags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No tienes permisos para realizar esta acción"
 *       404:
 *         description: Hashtag no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Hashtag no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/deleteHashtag/:hid', deleteHashtagValidator, deleteHashtag);

export default router;
