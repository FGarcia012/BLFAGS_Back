import { body, param } from 'express-validator';
import { emailExists, usernameExists, userExists } from '../helpers/db-validators.js';
import { validateField } from './validate-field.js';
import { deleteFileOnError } from './delete-file-on-error.js';
import { handleErrors } from './handle-erros.js';
import { validateJWT } from './validate-jwt.js';
import { hasRoles } from './validate-roles.js';
import { validateUserOwnership } from './validate-user-ownership.js'; 

export const registerValidator = [
    body('name').notEmpty().withMessage('El nombre es de caracter obligatorio'),
    body('username').notEmpty().withMessage('El nombre de usuario es de caracter obligatorio'),
    body('username').custom(usernameExists),
    body('email').isEmail().withMessage('El correo no es válido'),
    body('email').custom(emailExists),
    body('password').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage('La contraseña debe tener al menos 8 caracteres, 1 minúscula, 1 mayúscula, 1 número y 1 símbolo'),
    validateField,
    deleteFileOnError,
    handleErrors
];

export const loginValidator = [
    body('email').optional().isEmail().withMessage('No es un email válido'),
    body('username').optional().isString().withMessage('Nombre de usuario es en formáto erróneo'),
    body('password').isLength({ min: 7 }).withMessage('La contraseña debe contener al menos 8 caracteres'),
    validateField,
    handleErrors
];

export const updatePasswordValidator = [
    validateJWT,
    hasRoles('ADMIN', 'USER'),
    param('uid').isMongoId().withMessage('El ID de usuario no es válido'),
    param('uid').custom(userExists),
    validateUserOwnership, 
    body('currentPassword').notEmpty().withMessage('La contraseña actual es obligatoria'),
    body('newPassword').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage('La nueva contraseña debe tener al menos 8 caracteres, 1 minúscula, 1 mayúscula, 1 número y 1 símbolo'),
    validateField,
    handleErrors
];

export const updateUserValidator = [
    validateJWT,
    hasRoles('ADMIN', 'USER'),
    param('uid').isMongoId().withMessage('El ID de usuario no es válido'),
    param('uid').custom(userExists),
    validateUserOwnership, 
    body('name').optional().isString().withMessage('El nombre es obligatorio'),
    body('username').optional().isString().withMessage('El nombre de usuario es obligatorio'),
    body('email').optional().isEmail().withMessage('El correo electrónico es obligatorio'),
    validateField,
    handleErrors
];

export const updateProfilePictureValidator = [
    validateJWT,
    hasRoles('ADMIN', 'USER'),
    param('uid').isMongoId().withMessage('El ID de usuario no es válido'),
    param('uid').custom(userExists),
    validateUserOwnership, 
    validateField,
    deleteFileOnError,
    handleErrors
];

export const deleteUserValidator = [
    validateJWT,
    hasRoles('ADMIN', 'USER'), 
    param('uid').isMongoId().withMessage('El ID de usuario no es válido'),
    param('uid').custom(userExists),
    validateUserOwnership,
    validateField,
    handleErrors
];

export const confirmDeleteUserValidator = [
    validateJWT,
    hasRoles('ADMIN', 'USER'),
    body('confirm').isString().withMessage('Confirmación es obligatoria'),
    body('confirm').isIn(['Si', 'No']).withMessage('La confirmación debe ser "Si" o "No"'),
    validateField,
    handleErrors
];

export const getUserValidator = [
    validateJWT,
    hasRoles('ADMIN', 'USER'),
    param('uid').isMongoId().withMessage('El ID de usuario no es válido'),
    param('uid').custom(userExists),
    validateUserOwnership,
    validateField,
    handleErrors
];

export const getUsersValidator = [
    validateJWT,
    hasRoles('ADMIN'),
    validateField,
    handleErrors
];