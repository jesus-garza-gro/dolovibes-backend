/**
 * PUBLICAR CONTENIDO EN INGLÉS
 * =============================
 * 
 * Publica las versiones en inglés de los paquetes en Strapi.
 * 
 * Uso: node scripts/publish-english-content.js
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

async function publishEnglishPackages() {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  PUBLICAR CONTENIDO EN INGLÉS');
    console.log('═══════════════════════════════════════════════════════════\n');

    if (!STRAPI_API_TOKEN) {
        console.log('❌ Error: STRAPI_API_TOKEN no configurado');
        process.exit(1);
    }

    // Obtener todos los paquetes en inglés (incluyendo drafts)
    const response = await axios.get(`${STRAPI_URL}/api/packages`, {
        params: {
            locale: 'en',
            'status': 'draft',
            'pagination[pageSize]': 100,
        },
        headers: authHeaders,
    });

    const packages = response.data.data;
    console.log(`📦 Encontrados ${packages.length} paquetes en inglés\n`);

    let published = 0;
    let errors = 0;

    for (const pkg of packages) {
        try {
            if (pkg.publishedAt) {
                console.log(`⏭️  ${pkg.title}: Ya publicado`);
                continue;
            }

            await axios.put(
                `${STRAPI_URL}/api/packages/${pkg.documentId}`,
                {
                    data: {
                        publishedAt: new Date().toISOString(),
                    }
                },
                {
                    headers: {
                        ...authHeaders,
                        'Content-Type': 'application/json',
                    },
                    params: {
                        locale: 'en',
                    }
                }
            );

            console.log(`✅ ${pkg.title}: Publicado`);
            published++;
        } catch (error) {
            console.log(`❌ ${pkg.title}: Error - ${error.message}`);
            errors++;
        }
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  RESUMEN');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  ✅ Publicados: ${published}`);
    console.log(`  ❌ Errores:    ${errors}`);
    console.log('═══════════════════════════════════════════════════════════\n');
}

publishEnglishPackages().catch(console.error);
