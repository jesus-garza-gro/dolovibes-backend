/**
 * SEED DE HERO SECTION Y ABOUT PAGE EN ITALIANO Y ALEMÁN
 * =======================================================
 * 
 * Crea versiones en italiano y alemán de Hero Section y About Page
 * 
 * Uso: node scripts/seed-hero-about-locales.js
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
// TRADUCCIONES - HERO SECTION
// ═══════════════════════════════════════════════════════════════

const HERO_TRANSLATIONS = {
    it: {
        title: 'Scopri le ',
        titleHighlight: 'Dolomiti',
        subtitle: 'Vivi la magia delle Dolomiti con i nostri tour guidati. Dai rifugi di montagna alle discese su sci, creiamo esperienze autentiche per ogni tipo di viaggiatore.',
        badge: 'Avventure Indimenticabili',
        ctaText: 'Esplora i Nostri Pacchetti',
    },
    de: {
        title: 'Entdecke die ',
        titleHighlight: 'Dolomiten',
        subtitle: 'Erlebe die Magie der Dolomiten mit unseren geführten Touren. Von Berghütten bis zu Skiabfahrten schaffen wir authentische Erlebnisse für jeden Reisetyp.',
        badge: 'Unvergessliche Abenteuer',
        ctaText: 'Entdecke Unsere Pakete',
    },
};

// ═══════════════════════════════════════════════════════════════
// TRADUCCIONES - ABOUT PAGE
// ═══════════════════════════════════════════════════════════════

const ABOUT_TRANSLATIONS = {
    it: {
        title: 'Chi Siamo',
        subtitle: 'La Tua Porta d\'Accesso alle Dolomiti',
        description: 'DoloVibes nasce dalla passione per le montagne e il desiderio di condividere la bellezza delle Dolomiti con il mondo. Con anni di esperienza nelle Alpi italiane, creiamo esperienze autentiche che combinano avventura, cultura e connessione con la natura.',
        mission: 'La nostra missione è rendere le Dolomiti accessibili a tutti i viaggiatori, offrendo tour guidati professionali che rispettano l\'ambiente e celebrano la ricca cultura della regione.',
        values: [
            {
                title: 'Esperienza Locale',
                description: 'Guide native con profonda conoscenza del territorio',
            },
            {
                title: 'Sostenibilità',
                description: 'Turismo responsabile che protegge le montagne',
            },
            {
                title: 'Avventura Autentica',
                description: 'Esperienze genuine lontano dal turismo di massa',
            },
        ],
    },
    de: {
        title: 'Über Uns',
        subtitle: 'Dein Tor zu den Dolomiten',
        description: 'DoloVibes entsteht aus der Leidenschaft für die Berge und dem Wunsch, die Schönheit der Dolomiten mit der Welt zu teilen. Mit jahrelanger Erfahrung in den italienischen Alpen schaffen wir authentische Erlebnisse, die Abenteuer, Kultur und Verbindung zur Natur kombinieren.',
        mission: 'Unsere Mission ist es, die Dolomiten für alle Reisenden zugänglich zu machen und professionelle geführte Touren anzubieten, die die Umwelt respektieren und die reiche Kultur der Region feiern.',
        values: [
            {
                title: 'Lokale Erfahrung',
                description: 'Einheimische Führer mit tiefem Wissen über das Gebiet',
            },
            {
                title: 'Nachhaltigkeit',
                description: 'Verantwortungsbewusster Tourismus, der die Berge schützt',
            },
            {
                title: 'Authentisches Abenteuer',
                description: 'Echte Erlebnisse abseits des Massentourismus',
            },
        ],
    },
};

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════

async function getContent(endpoint, locale) {
    try {
        const response = await axios.get(`${STRAPI_URL}/api/${endpoint}`, {
            params: { locale },
            headers: authHeaders,
        });
        return response.data.data;
    } catch (error) {
        console.error(`❌ Error al obtener ${endpoint} (${locale}):`, error.message);
        return null;
    }
}

async function createHeroLocale(documentId, locale, translation) {
    console.log(`\n🎨 Creando Hero Section en ${locale.toUpperCase()}...`);
    
    try {
        // Para single types, necesitamos crear localización usando el endpoint de localizations
        const response = await axios.post(
            `${STRAPI_URL}/api/hero-sections/localizations`,
            {
                locale: locale,
                title: translation.title,
                titleHighlight: translation.titleHighlight || '',
                subtitle: translation.subtitle,
                badge: translation.badge || '',
                ctaText: translation.ctaText,
                ctaLink: '/packages',
            },
            { 
                headers: { 
                    ...authHeaders, 
                    'Content-Type': 'application/json' 
                } 
            }
        );
        
        console.log(`✅ Hero Section creado en ${locale.toUpperCase()}`);
        return { success: true };
    } catch (error) {
        const errMsg = error.response?.data?.error?.message || error.message;
        console.error(`❌ Error: ${errMsg}`);
        
        // Si ya existe, es éxito
        if (errMsg.includes('already exists') || errMsg.includes('locale')) {
            console.log(`ℹ️  Ya existe en ${locale.toUpperCase()}, omitiendo...`);
            return { success: true, skipped: true };
        }
        
        return { success: false, error: errMsg };
    }
}

async function createAboutLocale(documentId, locale, translation) {
    console.log(`\n📖 Creando About Page en ${locale.toUpperCase()}...`);
    
    try {
        // Para single types, necesitamos crear localización usando el endpoint de localizations
        const response = await axios.post(
            `${STRAPI_URL}/api/about-pages/localizations`,
            {
                locale: locale,
                pageTitle: translation.title,
                photoAlt: translation.subtitle,
                origin: {
                    title: translation.subtitle,
                    description: translation.description,
                },
                mission: {
                    title: 'Nuestra Misión',
                    description: translation.mission,
                },
                values: translation.values,
            },
            { 
                headers: { 
                    ...authHeaders, 
                    'Content-Type': 'application/json' 
                } 
            }
        );
        
        console.log(`✅ About Page creado en ${locale.toUpperCase()}`);
        return { success: true };
    } catch (error) {
        const errMsg = error.response?.data?.error?.message || error.message;
        console.error(`❌ Error: ${errMsg}`);
        
        // Si ya existe, es éxito
        if (errMsg.includes('already exists') || errMsg.includes('locale')) {
            console.log(`ℹ️  Ya existe en ${locale.toUpperCase()}, omitiendo...`);
            return { success: true, skipped: true };
        }
        
        return { success: false, error: errMsg };
    }
}

// ═══════════════════════════════════════════════════════════════
// PROCESO PRINCIPAL
// ═══════════════════════════════════════════════════════════════

async function seedHeroAboutLocales() {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║  🌍 SEED DE HERO & ABOUT - ITALIANO Y ALEMÁN        ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');

    const results = {
        hero: { it: null, de: null },
        about: { it: null, de: null },
    };

    // Crear Hero Section en italiano
    results.hero.it = await createHeroLocale(null, 'it', HERO_TRANSLATIONS.it);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Crear Hero Section en alemán
    results.hero.de = await createHeroLocale(null, 'de', HERO_TRANSLATIONS.de);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Crear About Page en italiano
    results.about.it = await createAboutLocale(null, 'it', ABOUT_TRANSLATIONS.it);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Crear About Page en alemán
    results.about.de = await createAboutLocale(null, 'de', ABOUT_TRANSLATIONS.de);

    // Resumen
    console.log('\n' + '═'.repeat(60));
    console.log('📊 RESUMEN DE CREACIÓN');
    console.log('═'.repeat(60));
    
    console.log('\n🎨 Hero Section:');
    console.log(`  🇮🇹 Italiano: ${results.hero.it?.success ? '✅ Creado' : '❌ Error'}`);
    console.log(`  🇩🇪 Alemán: ${results.hero.de?.success ? '✅ Creado' : '❌ Error'}`);
    
    console.log('\n📖 About Page:');
    console.log(`  🇮🇹 Italiano: ${results.about.it?.success ? '✅ Creado' : '❌ Error'}`);
    console.log(`  🇩🇪 Alemán: ${results.about.de?.success ? '✅ Creado' : '❌ Error'}`);

    const allSuccess = Object.values(results.hero).every(r => r?.success) &&
                       Object.values(results.about).every(r => r?.success);

    if (allSuccess) {
        console.log('\n✨ ¡Proceso completado exitosamente!\n');
    } else {
        console.log('\n⚠️  Algunos elementos fallaron. Revisa los errores arriba.\n');
    }
}

// Ejecutar
if (require.main === module) {
    seedHeroAboutLocales();
}

module.exports = { seedHeroAboutLocales };
