import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { logger } from '@/utils/logger';

interface ErrorWithStatus extends Error {
    status?: number;
}

export const errorHandler: ErrorRequestHandler = (
    err: ErrorWithStatus,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const status = err.status || 500;
    const message = err.message || 'Error interno del servidor';

    logger.error('Error en la aplicación:', { error: err.message, stack: err.stack });

    res.status(status).json({
        error: {
            message,
            status
        }
    });
}; 