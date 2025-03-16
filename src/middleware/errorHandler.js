const logger = require('../utils/logger');

function errorHandler(err, req, res, _next) {
    logger.error('Error no manejado:', err);
    
    res.status(500).json({
        error: 'Error interno del servidor',
        message: err.message
    });
}

module.exports = errorHandler; 