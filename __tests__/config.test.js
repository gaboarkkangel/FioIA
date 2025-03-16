const config = require('../config');

describe('Configuración', () => {
    test('debe tener todas las secciones requeridas', () => {
        expect(config).toHaveProperty('server');
        expect(config).toHaveProperty('api');
        expect(config).toHaveProperty('ui');
        expect(config).toHaveProperty('errorMessages');
        expect(config).toHaveProperty('rateLimit');
        expect(config).toHaveProperty('security');
        expect(config).toHaveProperty('logging');
    });

    test('debe tener la configuración correcta del servidor', () => {
        expect(config.server).toHaveProperty('port');
        expect(config.server).toHaveProperty('env');
        expect(config.server.cors).toHaveProperty('origin');
        expect(config.server.cors).toHaveProperty('methods');
    });

    test('debe tener la configuración correcta de la API', () => {
        expect(config.api).toHaveProperty('baseUrl');
        expect(config.api).toHaveProperty('apiKey');
        expect(config.api).toHaveProperty('maxTokens');
        expect(config.api).toHaveProperty('model');
    });

    test('debe tener límites válidos en la UI', () => {
        expect(config.ui.maxMessageLength).toBeGreaterThan(0);
        expect(config.ui.maxMessagesInChat).toBeGreaterThan(0);
        expect(config.ui.textareaMaxHeight).toBeGreaterThan(0);
    });

    test('debe tener todos los tipos de mensajes necesarios', () => {
        expect(config.ui.messageTypes).toHaveProperty('USER');
        expect(config.ui.messageTypes).toHaveProperty('BOT');
        expect(config.ui.messageTypes).toHaveProperty('ERROR');
    });

    test('debe tener la configuración correcta de rate limiting', () => {
        expect(config.rateLimit).toHaveProperty('windowMs');
        expect(config.rateLimit).toHaveProperty('max');
        expect(config.rateLimit.windowMs).toBe(60 * 1000); // 1 minuto
        expect(config.rateLimit.max).toBe(60);
    });

    test('debe tener la configuración correcta de seguridad', () => {
        expect(config.security.helmet).toHaveProperty('contentSecurityPolicy');
        expect(config.security.helmet.contentSecurityPolicy).toHaveProperty('directives');
    });

    test('debe tener la configuración correcta de logging', () => {
        expect(config.logging).toHaveProperty('level');
        expect(config.logging).toHaveProperty('format');
        expect(config.logging).toHaveProperty('directory');
    });

    test('debe tener todos los mensajes de error necesarios', () => {
        expect(config.errorMessages).toHaveProperty('EMPTY_MESSAGE');
        expect(config.errorMessages).toHaveProperty('OPENAI_ERROR');
        expect(config.errorMessages).toHaveProperty('DEFAULT');
        
        Object.values(config.errorMessages).forEach(message => {
            expect(typeof message).toBe('string');
            expect(message.length).toBeGreaterThan(0);
        });
    });
}); 