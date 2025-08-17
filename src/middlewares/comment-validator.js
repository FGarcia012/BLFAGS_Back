import { body, param } from 'express-validator';
import { commentExists, userExists, publicationExists } from '../helpers/db-validators.js';
import { validateField } from './validate-field.js';
import { deleteFileOnError } from './delete-file-on-error.js';
import { handleErrors } from './handle-erros.js';
import { validateJWT } from './validate-jwt.js';
import { hasRoles } from './validate-roles.js';

export const addCommentValidator = [
    validateJWT,
    hasRoles('ADMIN', 'USER'),
    body('publication').notEmpty().withMessage('El ID de la publicación es obligatorio'),
    body('publication').isMongoId().withMessage('El ID de la publicación debe ser un ObjectId válido'),
    body('publication').custom(publicationExists),
    body('user').notEmpty().withMessage('El ID del usuario es obligatorio'),
    body('user').isMongoId().withMessage('El ID del usuario debe ser un ObjectId válido'),
    body('user').custom(userExists),
    body('text').optional().isString().withMessage('El texto debe ser una cadena de caracteres'),
    body('text').optional().isLength({ max: 500 }).withMessage('El comentario no puede exceder 500 caracteres'),
    validateField,
    deleteFileOnError,
    handleErrors
];

export const deleteCommentValidator = [
    validateJWT,
    hasRoles('ADMIN', 'USER'),
    param('cid').isMongoId().withMessage('El ID del comentario debe ser un ObjectId válido'),
    param('cid').custom(commentExists),
    validateField,
    handleErrors
];

export const getCommentValidator = [
    param('cid').isMongoId().withMessage('El ID del comentario debe ser un ObjectId válido'),
    param('cid').custom(commentExists),
    validateField,
    handleErrors
];

export const getCommentsByPublicationValidator = [
    param('pid').isMongoId().withMessage('El ID de la publicación debe ser un ObjectId válido'),
    param('pid').custom(publicationExists),
    validateField,
    handleErrors
];

export const getCommentsValidator = [
    validateField,
    handleErrors
];
