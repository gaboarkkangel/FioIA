import { Config } from '@/types';

export const config: Config = {
    server: {
        port: Number(process.env.PORT) || 3000,
        env: process.env.NODE_ENV || 'development',
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET', 'POST']
        }
    },
    api: {
        baseUrl: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENAI_API_KEY || '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',
        maxTokens: 5000,
        model: process.env.MODEL || 'deepseek/deepseek-r1:free'
    },
    rateLimit: {
        windowMs: 60 * 1000, // 1 minuto
        max: 60 // límite de solicitudes por ventana
    },
    security: {
        helmet: {
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", 'data:', 'https:'],
                    connectSrc: ["'self'", process.env.OPENAI_BASE_URL || '']
                }
            }
        }
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: 'json',
        directory: 'logs'
    }
}; 