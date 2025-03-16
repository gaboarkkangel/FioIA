import { Config } from '@/types';
import path from 'path';
import * as dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env en la raíz del proyecto
const envPath = path.resolve(process.cwd(), '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
    throw new Error(`Error al cargar el archivo .env: ${result.error.message}`);
}

// Forzar la URL correcta de OpenRouter
process.env.OPENAI_BASE_URL = 'https://openrouter.ai/api/v1';
process.env.MODEL = 'deepseek/deepseek-r1:free';
process.env.OPENAI_API_KEY = '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';

// Validar variables de entorno requeridas
const requiredEnvVars = [
    'OPENAI_API_KEY',
    'OPENAI_BASE_URL',
    'MODEL'
] as const;

const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingVars.length > 0) {
    throw new Error(`Variables de entorno requeridas no encontradas: ${missingVars.join(', ')}`);
}

// Validar formato de URL
const urlRegex = /^https?:\/\/.+/i;
if (!urlRegex.test(process.env.OPENAI_BASE_URL!)) {
    throw new Error('OPENAI_BASE_URL debe ser una URL válida que comience con http:// o https://');
}

// Asegurar que las variables requeridas existan y validar sus tipos
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const MODEL = process.env.MODEL!;

// Validar puerto
const PORT = Number(process.env.PORT) || 3000;
if (isNaN(PORT) || PORT < 0 || PORT > 65535) {
    throw new Error('PORT debe ser un número válido entre 0 y 65535');
}

// Validar MAX_TOKENS
const MAX_TOKENS = Number(process.env.MAX_TOKENS) || 2000;
if (isNaN(MAX_TOKENS) || MAX_TOKENS < 1) {
    throw new Error('MAX_TOKENS debe ser un número positivo');
}

// Configuración de la aplicación
export const config: Config = {
    server: {
        port: PORT,
        env: process.env.NODE_ENV || 'development',
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET', 'POST']
        }
    },
    api: {
        baseUrl: OPENAI_BASE_URL,
        apiKey: OPENAI_API_KEY,
        maxTokens: MAX_TOKENS,
        model: MODEL
    },
    rateLimit: {
        windowMs: 60 * 1000,
        max: 60
    },
    security: {
        helmet: {
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", 'data:', 'https:'],
                    connectSrc: ["'self'", OPENAI_BASE_URL]
                }
            }
        }
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: 'json',
        directory: process.env.LOG_DIRECTORY || 'logs'
    }
};

// Log de configuración cargada
console.log('Configuración final:', {
    env: config.server.env,
    port: config.server.port,
    model: config.api.model,
    baseUrl: config.api.baseUrl,
    maxTokens: config.api.maxTokens,
    logLevel: config.logging.level,
    workingDirectory: process.cwd()
}); 