/**
 * SEED DE EXPERIENCES EN INGLÉS
 * ==============================
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

const TRANSLATIONS = {
    'hut-2-hut': {
        title: 'Hut 2 Hut',
        slug: 'hut-2-hut-en',
        season: 'summer',
        shortDescription: 'Sleep in traditional mountain huts and wake up to breathtaking alpine views.',
        longDescription: 'Experience the authentic Dolomites by trekking from refuge to refuge. Each night you\'ll stay in a cozy mountain hut with stunning views, hearty local cuisine, and the camaraderie of fellow hikers. This is the classic Alpine adventure.',
    },
    'hiking': {
        title: 'Hiking',
        slug: 'hiking-en',
        season: 'summer',
        shortDescription: 'Discover the Dolomites through accessible trails perfect for all levels.',
        longDescription: 'Our hiking tours are designed for those who want to explore the beauty of the mountains at a comfortable pace. With expert guides, we\'ll take you to the most scenic viewpoints and hidden gems of the region.',
    },
    'city-lights': {
        title: 'City Lights',
        slug: 'city-lights-en',
        season: 'summer',
        shortDescription: 'Explore the charming cities and villages of northern Italy.',
        longDescription: 'Immerse yourself in Italian culture, art, and gastronomy. From Venice canals to Verona\'s ancient streets, discover the rich heritage and vibrant life of northern Italy\'s most beautiful cities.',
    },
    'ski-pull': {
        title: 'Ski Pull',
        slug: 'ski-pull-en',
        season: 'winter',
        shortDescription: 'Glide through pristine winter landscapes on Nordic skiing trails.',
        longDescription: 'Cross-country skiing offers a peaceful way to explore the snow-covered Dolomites. Perfect for those seeking winter tranquility combined with a great workout in spectacular alpine scenery.',
    },
    'ski-family': {
        title: 'Ski Family',
        slug: 'ski-family-en',
        season: 'winter',
        shortDescription: 'Perfect ski vacations for the whole family with all amenities included.',
        longDescription: 'Create unforgettable family memories in the snow. Our family packages include ski lessons for all ages, childcare options, family-friendly accommodations, and activities everyone will enjoy.',
    },
    'navidad': {
        title: 'Christmas',
        slug: 'navidad-en',
        season: 'winter',
        shortDescription: 'Experience the magic of South Tyrolean Christmas markets and traditions.',
        longDescription: 'Step into a winter wonderland during the festive season. Stroll through enchanting Christmas markets, sample mulled wine and traditional treats, and experience authentic Alpine holiday traditions.',
    },
};

async function seedExperiences() {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║  🇬🇧 SEED DE EXPERIENCES EN INGLÉS - IDEMPOTENTE  ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    if (!STRAPI_API_TOKEN) {
        console.log('❌ Error: STRAPI_API_TOKEN no configurado');
        process.exit(1);
    }

    // Obtener experiences en español
    const response = await axios.get(`${STRAPI_URL}/api/experiences`, {
        params: {
            locale: 'es',
            'populate[thumbnail]': true,
            'populate[heroImage]': true,
            'pagination[pageSize]': 100
        },
        headers: authHeaders,
    });

    const experiences = response.data.data;
    console.log(`📦 Encontradas ${experiences.length} experiences en español\n`);

    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const exp of experiences) {
        const translation = TRANSLATIONS[exp.slug];

        if (!translation) {
            console.log(`⏭️  ${exp.title}: Sin traducción`);
            continue;
        }

        console.log(`\n📦 Procesando: ${exp.title} → ${translation.title}`);

        try {
            // Verificar si ya existe la traducción EN
            const checkEn = await axios.get(`${STRAPI_URL}/api/experiences`, {
                params: {
                    locale: 'en',
                    'filters[slug][$eq]': exp.slug,
                },
                headers: authHeaders,
            });

            const exists = checkEn.data.data.length > 0;
            
            // Preparar datos EN (conservar imágenes de ES)
            const englishData = {
                title: translation.title,
                slug: exp.slug,  // Mismo slug que ES
                season: translation.season,
                shortDescription: translation.shortDescription,
                longDescription: translation.longDescription,
                difficulty: exp.difficulty,
            };

            // Conservar IDs de imágenes de ES
            if (exp.thumbnail?.id) {
                englishData.thumbnail = exp.thumbnail.id;
            }
            if (exp.heroImage?.id) {
                englishData.heroImage = exp.heroImage.id;
            }

            if (exists) {
                console.log(`♻️  Ya existe en inglés (actualizando...)`);
                
                // PUT para actualizar
                await axios.put(
                    `${STRAPI_URL}/api/experiences/${exp.documentId}?locale=en`,
                    { data: englishData },
                    {
                        headers: { ...authHeaders, 'Content-Type': 'application/json' }
                    }
                );
                
                console.log(`✅ Actualizado: ${translation.title}`);
                updated++;
            } else {
                console.log(`🆕 Creando traducción EN usando documentId: ${exp.documentId}`);
                
                // PUT con documentId para crear traducción (NO documento nuevo)
                await axios.put(
                    `${STRAPI_URL}/api/experiences/${exp.documentId}?locale=en`,
                    { data: englishData },
                    {
                        headers: { ...authHeaders, 'Content-Type': 'application/json' }
                    }
                );
                
                console.log(`✅ Creado: ${translation.title}`);
                created++;
            }
            
            // Pausa para no sobrecargar Strapi
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.log(`❌ Error: ${error.response?.data?.error?.message || error.message}`);
            errors++;
        }
    }

    console.log('\n' + '═'.repeat(56));
    console.log('📊 RESUMEN DE CREACIÓN');
    console.log('═'.repeat(56));
    console.log(`✅ Creados: ${created}`);
    console.log(`♻️  Actualizados: ${updated}`);
    console.log(`❌ Fallidos: ${errors}`);
    console.log('\n✨ Proceso completado!\n');
}

if (require.main === module) {
    seedExperiences().catch(console.error);
}

module.exports = { seedExperiences };
