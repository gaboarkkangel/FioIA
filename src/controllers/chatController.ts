import { Request, Response } from 'express';
import { ChatService } from '@/services/chatService';
import { logger } from '@/utils/logger';
import { ErrorResponse } from '@/types';

class ChatController {
    private chatService: ChatService;

    constructor() {
        this.chatService = new ChatService();
    }

    public async handleMessage(req: Request, res: Response): Promise<void> {
        try {
            const { message } = req.body;

            if (!this.isValidMessage(message)) {
                this.sendError(res, {
                    error: 'El mensaje es requerido y debe ser una cadena de texto',
                    status: 400
                });
                return;
            }

            const response = await this.chatService.processMessage(message);
            logger.info('Mensaje procesado exitosamente', { messageLength: message.length });
            res.json(response);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    private isValidMessage(message: unknown): message is string {
        return typeof message === 'string' && message.trim().length > 0;
    }

    private sendError(res: Response, error: ErrorResponse): void {
        const { status = 500, error: message } = error;
        res.status(status).json({ error: message });
    }

    private handleError(error: unknown, res: Response): void {
        const isLimitError = error instanceof Error && 
            error.message.includes('límite de caracteres');
        
        const errorResponse: ErrorResponse = {
            error: error instanceof Error ? error.message : 'Error al procesar el mensaje',
            status: isLimitError ? 400 : 500
        };

        logger.error('Error al procesar mensaje:', {
            error: error instanceof Error ? error.message : 'Error desconocido',
            stack: error instanceof Error ? error.stack : undefined
        });

        this.sendError(res, errorResponse);
    }
}

export const chatController = new ChatController(); 