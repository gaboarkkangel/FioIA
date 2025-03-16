/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const config = require('../config');

describe('Cliente', () => {
    let scriptContent;
    let consoleSpy;

    beforeAll(() => {
        scriptContent = fs.readFileSync(path.join(__dirname, '../public/js/script.js'), 'utf8');
        eval(scriptContent);
        consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    beforeEach(() => {
        document.getElementById('chatMessages').innerHTML = '';
        document.getElementById('userInput').value = '';
        global.fetch.mockClear();
        consoleSpy.mockClear();
    });

    describe('Funcionalidad de mensajes', () => {
        test('debe agregar mensajes del usuario correctamente', () => {
            const userInput = document.getElementById('userInput');
            const sendButton = document.getElementById('sendButton');
            
            userInput.value = 'Mensaje de prueba';
            sendButton.click();

            const messages = document.getElementsByClassName('message');
            expect(messages.length).toBe(1);
            expect(messages[0].textContent).toBe('Mensaje de prueba');
            expect(messages[0].classList.contains('user')).toBe(true);
        });

        test('debe mantener el orden correcto de los mensajes', async () => {
            const userInput = document.getElementById('userInput');
            const sendButton = document.getElementById('sendButton');
            
            global.fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ content: 'Respuesta 1' })
                })
            );

            userInput.value = 'Mensaje 1';
            await sendButton.click();

            global.fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ content: 'Respuesta 2' })
                })
            );

            userInput.value = 'Mensaje 2';
            await sendButton.click();

            const messages = document.getElementsByClassName('message');
            expect(messages.length).toBe(4);
            expect(messages[0].textContent).toBe('Mensaje 1');
            expect(messages[1].textContent).toBe('Respuesta 1');
            expect(messages[2].textContent).toBe('Mensaje 2');
            expect(messages[3].textContent).toBe('Respuesta 2');
        });

        test('debe manejar el límite de mensajes', () => {
            const chatMessages = document.getElementById('chatMessages');
            
            for (let i = 0; i < config.ui.maxMessagesInChat + 5; i++) {
                const message = document.createElement('div');
                message.className = 'message';
                message.textContent = `Mensaje ${i}`;
                chatMessages.appendChild(message);
            }

            const userInput = document.getElementById('userInput');
            const sendButton = document.getElementById('sendButton');
            
            userInput.value = 'Nuevo mensaje';
            sendButton.click();

            expect(chatMessages.children.length).toBeLessThanOrEqual(config.ui.maxMessagesInChat);
            expect(chatMessages.lastChild.textContent).toBe('Nuevo mensaje');
        });

        test('debe hacer scroll al último mensaje', () => {
            const chatMessages = document.getElementById('chatMessages');
            const originalScrollTop = chatMessages.scrollTop;
            
            const userInput = document.getElementById('userInput');
            const sendButton = document.getElementById('sendButton');
            
            userInput.value = 'Mensaje de prueba';
            sendButton.click();

            expect(chatMessages.scrollTop).toBeGreaterThan(originalScrollTop);
        });
    });

    describe('Validación de entrada', () => {
        test('debe rechazar mensajes vacíos', () => {
            const userInput = document.getElementById('userInput');
            const sendButton = document.getElementById('sendButton');
            
            const emptyInputs = ['', '   ', '\n', '\t'];
            
            emptyInputs.forEach(input => {
                userInput.value = input;
                sendButton.click();
                expect(global.fetch).not.toHaveBeenCalled();
            });
        });

        test('debe rechazar mensajes muy largos', () => {
            const userInput = document.getElementById('userInput');
            const sendButton = document.getElementById('sendButton');
            
            userInput.value = 'a'.repeat(config.ui.maxMessageLength + 1);
            sendButton.click();

            const errorMessages = document.getElementsByClassName('message error');
            expect(errorMessages.length).toBe(1);
            expect(errorMessages[0].textContent).toContain('excede el límite');
            expect(global.fetch).not.toHaveBeenCalled();
        });

        test('debe deshabilitar la entrada durante el procesamiento', async () => {
            global.fetch.mockImplementationOnce(() =>
                new Promise(resolve =>
                    setTimeout(() => resolve({
                        ok: true,
                        json: () => Promise.resolve({ content: 'Respuesta' })
                    }), 100)
                )
            );

            const userInput = document.getElementById('userInput');
            const sendButton = document.getElementById('sendButton');
            
            userInput.value = 'Hola';
            const clickPromise = sendButton.click();

            expect(userInput.disabled).toBe(true);
            expect(sendButton.disabled).toBe(true);

            await clickPromise;

            expect(userInput.disabled).toBe(false);
            expect(sendButton.disabled).toBe(false);
        });
    });

    describe('Interacción con la API', () => {
        test('debe manejar respuestas exitosas', async () => {
            global.fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ content: 'Respuesta de la IA' })
                })
            );

            const userInput = document.getElementById('userInput');
            const sendButton = document.getElementById('sendButton');
            
            userInput.value = 'Hola';
            await sendButton.click();

            const messages = document.getElementsByClassName('message');
            expect(messages.length).toBe(2);
            expect(messages[1].textContent).toBe('Respuesta de la IA');
            expect(messages[1].classList.contains('bot')).toBe(true);
        });

        test('debe manejar diferentes tipos de errores', async () => {
            const errorScenarios = [
                {
                    error: { ok: false, status: 400, json: () => Promise.resolve({ code: 'INVALID_MESSAGE' }) },
                    expectedMessage: config.errorMessages.EMPTY_MESSAGE
                },
                {
                    error: { ok: false, status: 500, json: () => Promise.resolve({ code: 'OPENAI_ERROR' }) },
                    expectedMessage: config.errorMessages.OPENAI_ERROR
                },
                {
                    error: new Error('Network error'),
                    expectedMessage: config.errorMessages.DEFAULT
                }
            ];

            for (const scenario of errorScenarios) {
                global.fetch.mockImplementationOnce(() => {
                    if (scenario.error instanceof Error) {
                        return Promise.reject(scenario.error);
                    }
                    return Promise.resolve(scenario.error);
                });

                const userInput = document.getElementById('userInput');
                const sendButton = document.getElementById('sendButton');
                
                userInput.value = 'Hola';
                await sendButton.click();

                const errorMessages = document.getElementsByClassName('message error');
                expect(errorMessages[errorMessages.length - 1].textContent)
                    .toBe(scenario.expectedMessage);
            }
        });

        test('debe manejar errores de red', async () => {
            global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

            const userInput = document.getElementById('userInput');
            const sendButton = document.getElementById('sendButton');
            
            userInput.value = 'Hola';
            await sendButton.click();

            expect(consoleSpy).toHaveBeenCalled();
            const errorMessages = document.getElementsByClassName('message error');
            expect(errorMessages.length).toBe(1);
        });
    });

    describe('Estado de carga', () => {
        test('debe mostrar y ocultar el estado de carga correctamente', async () => {
            global.fetch.mockImplementationOnce(() =>
                new Promise(resolve =>
                    setTimeout(() => resolve({
                        ok: true,
                        json: () => Promise.resolve({ content: 'Respuesta' })
                    }), 100)
                )
            );

            const sendButton = document.getElementById('sendButton');
            const userInput = document.getElementById('userInput');
            
            userInput.value = 'Hola';
            const sendPromise = sendButton.click();

            expect(sendButton.disabled).toBe(true);
            expect(userInput.disabled).toBe(true);
            expect(sendButton.classList.contains('loading')).toBe(true);

            await sendPromise;

            expect(sendButton.disabled).toBe(false);
            expect(userInput.disabled).toBe(false);
            expect(sendButton.classList.contains('loading')).toBe(false);
        });

        test('debe restaurar el estado después de un error', async () => {
            global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

            const sendButton = document.getElementById('sendButton');
            const userInput = document.getElementById('userInput');
            
            userInput.value = 'Hola';
            await sendButton.click();

            expect(sendButton.disabled).toBe(false);
            expect(userInput.disabled).toBe(false);
            expect(sendButton.classList.contains('loading')).toBe(false);
            expect(userInput).toBe(document.activeElement);
        });
    });

    describe('Eventos del textarea', () => {
        test('debe ajustar la altura automáticamente', () => {
            const userInput = document.getElementById('userInput');
            const originalHeight = userInput.style.height;

            userInput.value = 'Línea 1\nLínea 2\nLínea 3';
            const event = new Event('input');
            userInput.dispatchEvent(event);

            expect(userInput.style.height).not.toBe(originalHeight);
        });

        test('debe respetar la altura máxima', () => {
            const userInput = document.getElementById('userInput');
            
            userInput.value = '\n'.repeat(100);
            const event = new Event('input');
            userInput.dispatchEvent(event);

            const height = parseInt(userInput.style.height);
            expect(height).toBeLessThanOrEqual(config.ui.textareaMaxHeight);
            expect(userInput.style.overflowY).toBe('auto');
        });

        test('debe manejar la tecla Enter correctamente', () => {
            const userInput = document.getElementById('userInput');
            
            userInput.value = 'Mensaje';
            
            // Enter sin Shift debe enviar
            const enterEvent = new KeyboardEvent('keypress', { key: 'Enter' });
            userInput.dispatchEvent(enterEvent);
            
            expect(global.fetch).toHaveBeenCalled();

            // Enter con Shift no debe enviar
            const shiftEnterEvent = new KeyboardEvent('keypress', { key: 'Enter', shiftKey: true });
            userInput.dispatchEvent(shiftEnterEvent);
            
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });
    });
}); 