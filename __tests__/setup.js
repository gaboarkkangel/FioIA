// Configuración del entorno de pruebas
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.OPENAI_API_KEY = 'test-api-key';
process.env.OPENAI_BASE_URL = 'https://openrouter.ai/api/v1';
process.env.LOG_LEVEL = 'error';

// Polyfill para setImmediate en el navegador
global.setImmediate = (callback) => setTimeout(callback, 0);

// Mock global fetch para pruebas del cliente
global.fetch = jest.fn();

// Configuración global para pruebas del cliente
global.window = {
    chatConfig: {
        ui: {
            maxMessageLength: 2000,
            maxMessagesInChat: 100,
            textareaMaxHeight: 150,
            messageTypes: {
                USER: 'user',
                BOT: 'bot',
                ERROR: 'error'
            }
        },
        errorMessages: {
            EMPTY_MESSAGE: 'Por favor, escribe un mensaje válido.',
            OPENAI_ERROR: 'Error al procesar tu mensaje con la IA. Por favor, intenta de nuevo.',
            DEFAULT: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.'
        }
    }
};

// Mock del DOM para pruebas del cliente
document.body.innerHTML = `
    <div id="chatMessages"></div>
    <textarea id="userInput"></textarea>
    <button id="sendButton">
        <span class="button-text">Enviar</span>
        <div class="loading-spinner"></div>
    </button>
`;

// Configuración de elementos del DOM
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Mock de métodos del DOM
chatMessages.scrollTo = jest.fn();
chatMessages.scrollTop = 0;
chatMessages.scrollHeight = 1000;
chatMessages.children = [];

userInput.scrollHeight = 100;
userInput.style = {
    height: '',
    overflowY: ''
};
userInput.value = '';

sendButton.classList = {
    contains: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    toggle: jest.fn()
};

// Mock de console.error para pruebas
console.error = jest.fn();

// Exportar elementos para uso en pruebas
module.exports = {
    chatMessages,
    userInput,
    sendButton
}; 