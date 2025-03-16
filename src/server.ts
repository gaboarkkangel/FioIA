import 'dotenv/config';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { config } from '@/config';
import { router } from '@/routes';
import { errorHandler } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

const app = express();

// Middleware de seguridad y optimización
app.use(helmet(config.security.helmet));
app.use(cors(config.server.cors));
app.use(compression());
app.use(morgan('dev'));

// Middleware de parseo
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rutas API
app.use('/api', router);

// Ruta principal
app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Middleware para rutas no encontradas
app.use((_req: Request, res: Response, _next: NextFunction) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador de errores global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
});

// Iniciar servidor
const PORT = config.server.port;
const server = app.listen(PORT, () => {
    logger.info(`Servidor iniciado en puerto ${PORT}`);
    logger.info(`Ambiente: ${config.server.env}`);
});

// Manejo de señales de terminación
const gracefulShutdown = () => {
    logger.info('Iniciando apagado graceful...');
    server.close(() => {
        logger.info('Servidor cerrado.');
        process.exit(0);
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export { app }; 