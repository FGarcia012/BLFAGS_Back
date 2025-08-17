import { body, param } from 'express-validator';
import { userExists, publicationExists } from '../helpers/db-validators.js';
import { validateField } from './validate-field.js';
import { deleteFileOnError } from './delete-file-on-error.js';
import { handleErrors } from './handle-erros.js';
import { validateJWT } from './validate-jwt.js';
import { hasRoles } from './validate-roles.js';

export const addPublicationValidator = [
    validateJWT,
    hasRoles('ADMIN', 'USER'),
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('title').isString().withMessage('El título debe ser una cadena de caracteres'),
    body('title').trim().isLength({ min: 1, max: 200 }).withMessage('El título debe tener entre 1 y 200 caracteres'),
    body('description').notEmpty().withMessage('La descripción es obligatoria'),
    body('description').isString().withMessage('La descripción debe ser una cadena de caracteres'),
    body('description').trim().isLength({ min: 1, max: 1000 }).withMessage('La descripción debe tener entre 1 y 1000 caracteres'),
    body('user').notEmpty().withMessage('El ID del usuario es obligatorio'),
    body('user').isMongoId().withMessage('El ID del usuario debe ser un ObjectId válido'),
    body('user').custom(userExists),
    validateField,
    deleteFileOnError,
    handleErrors
];

export const updatePublicationValidator = [
    validateJWT,
    hasRoles('ADMIN', 'USER'),
    param('pid').isMongoId().withMessage('El ID de la publicación debe ser un ObjectId válido'),
    param('pid').custom(publicationExists),
    body('title').optional().isString().withMessage('El título debe ser una cadena de caracteres'),
    body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('El título debe tener entre 1 y 200 caracteres'),
    body('description').optional().isString().withMessage('La descripción debe ser una cadena de caracteres'),
    body('description').optional().trim().isLength({ min: 1, max: 1000 }).withMessage('La descripción debe tener entre 1 y 1000 caracteres'),
    validateField,
    deleteFileOnError,
    handleErrors
];

export const deletePublicationValidator = [
    validateJWT,
    hasRoles('ADMIN', 'USER'),
    param('pid').isMongoId().withMessage('El ID de la publicación debe ser un ObjectId válido'),
    param('pid').custom(publicationExists),
    validateField,
    handleErrors
];

export const getPublicationValidator = [
    param('pid').isMongoId().withMessage('El ID de la publicación debe ser un ObjectId válido'),
    param('pid').custom(publicationExists),
    validateField,
    handleErrors
];

export const getPublicationsByUserValidator = [
    validateJWT,
    hasRoles('ADMIN', 'USER'),
    param('userId').isMongoId().withMessage('El ID del usuario debe ser un ObjectId válido'),
    param('userId').custom(userExists),
    validateField,
    handleErrors
];

export const getPublicationsValidator = [
    validateField,
    handleErrors
];
