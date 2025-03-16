const { body } = require('express-validator');

const validateMessage = [
    body('message')
        .trim()
        .notEmpty()
        .withMessage('El mensaje no puede estar vacío')
        .isString()
        .withMessage('El mensaje debe ser una cadena de texto')
        .isLength({ max: 500 })
        .withMessage('El mensaje no puede exceder los 500 caracteres'),
];

module.exports = {
    validateMessage,
}; 