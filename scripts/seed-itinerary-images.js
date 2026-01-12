/**
 * Script para asignar imágenes a los días del itinerario
 * Ejecutar con: node scripts/seed-itinerary-images.js
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const STRAPI_URL = 'http://localhost:1337';

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

// Imágenes de Unsplash para los itinerarios (fotos de Dolomitas)
const UNSPLASH_IMAGES = {
    'hut-2-hut-dolomitas-clasico': [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200', // Día 1 - Montañas
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200', // Día 2 - Tre Cime
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200', // Día 3 - Lago
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200', // Día 4 - Paso
        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200', // Día 5 - Valle
    ],
    'hut-2-hut-alta-via-1': [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200',
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200',
        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200',
        'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200',
    ],
    'hiking-lagos-alpinos': [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
        'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200',
    ],
    'ski-pull-cortina-classic': [
        'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=1200',
        'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=1200',
        'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=1200',
        'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=1200',
        'https://images.unsplash.com/photo-1520935662326-2a90baa2ea23?w=1200',
    ],
    'ski-family-val-gardena': [
        'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=1200',
        'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=1200',
        'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=1200',
        'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=1200',
        'https://images.unsplash.com/photo-1520935662326-2a90baa2ea23?w=1200',
    ],
    'city-lights-norte-italia': [
        'https://images.unsplash.com/photo-1513735492321-74fb442a93ea?w=1200', // Milán
        'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200', // Verona
        'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200', // Venecia
        'https://images.unsplash.com/photo-1534113414509-0eec2bfb493a?w=1200', // Italia
        'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200', // Costa
    ],
    'navidad-mercados-bolzano': [
        'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=1200', // Navidad
        'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=1200', // Mercado
        'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=1200', // Luces
        'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=1200', // Nieve
        'https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=1200', // Montaña nevada
    ],
};

async function downloadImage(url, filename) {
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const filepath = path.join(tempDir, filename);

    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(filepath);

        protocol.get(url, (response) => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302) {
                downloadImage(response.headers.location, filename)
                    .then(resolve)
                    .catch(reject);
                return;
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(filepath);
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
}

async function uploadImageToStrapi(filepath) {
    const form = new FormData();
    form.append('files', fs.createReadStream(filepath));

    try {
        const response = await axios.post(`${STRAPI_URL}/api/upload`, form, {
            headers: {
                ...form.getHeaders(),
                ...authHeaders,
            },
        });
        return response.data[0];
    } catch (error) {
        console.error('Error uploading image:', error.response?.data || error.message);
        return null;
    }
}

async function getPackages() {
    try {
        const response = await axios.get(`${STRAPI_URL}/api/packages`, {
            params: {
                'populate[itinerary]': true,
                'pagination[pageSize]': 100,
            },
            headers: authHeaders,
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching packages:', error.message);
        return [];
    }
}

async function updatePackageItinerary(documentId, itinerary) {
    try {
        const response = await axios.put(`${STRAPI_URL}/api/packages/${documentId}`, {
            data: {
                itinerary: itinerary,
            },
        }, {
            headers: authHeaders,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating package:', error.response?.data || error.message);
        return null;
    }
}

async function main() {
    console.log('🚀 Iniciando asignación de imágenes a itinerarios...');
    console.log(`🔑 API Token: ${STRAPI_API_TOKEN ? 'Configurado' : 'NO CONFIGURADO'}\n`);

    const packages = await getPackages();
    console.log(`📦 Encontrados ${packages.length} paquetes\n`);

    for (const pkg of packages) {
        const slug = pkg.slug;
        const images = UNSPLASH_IMAGES[slug];

        if (!images) {
            console.log(`⏭️  ${pkg.title}: Sin imágenes definidas, saltando...`);
            continue;
        }

        if (!pkg.itinerary || pkg.itinerary.length === 0) {
            console.log(`⏭️  ${pkg.title}: Sin itinerario, saltando...`);
            continue;
        }

        console.log(`\n📸 Procesando: ${pkg.title}`);
        console.log(`   Días de itinerario: ${pkg.itinerary.length}`);

        const updatedItinerary = [];

        for (let i = 0; i < pkg.itinerary.length; i++) {
            const day = pkg.itinerary[i];
            const imageUrl = images[i % images.length]; // Ciclar si hay más días que imágenes

            console.log(`   📷 Día ${day.day}: Descargando imagen...`);

            try {
                const filename = `${slug}_day_${day.day}_${Date.now()}.jpg`;
                const filepath = await downloadImage(imageUrl, filename);

                console.log(`   ⬆️  Día ${day.day}: Subiendo a Strapi...`);
                const uploadedImage = await uploadImageToStrapi(filepath);

                // Limpiar archivo temporal
                fs.unlinkSync(filepath);

                if (uploadedImage) {
                    updatedItinerary.push({
                        day: day.day,
                        title: day.title,
                        description: day.description,
                        image: uploadedImage.id,
                    });
                    console.log(`   ✅ Día ${day.day}: Imagen asignada (ID: ${uploadedImage.id})`);
                } else {
                    updatedItinerary.push({
                        day: day.day,
                        title: day.title,
                        description: day.description,
                    });
                    console.log(`   ❌ Día ${day.day}: Error al subir imagen`);
                }
            } catch (error) {
                console.error(`   ❌ Día ${day.day}: Error - ${error.message}`);
                updatedItinerary.push({
                    day: day.day,
                    title: day.title,
                    description: day.description,
                });
            }
        }

        // Actualizar el paquete con las nuevas imágenes
        console.log(`   💾 Guardando cambios en Strapi...`);
        const result = await updatePackageItinerary(pkg.documentId, updatedItinerary);

        if (result) {
            console.log(`   ✅ ${pkg.title}: Actualizado exitosamente`);
        } else {
            console.log(`   ❌ ${pkg.title}: Error al actualizar`);
        }
    }

    // Limpiar directorio temporal
    const tempDir = path.join(__dirname, 'temp');
    if (fs.existsSync(tempDir)) {
        fs.rmdirSync(tempDir, { recursive: true });
    }

    console.log('\n✨ ¡Proceso completado!');
}

main().catch(console.error);
