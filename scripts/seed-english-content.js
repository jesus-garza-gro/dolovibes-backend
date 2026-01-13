/**
 * SEED DE CONTENIDO EN INGLÉS
 * ============================
 * 
 * Crea versiones en inglés de los paquetes existentes en Strapi.
 * El contenido en español se traduce al inglés.
 * 
 * Uso: node scripts/seed-english-content.js
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

// ═══════════════════════════════════════════════════════════════
// TRADUCCIONES DE CONTENIDO
// ═══════════════════════════════════════════════════════════════

const PACKAGE_TRANSLATIONS = {
    'hut-2-hut-dolomitas-clasico': {
        title: 'Hut 2 Hut - Classic Dolomites',
        location: 'Dolomites',
        duration: '5 Days',
        description: 'The classic route of the Tre Cime di Lavaredo. 5 days trekking through the most iconic mountain huts.',
        difficulty: 'Intermediate',
        groupSize: '4-8 people',
        guideType: 'Guided',
        availableDates: 'June - September',
        itinerary: [
            { day: 1, title: 'Arrival in Cortina', description: 'Arrival at Cortina d\'Ampezzo and welcome briefing. First stretch to Auronzo refuge with views of the Tre Cime.' },
            { day: 2, title: 'Tre Cime di Lavaredo', description: 'Iconic hike around the Tre Cime. Approximately 10km with breathtaking views.' },
            { day: 3, title: 'Lake Braies', description: 'Trek to Lake Braies, one of the most photographed lakes in the Dolomites.' },
            { day: 4, title: 'Giau Pass', description: 'Crossing the Giau Pass with 360° panoramas. Night at the refuge with special dinner.' },
            { day: 5, title: 'Descent and Farewell', description: 'Final stretch descending to the valley. Arrival in Cortina and group farewell.' },
        ],
        includes: [
            { label: 'UIAGM Guide', detail: 'UIAGM certified mountain guide with more than 10 years of experience in the Dolomites.' },
            { label: 'Refuge accommodation', detail: '4 nights in traditional mountain refuges with shared rooms.' },
            { label: 'Half board', detail: 'Buffet breakfast and 3-course dinner each day at the refuge.' },
            { label: 'Luggage transport', detail: 'Your main bag is transported from refuge to refuge. You only carry your day pack.' },
        ],
        notIncludes: ['International flights', 'Lunches', 'Travel insurance', 'Tips'],
        gallery: [
            { caption: 'Auronzo Refuge - First day of the trek' },
            { caption: 'Panoramic view of the Tre Cime di Lavaredo' },
            { caption: 'Trail to Lake Braies' },
            { caption: 'Sunset from the refuge' },
            { caption: 'Hikers group at Giau Pass' },
        ],
    },
    'hut-2-hut-alta-via-1': {
        title: 'Hut 2 Hut - Alta Via 1',
        location: 'Central Dolomites',
        duration: '7 Days',
        description: 'The legendary Alta Via 1, the most famous trek in the Dolomites. 7 days of pure adventure.',
        difficulty: 'Advanced',
        groupSize: '4-6 people',
        guideType: 'Guided',
        availableDates: 'July - August',
        itinerary: [
            { day: 1, title: 'Lake Braies', description: 'Start at iconic Lake Braies. First stage to Biella refuge.' },
            { day: 2, title: 'Fanes', description: 'Trek through the Fanes plateau with spectacular views.' },
            { day: 3, title: 'Lagazuoi', description: 'Ascent to Lagazuoi with WWI tunnels.' },
            { day: 4, title: 'Cinque Torri', description: 'Passing by the iconic Cinque Torri.' },
            { day: 5, title: 'Nuvolau', description: 'Ascent to Nuvolau with 360° panoramas.' },
            { day: 6, title: 'Civetta', description: 'Trek towards the imposing Civetta wall.' },
            { day: 7, title: 'Alleghe', description: 'Final descent to Alleghe. Celebration and farewell.' },
        ],
        includes: [
            { label: 'What\'s included', detail: 'Expert guide, 6 nights in refuges, half board, luggage transport.' },
        ],
        notIncludes: ['Flights', 'Lunches', 'Insurance', 'Tips'],
    },
    'hiking-lagos-alpinos': {
        title: 'Hiking - Alpine Lakes',
        location: 'South Tyrol',
        duration: '4 Days',
        description: 'Discover the most crystal-clear lakes in the Alps. Gentle routes with incredible landscapes.',
        difficulty: 'Easy',
        groupSize: '4-12 people',
        itinerary: [
            { day: 1, title: 'Arrival', description: 'Hotel check-in and welcome walk.' },
            { day: 2, title: 'Lake Carezza', description: 'Route to the famous rainbow lake of the Dolomites.' },
            { day: 3, title: 'Lake Anterselva', description: 'Hike around Tyrol\'s largest lake.' },
            { day: 4, title: 'Farewell', description: 'Final easy walk and return.' },
        ],
        includes: [
            { label: 'Local guide', detail: 'Hiking guide with specialized knowledge of the area.' },
            { label: '3* Hotel', detail: '3 nights in mountain hotel with spa.' },
            { label: 'Breakfasts', detail: 'Buffet breakfast each morning.' },
            { label: 'Transport', detail: 'Transfers to the starting points of each route.' },
        ],
        notIncludes: ['Flights', 'Main meals', 'Insurance'],
    },
    'city-lights-norte-italia': {
        title: 'City Lights - Northern Italy',
        location: 'Milan, Verona, Venice',
        duration: '5 Days',
        description: 'The classic tour through the jewels of northern Italy.',
        difficulty: 'Easy',
        groupSize: '6-14 people',
        itinerary: [
            { day: 1, title: 'Milan', description: 'Arrival. Duomo, Galleria Vittorio Emanuele.' },
            { day: 2, title: 'Milan - Fashion', description: 'Quadrilatero della Moda and Navigli.' },
            { day: 3, title: 'Verona', description: 'Arena di Verona, Juliet\'s house.' },
            { day: 4, title: 'Venice', description: 'St. Mark\'s Square, gondola ride.' },
            { day: 5, title: 'Murano and Burano', description: 'Glass and color islands. Farewell.' },
        ],
        includes: [
            { label: 'Guided tours', detail: 'Local guides in each city.' },
            { label: 'Downtown hotels', detail: '4 nights in boutique hotels.' },
            { label: 'Transport', detail: 'High-speed train between cities.' },
            { label: 'Breakfasts', detail: 'Italian breakfast each morning.' },
        ],
        notIncludes: ['Flights', 'Meals', 'Museum tickets'],
    },
    'ski-pull-cortina-classic': {
        title: 'Ski Pull - Cortina Classic',
        location: 'Cortina d\'Ampezzo',
        duration: '5 Days',
        description: 'Skiing on Cortina\'s Olympic slopes with an expert guide.',
        difficulty: 'Intermediate-Advanced',
        groupSize: '4-8 people',
        itinerary: [
            { day: 1, title: 'Arrival', description: 'Check-in and resort reconnaissance.' },
            { day: 2, title: 'Tofana', description: 'Skiing in the Tofana area.' },
            { day: 3, title: 'Lagazuoi', description: 'Legendary Lagazuoi descent.' },
            { day: 4, title: 'Cinque Torri', description: 'Skiing with Cinque Torri views.' },
            { day: 5, title: 'Free Day', description: 'Free skiing or spa. Farewell dinner.' },
        ],
        includes: [
            { label: 'Dolomiti Superski pass', detail: '5-day pass with access to 1,200km of slopes.' },
            { label: 'Hotel with spa', detail: '4 nights in 4* hotel with spa and pool.' },
            { label: 'Half board', detail: 'Breakfast and gourmet dinner.' },
            { label: 'Ski guide', detail: 'Instructor to improve your technique.' },
        ],
        notIncludes: ['Flights', 'Ski equipment', 'Insurance'],
    },
    'ski-family-val-gardena': {
        title: 'Ski Family - Val Gardena',
        location: 'Val Gardena',
        duration: '5 Days',
        description: 'Perfect ski vacation for the whole family.',
        difficulty: 'All levels',
        groupSize: 'Families',
        itinerary: [
            { day: 1, title: 'Settlement', description: 'Arrival at family hotel.' },
            { day: 2, title: 'Lessons', description: 'Ski lessons for everyone.' },
            { day: 3, title: 'Family Skiing', description: 'Family ski day.' },
            { day: 4, title: 'Adventures', description: 'Sleds and snow activities.' },
            { day: 5, title: 'Farewell', description: 'Last day and diploma ceremony.' },
        ],
        includes: [
            { label: 'Family hotel', detail: '4 nights with family rooms and kids club.' },
            { label: 'Family ski pass', detail: 'Passes for the whole family.' },
            { label: 'Kids lessons', detail: '3 days of lessons for the little ones.' },
            { label: 'Full board', detail: 'All meals included.' },
        ],
        notIncludes: ['Flights', 'Equipment', 'Extras'],
    },
    'navidad-mercados-bolzano': {
        title: 'Christmas - Bolzano Markets',
        location: 'Bolzano, South Tyrol',
        duration: '5 Days',
        description: 'The magic of the South Tyrolean Christmas markets.',
        difficulty: 'Easy',
        groupSize: '6-14 people',
        itinerary: [
            { day: 1, title: 'Bolzano', description: 'Arrival and first Christmas market.' },
            { day: 2, title: 'Markets', description: 'Tour of Bolzano\'s markets.' },
            { day: 3, title: 'Merano', description: 'Merano\'s floating market.' },
            { day: 4, title: 'Bressanone', description: 'Bressanone market and traditional dinner.' },
            { day: 5, title: 'Farewell', description: 'Last shopping and brunch.' },
        ],
        includes: [
            { label: '4* Hotel', detail: '4 nights in Christmas-themed boutique hotel.' },
            { label: 'Breakfasts', detail: 'Buffet breakfast with local products.' },
            { label: 'Guided tours', detail: 'Expert guide on Christmas traditions.' },
            { label: 'Tastings', detail: 'Mulled wine, strudel and typical products.' },
        ],
        notIncludes: ['Flights', 'Unspecified meals', 'Shopping'],
    },
};

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════

async function checkIfEnglishPackageExists(slug) {
    try {
        const response = await axios.get(`${STRAPI_URL}/api/packages`, {
            params: {
                locale: 'en',
                filters: { slug: { $eq: slug } },
                pagination: { pageSize: 1 },
            },
            headers: authHeaders,
        });
        return response.data.data.length > 0 ? response.data.data[0] : null;
    } catch (error) {
        return null;
    }
}

async function getPackagesInSpanish() {
    try {
        const response = await axios.get(`${STRAPI_URL}/api/packages`, {
            params: {
                locale: 'es',
                'populate[itinerary][populate]': 'image',
                'populate[includes]': true,
                'populate[notIncludes]': true,
                'populate[gallery][populate]': 'image',
                'populate[tags]': true,
                'populate[thumbnail]': true,
                'populate[heroImage]': true,
                'pagination[pageSize]': 100,
            },
            headers: authHeaders,
        });
        return response.data.data;
    } catch (error) {
        console.error('❌ Error al obtener paquetes:', error.message);
        throw error;
    }
}

async function createEnglishVersion(pkg, translation) {
    console.log(`\n📦 Procesando: ${pkg.title} (${pkg.slug})`);

    // Preparar datos para la versión en inglés
    const englishData = {
        title: translation.title,
        slug: pkg.slug,  // ✅ Mismo slug para todas las localizaciones
        location: translation.location,
        duration: translation.duration,
        description: translation.description,
        difficulty: translation.difficulty || pkg.difficulty,
        groupSize: translation.groupSize || pkg.groupSize,
        guideType: translation.guideType || pkg.guideType,
        availableDates: translation.availableDates || pkg.availableDates,
        priceAmount: pkg.priceAmount,
        originalPriceAmount: pkg.originalPriceAmount,
        rating: pkg.rating,
        hasDiscount: pkg.hasDiscount,
        season: pkg.season,
    };

    // Itinerario traducido (conservar IDs de imagen)
    if (translation.itinerary && pkg.itinerary) {
        englishData.itinerary = pkg.itinerary.map((day, idx) => ({
            day: day.day,
            title: translation.itinerary[idx]?.title || day.title,
            description: translation.itinerary[idx]?.description || day.description,
            image: day.image?.id || undefined,
        }));
    }

    // Includes traducidos
    if (translation.includes) {
        englishData.includes = translation.includes.map(inc => ({
            label: inc.label,
            detail: inc.detail,
        }));
    }

    // Not includes traducidos
    if (translation.notIncludes) {
        englishData.notIncludes = translation.notIncludes.map(text => ({ text }));
    }

    // Galería con captions traducidos (conservar imágenes)
    if (translation.gallery && pkg.gallery) {
        englishData.gallery = pkg.gallery.map((g, idx) => ({
            image: g.image?.id || undefined,
            caption: translation.gallery[idx]?.caption || g.caption,
        }));
    }

    // Tags (mantener igual)
    if (pkg.tags) {
        englishData.tags = pkg.tags.map(t => ({ name: t.name }));
    }

    // Thumbnails y heroImage
    if (pkg.thumbnail?.id) {
        englishData.thumbnail = pkg.thumbnail.id;
    }
    if (pkg.heroImage?.id) {
        englishData.heroImage = pkg.heroImage.id;
    }

    try {
        // ✅ PUT con documentId y locale es IDEMPOTENTE en Strapi 5
        const existing = await checkIfEnglishPackageExists(pkg.slug);
        const action = existing ? 'actualizado' : 'creado';

        if (existing) {
            console.log(`♻️  Ya existe en inglés: ${translation.title} (actualizando...)`);
        }

        const response = await axios.put(
            `${STRAPI_URL}/api/packages/${pkg.documentId}?locale=en`,
            { data: englishData },
            {
                headers: {
                    ...authHeaders,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(`✅ ${action.charAt(0).toUpperCase() + action.slice(1)} en inglés: ${translation.title}`);
        return { created: true, updated: !!existing, id: response.data.data?.id };

    } catch (error) {
        console.error(`❌ Error al crear versión inglesa: ${error.response?.data?.error?.message || error.message}`);
        return { created: false, error: error.message };
    }
}

// ═══════════════════════════════════════════════════════════════
// PROCESO PRINCIPAL
// ═══════════════════════════════════════════════════════════════

async function seedEnglishPackages() {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║  🇬🇧 SEED DE PAQUETES EN INGLÉS - IDEMPOTENTE      ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    if (!STRAPI_API_TOKEN) {
        console.log('❌ Error: STRAPI_API_TOKEN no configurado');
        process.exit(1);
    }

    try {
        // 1. Obtener todos los paquetes en español
        console.log('📥 Obteniendo paquetes en español...');
        const spanishPackages = await getPackagesInSpanish();
        console.log(`✓ ${spanishPackages.length} paquetes encontrados\n`);

        // 2. Crear versiones en inglés
        const results = [];
        for (const pkg of spanishPackages) {
            const translation = PACKAGE_TRANSLATIONS[pkg.slug];

            if (translation) {
                const result = await createEnglishVersion(pkg, translation);
                results.push({
                    slug: pkg.slug,
                    title: pkg.title,
                    ...result,
                });
                // Pequeña pausa para no sobrecargar Strapi
                await new Promise(resolve => setTimeout(resolve, 500));
            } else {
                console.log(`⚠️  No hay traducción para: ${pkg.slug}`);
            }
        }

        // 3. Resumen
        console.log('\n' + '═'.repeat(56));
        console.log('📊 RESUMEN DE CREACIÓN');
        console.log('═'.repeat(56));

        const created = results.filter(r => r.created && !r.updated);
        const updated = results.filter(r => r.created && r.updated);
        const failed = results.filter(r => !r.created);

        console.log(`✅ Creados: ${created.length}`);
        console.log(`♻️  Actualizados: ${updated.length}`);
        console.log(`❌ Fallidos: ${failed.length}`);

        if (failed.length > 0) {
            console.log('\n⚠️  Paquetes con errores:');
            failed.forEach(f => console.log(`   - ${f.title} (${f.slug})`));
        }

        console.log('\n✨ Proceso completado!\n');

    } catch (error) {
        console.error('\n💥 Error fatal:', error.message);
        process.exit(1);
    }
}

// Ejecutar
if (require.main === module) {
    seedEnglishPackages();
}

module.exports = { seedEnglishPackages };

