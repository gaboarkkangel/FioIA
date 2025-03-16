export interface Config {
    server: {
        port: number;
        env: string;
        cors: {
            origin: string;
            methods: string[];
        };
    };
    api: {
        baseUrl: string;
        apiKey: string;
        maxTokens: number;
        model: string;
    };
    rateLimit: {
        windowMs: number;
        max: number;
    };
    security: {
        helmet: {
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: string[];
                    scriptSrc: string[];
                    styleSrc: string[];
                    imgSrc: string[];
                    connectSrc: string[];
                };
            };
        };
    };
    logging: {
        level: string;
        format: string;
        directory: string;
    };
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatResponse {
    content: string;
    tokens: number;
    timestamp: string;
}

export interface ErrorResponse {
    error: string;
    status?: number;
}

export interface ApiResponse<T> {
    data?: T;
    error?: ErrorResponse;
}

export interface DeepSeekResponse {
    choices: Array<{
        message: ChatMessage;
    }>;
    usage: {
        total_tokens: number;
    };
} 