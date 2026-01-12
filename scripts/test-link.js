const axios = require('axios');
const fs = require('fs');

// Leer token
const envContent = fs.readFileSync('.env', 'utf8');
let token = '';
envContent.split('\n').forEach(line => {
  if (line.startsWith('STRAPI_API_TOKEN=')) {
    token = line.split('=')[1].trim();
  }
});

const client = axios.create({
  baseURL: 'http://localhost:1337',
  headers: { 'Authorization': `Bearer ${token}` }
});

async function test() {
  try {
    // 1. Obtener experiencia
    const exp = await client.get('/api/experiences', {
      params: { 'filters[slug][$eq]': 'hut-2-hut', locale: 'es' }
    });
    
    const docId = exp.data.data[0].documentId;
    console.log('📌 Experience Document ID:', docId);
    console.log('📷 Thumbnail actual:', exp.data.data[0].thumbnail || 'NINGUNO');
    
    // 2. Actualizar con imágenes ID 5 y 6
    console.log('\n🔄 Actualizando...');
    const update = await client.put(`/api/experiences/${docId}`, {
      data: { 
        thumbnail: 5,
        heroImage: 6
      }
    });
    
    console.log('✅ Respuesta:', update.status);
    console.log('📷 Nuevo thumbnail:', update.data.data.thumbnail ? 'VINCULADO' : 'NO VINCULADO');
    
    // 3. Verificar con populate
    console.log('\n🔍 Verificando con populate...');
    const check = await client.get(`/api/experiences/${docId}`, {
      params: { locale: 'es', populate: '*' }
    });
    
    console.log('📷 Thumbnail:', check.data.data.thumbnail?.url || 'NO ENCONTRADO');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

test();
