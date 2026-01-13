/**
 * SEED DE PAQUETES EN ITALIANO
 * =============================
 * 
 * Crea versiones en italiano de los paquetes existentes en Strapi.
 * Incluye traducciones completas con itinerarios detallados.
 * 
 * Uso: node scripts/seed-italian-packages.js
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
// TRADUCCIONES DE PAQUETES EN ITALIANO
// ═══════════════════════════════════════════════════════════════

const PACKAGE_TRANSLATIONS_IT = {
    'hut-2-hut-dolomitas-clasico': {
        title: 'Rifugio 2 Rifugio - Dolomiti Classiche',
        location: 'Dolomiti',
        duration: '5 Giorni',
        description: 'Il percorso classico delle Tre Cime di Lavaredo. 5 giorni di trekking tra i rifugi più iconici.',
        difficulty: 'Intermedio',
        groupSize: '4-8 persone',
        guideType: 'Guidato',
        availableDates: 'Giugno - Settembre',
        itinerary: [
            { day: 1, title: 'Arrivo a Cortina', description: 'Arrivo a Cortina d\'Ampezzo e briefing di benvenuto. Prima tappa al Rifugio Auronzo con vista sulle Tre Cime.' },
            { day: 2, title: 'Tre Cime di Lavaredo', description: 'Escursione iconica attorno alle Tre Cime. Circa 10km con panorami mozzafiato.' },
            { day: 3, title: 'Lago di Braies', description: 'Trekking verso il Lago di Braies, uno dei laghi più fotografati delle Dolomiti.' },
            { day: 4, title: 'Passo Giau', description: 'Attraversamento del Passo Giau con panorami a 360°. Notte in rifugio con cena speciale.' },
            { day: 5, title: 'Discesa e Arrivederci', description: 'Tappa finale scendendo verso la valle. Arrivo a Cortina e saluto del gruppo.' },
        ],
        includes: [
            { label: 'Guida UIAGM', detail: 'Guida alpina certificata UIAGM con oltre 10 anni di esperienza nelle Dolomiti.' },
            { label: 'Alloggio in rifugio', detail: '4 notti nei tradizionali rifugi di montagna con camere condivise.' },
            { label: 'Mezza pensione', detail: 'Colazione a buffet e cena di 3 portate ogni giorno in rifugio.' },
            { label: 'Trasporto bagagli', detail: 'Il tuo bagaglio principale viene trasportato da rifugio a rifugio. Porti solo lo zaino giornaliero.' },
        ],
        notIncludes: ['Voli internazionali', 'Pranzi', 'Assicurazione di viaggio', 'Mance'],
        gallery: [
            { caption: 'Rifugio Auronzo - Primo giorno del trek' },
            { caption: 'Vista panoramica delle Tre Cime di Lavaredo' },
            { caption: 'Sentiero verso il Lago di Braies' },
            { caption: 'Tramonto dal rifugio' },
            { caption: 'Gruppo di escursionisti al Passo Giau' },
        ],
    },
    'hut-2-hut-alta-via-1': {
        title: 'Rifugio 2 Rifugio - Alta Via 1',
        location: 'Dolomiti Centrali',
        duration: '7 Giorni',
        description: 'La leggendaria Alta Via 1, il trekking più famoso delle Dolomiti. 7 giorni di pura avventura.',
        difficulty: 'Avanzato',
        groupSize: '4-6 persone',
        guideType: 'Guidato',
        availableDates: 'Luglio - Agosto',
        itinerary: [
            { day: 1, title: 'Lago di Braies', description: 'Partenza dall\'iconico Lago di Braies. Prima tappa al Rifugio Biella.' },
            { day: 2, title: 'Fanes', description: 'Trekking attraverso l\'altopiano di Fanes con viste spettacolari.' },
            { day: 3, title: 'Lagazuoi', description: 'Salita al Lagazuoi con gallerie della Prima Guerra Mondiale.' },
            { day: 4, title: 'Cinque Torri', description: 'Passaggio per le iconiche Cinque Torri.' },
            { day: 5, title: 'Nuvolau', description: 'Ascesa al Nuvolau con panorami a 360°.' },
            { day: 6, title: 'Civetta', description: 'Trekking verso l\'imponente parete della Civetta.' },
            { day: 7, title: 'Alleghe', description: 'Discesa finale ad Alleghe. Celebrazione e arrivederci.' },
        ],
        includes: [
            { label: 'Cosa include', detail: 'Guida esperta, 6 notti in rifugi, mezza pensione, trasporto bagagli.' },
        ],
        notIncludes: ['Voli', 'Pranzi', 'Assicurazione', 'Mance'],
    },
    'hiking-lagos-alpinos': {
        title: 'Escursionismo - Laghi Alpini',
        location: 'Alto Adige',
        duration: '4 Giorni',
        description: 'Scopri i laghi più cristallini delle Alpi. Percorsi tranquilli con paesaggi incredibili.',
        difficulty: 'Facile',
        groupSize: '4-12 persone',
        itinerary: [
            { day: 1, title: 'Arrivo', description: 'Check-in in hotel e passeggiata di benvenuto.' },
            { day: 2, title: 'Lago di Carezza', description: 'Percorso verso il famoso lago arcobaleno delle Dolomiti.' },
            { day: 3, title: 'Lago di Anterselva', description: 'Escursione attorno al lago più grande del Tirolo.' },
            { day: 4, title: 'Arrivederci', description: 'Ultima passeggiata facile e ritorno.' },
        ],
        includes: [
            { label: 'Guida locale', detail: 'Guida escursionistica con conoscenza specializzata della zona.' },
            { label: 'Hotel 3*', detail: '3 notti in hotel di montagna con spa.' },
            { label: 'Colazioni', detail: 'Colazione a buffet ogni mattina.' },
            { label: 'Trasporto', detail: 'Trasferimenti ai punti di partenza di ogni percorso.' },
        ],
        notIncludes: ['Voli', 'Pasti principali', 'Assicurazione'],
    },
    'city-lights-norte-italia': {
        title: 'Luci della Città - Nord Italia',
        location: 'Milano, Verona, Venezia',
        duration: '5 Giorni',
        description: 'Il tour classico attraverso i gioielli del nord Italia.',
        difficulty: 'Facile',
        groupSize: '6-14 persone',
        itinerary: [
            { day: 1, title: 'Milano', description: 'Arrivo. Duomo, Galleria Vittorio Emanuele.' },
            { day: 2, title: 'Milano - Moda', description: 'Quadrilatero della Moda e Navigli.' },
            { day: 3, title: 'Verona', description: 'Arena di Verona, Casa di Giulietta.' },
            { day: 4, title: 'Venezia', description: 'Piazza San Marco, giro in gondola.' },
            { day: 5, title: 'Murano e Burano', description: 'Isole del vetro e del colore. Arrivederci.' },
        ],
        includes: [
            { label: 'Tour guidati', detail: 'Guide locali in ogni città.' },
            { label: 'Hotel in centro', detail: '4 notti in hotel boutique.' },
            { label: 'Trasporto', detail: 'Treno ad alta velocità tra le città.' },
            { label: 'Colazioni', detail: 'Colazione italiana ogni mattina.' },
        ],
        notIncludes: ['Voli', 'Pasti', 'Biglietti musei'],
    },
    'ski-pull-cortina-classic': {
        title: 'Ski Pull - Cortina Classico',
        location: 'Cortina d\'Ampezzo',
        duration: '5 Giorni',
        description: 'Sciare sulle piste olimpiche di Cortina con una guida esperta.',
        difficulty: 'Intermedio-Avanzato',
        groupSize: '4-8 persone',
        itinerary: [
            { day: 1, title: 'Arrivo', description: 'Check-in e ricognizione del resort.' },
            { day: 2, title: 'Tofana', description: 'Sci nell\'area Tofana.' },
            { day: 3, title: 'Lagazuoi', description: 'Leggendaria discesa del Lagazuoi.' },
            { day: 4, title: 'Cinque Torri', description: 'Sci con vista sulle Cinque Torri.' },
            { day: 5, title: 'Giorno Libero', description: 'Sci libero o spa. Cena d\'arrivederci.' },
        ],
        includes: [
            { label: 'Skipass Dolomiti Superski', detail: 'Pass di 5 giorni con accesso a 1.200km di piste.' },
            { label: 'Hotel con spa', detail: '4 notti in hotel 4* con spa e piscina.' },
            { label: 'Mezza pensione', detail: 'Colazione e cena gourmet.' },
            { label: 'Guida sci', detail: 'Istruttore per migliorare la tua tecnica.' },
        ],
        notIncludes: ['Voli', 'Attrezzatura sci', 'Assicurazione'],
    },
    'ski-family-val-gardena': {
        title: 'Sci in Famiglia - Val Gardena',
        location: 'Val Gardena',
        duration: '5 Giorni',
        description: 'Vacanza sulla neve perfetta per tutta la famiglia.',
        difficulty: 'Tutti i livelli',
        groupSize: 'Famiglie',
        itinerary: [
            { day: 1, title: 'Sistemazione', description: 'Arrivo all\'hotel per famiglie.' },
            { day: 2, title: 'Lezioni', description: 'Lezioni di sci per tutti.' },
            { day: 3, title: 'Sci in Famiglia', description: 'Giornata di sci in famiglia.' },
            { day: 4, title: 'Avventure', description: 'Slitte e attività sulla neve.' },
            { day: 5, title: 'Arrivederci', description: 'Ultimo giorno e cerimonia di diploma.' },
        ],
        includes: [
            { label: 'Hotel per famiglie', detail: '4 notti con camere familiari e kids club.' },
            { label: 'Skipass famiglia', detail: 'Pass per tutta la famiglia.' },
            { label: 'Lezioni bambini', detail: '3 giorni di lezioni per i più piccoli.' },
            { label: 'Pensione completa', detail: 'Tutti i pasti inclusi.' },
        ],
        notIncludes: ['Voli', 'Attrezzatura', 'Extra'],
    },
    'navidad-mercados-bolzano': {
        title: 'Natale - Mercatini di Bolzano',
        location: 'Bolzano, Alto Adige',
        duration: '5 Giorni',
        description: 'La magia dei mercatini di Natale dell\'Alto Adige.',
        difficulty: 'Facile',
        groupSize: '6-14 persone',
        itinerary: [
            { day: 1, title: 'Bolzano', description: 'Arrivo e primo mercatino di Natale.' },
            { day: 2, title: 'Mercatini', description: 'Tour dei mercatini di Bolzano.' },
            { day: 3, title: 'Merano', description: 'Mercatino galleggiante di Merano.' },
            { day: 4, title: 'Bressanone', description: 'Mercatino di Bressanone e cena tradizionale.' },
            { day: 5, title: 'Arrivederci', description: 'Ultimo shopping e brunch.' },
        ],
        includes: [
            { label: 'Hotel 4*', detail: '4 notti in hotel boutique a tema natalizio.' },
            { label: 'Colazioni', detail: 'Colazione a buffet con prodotti locali.' },
            { label: 'Tour guidati', detail: 'Guida esperta sulle tradizioni natalizie.' },
            { label: 'Degustazioni', detail: 'Vin brulé, strudel e prodotti tipici.' },
        ],
        notIncludes: ['Voli', 'Pasti non specificati', 'Shopping'],
    },
    'verano-activo-adventure-week': {
        title: 'Estate Attiva - Settimana d\'Avventura',
        location: 'Dolomiti',
        duration: '7 Giorni',
        description: 'Settimana completa di attività: trekking, via ferrata, rafting e arrampicata.',
        difficulty: 'Intermedio-Avanzato',
        groupSize: '6-10 persone',
        itinerary: [
            { day: 1, title: 'Arrivo', description: 'Check-in e sessione di orientamento.' },
            { day: 2, title: 'Via Ferrata', description: 'Prima esperienza di via ferrata guidata.' },
            { day: 3, title: 'Trekking', description: 'Escursione intera giornata alle Tre Cime.' },
            { day: 4, title: 'Rafting', description: 'Rafting sul fiume Piave.' },
            { day: 5, title: 'Arrampicata', description: 'Giornata di arrampicata su roccia.' },
            { day: 6, title: 'Mountain Bike', description: 'Tour in mountain bike attraverso la valle.' },
            { day: 7, title: 'Relax e Arrivederci', description: 'Mattinata libera e cena d\'arrivederci.' },
        ],
        includes: [
            { label: 'Guide certificate', detail: 'Guide professioniste per ogni attività.' },
            { label: 'Tutto l\'equipaggiamento', detail: 'Attrezzatura completa per tutte le attività.' },
            { label: 'Hotel 3*', detail: '6 notti con colazione.' },
            { label: 'Trasporto', detail: 'Trasferimenti a tutti i punti di partenza.' },
        ],
        notIncludes: ['Voli', 'Pranzi e cene', 'Assicurazione'],
    },
};

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════

async function checkIfItalianPackageExists(slug) {
    try {
        const response = await axios.get(`${STRAPI_URL}/api/packages`, {
            params: { 
                locale: 'it',
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

async function createItalianVersion(pkg, translation) {
    console.log(`\n📦 Procesando: ${pkg.title} (${pkg.slug})`);
    
    // Preparar datos para la versión en italiano
    const italianData = {
        title: translation.title,
        slug: pkg.slug,  // Mismo slug para todas las localizaciones
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
        italianData.itinerary = pkg.itinerary.map((day, idx) => ({
            day: day.day,
            title: translation.itinerary[idx]?.title || day.title,
            description: translation.itinerary[idx]?.description || day.description,
            image: day.image?.id || undefined,
        }));
    }

    // Includes traducidos
    if (translation.includes) {
        italianData.includes = translation.includes.map(inc => ({
            label: inc.label,
            detail: inc.detail,
        }));
    }

    // Not includes traducidos
    if (translation.notIncludes) {
        italianData.notIncludes = translation.notIncludes.map(text => ({ text }));
    }

    // Galería con captions traducidos (conservar imágenes)
    if (translation.gallery && pkg.gallery) {
        italianData.gallery = pkg.gallery.map((g, idx) => ({
            image: g.image?.id || undefined,
            caption: translation.gallery[idx]?.caption || g.caption,
        }));
    }

    // Tags (mantener igual)
    if (pkg.tags) {
        italianData.tags = pkg.tags.map(t => ({ name: t.name }));
    }

    // Thumbnails y heroImage
    if (pkg.thumbnail?.id) {
        italianData.thumbnail = pkg.thumbnail.id;
    }
    if (pkg.heroImage?.id) {
        italianData.heroImage = pkg.heroImage.id;
    }

    try {
        // En Strapi 5, PUT con documentId y locale crea o actualiza automáticamente
        // Es inherentemente idempotente
        const existing = await checkIfItalianPackageExists(pkg.slug);
        const action = existing ? 'actualizado' : 'creado';
        
        if (existing) {
            console.log(`♻️  Ya existe en italiano: ${translation.title} (actualizando...)`);
        }
        
        const response = await axios.put(
            `${STRAPI_URL}/api/packages/${pkg.documentId}?locale=it`,
            { data: italianData },
            { 
                headers: { 
                    ...authHeaders, 
                    'Content-Type': 'application/json' 
                } 
            }
        );

        console.log(`✅ ${action.charAt(0).toUpperCase() + action.slice(1)} en italiano: ${translation.title}`);
        return { created: true, updated: !!existing, id: response.data.data.id };

    } catch (error) {
        console.error(`❌ Error al crear versión italiana: ${error.response?.data?.error?.message || error.message}`);
        return { created: false, error: error.message };
    }
}

// ═══════════════════════════════════════════════════════════════
// PROCESO PRINCIPAL
// ═══════════════════════════════════════════════════════════════

async function seedItalianPackages() {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║  🇮🇹 SEED DE PAQUETES EN ITALIANO - DOLOMITI      ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    try {
        // 1. Obtener todos los paquetes en español
        console.log('📥 Obteniendo paquetes en español...');
        const spanishPackages = await getPackagesInSpanish();
        console.log(`✓ ${spanishPackages.length} paquetes encontrados\n`);

        // 2. Crear versiones en italiano
        const results = [];
        for (const pkg of spanishPackages) {
            const translation = PACKAGE_TRANSLATIONS_IT[pkg.slug];
            
            if (translation) {
                const result = await createItalianVersion(pkg, translation);
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
    seedItalianPackages();
}

module.exports = { seedItalianPackages };
