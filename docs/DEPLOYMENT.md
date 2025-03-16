# Guía de Despliegue

## Preparación para Producción

### 1. Variables de Entorno
```env
NODE_ENV=production
PORT=3000
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_API_KEY=tu-api-key-produccion
```

### 2. Configuración de Seguridad
- CORS configurado para dominios específicos
- Rate limiting
- Helmet para headers HTTP
- Validación de entrada
- Sanitización de datos

### 3. Optimizaciones
- Compresión gzip/brotli
- Caché de respuestas
- Minificación de assets
- Headers de caché apropiados

## Opciones de Despliegue

### 1. Heroku
```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Crear aplicación
heroku create mi-app-chat

# Configurar variables
heroku config:set NODE_ENV=production
heroku config:set OPENAI_API_KEY=xxx

# Desplegar
git push heroku main
```

### 2. DigitalOcean
1. Crear Droplet
2. Configurar Nginx
3. Configurar PM2
4. Configurar SSL con Let's Encrypt

### 3. AWS Elastic Beanstalk
1. Crear aplicación
2. Configurar ambiente
3. Desplegar código
4. Configurar auto-scaling

## Proceso de Despliegue

### 1. Pre-despliegue
```bash
# Verificar pruebas
npm test

# Verificar build
npm run build

# Verificar dependencias
npm audit
```

### 2. Despliegue
```bash
# Ejemplo con PM2
pm2 deploy ecosystem.config.js production
```

### 3. Post-despliegue
- Verificar logs
- Monitorear métricas
- Verificar funcionalidad
- Realizar pruebas de carga

## Monitoreo

### 1. Logs
```javascript
// Configuración de Winston
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 2. Métricas
- CPU/Memoria
- Tiempo de respuesta
- Tasa de errores
- Usuarios concurrentes

### 3. Alertas
- Errores críticos
- Alto uso de recursos
- Latencia elevada
- Caída del servicio

## SSL/TLS

### 1. Let's Encrypt
```bash
# Instalar Certbot
sudo apt-get install certbot

# Obtener certificado
sudo certbot --nginx -d tudominio.com
```

### 2. Configuración Nginx
```nginx
server {
    listen 443 ssl;
    server_name tudominio.com;

    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Backup y Recuperación

### 1. Backup
- Código fuente (Git)
- Variables de entorno
- Logs
- Configuraciones

### 2. Plan de Recuperación
1. Restaurar último backup
2. Verificar configuraciones
3. Reiniciar servicios
4. Verificar funcionalidad

## Escalabilidad

### 1. Horizontal
- Load balancer
- Múltiples instancias
- Sesiones distribuidas

### 2. Vertical
- Aumentar recursos
- Optimizar código
- Mejorar caché

## Mantenimiento

### 1. Actualizaciones
- Dependencias
- Sistema operativo
- SSL certificates
- Configuraciones

### 2. Monitoreo Continuo
- Revisar logs
- Verificar métricas
- Actualizar documentación
- Realizar backups

## Rollback

### 1. Plan de Rollback
```bash
# Ejemplo con PM2
pm2 deploy production revert 1
```

### 2. Verificación
- Logs de error
- Funcionalidad básica
- Métricas clave
- Notificar stakeholders 