const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

// Leer .env manualmente
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
let STRAPI_API_TOKEN = '';

for (const line of envLines) {
  if (line.startsWith('STRAPI_API_TOKEN=')) {
    STRAPI_API_TOKEN = line.split('=')[1].trim();
  }
}

const STRAPI_URL = 'http://localhost:1337';

console.log('🔍 PRUEBA DE SUBIDA DE IMAGEN');
console.log('══════════════════════════════\n');
console.log(`Token configurado: ${STRAPI_API_TOKEN ? 'Sí' : 'No'}`);
console.log(`Token (primeros 20 chars): ${STRAPI_API_TOKEN ? STRAPI_API_TOKEN.substring(0, 20) + '...' : 'N/A'}`);
console.log(`URL: ${STRAPI_URL}\n`);

async function testUpload() {
  try {
    // Archivo de prueba
    const testFile = path.join(__dirname, '..', 'downloads', 'experiences', 'hut-2-hut-thumbnail.jpg');
    
    console.log(`📂 Archivo: ${testFile}`);
    console.log(`¿Existe?: ${fs.existsSync(testFile) ? 'Sí' : 'No'}`);
    
    if (!fs.existsSync(testFile)) {
      console.error('❌ El archivo no existe');
      return;
    }
    
    const stats = fs.statSync(testFile);
    console.log(`Tamaño: ${(stats.size / 1024).toFixed(2)} KB\n`);
    
    // Crear FormData
    console.log('📤 Creando FormData...');
    const formData = new FormData();
    formData.append('files', fs.createReadStream(testFile), {
      filename: 'hut-2-hut-thumbnail.jpg',
      contentType: 'image/jpeg'
    });
    
    console.log('✅ FormData creado\n');
    
    // Intentar subir
    console.log('📡 Enviando petición a Strapi...');
    console.log(`URL: ${STRAPI_URL}/api/upload`);
    
    const response = await axios.post(`${STRAPI_URL}/api/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      }
    });
    
    console.log('\n✅ ¡ÉXITO!');
    console.log('Respuesta:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('\n❌ ERROR DETECTADO:');
    console.error('Tipo de error:', error.constructor.name);
    console.error('Mensaje:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.request) {
      console.error('Request hecho pero sin respuesta');
    }
    
    console.error('\nError completo:');
    console.dir(error, { depth: null });
  }
}

testUpload();
