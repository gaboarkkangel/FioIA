import request from 'supertest';
import express from 'express';
import { config } from '../src/config';
import cors from 'cors';
import helmet from 'helmet';
import { ChatController } from '../src/controllers/chatController';
import { ChatService } from '../src/services/chatService';

// Constantes para pruebas
const TEST_MESSAGE = '¿Cuál es la capital de Francia?';
const TEST_RESPONSE = 'La capital de Francia es París.';
const TEST_TOKENS = 15;

describe('API Chat Tests', () => {
    let app: express.Application;
    let mockChatService: jest.Mocked<ChatService>;

    beforeEach(() => {
        // Crear mock del ChatService
        mockChatService = {
            processMessage: jest.fn(),
        } as any;

        // Configurar el mock
        mockChatService.processMessage.mockResolvedValue({
            content: TEST_RESPONSE,
            tokens: TEST_TOKENS,
            timestamp: new Date().toISOString()
        });

        // Configurar la aplicación
        app = express();
        app.use(cors());
        app.use(helmet());
        app.use(express.json());

        // Configurar el controlador con el servicio mock
        const chatController = new ChatController();
        (chatController as any).chatService = mockChatService;

        // Configurar la ruta
        app.post('/api/chat', chatController.handleMessage.bind(chatController));
    });

    describe('POST /api/chat', () => {
        it('debe procesar un mensaje válido correctamente', async () => {
            const response = await request(app)
                .post('/api/chat')
                .send({ message: TEST_MESSAGE })
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('content', TEST_RESPONSE);
            expect(response.body).toHaveProperty('tokens', TEST_TOKENS);
            expect(response.body).toHaveProperty('timestamp');
            expect(mockChatService.processMessage).toHaveBeenCalledWith(TEST_MESSAGE);
        });

        it('debe rechazar un mensaje vacío', async () => {
            const response = await request(app)
                .post('/api/chat')
                .send({ message: '' })
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(mockChatService.processMessage).not.toHaveBeenCalled();
        });

        it('debe rechazar una petición sin mensaje', async () => {
            const response = await request(app)
                .post('/api/chat')
                .send({})
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(mockChatService.processMessage).not.toHaveBeenCalled();
        });

        it('debe manejar errores del servicio', async () => {
            const errorMessage = 'Error en el servicio';
            mockChatService.processMessage.mockRejectedValueOnce(new Error(errorMessage));

            const response = await request(app)
                .post('/api/chat')
                .send({ message: TEST_MESSAGE })
                .expect('Content-Type', /json/)
                .expect(500);

            expect(response.body).toHaveProperty('error');
            expect(mockChatService.processMessage).toHaveBeenCalledWith(TEST_MESSAGE);
        });
    });
}); 