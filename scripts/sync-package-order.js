/**
 * SINCRONIZAR ORDEN DE PACKAGES EN TODOS LOS IDIOMAS
 * ===================================================
 * 
 * Establece el mismo displayOrder para packages con el mismo documentId
 * en todos los idiomas (ES, EN, IT, DE).
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const STRAPI_URL = 'http://localhost:1337';

const envPath = path.join(__dirname, '..', '.env');
let STRAPI_API_TOKEN = '';
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/STRAPI_API_TOKEN=(.+)/);
    if (match) STRAPI_API_TOKEN = match[1].trim();
}

const authHeaders = { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` };

// Orden deseado (basado en lógica de negocio)
const ORDER_BY_SLUG = {
    'navidad-mercados-bolzano': 1,        // Temporada (prioridad)
    'hiking-lagos-alpinos': 2,            // Fácil
    'city-lights-norte-italia': 3,        // Fácil
    'hut-2-hut-dolomitas-clasico': 4,     // Intermedio
    'hut-2-hut-alta-via-1': 5,            // Avanzado
    'ski-pull-cortina-classic': 6,        // Invierno
    'ski-family-val-gardena': 7,          // Invierno familiar
};

async function syncDisplayOrder() {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║  🔄 SINCRONIZAR ORDEN DE PACKAGES                  ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    const locales = ['es', 'en', 'it', 'de'];
    let updated = 0;
    let errors = 0;

    for (const locale of locales) {
        console.log(`\n📦 Actualizando ${locale.toUpperCase()}...\n`);

        // Obtener packages del locale CON imágenes
        const res = await axios.get(`${STRAPI_URL}/api/packages`, {
            params: {
                locale,
                'populate[thumbnail]': true,
                'populate[heroImage]': true,
                'pagination[pageSize]': 100
            },
            headers: authHeaders
        });

        for (const pkg of res.data.data) {
            const newOrder = ORDER_BY_SLUG[pkg.slug];
            
            if (!newOrder) {
                console.log(`   ⚠️  Sin orden definido para: ${pkg.slug}`);
                continue;
            }

            try {
                // Preparar datos preservando las imágenes
                const updateData = {
                    displayOrder: newOrder
                };

                // Preservar thumbnail y heroImage si existen
                if (pkg.thumbnail?.id) {
                    updateData.thumbnail = pkg.thumbnail.id;
                }
                if (pkg.heroImage?.id) {
                    updateData.heroImage = pkg.heroImage.id;
                }

                // Actualizar displayOrder SIN perder las imágenes
                await axios.put(
                    `${STRAPI_URL}/api/packages/${pkg.documentId}?locale=${locale}`,
                    { data: updateData },
                    { headers: authHeaders }
                );

                console.log(`   ✓ ${pkg.title} → displayOrder: ${newOrder}`);
                updated++;
            } catch (error) {
                console.log(`   ✗ Error actualizando ${pkg.title}: ${error.message}`);
                errors++;
            }
        }
    }

    console.log('\n' + '═'.repeat(56));
    console.log('📊 RESUMEN');
    console.log('═'.repeat(56));
    console.log(`✓ Actualizados: ${updated}`);
    console.log(`✗ Errores: ${errors}`);
    console.log('\n✨ Ahora todos los idiomas tienen el mismo orden!\n');
}

if (require.main === module) {
    if (!STRAPI_API_TOKEN) {
        console.log('\n❌ Error: STRAPI_API_TOKEN no configurado\n');
        process.exit(1);
    }
    syncDisplayOrder().catch(error => {
        console.error('\n💥 Error fatal:', error.message);
        process.exit(1);
    });
}

module.exports = { syncDisplayOrder };
