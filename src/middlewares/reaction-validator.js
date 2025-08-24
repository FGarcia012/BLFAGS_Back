import { body, param } from 'express-validator';
import { publicationExistsById } from '../helpers/db-validators.js';
import { validateField } from './validate-field.js';
import { handleErrors } from './handle-erros.js';
import { validateJWT, optionalJWT } from './validate-jwt.js';
import { hasRoles } from './validate-roles.js';

export const addOrUpdateReactionValidator = [
    validateJWT,
    hasRoles('ADMIN', 'USER'),
    param('pid').isMongoId().withMessage('El ID de la publicación debe ser un ObjectId válido'),
    param('pid').custom(publicationExistsById),
    body('type').notEmpty().withMessage('El tipo de reacción es obligatorio'),
    body('type').isIn(['like', 'love', 'laugh', 'sad', 'angry']).withMessage('Tipo de reacción inválido. Debe ser: like, love, laugh, sad o angry'),
    validateField,
    handleErrors
];

export const removeReactionValidator = [
    validateJWT,
    hasRoles('ADMIN', 'USER'),
    param('pid').isMongoId().withMessage('El ID de la publicación debe ser un ObjectId válido'),
    param('pid').custom(publicationExistsById),
    validateField,
    handleErrors
];

export const getPublicationReactionsValidator = [
    optionalJWT,
    param('pid').isMongoId().withMessage('El ID de la publicación debe ser un ObjectId válido'),
    param('pid').custom(publicationExistsById),
    validateField,
    handleErrors
];

export const getUserReactionValidator = [
    validateJWT,
    hasRoles('ADMIN', 'USER'),
    param('pid').isMongoId().withMessage('El ID de la publicación debe ser un ObjectId válido'),
    param('pid').custom(publicationExistsById),
    validateField,
    handleErrors
];