import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { logger } from '@/utils/logger';
import { ErrorResponse } from '@/types';

interface ErrorWithStatus extends Error {
    status?: number;
}

export const errorHandler: ErrorRequestHandler = (
    err: ErrorWithStatus,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    const status = err.status || 500;
    const message = err.message || 'Error interno del servidor';

    const errorResponse: ErrorResponse = {
        error: message,
        status
    };

    logger.error('Error en la aplicación:', { 
        error: message, 
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    res.status(status).json(errorResponse);
}; 