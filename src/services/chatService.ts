import sanitizeHtml from 'sanitize-html';
import { OpenAI } from 'openai';
import type { ChatCompletion } from 'openai/resources';
import { logger } from '@/utils/logger';
import { config } from '@/config';
import { ChatResponse, ChatMessage } from '@/types';

export class ChatService {
    private readonly openai: OpenAI;
    private readonly maxTokens: number;
    private readonly model: string;
    private readonly temperature: number;

    constructor() {
        // Validar configuración requerida
        if (!config.api.apiKey) {
            throw new Error('API Key no configurada');
        }

        this.openai = new OpenAI({
            baseURL: config.api.baseUrl,
            apiKey: config.api.apiKey,
            defaultHeaders: {
                'HTTP-Referer': config.server.cors.origin || 'http://localhost:3000',
                'X-Title': process.env.OR_APP_NAME || 'DeepSeek Chat'
            }
        });

        // Usar valores de la configuración global
        this.maxTokens = config.api.maxTokens;
        this.model = config.api.model;
        this.temperature = Number(process.env.TEMPERATURE) || 0.7;

        // Log de inicialización
        logger.info('ChatService inicializado:', {
            baseURL: config.api.baseUrl,
            model: this.model,
            maxTokens: this.maxTokens,
            temperature: this.temperature
        });
    }

    public async processMessage(message: string): Promise<ChatResponse> {
        try {
            this.validateMessage(message);
            const sanitizedMessage = this.sanitizeMessage(message);
            const response = await this.generateResponse(sanitizedMessage);
            return response;
        } catch (error) {
            logger.error('Error en el servicio de chat:', { 
                error: error instanceof Error ? error.message : 'Error desconocido',
                model: this.model
            });
            throw error;
        }
    }

    private validateMessage(message: string): void {
        if (!message?.trim()) {
            throw new Error('El mensaje no puede estar vacío');
        }
        if (message.length > 500) {
            throw new Error('El mensaje excede el límite de caracteres');
        }
    }

    private sanitizeMessage(message: string): string {
        return sanitizeHtml(message, {
            allowedTags: [],
            allowedAttributes: {},
            allowedIframeHostnames: []
        });
    }

    private async generateResponse(message: string): Promise<ChatResponse> {
        try {
            logger.info('Generando respuesta:', { 
                model: this.model,
                maxTokens: this.maxTokens,
                temperature: this.temperature
            });

            const completion = await this.openai.chat.completions.create({
                model: this.model,
                messages: [
                    { 
                        role: 'user', 
                        content: message 
                    }
                ],
                max_tokens: this.maxTokens,
                temperature: this.temperature
            });

            const responseMessage = completion.choices[0]?.message;
            if (!responseMessage?.content) {
                throw new Error('Error en la API de OpenRouter: Respuesta vacía');
            }

            logger.info('Respuesta generada exitosamente');

            return {
                content: responseMessage.content,
                tokens: completion.usage?.total_tokens || 0,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            logger.error('Error al generar respuesta:', { 
                error: errorMessage,
                message,
                model: this.model,
                maxTokens: this.maxTokens,
                temperature: this.temperature,
                baseURL: config.api.baseUrl
            });
            throw new Error(`Error al generar respuesta: ${errorMessage}`);
        }
    }
} 