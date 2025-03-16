import { ChatService } from '../../src/services/chatService';
import { config } from '../../src/config';
import { logger } from '../../src/utils/logger';

jest.mock('openai');
jest.mock('../../src/utils/logger');

describe('ChatService', () => {
    let chatService: ChatService;
    const mockCreate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        chatService = new ChatService();
        (chatService as any).openai = {
            chat: {
                completions: {
                    create: mockCreate
                }
            }
        };
    });

    it('debería procesar un mensaje válido correctamente', async () => {
        const message = 'Hola, ¿cómo estás?';
        const mockResponse = {
            choices: [{ message: { content: 'Respuesta de prueba' } }],
            usage: { total_tokens: 10 }
        };
        mockCreate.mockResolvedValueOnce(mockResponse);

        const result = await chatService.processMessage(message);

        expect(mockCreate).toHaveBeenCalledWith({
            model: config.api.model,
            messages: [{ role: 'user', content: message }],
            temperature: 0.7,
            max_tokens: config.api.maxTokens
        });
        expect(result.content).toBe('Respuesta de prueba');
        expect(result.tokens).toBe(10);
        expect(result.timestamp).toBeDefined();
    });

    it('debería manejar respuestas vacías de la API', async () => {
        const message = 'Hola';
        mockCreate.mockResolvedValueOnce({
            choices: [{ message: { content: '' } }]
        });

        await expect(chatService.processMessage(message))
            .rejects
            .toThrow('Error en la API de DeepSeek: Respuesta vacía');
    });

    it('debería sanitizar los mensajes antes de enviarlos', async () => {
        const message = '<script>alert("malicioso")</script>Hola';
        const mockResponse = {
            choices: [{ message: { content: 'Respuesta de prueba' } }],
            usage: { total_tokens: 5 }
        };
        mockCreate.mockResolvedValueOnce(mockResponse);

        await chatService.processMessage(message);

        expect(mockCreate).toHaveBeenCalledWith({
            model: config.api.model,
            messages: [{ role: 'user', content: 'Hola' }],
            temperature: 0.7,
            max_tokens: config.api.maxTokens
        });
    });

    it('debería rechazar mensajes que excedan el límite de caracteres', async () => {
        const message = 'a'.repeat(501);
        await expect(chatService.processMessage(message))
            .rejects
            .toThrow('El mensaje excede el límite de caracteres');
    });

    it('debería manejar errores de la API correctamente', async () => {
        const message = 'Hola';
        mockCreate.mockRejectedValueOnce(new Error('Error de API'));

        await expect(chatService.processMessage(message))
            .rejects
            .toThrow('Error al generar respuesta');
        expect(logger.error).toHaveBeenCalled();
    });
}); 