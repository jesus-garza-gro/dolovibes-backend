/**
 * LIMPIEZA DE PAQUETES DUPLICADOS
 * =================================
 * 
 * Elimina paquetes con títulos en inglés pero locale='es'
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const STRAPI_URL = 'http://localhost:1337';

// Leer API Token
const envPath = path.join(__dirname, '..', '.env');
let STRAPI_API_TOKEN = '';
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/STRAPI_API_TOKEN=(.+)/);
    if (match) STRAPI_API_TOKEN = match[1].trim();
}

const authHeaders = { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` };

const ENGLISH_TITLES = [
    'Christmas - Bolzano Markets',
    'Hut 2 Hut - Alta Via 1',
    'Hiking - Alpine Lakes',
    'Ski Pull - Cortina Classic',
    'Ski Family - Val Gardena',
    'City Lights - Northern Italy',
    'Hut 2 Hut - Classic Dolomites',
];

async function cleanup() {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  LIMPIEZA DE DUPLICADOS');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Obtener todos los paquetes en español
    const response = await axios.get(`${STRAPI_URL}/api/packages`, {
        params: {
            locale: 'es',
            'pagination[pageSize]': 100,
        },
        headers: authHeaders,
    });

    const packages = response.data.data;
    console.log(`📦 Total paquetes en español: ${packages.length}\n`);

    let deleted = 0;

    for (const pkg of packages) {
        if (ENGLISH_TITLES.includes(pkg.title)) {
            console.log(`🗑️  Eliminando: ${pkg.title} (locale=${pkg.locale}, slug=${pkg.slug})`);
            
            try {
                await axios.delete(
                    `${STRAPI_URL}/api/packages/${pkg.documentId}`,
                    { headers: authHeaders }
                );
                deleted++;
            } catch (error) {
                console.log(`   ❌ Error: ${error.message}`);
            }
        }
    }

    console.log(`\n✅ Eliminados: ${deleted} paquetes duplicados\n`);
}

cleanup().catch(console.error);
