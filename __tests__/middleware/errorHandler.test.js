const errorHandler = require('../../src/middleware/errorHandler');
const logger = require('../../src/utils/logger');

jest.mock('../../src/utils/logger');

describe('Error Handler Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            path: '/test',
            method: 'GET',
            id: '123'
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        
        // Limpiar mocks
        logger.error.mockClear();
    });

    test('debería manejar errores básicos', () => {
        const error = new Error('Test error');
        
        errorHandler(error, req, res, next);

        expect(logger.error).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Test error',
            code: 'SERVER_ERROR',
            requestId: '123'
        });
    });

    test('debería respetar el código de estado personalizado', () => {
        const error = new Error('Not Found');
        error.statusCode = 404;
        
        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('debería incluir stack trace en desarrollo', () => {
        process.env.NODE_ENV = 'development';
        const error = new Error('Dev error');
        error.stack = 'Test stack trace';
        
        errorHandler(error, req, res, next);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            stack: 'Test stack trace'
        }));
    });

    test('no debería incluir stack trace en producción', () => {
        process.env.NODE_ENV = 'production';
        const error = new Error('Prod error');
        error.stack = 'Test stack trace';
        
        errorHandler(error, req, res, next);

        const response = res.json.mock.calls[0][0];
        expect(response.stack).toBeUndefined();
    });

    test('debería registrar detalles del error', () => {
        const error = new Error('Detailed error');
        error.details = { specific: 'test detail' };
        
        errorHandler(error, req, res, next);

        expect(logger.error).toHaveBeenCalledWith(
            'Error en la aplicación',
            expect.objectContaining({
                error: 'Detailed error',
                path: '/test',
                method: 'GET'
            })
        );
    });
}); 