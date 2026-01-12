/**
 * RESTAURAR PAQUETES FALTANTES
 * =============================
 * 
 * Crea los paquetes que se borraron por error
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

const MISSING_PACKAGES = [
    {
        title: 'Hut 2 Hut - Alta Via 1',
        slug: 'hut-2-hut-alta-via-1',
        location: 'Dolomitas Centrales',
        duration: '7 Días',
        description: 'La legendaria Alta Via 1, el trek más famoso de los Dolomitas',
        difficulty: 'Avanzado',
        groupSize: '4-6 personas',
        priceAmount: 1890,
        rating: 5,
        season: 'summer',
        itinerary: [
            { day: 1, title: 'Lago Braies', description: 'Inicio en el icónico Lago Braies' },
            { day: 2, title: 'Fanes', description: 'Trek por el altiplano de Fanes' },
            { day: 3, title: 'Lagazuoi', description: 'Ascenso al Lagazuoi' },
        ],
        includes: [{ label: 'Guía', detail: 'Guía certificado' }],
        notIncludes: [{ text: 'Vuelos' }],
    },
    {
        title: 'Ski Pull - Cortina Classic',
        slug: 'ski-pull-cortina-classic',
        location: 'Cortina d\'Ampezzo',
        duration: '6 Días',
        description: 'Esquí de fondo en las pistas olímpicas de Cortina',
        difficulty: 'Intermedio',
        groupSize: '6-10 personas',
        priceAmount: 1590,
        rating: 4.8,
        season: 'winter',
        itinerary: [
            { day: 1, title: 'Llegada', description: 'Llegada a Cortina' },
            { day: 2, title: 'Ski día 1', description: 'Primera jornada de esquí' },
        ],
        includes: [{ label: 'Forfait', detail: 'Pase de ski incluido' }],
        notIncludes: [{ text: 'Equipo' }],
    },
    {
        title: 'Ski Family - Val Gardena',
        slug: 'ski-family-val-gardena',
        location: 'Val Gardena',
        duration: '5 Días',
        description: 'Vacaciones perfectas de ski para toda la familia',
        difficulty: 'Todos los niveles',
        groupSize: 'Familias',
        priceAmount: 1790,
        rating: 4.9,
        season: 'winter',
        itinerary: [
            { day: 1, title: 'Llegada', description: 'Check-in en hotel familiar' },
            { day: 2, title: 'Clases', description: 'Clases de esquí para todos' },
        ],
        includes: [{ label: 'Hotel', detail: 'Hotel 4* familiar' }],
        notIncludes: [{ text: 'Vuelos' }],
    },
];

async function restore() {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  RESTAURAR PAQUETES FALTANTES');
    console.log('═══════════════════════════════════════════════════════════\n');

    for (const pkg of MISSING_PACKAGES) {
        console.log(`📦 Creando: ${pkg.title}`);
        
        try {
            await axios.post(
                `${STRAPI_URL}/api/packages`,
                { data: pkg },
                {
                    headers: { ...authHeaders, 'Content-Type': 'application/json' },
                    params: { locale: 'es' }
                }
            );
            console.log(`   ✅ Creado\n`);
        } catch (error) {
            console.log(`   ❌ Error: ${error.response?.data?.error?.message || error.message}\n`);
        }
    }
}

restore().catch(console.error);
