/**
 * SEED DE PAQUETES EN ALEMÁN
 * ===========================
 * 
 * Crea versiones en alemán de los paquetes existentes en Strapi.
 * Incluye traducciones completas con itinerarios detallados.
 * 
 * Uso: node scripts/seed-german-packages.js
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
// TRADUCCIONES DE PAQUETES EN ALEMÁN
// ═══════════════════════════════════════════════════════════════

const PACKAGE_TRANSLATIONS_DE = {
    'hut-2-hut-dolomitas-clasico': {
        title: 'Hütte zu Hütte - Klassische Dolomiten',
        location: 'Dolomiten',
        duration: '5 Tage',
        description: 'Die klassische Route der Drei Zinnen. 5 Tage Trekking durch die bekanntesten Berghütten.',
        difficulty: 'Mittel',
        groupSize: '4-8 Personen',
        guideType: 'Geführt',
        availableDates: 'Juni - September',
        itinerary: [
            { day: 1, title: 'Ankunft in Cortina', description: 'Ankunft in Cortina d\'Ampezzo und Willkommens-Briefing. Erste Etappe zur Auronzohütte mit Blick auf die Drei Zinnen.' },
            { day: 2, title: 'Drei Zinnen', description: 'Ikonische Wanderung um die Drei Zinnen. Etwa 10 km mit atemberaubenden Ausblicken.' },
            { day: 3, title: 'Pragser Wildsee', description: 'Trekking zum Pragser Wildsee, einem der meistfotografierten Seen der Dolomiten.' },
            { day: 4, title: 'Giaupass', description: 'Überquerung des Giaupasses mit 360°-Panorama. Übernachtung in der Hütte mit besonderem Abendessen.' },
            { day: 5, title: 'Abstieg und Abschied', description: 'Letzte Etappe mit Abstieg ins Tal. Ankunft in Cortina und Gruppenverabschiedung.' },
        ],
        includes: [
            { label: 'UIAGM-Bergführer', detail: 'UIAGM-zertifizierter Bergführer mit über 10 Jahren Erfahrung in den Dolomiten.' },
            { label: 'Hüttenunterkunft', detail: '4 Nächte in traditionellen Berghütten mit Mehrbettzimmern.' },
            { label: 'Halbpension', detail: 'Frühstücksbuffet und 3-Gänge-Abendessen jeden Tag in der Hütte.' },
            { label: 'Gepäcktransport', detail: 'Ihr Hauptgepäck wird von Hütte zu Hütte transportiert. Sie tragen nur Ihren Tagesrucksack.' },
        ],
        notIncludes: ['Internationale Flüge', 'Mittagessen', 'Reiseversicherung', 'Trinkgelder'],
        gallery: [
            { caption: 'Auronzohütte - Erster Tag der Tour' },
            { caption: 'Panoramablick auf die Drei Zinnen' },
            { caption: 'Weg zum Pragser Wildsee' },
            { caption: 'Sonnenuntergang von der Hütte' },
            { caption: 'Wandergruppe am Giaupass' },
        ],
    },
    'hut-2-hut-alta-via-1': {
        title: 'Hütte zu Hütte - Alta Via 1',
        location: 'Zentrale Dolomiten',
        duration: '7 Tage',
        description: 'Die legendäre Alta Via 1, die berühmteste Wanderung der Dolomiten. 7 Tage pures Abenteuer.',
        difficulty: 'Fortgeschritten',
        groupSize: '4-6 Personen',
        guideType: 'Geführt',
        availableDates: 'Juli - August',
        itinerary: [
            { day: 1, title: 'Pragser Wildsee', description: 'Start am berühmten Pragser Wildsee. Erste Etappe zur Biella-Hütte.' },
            { day: 2, title: 'Fanes', description: 'Trekking durch das Fanes-Hochplateau mit spektakulären Ausblicken.' },
            { day: 3, title: 'Lagazuoi', description: 'Aufstieg zum Lagazuoi mit Tunneln aus dem Ersten Weltkrieg.' },
            { day: 4, title: 'Cinque Torri', description: 'Vorbei an den ikonischen Cinque Torri.' },
            { day: 5, title: 'Nuvolau', description: 'Aufstieg zum Nuvolau mit 360°-Panorama.' },
            { day: 6, title: 'Civetta', description: 'Trekking zur imposanten Civetta-Wand.' },
            { day: 7, title: 'Alleghe', description: 'Letzter Abstieg nach Alleghe. Feier und Abschied.' },
        ],
        includes: [
            { label: 'Was enthalten ist', detail: 'Erfahrener Bergführer, 6 Nächte in Hütten, Halbpension, Gepäcktransport.' },
        ],
        notIncludes: ['Flüge', 'Mittagessen', 'Versicherung', 'Trinkgelder'],
    },
    'hiking-lagos-alpinos': {
        title: 'Wandern - Alpenseen',
        location: 'Südtirol',
        duration: '4 Tage',
        description: 'Entdecken Sie die kristallklarsten Seen der Alpen. Sanfte Routen mit unglaublichen Landschaften.',
        difficulty: 'Leicht',
        groupSize: '4-12 Personen',
        itinerary: [
            { day: 1, title: 'Ankunft', description: 'Hotel-Check-in und Willkommensspaziergang.' },
            { day: 2, title: 'Karersee', description: 'Route zum berühmten Regenbogensee der Dolomiten.' },
            { day: 3, title: 'Antholzer See', description: 'Wanderung um den größten See Tirols.' },
            { day: 4, title: 'Abschied', description: 'Letzte leichte Wanderung und Rückkehr.' },
        ],
        includes: [
            { label: 'Lokaler Führer', detail: 'Wanderführer mit spezialisiertem Wissen über die Region.' },
            { label: '3* Hotel', detail: '3 Nächte im Berghotel mit Spa.' },
            { label: 'Frühstück', detail: 'Frühstücksbuffet jeden Morgen.' },
            { label: 'Transport', detail: 'Transfers zu den Startpunkten jeder Route.' },
        ],
        notIncludes: ['Flüge', 'Hauptmahlzeiten', 'Versicherung'],
    },
    'city-lights-norte-italia': {
        title: 'Stadtlichter - Norditalien',
        location: 'Mailand, Verona, Venedig',
        duration: '5 Tage',
        description: 'Die klassische Tour durch die Juwelen Norditaliens.',
        difficulty: 'Leicht',
        groupSize: '6-14 Personen',
        itinerary: [
            { day: 1, title: 'Mailand', description: 'Ankunft. Mailänder Dom, Galleria Vittorio Emanuele.' },
            { day: 2, title: 'Mailand - Mode', description: 'Quadrilatero della Moda und Navigli.' },
            { day: 3, title: 'Verona', description: 'Arena von Verona, Julias Haus.' },
            { day: 4, title: 'Venedig', description: 'Markusplatz, Gondelfahrt.' },
            { day: 5, title: 'Murano und Burano', description: 'Inseln des Glases und der Farbe. Abschied.' },
        ],
        includes: [
            { label: 'Geführte Touren', detail: 'Lokale Führer in jeder Stadt.' },
            { label: 'Innenstadthotels', detail: '4 Nächte in Boutique-Hotels.' },
            { label: 'Transport', detail: 'Hochgeschwindigkeitszug zwischen den Städten.' },
            { label: 'Frühstück', detail: 'Italienisches Frühstück jeden Morgen.' },
        ],
        notIncludes: ['Flüge', 'Mahlzeiten', 'Museumstickets'],
    },
    'ski-pull-cortina-classic': {
        title: 'Ski Pull - Cortina Klassisch',
        location: 'Cortina d\'Ampezzo',
        duration: '5 Tage',
        description: 'Skifahren auf Cortinas olympischen Pisten mit einem erfahrenen Führer.',
        difficulty: 'Mittel-Fortgeschritten',
        groupSize: '4-8 Personen',
        itinerary: [
            { day: 1, title: 'Ankunft', description: 'Check-in und Resort-Erkundung.' },
            { day: 2, title: 'Tofana', description: 'Skifahren im Tofana-Gebiet.' },
            { day: 3, title: 'Lagazuoi', description: 'Legendäre Lagazuoi-Abfahrt.' },
            { day: 4, title: 'Cinque Torri', description: 'Skifahren mit Blick auf die Cinque Torri.' },
            { day: 5, title: 'Freier Tag', description: 'Freies Skifahren oder Spa. Abschiedsessen.' },
        ],
        includes: [
            { label: 'Dolomiti Superski Pass', detail: '5-Tages-Pass mit Zugang zu 1.200 km Pisten.' },
            { label: 'Hotel mit Spa', detail: '4 Nächte im 4* Hotel mit Spa und Pool.' },
            { label: 'Halbpension', detail: 'Frühstück und Gourmet-Abendessen.' },
            { label: 'Skilehrer', detail: 'Instruktor zur Verbesserung Ihrer Technik.' },
        ],
        notIncludes: ['Flüge', 'Ski-Ausrüstung', 'Versicherung'],
    },
    'ski-family-val-gardena': {
        title: 'Ski Familie - Grödnertal',
        location: 'Grödnertal',
        duration: '5 Tage',
        description: 'Perfekter Skiurlaub für die ganze Familie.',
        difficulty: 'Alle Stufen',
        groupSize: 'Familien',
        itinerary: [
            { day: 1, title: 'Anreise', description: 'Ankunft im Familienhotel.' },
            { day: 2, title: 'Skikurs', description: 'Skiunterricht für alle.' },
            { day: 3, title: 'Familienskifahren', description: 'Familien-Skitag.' },
            { day: 4, title: 'Abenteuer', description: 'Schlitten und Schneeaktivitäten.' },
            { day: 5, title: 'Abschied', description: 'Letzter Tag und Diplomzeremonie.' },
        ],
        includes: [
            { label: 'Familienhotel', detail: '4 Nächte mit Familienzimmern und Kinderclub.' },
            { label: 'Familien-Skipass', detail: 'Pässe für die ganze Familie.' },
            { label: 'Kinderunterricht', detail: '3 Tage Unterricht für die Kleinen.' },
            { label: 'Vollpension', detail: 'Alle Mahlzeiten inklusive.' },
        ],
        notIncludes: ['Flüge', 'Ausrüstung', 'Extras'],
    },
    'navidad-mercados-bolzano': {
        title: 'Weihnachten - Bozener Christkindlmarkt',
        location: 'Bozen, Südtirol',
        duration: '5 Tage',
        description: 'Die Magie der Südtiroler Weihnachtsmärkte.',
        difficulty: 'Leicht',
        groupSize: '6-14 Personen',
        itinerary: [
            { day: 1, title: 'Bozen', description: 'Ankunft und erster Weihnachtsmarkt.' },
            { day: 2, title: 'Märkte', description: 'Tour durch Bozens Weihnachtsmärkte.' },
            { day: 3, title: 'Meran', description: 'Meraner schwimmender Markt.' },
            { day: 4, title: 'Brixen', description: 'Brixener Markt und traditionelles Abendessen.' },
            { day: 5, title: 'Abschied', description: 'Letztes Einkaufen und Brunch.' },
        ],
        includes: [
            { label: '4* Hotel', detail: '4 Nächte im weihnachtlichen Boutique-Hotel.' },
            { label: 'Frühstück', detail: 'Frühstücksbuffet mit lokalen Produkten.' },
            { label: 'Geführte Touren', detail: 'Experte für Weihnachtstraditionen.' },
            { label: 'Verkostungen', detail: 'Glühwein, Strudel und typische Produkte.' },
        ],
        notIncludes: ['Flüge', 'Nicht spezifizierte Mahlzeiten', 'Einkaufen'],
    },
    'verano-activo-adventure-week': {
        title: 'Aktiver Sommer - Abenteuerwoche',
        location: 'Dolomiten',
        duration: '7 Tage',
        description: 'Komplette Woche voller Aktivitäten: Trekking, Klettersteig, Rafting und Klettern.',
        difficulty: 'Mittel-Fortgeschritten',
        groupSize: '6-10 Personen',
        itinerary: [
            { day: 1, title: 'Ankunft', description: 'Check-in und Orientierungssitzung.' },
            { day: 2, title: 'Klettersteig', description: 'Erste geführte Klettersteig-Erfahrung.' },
            { day: 3, title: 'Trekking', description: 'Ganztageswanderung zu den Drei Zinnen.' },
            { day: 4, title: 'Rafting', description: 'Rafting auf dem Piave-Fluss.' },
            { day: 5, title: 'Klettern', description: 'Felsklettertag.' },
            { day: 6, title: 'Mountainbike', description: 'Mountainbike-Tour durch das Tal.' },
            { day: 7, title: 'Entspannung und Abschied', description: 'Freier Morgen und Abschiedsessen.' },
        ],
        includes: [
            { label: 'Zertifizierte Führer', detail: 'Professionelle Führer für jede Aktivität.' },
            { label: 'Komplette Ausrüstung', detail: 'Vollständige Ausrüstung für alle Aktivitäten.' },
            { label: '3* Hotel', detail: '6 Nächte mit Frühstück.' },
            { label: 'Transport', detail: 'Transfers zu allen Startpunkten.' },
        ],
        notIncludes: ['Flüge', 'Mittag- und Abendessen', 'Versicherung'],
    },
};

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════

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

async function createGermanVersion(pkg, translation) {
    console.log(`\n📦 Procesando: ${pkg.title} (${pkg.slug})`);
    
    // Preparar datos para la versión en alemán
    const germanData = {
        title: translation.title,
        slug: `${pkg.slug}-de`,
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
        locale: 'de',
    };

    // Itinerario traducido (conservar IDs de imagen)
    if (translation.itinerary && pkg.itinerary) {
        germanData.itinerary = pkg.itinerary.map((day, idx) => ({
            day: day.day,
            title: translation.itinerary[idx]?.title || day.title,
            description: translation.itinerary[idx]?.description || day.description,
            image: day.image?.id || undefined,
        }));
    }

    // Includes traducidos
    if (translation.includes) {
        germanData.includes = translation.includes.map(inc => ({
            label: inc.label,
            detail: inc.detail,
        }));
    }

    // Not includes traducidos
    if (translation.notIncludes) {
        germanData.notIncludes = translation.notIncludes.map(text => ({ text }));
    }

    // Galería con captions traducidos (conservar imágenes)
    if (translation.gallery && pkg.gallery) {
        germanData.gallery = pkg.gallery.map((g, idx) => ({
            image: g.image?.id || undefined,
            caption: translation.gallery[idx]?.caption || g.caption,
        }));
    }

    // Tags (mantener igual)
    if (pkg.tags) {
        germanData.tags = pkg.tags.map(t => ({ name: t.name }));
    }

    // Thumbnails y heroImage
    if (pkg.thumbnail?.id) {
        germanData.thumbnail = pkg.thumbnail.id;
    }
    if (pkg.heroImage?.id) {
        germanData.heroImage = pkg.heroImage.id;
    }

    try {
        // Crear paquete en alemán
        const response = await axios.post(
            `${STRAPI_URL}/api/packages?locale=de`,
            { data: germanData },
            { 
                headers: { 
                    ...authHeaders, 
                    'Content-Type': 'application/json' 
                } 
            }
        );

        console.log(`✅ Creado en alemán: ${translation.title}`);
        return { created: true, id: response.data.data.id };

    } catch (error) {
        console.error(`❌ Error al crear versión alemana: ${error.response?.data?.error?.message || error.message}`);
        return { created: false, error: error.message };
    }
}

// ═══════════════════════════════════════════════════════════════
// PROCESO PRINCIPAL
// ═══════════════════════════════════════════════════════════════

async function seedGermanPackages() {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║  🇩🇪 SEED DE PAQUETES EN ALEMÁN - DOLOMITEN       ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    try {
        // 1. Obtener todos los paquetes en español
        console.log('📥 Obteniendo paquetes en español...');
        const spanishPackages = await getPackagesInSpanish();
        console.log(`✓ ${spanishPackages.length} paquetes encontrados\n`);

        // 2. Crear versiones en alemán
        const results = [];
        for (const pkg of spanishPackages) {
            const translation = PACKAGE_TRANSLATIONS_DE[pkg.slug];
            
            if (translation) {
                const result = await createGermanVersion(pkg, translation);
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
        
        const created = results.filter(r => r.created);
        const failed = results.filter(r => !r.created);

        console.log(`✅ Creados exitosamente: ${created.length}`);
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
    seedGermanPackages();
}

module.exports = { seedGermanPackages };
