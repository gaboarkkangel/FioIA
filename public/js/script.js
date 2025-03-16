// Importar configuración
const config = {
    ui: window.chatConfig?.ui || {
        maxMessageLength: 2000,
        maxMessagesInChat: 100,
        textareaMaxHeight: 150,
        messageTypes: {
            USER: 'user',
            BOT: 'bot',
            ERROR: 'error'
        }
    },
    errorMessages: window.chatConfig?.errorMessages || {
        EMPTY_MESSAGE: 'Por favor, escribe un mensaje válido.',
        OPENAI_ERROR: 'Error al procesar tu mensaje con la IA. Por favor, intenta de nuevo.',
        DEFAULT: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');
    let messageCount = 0;
    let isProcessing = false;

    function addMessage(content, type = config.ui.messageTypes.BOT) {
        if (messageCount >= config.ui.maxMessagesInChat) {
            const firstMessage = chatMessages.firstElementChild;
            if (firstMessage) {
                firstMessage.remove();
                messageCount--;
            }
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        messageCount++;
    }

    function setLoading(loading) {
        isProcessing = loading;
        sendButton.disabled = loading;
        sendButton.classList.toggle('loading', loading);
        userInput.disabled = loading;
        if (!loading) {
            userInput.focus();
        }
    }

    function handleError(error) {
        console.error('Error:', error);
        let errorMessage = config.errorMessages.DEFAULT;
        
        if (error.code === 'EMPTY_MESSAGE' || error.code === 'INVALID_MESSAGE') {
            errorMessage = config.errorMessages.EMPTY_MESSAGE;
        } else if (error.code === 'OPENAI_ERROR') {
            errorMessage = config.errorMessages.OPENAI_ERROR;
        }
        
        addMessage(errorMessage, config.ui.messageTypes.ERROR);
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message || isProcessing) {return;}

        if (message.length > config.ui.maxMessageLength) {
            handleError({
                code: 'INVALID_MESSAGE',
                message: `El mensaje excede el límite de ${config.ui.maxMessageLength} caracteres`
            });
            return;
        }

        try {
            setLoading(true);
            addMessage(message, config.ui.messageTypes.USER);
            userInput.value = '';
            userInput.style.height = 'auto';

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw { ...data, status: response.status };
            }

            if (data.error) {
                throw data;
            }

            addMessage(data.content, config.ui.messageTypes.BOT);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Autoajuste de altura del textarea con límite máximo
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = Math.min(userInput.scrollHeight, config.ui.textareaMaxHeight) + 'px';
        if (userInput.scrollHeight > config.ui.textareaMaxHeight) {
            userInput.style.overflowY = 'auto';
        } else {
            userInput.style.overflowY = 'hidden';
        }
    });

    // Enfoque inicial en el textarea
    userInput.focus();
}); 