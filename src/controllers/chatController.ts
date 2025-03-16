import { Request, Response } from 'express';
import { ChatService } from '../services/chatService';
import { logger } from '../utils/logger';
import { ErrorResponse } from '../types';

class ChatController {
    private chatService: ChatService;

    constructor() {
        this.chatService = new ChatService();
    }

    public async handleMessage(req: Request, res: Response): Promise<void> {
        try {
            const { message } = req.body;

            if (!message || typeof message !== 'string') {
                const errorResponse: ErrorResponse = {
                    error: 'El mensaje es requerido y debe ser una cadena de texto',
                    status: 400
                };
                res.status(400).json(errorResponse);
                return;
            }

            const response = await this.chatService.processMessage(message);
            logger.info('Mensaje procesado exitosamente', { messageLength: message.length });
            res.json(response);
        } catch (error) {
            const statusCode = error instanceof Error && error.message.includes('límite de caracteres') ? 400 : 500;
            const errorResponse: ErrorResponse = {
                error: error instanceof Error ? error.message : 'Error al procesar el mensaje',
                status: statusCode
            };
            
            logger.error('Error al procesar mensaje:', { 
                error: error instanceof Error ? error.message : 'Error desconocido',
                stack: error instanceof Error ? error.stack : undefined
            });
            
            res.status(statusCode).json(errorResponse);
        }
    }
}

export const chatController = new ChatController(); 