const rateLimit = require('express-rate-limit');
const config = require('../config/server');

const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: {
        error: 'Demasiadas solicitudes',
        code: 'RATE_LIMIT',
        retryAfter: Math.ceil(config.rateLimit.windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = limiter; 