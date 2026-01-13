#!/usr/bin/env node
/**
 * fix-slugs.js
 * 
 * Corrige los slugs que tienen sufijos de idioma (-en, -it, -de, etc.)
 * para que todos los idiomas usen el mismo slug base.
 * 
 * El problema: Cuando se crean localizaciones en Strapi con i18n,
 * a veces se generan slugs con sufijos de idioma (hut-2-hut-en).
 * Esto causa que las URLs no funcionen correctamente.
 * 
 * La solución: Este script elimina los sufijos de idioma de los slugs.
 * 
 * Uso:
 *   node scripts/fix-slugs.js
 *   node scripts/fix-slugs.js --dry-run   (solo muestra qué haría)
 */

require('dotenv').config();
const axios = require('axios');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

const DRY_RUN = process.argv.includes('--dry-run');

// Sufijos de idioma a eliminar
const LANGUAGE_SUFFIXES = ['-en', '-it', '-de', '-fr', '-pt', '-es'];

const api = axios.create({
    baseURL: `${STRAPI_URL}/api`,
    headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
    },
});

/**
 * Limpia el slug removiendo sufijos de idioma
 */
function cleanSlug(slug) {
    if (!slug) return slug;

    let cleanedSlug = slug;

    // Remover sufijos de idioma al final
    for (const suffix of LANGUAGE_SUFFIXES) {
        if (cleanedSlug.endsWith(suffix)) {
            cleanedSlug = cleanedSlug.slice(0, -suffix.length);
            break; // Solo remover un sufijo
        }
    }

    // También manejar casos como "slug-1" (duplicados de Strapi)
    // pero solo si el slug original tenía un sufijo de idioma
    if (cleanedSlug !== slug) {
        // Remover números al final como "-1", "-2" que Strapi agrega para duplicados
        cleanedSlug = cleanedSlug.replace(/-\d+$/, '');
    }

    return cleanedSlug;
}

/**
 * Obtiene todos los documentos de un tipo incluyendo todas las localizaciones
 */
async function getAllDocuments(contentType) {
    const locales = ['es', 'en', 'it', 'de'];
    const allDocuments = [];

    for (const locale of locales) {
        try {
            const response = await api.get(`/${contentType}`, {
                params: {
                    'pagination[pageSize]': 100,
                    'locale': locale,
                },
            });

            const docs = response.data.data || [];
            // Agregar el locale a cada documento
            docs.forEach(doc => {
                doc.locale = locale;
                allDocuments.push(doc);
            });

        } catch (error) {
            // Si el locale no existe, continuar con el siguiente
            if (error.response?.status !== 404) {
                console.error(`  Error obteniendo ${contentType} (${locale}):`, error.response?.data?.error?.message || error.message);
            }
        }
    }

    return allDocuments;
}

/**
 * Actualiza el slug de un documento
 */
async function updateSlug(contentType, documentId, locale, oldSlug, newSlug) {
    if (DRY_RUN) {
        console.log(`  [DRY-RUN] Actualizaría ${contentType} (${documentId}) locale=${locale}: "${oldSlug}" → "${newSlug}"`);
        return true;
    }

    try {
        await api.put(`/${contentType}/${documentId}`, {
            data: {
                slug: newSlug,
            },
        }, {
            params: { locale },
        });
        console.log(`  ✅ Actualizado ${contentType} (${documentId}) locale=${locale}: "${oldSlug}" → "${newSlug}"`);
        return true;
    } catch (error) {
        console.error(`  ❌ Error actualizando ${contentType} (${documentId}):`, error.response?.data || error.message);
        return false;
    }
}

/**
 * Procesa todos los documentos de un tipo
 */
async function processContentType(contentType, displayName) {
    console.log(`\n📦 Procesando ${displayName}...`);

    const documents = await getAllDocuments(contentType);
    console.log(`   Encontrados: ${documents.length} documentos`);

    let fixed = 0;
    let skipped = 0;

    for (const doc of documents) {
        const oldSlug = doc.slug;
        const newSlug = cleanSlug(oldSlug);
        const locale = doc.locale || 'es';

        if (oldSlug !== newSlug) {
            const success = await updateSlug(contentType, doc.documentId, locale, oldSlug, newSlug);
            if (success) fixed++;
        } else {
            skipped++;
        }
    }

    console.log(`   ✅ Corregidos: ${fixed}`);
    console.log(`   ⏭️  Sin cambios: ${skipped}`);

    return { fixed, skipped };
}

async function main() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🔧 CORRECCIÓN DE SLUGS CON SUFIJOS DE IDIOMA');
    console.log('═══════════════════════════════════════════════════════════════');

    if (DRY_RUN) {
        console.log('⚠️  MODO DRY-RUN: No se realizarán cambios reales\n');
    }

    if (!API_TOKEN) {
        console.error('❌ Error: STRAPI_API_TOKEN no está configurado en .env');
        process.exit(1);
    }

    console.log(`📡 Conectando a: ${STRAPI_URL}`);

    // Procesar Experiences
    const expResult = await processContentType('experiences', 'Experiences');

    // Procesar Packages
    const pkgResult = await processContentType('packages', 'Packages');

    // Resumen
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('📊 RESUMEN:');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`   Experiences corregidas: ${expResult.fixed}`);
    console.log(`   Packages corregidos: ${pkgResult.fixed}`);
    console.log(`   Total: ${expResult.fixed + pkgResult.fixed} slugs actualizados`);

    if (DRY_RUN) {
        console.log('\n💡 Ejecuta sin --dry-run para aplicar los cambios:');
        console.log('   node scripts/fix-slugs.js');
    } else {
        console.log('\n✅ ¡Slugs corregidos exitosamente!');
        console.log('   Reinicia Strapi si es necesario y verifica el frontend.');
    }
}

main().catch(console.error);
