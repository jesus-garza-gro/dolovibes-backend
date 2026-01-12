/**
 * Restaurar relaciones entre paquetes y experiencias
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

// Mapeo de paquetes a experiencias (basado en packages.js del frontend)
const PACKAGE_EXPERIENCE_MAP = {
    'hut-2-hut-dolomitas-clasico': 'hut-2-hut',
    'hut-2-hut-alta-via-1': 'hut-2-hut',
    'hiking-lagos-alpinos': 'hiking',
    'city-lights-norte-italia': 'city-lights',
    'ski-pull-cortina-classic': 'ski-pull',
    'ski-family-val-gardena': 'ski-family',
    'navidad-mercados-bolzano': 'navidad',
};

async function main() {
    console.log('🔗 Restaurando relaciones paquetes-experiencias...\n');

    // Obtener experiencias
    const expResponse = await axios.get(`${STRAPI_URL}/api/experiences`, { headers: authHeaders });
    const experiences = expResponse.data.data;
    const expMap = {};
    experiences.forEach(e => { expMap[e.slug] = e.documentId; });
    console.log(`📂 Experiencias: ${Object.keys(expMap).join(', ')}\n`);

    // Obtener paquetes
    const pkgResponse = await axios.get(`${STRAPI_URL}/api/packages`, { headers: authHeaders });
    const packages = pkgResponse.data.data;

    for (const pkg of packages) {
        const expSlug = PACKAGE_EXPERIENCE_MAP[pkg.slug];
        if (!expSlug) {
            console.log(`⚠️  ${pkg.title}: Sin mapeo de experiencia`);
            continue;
        }

        const expDocId = expMap[expSlug];
        if (!expDocId) {
            console.log(`❌ ${pkg.title}: Experiencia "${expSlug}" no encontrada`);
            continue;
        }

        try {
            await axios.put(
                `${STRAPI_URL}/api/packages/${pkg.documentId}`,
                { data: { experience: expDocId } },
                { headers: authHeaders }
            );
            console.log(`✅ ${pkg.title} → ${expSlug}`);
        } catch (error) {
            console.log(`❌ ${pkg.title}: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    console.log('\n✨ Listo!');
}

main().catch(console.error);
