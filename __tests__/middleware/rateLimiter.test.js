const rateLimit = require('express-rate-limit');
const config = require('../../config');
const limiter = require('../../src/middleware/rateLimiter');

jest.mock('express-rate-limit');

describe('Rate Limiter Middleware', () => {
    beforeEach(() => {
        rateLimit.mockClear();
    });

    test('debería configurarse con los valores correctos', () => {
        expect(rateLimit).toHaveBeenCalledWith({
            windowMs: config.rateLimit.windowMs,
            max: config.rateLimit.max,
            standardHeaders: true,
            legacyHeaders: false,
            message: {
                code: 'RATE_LIMIT',
                error: 'Demasiadas solicitudes',
                retryAfter: 60
            }
        });
    });

    test('debería exportar un middleware', () => {
        const mockMiddleware = jest.fn();
        rateLimit.mockReturnValue(mockMiddleware);
        
        expect(limiter).toBeDefined();
        expect(typeof limiter).toBe('function');
    });
}); 