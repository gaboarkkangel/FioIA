import { config } from '@/config';

// Configuración de variables de entorno para pruebas
process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.OPENAI_API_KEY = 'test-api-key';
process.env.OPENAI_BASE_URL = 'https://api.test.com/v1';

// Mock global.fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ choices: [{ message: { content: 'test response' } }] })
  })
) as jest.Mock; 