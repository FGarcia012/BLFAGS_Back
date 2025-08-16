import { body, param } from 'express-validator';
import { emailExists, usernameExists, userExists } from '../helpers/db-validators.js';
import { validateField } from './validate-field.js';
import { deleteFileOnError } from './delete-file-on-error.js';
import { handleErrors } from './handle-erros.js';
import { validateJWT } from './validate-jwt.js';

export const registerValidator = [
    body('name').notEmpty().withMessage('El nombre es de caracter obligatorio'),
    body('username').notEmpty().withMessage('El nombre de usuario es de caracter obligatorio'),
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