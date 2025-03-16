import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '@/config';
import { chatController } from '@/controllers/chatController';

const router = Router();

// Configurar rate limiting
const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: {
        error: 'Demasiadas solicitudes, por favor intente más tarde'
    }
});

// Aplicar rate limiting a todas las rutas
router.use(limiter);

// Ruta para el chat
router.post('/chat', async (req, res, next) => {
    try {
        await chatController.handleMessage(req, res);
    } catch (error) {
        next(error);
    }
});

// Ruta de health check
router.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

export { router }; 