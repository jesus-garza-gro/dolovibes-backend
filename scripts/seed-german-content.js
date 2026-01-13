/**
 * SEED DE CONTENIDO EN ALEMÁN
 * ============================
 * Crea versiones en alemán de experiencias
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

// Traducciones de experiencias a alemán
const EXPERIENCE_TRANSLATIONS = {
    'hut-2-hut': {
        title: 'Hüttentour',
        shortDescription: 'Übernachten Sie in traditionellen Berghütten und wachen Sie mit atemberaubenden Alpenblicken auf.',
        longDescription: 'Erleben Sie die authentischen Dolomiten bei einer Hüttenwanderung. Jede Nacht übernachten Sie in einer gemütlichen Berghütte mit spektakulärer Aussicht, herzhafter regionaler Küche und der Gesellschaft anderer Wanderer.',
    },
    'hiking': {
        title: 'Wandern',
        shortDescription: 'Entdecken Sie die Dolomiten auf zugänglichen Wanderwegen für alle Schwierigkeitsgrade.',
        longDescription: 'Unsere Wandertouren sind für diejenigen konzipiert, die die Schönheit der Berge in gemütlichem Tempo erkunden möchten. Mit erfahrenen Guides bringen wir Sie zu den schönsten Aussichtspunkten und versteckten Juwelen der Region.',
    },
    'city-lights': {
        title: 'City Lights',
        shortDescription: 'Erkunden Sie die charmanten Städte und Dörfer Norditaliens.',
        longDescription: 'Tauchen Sie ein in italienische Kultur, Kunst und Gastronomie. Von den Kanälen Venedigs bis zu den antiken Straßen Veronas entdecken Sie das reiche Erbe und das pulsierende Leben der schönsten Städte Norditaliens.',
    },
    'ski-pull': {
        title: 'Langlauf',
        shortDescription: 'Gleiten Sie durch unberührte Winterlandschaften auf nordischen Skiloipen.',
        longDescription: 'Langlauf bietet eine friedliche Möglichkeit, die schneebedeckten Dolomiten zu erkunden. Perfekt für alle, die winterliche Ruhe mit einem tollen Workout in spektakulärer alpiner Kulisse suchen.',
    },
    'ski-family': {
        title: 'Familien Skiurlaub',
        shortDescription: 'Perfekte Skiferien für die ganze Familie mit allen Annehmlichkeiten inklusive.',
        longDescription: 'Schaffen Sie unvergessliche Familienerinnerungen im Schnee. Unsere Familienpakete umfassen Skiunterricht für alle Altersgruppen, Kinderbetreuung, familienfreundliche Unterkünfte und Aktivitäten, die allen Spaß machen.',
    },
    'navidad': {
        title: 'Weihnachten',
        shortDescription: 'Erleben Sie die Magie der Südtiroler Weihnachtsmärkte und Traditionen.',
        longDescription: 'Betreten Sie ein Winterwunderland während der Festtage. Schlendern Sie durch zauberhafte Weihnachtsmärkte, probieren Sie Glühwein und traditionelle Leckereien und erleben Sie authentische alpine Weihnachtstraditionen.',
    },
};

async function seedGerman() {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  🇩🇪 SEED DE CONTENIDO EN ALEMÁN');
    console.log('═══════════════════════════════════════════════════════════\n');

    let experiencesCreated = 0;
    let errors = 0;

    console.log('🎯 Creando experiencias...\n');
    
    const experiencesEs = await axios.get(`${STRAPI_URL}/api/experiences`, {
        params: {
            locale: 'es',
            'populate[thumbnail]': true,
            'populate[heroImage]': true,
            'pagination[pageSize]': 100
        },
        headers: authHeaders,
    });

    for (const exp of experiencesEs.data.data) {
        const translation = EXPERIENCE_TRANSLATIONS[exp.slug];
        if (!translation) continue;

        try {
            // Verificar si ya existe
            const check = await axios.get(`${STRAPI_URL}/api/experiences`, {
                params: { locale: 'de', 'filters[slug][$eq]': exp.slug },
                headers: authHeaders,
            });

            const exists = check.data.data.length > 0;
            const action = exists ? 'actualizado' : 'creado';

            // Preparar datos preservando imágenes
            const dataToSend = {
                ...translation,
                slug: exp.slug,  // Mismo slug que ES
                season: exp.season,
                difficulty: exp.difficulty,
            };

            // Conservar IDs de imágenes de ES
            if (exp.thumbnail?.id) {
                dataToSend.thumbnail = exp.thumbnail.id;
            }
            if (exp.heroImage?.id) {
                dataToSend.heroImage = exp.heroImage.id;
            }

            // PUT con documentId crea/actualiza la traducción
            await axios.put(
                `${STRAPI_URL}/api/experiences/${exp.documentId}?locale=de`,
                { data: dataToSend },
                { headers: { ...authHeaders, 'Content-Type': 'application/json' } }
            );

            console.log(`✅ ${translation.title} (${action})`);
            experiencesCreated++;
        } catch (error) {
            console.log(`❌ ${translation.title}: ${error.response?.data?.error?.message || error.message}`);
            errors++;
        }
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  RESUMEN');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  🎯 Experiencias:  ${experiencesCreated}`);
    console.log(`  ❌ Errores:       ${errors}`);
    console.log('═══════════════════════════════════════════════════════════\n');
}

seedGerman().catch(console.error);
