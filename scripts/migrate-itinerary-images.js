/**
 * MIGRACIÓN DE IMÁGENES DE ITINERARIO
 * ====================================
 * 
 * Este script sincroniza las imágenes de itinerario del frontend estático
 * hacia Strapi CMS. Es idempotente y robusto.
 * 
 * Uso: node scripts/migrate-itinerary-images.js [--package=slug]
 * 
 * Opciones:
 *   --package=slug   Migrar solo un paquete específico
 *   --dry-run        Solo mostrar qué se haría, sin ejecutar
 *   --force          Reemplazar imágenes existentes con las del frontend
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════

const STRAPI_URL = 'http://localhost:1337';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;
const UPLOAD_DELAY_MS = 1500;
const PACKAGE_DELAY_MS = 3000;

// Leer API Token desde .env
const envPath = path.join(__dirname, '..', '.env');
let STRAPI_API_TOKEN = '';
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/STRAPI_API_TOKEN=(.+)/);
    if (match) {
        STRAPI_API_TOKEN = match[1].trim();
    }
}

const authHeaders = STRAPI_API_TOKEN ? {
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`
} : {};

// ═══════════════════════════════════════════════════════════════
// IMÁGENES DEL FRONTEND (source of truth para migración)
// ═══════════════════════════════════════════════════════════════

const FRONTEND_ITINERARY_IMAGES = {
    'hut-2-hut-dolomitas-clasico': [
        { day: 1, url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80' },
        { day: 2, url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80' },
        { day: 3, url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80' },
        { day: 4, url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80' },
        { day: 5, url: 'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=800&q=80' },
    ],
    'hut-2-hut-alta-via-1': [
        { day: 1, url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80' },
        { day: 2, url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80' },
        { day: 3, url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80' },
        { day: 4, url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80' },
        { day: 5, url: 'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=800&q=80' },
        { day: 6, url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80' },
        { day: 7, url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80' },
    ],
    'hiking-lagos-alpinos': [
        { day: 1, url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80' },
        { day: 2, url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80' },
        { day: 3, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80' },
        { day: 4, url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80' },
    ],
    'city-lights-norte-italia': [
        { day: 1, url: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=800&q=80' },
        { day: 2, url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
        { day: 3, url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&q=80' },
        { day: 4, url: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&q=80' },
        { day: 5, url: 'https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9?w=800&q=80' },
    ],
    'ski-pull-cortina-classic': [
        { day: 1, url: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80' },
        { day: 2, url: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&q=80' },
        { day: 3, url: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800&q=80' },
        { day: 4, url: 'https://images.unsplash.com/photo-1520208422220-d12a3c588e6c?w=800&q=80' },
        { day: 5, url: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=800&q=80' },
    ],
    'ski-family-val-gardena': [
        { day: 1, url: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&q=80' },
        { day: 2, url: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&q=80' },
        { day: 3, url: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80' },
        { day: 4, url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80' },
        { day: 5, url: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800&q=80' },
    ],
    'navidad-mercados-bolzano': [
        { day: 1, url: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&q=80' },
        { day: 2, url: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=800&q=80' },
        { day: 3, url: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800&q=80' },
        { day: 4, url: 'https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=800&q=80' },
        { day: 5, url: 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?w=800&q=80' },
    ],
};

// ═══════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const log = {
    info: (msg) => console.log(`ℹ️  ${msg}`),
    success: (msg) => console.log(`✅ ${msg}`),
    warn: (msg) => console.log(`⚠️  ${msg}`),
    error: (msg) => console.log(`❌ ${msg}`),
    step: (msg) => console.log(`   → ${msg}`),
};

async function retryWithBackoff(fn, retries = MAX_RETRIES, delayMs = RETRY_DELAY_MS) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error;
            const waitTime = delayMs * Math.pow(2, i);
            log.warn(`Reintento ${i + 1}/${retries} en ${waitTime}ms...`);
            await delay(waitTime);
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// FUNCIONES DE DESCARGA/UPLOAD
// ═══════════════════════════════════════════════════════════════

async function downloadImage(url, filename) {
    const tempDir = path.join(__dirname, '.temp-images');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const filepath = path.join(tempDir, filename);

    return new Promise((resolve, reject) => {
        const request = https.get(url, { timeout: 30000 }, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                downloadImage(response.headers.location, filename)
                    .then(resolve)
                    .catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode} para ${url}`));
                return;
            }

            const file = fs.createWriteStream(filepath);
            response.pipe(file);

            file.on('finish', () => {
                file.close();
                resolve(filepath);
            });

            file.on('error', (err) => {
                fs.unlink(filepath, () => { });
                reject(err);
            });
        });

        request.on('error', reject);
        request.on('timeout', () => {
            request.destroy();
            reject(new Error('Timeout al descargar imagen'));
        });
    });
}

async function uploadToStrapi(filepath, filename) {
    const form = new FormData();
    form.append('files', fs.createReadStream(filepath), filename);

    const response = await axios.post(`${STRAPI_URL}/api/upload`, form, {
        headers: {
            ...form.getHeaders(),
            ...authHeaders,
        },
        timeout: 60000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
    });

    return response.data[0];
}

// ═══════════════════════════════════════════════════════════════
// FUNCIONES DE API DE STRAPI
// ═══════════════════════════════════════════════════════════════

async function getPackages(slugFilter = null) {
    const params = {
        'populate[itinerary][populate]': 'image',
        'pagination[pageSize]': 100,
    };

    if (slugFilter) {
        params['filters[slug][$eq]'] = slugFilter;
    }

    const response = await axios.get(`${STRAPI_URL}/api/packages`, {
        params,
        headers: authHeaders,
    });

    return response.data.data;
}

async function updatePackageItinerary(documentId, itinerary) {
    const response = await axios.put(
        `${STRAPI_URL}/api/packages/${documentId}`,
        { data: { itinerary } },
        { headers: authHeaders }
    );
    return response.data;
}

// ═══════════════════════════════════════════════════════════════
// MIGRACIÓN PRINCIPAL
// ═══════════════════════════════════════════════════════════════

async function migratePackageImages(pkg, frontendImages, dryRun = false, force = false) {
    log.info(`Procesando: ${pkg.title} (${pkg.itinerary?.length || 0} días)`);

    if (!pkg.itinerary || pkg.itinerary.length === 0) {
        log.warn(`Sin itinerario, saltando...`);
        return { success: false, reason: 'no_itinerary' };
    }

    const updatedItinerary = [];
    let uploadedCount = 0;
    let skippedCount = 0;

    for (const day of pkg.itinerary) {
        const frontendImage = frontendImages.find(fi => fi.day === day.day);

        // Si ya tiene imagen y no estamos en modo force, conservar
        if (day.image?.url && !force) {
            log.step(`Día ${day.day}: Ya tiene imagen, conservando`);
            skippedCount++;
            updatedItinerary.push({
                day: day.day,
                title: day.title,
                description: day.description,
                image: day.image.id,
            });
            continue;
        }

        // Si tiene imagen pero estamos en force, la reemplazaremos
        if (day.image?.url && force) {
            log.step(`Día ${day.day}: [FORCE] Reemplazando imagen existente`);
        }

        if (!frontendImage) {
            log.step(`Día ${day.day}: Sin imagen frontend definida`);
            updatedItinerary.push({
                day: day.day,
                title: day.title,
                description: day.description,
            });
            continue;
        }

        if (dryRun) {
            log.step(`Día ${day.day}: [DRY-RUN] Subiría ${frontendImage.url}`);
            updatedItinerary.push({
                day: day.day,
                title: day.title,
                description: day.description,
            });
            continue;
        }

        // Descargar y subir imagen
        try {
            log.step(`Día ${day.day}: Descargando...`);
            const hash = crypto.randomBytes(4).toString('hex');
            const filename = `${pkg.slug}_day${day.day}_${hash}.jpg`;

            const filepath = await retryWithBackoff(() =>
                downloadImage(frontendImage.url, filename)
            );

            log.step(`Día ${day.day}: Subiendo a Strapi...`);
            const uploaded = await retryWithBackoff(() =>
                uploadToStrapi(filepath, filename)
            );

            // Limpiar archivo temporal
            try { fs.unlinkSync(filepath); } catch { }

            updatedItinerary.push({
                day: day.day,
                title: day.title,
                description: day.description,
                image: uploaded.id,
            });

            log.success(`Día ${day.day}: Imagen subida (ID: ${uploaded.id})`);
            uploadedCount++;

            // Pausa entre uploads para no saturar el servidor
            await delay(UPLOAD_DELAY_MS);

        } catch (error) {
            log.error(`Día ${day.day}: ${error.message}`);
            updatedItinerary.push({
                day: day.day,
                title: day.title,
                description: day.description,
            });
        }
    }

    // Actualizar en Strapi
    if (!dryRun && (uploadedCount > 0 || skippedCount !== pkg.itinerary.length)) {
        try {
            log.step(`Guardando cambios en Strapi...`);
            await retryWithBackoff(() =>
                updatePackageItinerary(pkg.documentId, updatedItinerary)
            );
            log.success(`${pkg.title}: ${uploadedCount} imágenes subidas, ${skippedCount} conservadas`);
        } catch (error) {
            log.error(`Error guardando: ${error.message}`);
            return { success: false, reason: 'save_failed' };
        }
    }

    return { success: true, uploaded: uploadedCount, skipped: skippedCount };
}

async function main() {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  MIGRACIÓN DE IMÁGENES DE ITINERARIO');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Parsear argumentos
    const args = process.argv.slice(2);
    const packageFilter = args.find(a => a.startsWith('--package='))?.split('=')[1];
    const dryRun = args.includes('--dry-run');
    const force = args.includes('--force');

    if (!STRAPI_API_TOKEN) {
        log.error('STRAPI_API_TOKEN no configurado en .env');
        process.exit(1);
    }

    log.info(`API Token: Configurado`);
    log.info(`Modo: ${dryRun ? 'DRY-RUN (sin cambios)' : 'EJECUCIÓN REAL'}`);
    if (force) log.info(`FORCE: Reemplazando imágenes existentes`);
    if (packageFilter) log.info(`Filtro: Solo paquete "${packageFilter}"`);
    console.log('');

    // Obtener paquetes
    const packages = await getPackages(packageFilter);
    log.info(`Encontrados ${packages.length} paquetes\n`);

    if (packages.length === 0) {
        log.warn('No se encontraron paquetes para procesar');
        return;
    }

    const results = {
        success: 0,
        failed: 0,
        skipped: 0,
        totalUploaded: 0,
    };

    for (const pkg of packages) {
        const frontendImages = FRONTEND_ITINERARY_IMAGES[pkg.slug];

        if (!frontendImages) {
            log.warn(`${pkg.title}: Sin mapeo de imágenes definido, saltando`);
            results.skipped++;
            continue;
        }

        const result = await migratePackageImages(pkg, frontendImages, dryRun, force);

        if (result.success) {
            results.success++;
            results.totalUploaded += result.uploaded || 0;
        } else {
            results.failed++;
        }

        // Pausa entre paquetes
        await delay(PACKAGE_DELAY_MS);
        console.log('');
    }

    // Limpiar directorio temporal
    const tempDir = path.join(__dirname, '.temp-images');
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }

    // Resumen final
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  RESUMEN');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  ✅ Exitosos:    ${results.success}`);
    console.log(`  ❌ Fallidos:    ${results.failed}`);
    console.log(`  ⏭️  Saltados:    ${results.skipped}`);
    console.log(`  📸 Imágenes:    ${results.totalUploaded} subidas`);
    console.log('═══════════════════════════════════════════════════════════\n');
}

main().catch((error) => {
    log.error(`Error fatal: ${error.message}`);
    process.exit(1);
});
