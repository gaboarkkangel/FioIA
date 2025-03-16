# Chat con DeepSeek AI

## Descripción
Esta aplicación es una interfaz de chat interactiva que utiliza la API de DeepSeek para generar respuestas inteligentes. La aplicación está construida con una arquitectura cliente-servidor, utilizando Node.js en el backend y HTML/CSS/JavaScript vanilla en el frontend.

## Estructura del Proyecto

```
deepseek/
├── src/                          # Código fuente principal
│   ├── api/                      # Clientes de API externos
│   │   └── deepseek.js          # Cliente para la API de DeepSeek
│   │
│   ├── config/                   # Configuraciones
│   │   ├── database.js          # Configuración de base de datos
│   │   ├── environment.js       # Variables de entorno
│   │   └── server.js           # Configuración del servidor
│   │
│   ├── controllers/             # Controladores
│   │   └── chatController.js   # Lógica de control del chat
│   │
│   ├── middleware/             # Middleware
│   │   ├── errorHandler.js    # Manejo de errores global
│   │   ├── rateLimiter.js    # Limitador de tasa
│   │   └── validator.js      # Validación de entrada
│   │
│   ├── models/               # Modelos de datos
│   │   └── message.js      # Modelo de mensajes
│   │
│   ├── routes/             # Definición de rutas
│   │   ├── api.js        # Rutas de la API
│   │   └── index.js     # Rutas principales
│   │
│   ├── services/        # Servicios de negocio
│   │   └── chatService.js  # Lógica de negocio del chat
│   │
│   └── utils/          # Utilidades
│       ├── logger.js  # Sistema de logging
│       └── helpers.js # Funciones auxiliares
│
├── public/            # Archivos públicos
│   ├── css/          # Estilos
│   │   └── styles.css
│   ├── js/           # JavaScript del cliente
│   │   └── script.js
│   └── assets/       # Recursos estáticos
│       └── images/   # Imágenes
│
├── tests/            # Pruebas
│   ├── unit/        # Pruebas unitarias
│   │   ├── api/
│   │   ├── controllers/
│   │   └── services/
│   ├── integration/ # Pruebas de integración
│   └── e2e/        # Pruebas end-to-end
│
├── docs/           # Documentación
│   ├── api/       # Documentación de API
│   ├── development/ # Guías de desarrollo
│   └── deployment/  # Guías de despliegue
│
├── .env            # Variables de entorno (no versionado)
├── .env.example    # Ejemplo de variables de entorno
├── .gitignore     # Archivos ignorados por git
├── package.json   # Dependencias y scripts
├── README.md     # Documentación principal
└── server.js    # Punto de entrada de la aplicación
```

## Componentes Principales

### Backend (src/)

#### 1. API (/src/api)
- Gestiona la comunicación con servicios externos
- Implementa el cliente de DeepSeek
- Maneja errores de API

#### 2. Config (/src/config)
- Centraliza la configuración
- Gestiona variables de entorno
- Define constantes globales

#### 3. Controllers (/src/controllers)
- Maneja la lógica de control
- Procesa peticiones
- Coordina servicios

#### 4. Middleware (/src/middleware)
- Validación de entrada
- Control de acceso
- Manejo de errores

#### 5. Services (/src/services)
- Implementa lógica de negocio
- Procesa mensajes
- Gestiona respuestas

### Frontend (public/)

#### 1. CSS (/public/css)
- Estilos de la interfaz
- Diseño responsivo
- Animaciones

#### 2. JavaScript (/public/js)
- Lógica del cliente
- Manejo de eventos
- Comunicación con API

#### 3. Assets (/public/assets)
- Imágenes
- Iconos
- Recursos estáticos

### Tests (tests/)
- Pruebas unitarias
- Pruebas de integración
- Pruebas end-to-end

### Docs (docs/)
- Documentación de API
- Guías de desarrollo
- Instrucciones de despliegue

## Características Principales
- 🤖 Integración con DeepSeek AI
- 💬 Interfaz de chat en tiempo real
- 🎨 Diseño responsivo y moderno
- ⚡ Validación de entrada en tiempo real
- 🔄 Indicadores de carga y estados
- 🛡️ Manejo robusto de errores

## Requisitos Previos
- Node.js (v14 o superior)
- npm (v6 o superior)
- Clave API de DeepSeek

## Instalación

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
cd deepseek
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

## Ejecución

### Modo Desarrollo
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

### Ejecutar Pruebas
```bash
npm test                # Ejecutar pruebas
npm run test:watch     # Modo watch
npm run test:coverage  # Reporte de cobertura
```

## Documentación Adicional
- [Guía de API](./docs/API.md)
- [Guía de Desarrollo](./docs/DEVELOPMENT.md)
- [Guía de Pruebas](./docs/TESTING.md)
- [Guía de Despliegue](./docs/DEPLOYMENT.md)

## Licencia
MIT 