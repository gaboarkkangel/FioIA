import { config } from '@/config';

console.log('=== Test de Configuración ===');
console.log('URL Base:', config.api.baseUrl);
console.log('API Key:', config.api.apiKey ? 'Configurada correctamente' : 'No configurada');
console.log('Modelo:', config.api.model);
console.log('========================'); 