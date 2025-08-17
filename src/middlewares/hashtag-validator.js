import { body, param } from 'express-validator';
import { hashtagExists } from '../helpers/db-validators.js';
import { validateField } from './validate-field.js';
import { handleErrors } from './handle-erros.js';
import { hasRoles } from './validate-roles.js';
import { validateJWT } from './validate-jwt.js';

export const addHashtagValidator = [
    validateJWT,
    hasRoles('ADMIN', 'USER'),
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    validateField,
    handleErrors
];

export const deleteHashtagValidator = [
    validateJWT,
    hasRoles('ADMIN'),
    param('hid').isMongoId().withMessage('El ID de hashtag no es válido'),
    param('hid').custom(hashtagExists),
    validateField,
    handleErrors
];

