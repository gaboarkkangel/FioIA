const logger = require('../../src/utils/logger');

describe('Logger', () => {
    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    test('debería registrar mensajes de info correctamente', () => {
        const message = 'Test info message';
        logger.info(message);

        expect(consoleSpy).toHaveBeenCalled();
        const loggedData = JSON.parse(consoleSpy.mock.calls[0][0]);
        expect(loggedData).toMatchObject({
            level: 'info',
            message,
            env: expect.any(String)
        });
    });

    test('debería registrar errores correctamente', () => {
        const message = 'Test error message';
        const error = new Error('Test error');
        logger.error(message, error);

        expect(consoleSpy).toHaveBeenCalled();
        const loggedData = JSON.parse(consoleSpy.mock.calls[0][0]);
        expect(loggedData).toMatchObject({
            level: 'error',
            message,
            error: {
                message: error.message,
                stack: expect.any(String)
            },
            env: expect.any(String)
        });
    });

    test('debería registrar advertencias correctamente', () => {
        const message = 'Test warning message';
        logger.warn(message);

        expect(consoleSpy).toHaveBeenCalled();
        const loggedData = JSON.parse(consoleSpy.mock.calls[0][0]);
        expect(loggedData).toMatchObject({
            level: 'warn',
            message,
            env: expect.any(String)
        });
    });

    test('debería incluir timestamp en formato ISO', () => {
        const message = 'Test timestamp message';
        logger.info(message);

        expect(consoleSpy).toHaveBeenCalled();
        const loggedData = JSON.parse(consoleSpy.mock.calls[0][0]);
        expect(loggedData).toHaveProperty('timestamp');
        expect(new Date(loggedData.timestamp).toISOString()).toBe(loggedData.timestamp);
    });
}); 