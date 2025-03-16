# Guía de Pruebas

## Configuración de Pruebas

### Herramientas
- **Jest**: Framework principal de pruebas
- **Supertest**: Pruebas de API
- **JSDOM**: Simulación del DOM

### Estructura
```
__tests__/
├── setup.js           # Configuración global
├── server.test.js    # Pruebas del servidor
├── client.test.js   # Pruebas del cliente
└── config.test.js  # Pruebas de configuración
```

## Tipos de Pruebas

### 1. Pruebas Unitarias
- Funciones individuales
- Componentes aislados
- Utilidades y helpers

### 2. Pruebas de Integración
- API endpoints
- Flujos de datos
- Interacciones DOM

### 3. Pruebas End-to-End
- Flujos completos de usuario
- Integración frontend-backend

## Ejecución de Pruebas

### Comandos Básicos
```bash
# Ejecutar todas las pruebas
npm test

# Modo watch
npm run test:watch

# Cobertura de código
npm run test:coverage
```

### Configuración de Jest
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/__tests__/setup.js'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

## Ejemplos de Pruebas

### Pruebas del Servidor
```javascript
describe('Server API', () => {
  test('GET / returns index.html', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.type).toBe('text/html');
  });

  test('POST /api/chat processes messages', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'test' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('response');
  });
});
```

### Pruebas del Cliente
```javascript
describe('Client Features', () => {
  test('adds messages to chat', () => {
    addMessage('test', true);
    const messages = document.querySelectorAll('.message');
    expect(messages.length).toBe(1);
  });

  test('handles loading state', () => {
    setLoading(true);
    const button = document.querySelector('button');
    expect(button.disabled).toBe(true);
  });
});
```

## Mocks y Stubs

### API Mocks
```javascript
jest.spyOn(global, 'fetch').mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ response: 'test' })
  })
);
```

### DOM Mocks
```javascript
document.body.innerHTML = `
  <div id="chat"></div>
  <textarea id="input"></textarea>
  <button id="send">Send</button>
`;
```

## Cobertura de Código

### Métricas
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

### Reporte
```bash
npm run test:coverage
```

### Exclusiones
```javascript
/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  // código de desarrollo
}
```

## Mejores Prácticas

### 1. Organización
- Un archivo de prueba por módulo
- Descripciones claras de pruebas
- Agrupación lógica de casos

### 2. Nomenclatura
```javascript
describe('Component/Function', () => {
  test('should do something when condition', () => {
    // prueba
  });
});
```

### 3. Aislamiento
- Limpiar estado entre pruebas
- Evitar dependencias entre pruebas
- Usar mocks apropiadamente

### 4. Aserciones
- Ser específico en las aserciones
- Verificar estados positivos y negativos
- Cubrir casos límite

## Depuración

### Jest Debug
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### VS Code
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "program": "${workspaceFolder}/node_modules/jest/bin/jest",
  "args": ["--runInBand"]
}
```

## CI/CD

### GitHub Actions
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test
```

## Mantenimiento

### 1. Actualización Regular
- Mantener dependencias actualizadas
- Revisar deprecaciones
- Actualizar mocks según cambios

### 2. Refactorización
- Eliminar pruebas redundantes
- Mejorar legibilidad
- Optimizar rendimiento

### 3. Documentación
- Mantener README actualizado
- Documentar configuraciones
- Explicar casos especiales 