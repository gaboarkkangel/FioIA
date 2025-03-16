# API de Chat con DeepSeek

## Estructura del Proyecto

```
src/
├── config/
│   └── index.ts         # Configuración de la aplicación
├── controllers/
│   └── chatController.ts # Controlador del chat
├── services/
│   └── chatService.ts   # Servicio de chat
├── routes/
│   └── index.ts         # Rutas de la API
├── types/
│   └── index.ts         # Definiciones de tipos
├── utils/
│   └── logger.ts        # Utilidad de logging
└── server.ts            # Punto de entrada
```

## Endpoints

### Chat con DeepSeek
```http
POST /api/chat
```

#### Headers
```json
{
  "Content-Type": "application/json"
}
```

#### Request
```typescript
interface ChatRequest {
  content: string;  // Mensaje del usuario (1-500 caracteres)
}
```

#### Response
```typescript
interface ChatResponse {
  content: string;    // Respuesta generada
  tokens: number;     // Tokens utilizados
  timestamp: string;  // ISO 8601
}
```

#### Errores
```typescript
interface ErrorResponse {
  error: string;
}
```

| Status | Descripción |
|--------|-------------|
| 400 | Mensaje inválido o vacío |
| 429 | Límite de solicitudes excedido |
| 500 | Error interno del servidor |

## Configuración

```typescript
interface Config {
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
    windowMs: number;  // 60 * 1000 (1 minuto)
    max: number;      // 60 solicitudes
  };
  logging: {
    level: string;
    format: string;
    directory: string;
  };
}
```

## Variables de Entorno

```env
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://openrouter.ai/api/v1
MAX_TOKENS=2000
MODEL=deepseek/deepseek-r1:free
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
LOG_DIRECTORY=logs
```

## Ejemplo de Uso

```typescript
// Enviar mensaje
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    message: '¿Cuál es la capital de Francia?' 
  })
});

// Respuesta exitosa
{
  "content": "La capital de Francia es París.",
  "tokens": 15,
  "timestamp": "2024-03-16T12:00:00Z"
}

// Respuesta de error
{
  "error": "Mensaje inválido"
}
```

## Seguridad

- Rate limiting: 60 solicitudes por minuto
- Validación de entrada
- Sanitización de mensajes
- CORS configurado
- Headers de seguridad (Helmet)

## Logging

El sistema utiliza Winston para logging estructurado:

```typescript
logger.info('Mensaje procesado exitosamente');
logger.error('Error en el servicio de chat:', error);
```

Los logs se almacenan en:
- `logs/error.log`: Errores
- `logs/combined.log`: Todos los logs 