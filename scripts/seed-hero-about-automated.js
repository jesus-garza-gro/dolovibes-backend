/**
 * SEED DE HERO SECTION Y ABOUT PAGE EN ITALIANO Y ALEMÁN (AUTOMATIZADO)
 * ======================================================================
 * 
 * Crea versiones en italiano y alemán de Hero Section y About Page
 * usando el enfoque correcto para Strapi 5 single types
 * 
 * Uso: node scripts/seed-hero-about-automated.js
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
// TRADUCCIONES
// ═══════════════════════════════════════════════════════════════

const HERO_TRANSLATIONS = {
    it: {
        title: 'Scopri le ',
        titleHighlight: 'Dolomiti',
        subtitle: 'Vivi la magia delle Dolomiti con i nostri tour guidati. Dai rifugi di montagna alle discese su sci, creiamo esperienze autentiche per ogni tipo di viaggiatore.',
        badge: 'Avventure Indimenticabili',
    },
    de: {
        title: 'Entdecke die ',
        titleHighlight: 'Dolomiten',
        subtitle: 'Erlebe die Magie der Dolomiten mit unseren geführten Touren. Von Berghütten bis zu Skiabfahrten schaffen wir authentische Erlebnisse für jeden Reisetyp.',
        badge: 'Unvergessliche Abenteuer',
    },
};

const ABOUT_TRANSLATIONS = {
    it: {
        pageTitle: 'Chi Siamo',
        photoAlt: 'La Tua Porta d\'Accesso alle Dolomiti',
        origin: {
            title: 'La Nostra Origine',
            description: 'DoloVibes nasce dalla passione per le montagne e il desiderio di condividere la bellezza delle Dolomiti con il mondo.',
        },
        essence: {
            title: 'La Nostra Essenza',
            description: 'Con anni di esperienza nelle Alpi italiane, creiamo esperienze autentiche che combinano avventura, cultura e connessione con la natura.',
        },
        vision: {
            title: 'La Nostra Visione',
            description: 'Immaginiamo un futuro in cui ogni viaggiatore può vivere la magia delle Dolomiti in modo autentico e sostenibile.',
        },
        mission: {
            title: 'La Nostra Missione',
            description: 'Rendere le Dolomiti accessibili a tutti i viaggiatori, offrendo tour guidati professionali che rispettano l\'ambiente.',
        },
    },
    de: {
        pageTitle: 'Über Uns',
        photoAlt: 'Dein Tor zu den Dolomiten',
        origin: {
            title: 'Unsere Herkunft',
            description: 'DoloVibes entsteht aus der Leidenschaft für die Berge und dem Wunsch, die Schönheit der Dolomiten mit der Welt zu teilen.',
        },
        essence: {
            title: 'Unsere Essenz',
            description: 'Mit jahrelanger Erfahrung in den italienischen Alpen schaffen wir authentische Erlebnisse, die Abenteuer, Kultur und Verbindung zur Natur kombinieren.',
        },
        vision: {
            title: 'Unsere Vision',
            description: 'Eine Welt zu schaffen, in der jeder Reisende die transformative Kraft der Berge erleben kann.',
        },
        mission: {
            title: 'Unsere Mission',
            description: 'Unsere Mission ist es, die Dolomiten für alle Reisenden zugänglich zu machen und professionelle geführte Touren anzubieten.',
        },
    },
};

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════

async function getHeroSection(locale = 'es') {
    try {
        const response = await axios.get(`${STRAPI_URL}/api/hero-section`, {
            params: { locale },
            headers: authHeaders,
        });
        return response.data.data;
    } catch (error) {
        console.error(`Error al obtener Hero Section (${locale}):`, error.message);
        return null;
    }
}

async function getAboutPage(locale = 'es') {
    try {
        const response = await axios.get(`${STRAPI_URL}/api/about-page`, {
            params: { locale },
            headers: authHeaders,
        });
        return response.data.data;
    } catch (error) {
        console.error(`Error al obtener About Page (${locale}):`, error.message);
        return null;
    }
}

async function createHeroLocalization(documentId, locale, data) {
    try {
        // Verificar si ya existe
        const existing = await getHeroSection(locale);
        
        if (existing) {
            console.log(`♻️  Hero Section ya existe en ${locale.toUpperCase()} (actualizando...)`);
        } else {
            console.log(`\n🎨 Creando Hero Section en ${locale.toUpperCase()}...`);
        }
        
        // Para single types con i18n, usar PUT directo con el locale (crea o actualiza)
        const response = await axios.put(
            `${STRAPI_URL}/api/hero-section?locale=${locale}`,
            { data },
            { 
                headers: { 
                    ...authHeaders, 
                    'Content-Type': 'application/json' 
                }
            }
        );
        
        console.log(`✅ Hero Section ${existing ? 'actualizado' : 'creado'} en ${locale.toUpperCase()}`);
        return { success: true, updated: !!existing };
    } catch (error) {
        const errMsg = error.response?.data?.error?.message || error.message;
        console.error(`❌ Error: ${errMsg}`);
        return { success: false, error: errMsg };
    }
}

async function createAboutLocalization(documentId, locale, data) {
    try {
        // Verificar si ya existe
        const existing = await getAboutPage(locale);
        
        if (existing) {
            console.log(`♻️  About Page ya existe en ${locale.toUpperCase()} (actualizando...)`);
        } else {
            console.log(`\n📖 Creando About Page en ${locale.toUpperCase()}...`);
        }
        
        // Para single types con i18n, usar PUT directo con el locale (crea o actualiza)
        const response = await axios.put(
            `${STRAPI_URL}/api/about-page?locale=${locale}`,
            { data },
            { 
                headers: { 
                    ...authHeaders, 
                    'Content-Type': 'application/json' 
                }
            }
        );
        
        console.log(`✅ About Page ${existing ? 'actualizado' : 'creado'} en ${locale.toUpperCase()}`);
        return { success: true, updated: !!existing };
    } catch (error) {
        const errMsg = error.response?.data?.error?.message || error.message;
        console.error(`❌ Error: ${errMsg}`);
        return { success: false, error: errMsg };
    }
}

// ═══════════════════════════════════════════════════════════════
// PROCESO PRINCIPAL
// ═══════════════════════════════════════════════════════════════

async function seedHeroAboutAutomated() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║  🤖 SEED AUTOMATIZADO - HERO & ABOUT IT/DE           ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    try {
        // 1. Obtener contenido base en español
        console.log('📥 Obteniendo contenido base en español...');
        const heroEs = await getHeroSection('es');
        const aboutEs = await getAboutPage('es');

        if (!heroEs || !aboutEs) {
            console.error('❌ No se pudo obtener el contenido base en español');
            process.exit(1);
        }

        console.log(`✓ Hero Section ID: ${heroEs.documentId}`);
        console.log(`✓ About Page ID: ${aboutEs.documentId}`);

        const results = {
            hero: { it: null, de: null },
            about: { it: null, de: null },
        };

        // 2. Crear localizaciones de Hero Section
        results.hero.it = await createHeroLocalization(
            heroEs.documentId, 
            'it', 
            HERO_TRANSLATIONS.it
        );
        await new Promise(resolve => setTimeout(resolve, 500));

        results.hero.de = await createHeroLocalization(
            heroEs.documentId, 
            'de', 
            HERO_TRANSLATIONS.de
        );
        await new Promise(resolve => setTimeout(resolve, 500));

        // 3. Crear localizaciones de About Page
        results.about.it = await createAboutLocalization(
            aboutEs.documentId, 
            'it', 
            ABOUT_TRANSLATIONS.it
        );
        await new Promise(resolve => setTimeout(resolve, 500));

        results.about.de = await createAboutLocalization(
            aboutEs.documentId, 
            'de', 
            ABOUT_TRANSLATIONS.de
        );

        // 4. Resumen
        console.log('\n' + '═'.repeat(60));
        console.log('📊 RESUMEN DE CREACIÓN');
        console.log('═'.repeat(60));
        
        console.log('\n🎨 Hero Section:');
        console.log(`  🇮🇹 Italiano: ${results.hero.it?.success ? '✅ OK' : '❌ Error'}`);
        console.log(`  🇩🇪 Alemán: ${results.hero.de?.success ? '✅ OK' : '❌ Error'}`);
        
        console.log('\n📖 About Page:');
        console.log(`  🇮🇹 Italiano: ${results.about.it?.success ? '✅ OK' : '❌ Error'}`);
        console.log(`  🇩🇪 Alemán: ${results.about.de?.success ? '✅ OK' : '❌ Error'}`);

        const allSuccess = Object.values(results.hero).every(r => r?.success) &&
                           Object.values(results.about).every(r => r?.success);

        if (allSuccess) {
            console.log('\n✨ ¡Proceso completado exitosamente!\n');
        } else {
            console.log('\n⚠️  Algunos elementos fallaron.\n');
        }

    } catch (error) {
        console.error('\n💥 Error fatal:', error.message);
        process.exit(1);
    }
}

// Ejecutar
if (require.main === module) {
    seedHeroAboutAutomated();
}

module.exports = { seedHeroAboutAutomated };
