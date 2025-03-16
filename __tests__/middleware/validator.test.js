const validator = require('../../src/middleware/validator');

describe('Validator Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    test('debería rechazar cuando no hay mensaje', () => {
        validator.validateMessage(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Mensaje requerido',
            code: 'INVALID_MESSAGE',
            details: {
                minLength: 1,
                received: 0
            }
        });
        expect(next).not.toHaveBeenCalled();
    });

    test('debería rechazar cuando el mensaje no es string', () => {
        req.body.message = 123;

        validator.validateMessage(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'El mensaje debe ser una cadena de texto',
            code: 'INVALID_MESSAGE',
            details: {
                expectedType: 'string',
                receivedType: 'number'
            }
        });
        expect(next).not.toHaveBeenCalled();
    });

    test('debería rechazar cuando el mensaje es muy largo', () => {
        req.body.message = 'a'.repeat(501);

        validator.validateMessage(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Mensaje excede longitud máxima',
            code: 'INVALID_MESSAGE',
            details: {
                maxLength: 500,
                received: 501
            }
        });
        expect(next).not.toHaveBeenCalled();
    });

    test('debería permitir un mensaje válido', () => {
        req.body.message = 'Hola mundo';

        validator.validateMessage(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
}); 