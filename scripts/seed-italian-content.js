/**
 * SEED DE CONTENIDO EN ITALIANO
 * ==============================
 * Crea versiones en italiano de paquetes y experiencias
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

// Traducciones de paquetes a italiano
const PACKAGE_TRANSLATIONS = {
    'navidad-mercados-bolzano': {
        title: 'Natale - Mercatini di Bolzano',
        location: 'Bolzano, Alto Adige',
        duration: '5 Giorni',
        description: 'La magia dei mercatini di Natale altoatesini',
        difficulty: 'Facile',
        groupSize: '6-14 persone',
    },
    'hut-2-hut-alta-via-1': {
        title: 'Hut 2 Hut - Alta Via 1',
        location: 'Dolomiti Centrali',
        duration: '7 Giorni',
        description: 'La leggendaria Alta Via 1, il trekking più famoso delle Dolomiti',
        difficulty: 'Avanzato',
        groupSize: '4-6 persone',
    },
    'hiking-lagos-alpinos': {
        title: 'Hiking - Laghi Alpini',
        location: 'Alto Adige',
        duration: '4 Giorni',
        description: 'Scopri i laghi più cristallini delle Alpi',
        difficulty: 'Facile',
        groupSize: '4-12 persone',
    },
    'ski-pull-cortina-classic': {
        title: 'Sci Pull - Cortina Classic',
        location: "Cortina d'Ampezzo",
        duration: '6 Giorni',
        description: 'Sci di fondo sulle piste olimpiche di Cortina',
        difficulty: 'Intermedio',
        groupSize: '6-10 persone',
    },
    'ski-family-val-gardena': {
        title: 'Sci Famiglia - Val Gardena',
        location: 'Val Gardena',
        duration: '5 Giorni',
        description: 'Vacanze sulla neve perfette per tutta la famiglia',
        difficulty: 'Tutti i livelli',
        groupSize: 'Famiglie',
    },
    'city-lights-norte-italia': {
        title: 'City Lights - Nord Italia',
        location: 'Nord Italia',
        duration: '6 Giorni',
        description: 'Esplora le città più affascinanti del nord Italia',
        difficulty: 'Facile',
        groupSize: '8-15 persone',
    },
    'hut-2-hut-dolomitas-clasico': {
        title: 'Hut 2 Hut - Dolomiti Classiche',
        location: 'Dolomiti',
        duration: '5 Giorni',
        description: 'Il percorso classico delle Tre Cime di Lavaredo',
        difficulty: 'Intermedio',
        groupSize: '4-8 persone',
    },
};

// Traducciones de experiencias a italiano
const EXPERIENCE_TRANSLATIONS = {
    'hut-2-hut': {
        title: 'Hut 2 Hut',
        shortDescription: 'Dormi nei rifugi di montagna tradizionali e svegliati con viste alpine mozzafiato.',
        longDescription: 'Vivi le autentiche Dolomiti camminando da rifugio a rifugio. Ogni notte resterai in un accogliente rifugio di montagna con viste spettacolari, cucina locale abbondante e la compagnia di altri escursionisti.',
    },
    'hiking': {
        title: 'Hiking',
        shortDescription: 'Scopri le Dolomiti attraverso sentieri accessibili perfetti per tutti i livelli.',
        longDescription: 'I nostri tour di trekking sono progettati per chi vuole esplorare la bellezza delle montagne a un ritmo confortevole. Con guide esperte, ti porteremo ai punti panoramici più belli e ai gioielli nascosti della regione.',
    },
    'city-lights': {
        title: 'City Lights',
        shortDescription: 'Esplora le affascinanti città e borghi del nord Italia.',
        longDescription: "Immergiti nella cultura, nell'arte e nella gastronomia italiana. Dai canali di Venezia alle antiche strade di Verona, scopri il ricco patrimonio e la vita vibrante delle più belle città del nord Italia.",
    },
    'ski-pull': {
        title: 'Sci Pull',
        shortDescription: 'Scivola attraverso paesaggi invernali incontaminati su piste di sci nordico.',
        longDescription: 'Lo sci di fondo offre un modo tranquillo per esplorare le Dolomiti innevate. Perfetto per chi cerca tranquillità invernale combinata con un ottimo allenamento in scenari alpini spettacolari.',
    },
    'ski-family': {
        title: 'Sci Famiglia',
        shortDescription: 'Vacanze sulla neve perfette per tutta la famiglia con tutti i comfort inclusi.',
        longDescription: 'Crea ricordi indimenticabili in famiglia sulla neve. I nostri pacchetti famiglia includono lezioni di sci per tutte le età, opzioni di assistenza bambini, alloggi family-friendly e attività che piaceranno a tutti.',
    },
    'navidad': {
        title: 'Natale',
        shortDescription: 'Vivi la magia dei mercatini di Natale e delle tradizioni altoatesine.',
        longDescription: 'Entra in un paese delle meraviglie invernale durante le festività. Passeggia tra gli incantevoli mercatini di Natale, assaggia vin brûlé e dolci tradizionali, e vivi autentiche tradizioni alpine natalizie.',
    },
};

async function seedItalian() {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  🇮🇹 SEED DE CONTENIDO EN ITALIANO');
    console.log('═══════════════════════════════════════════════════════════\n');

    let packagesCreated = 0;
    let experiencesCreated = 0;
    let errors = 0;

    // 1. Crear paquetes en italiano
    console.log('📦 Creando paquetes...\n');
    
    const packagesEs = await axios.get(`${STRAPI_URL}/api/packages`, {
        params: { locale: 'es', 'pagination[pageSize]': 100 },
        headers: authHeaders,
    });

    for (const pkg of packagesEs.data.data) {
        const translation = PACKAGE_TRANSLATIONS[pkg.slug];
        if (!translation) continue;

        try {
            // Verificar si ya existe
            const check = await axios.get(`${STRAPI_URL}/api/packages`, {
                params: { locale: 'it', 'filters[slug][$eq]': `${pkg.slug}-it` },
                headers: authHeaders,
            });

            if (check.data.data.length > 0) {
                console.log(`⏭️  ${translation.title}: Ya existe`);
                continue;
            }

            await axios.post(`${STRAPI_URL}/api/packages`, {
                data: { ...translation, slug: `${pkg.slug}-it`, season: pkg.season }
            }, {
                headers: { ...authHeaders, 'Content-Type': 'application/json' },
                params: { locale: 'it' }
            });

            console.log(`✅ ${translation.title}`);
            packagesCreated++;
        } catch (error) {
            console.log(`❌ ${translation.title}: ${error.response?.data?.error?.message || error.message}`);
            errors++;
        }
    }

    // 2. Crear experiencias en italiano
    console.log('\n🎯 Creando experiencias...\n');
    
    const experiencesEs = await axios.get(`${STRAPI_URL}/api/experiences`, {
        params: { locale: 'es', 'pagination[pageSize]': 100 },
        headers: authHeaders,
    });

    for (const exp of experiencesEs.data.data) {
        const translation = EXPERIENCE_TRANSLATIONS[exp.slug];
        if (!translation) continue;

        try {
            // Verificar si ya existe
            const check = await axios.get(`${STRAPI_URL}/api/experiences`, {
                params: { locale: 'it', 'filters[slug][$eq]': `${exp.slug}-it` },
                headers: authHeaders,
            });

            if (check.data.data.length > 0) {
                console.log(`⏭️  ${translation.title}: Ya existe`);
                continue;
            }

            await axios.post(`${STRAPI_URL}/api/experiences`, {
                data: { ...translation, slug: `${exp.slug}-it`, season: exp.season }
            }, {
                headers: { ...authHeaders, 'Content-Type': 'application/json' },
                params: { locale: 'it' }
            });

            console.log(`✅ ${translation.title}`);
            experiencesCreated++;
        } catch (error) {
            console.log(`❌ ${translation.title}: ${error.response?.data?.error?.message || error.message}`);
            errors++;
        }
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  RESUMEN');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  📦 Paquetes:      ${packagesCreated}`);
    console.log(`  🎯 Experiencias:  ${experiencesCreated}`);
    console.log(`  ❌ Errores:       ${errors}`);
    console.log('═══════════════════════════════════════════════════════════\n');
}

seedItalian().catch(console.error);
