import sanitizeHtml from 'sanitize-html';
import { OpenAI } from 'openai';
import { logger } from '../utils/logger';
import { config } from '../config';
import { ChatResponse } from '../types';

export class ChatService {
    private readonly openai: OpenAI;
    private readonly maxTokens: number;
    private readonly model: string;

    constructor() {
        this.openai = new OpenAI({
            baseURL: config.api.baseUrl,
            apiKey: config.api.apiKey,
            defaultHeaders: {
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'DeepSeek Chat'
            }
        });
        this.maxTokens = config.api.maxTokens;
        this.model = config.api.model;
    }

    public async processMessage(message: string): Promise<ChatResponse> {
        try {
            if (!message || message.trim().length === 0) {
                throw new Error('El mensaje no puede estar vacío');
            }

            if (message.length > 500) {
                throw new Error('El mensaje excede el límite de caracteres');
            }

            const sanitizedMessage = this.sanitizeMessage(message);
            const response = await this.generateResponse(sanitizedMessage);

            return {
                content: response.content,
                tokens: response.tokens,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            logger.error('Error en el servicio de chat:', { error: error instanceof Error ? error.message : 'Error desconocido' });
            throw error;
        }
    }

    private sanitizeMessage(message: string): string {
        return sanitizeHtml(message, {
            allowedTags: [],
            allowedAttributes: {},
            allowedIframeHostnames: []
        });
    }

    private async generateResponse(message: string): Promise<any> {
        try {
            const completion = await this.openai.chat.completions.create({
                model: this.model,
                messages: [{ role: 'user', content: message }],
                temperature: 0.7,
                max_tokens: this.maxTokens
            });

            if (!completion.choices[0]?.message?.content) {
                throw new Error('Error en la API de DeepSeek: Respuesta vacía');
            }

            return {
                content: completion.choices[0].message.content,
                tokens: completion.usage?.total_tokens || 0
            };
        } catch (error) {
            logger.error('Error al generar respuesta:', { 
                error: error instanceof Error ? error.message : 'Error desconocido',
                message 
            });
            throw new Error('Error al generar respuesta');
        }
    }
} 