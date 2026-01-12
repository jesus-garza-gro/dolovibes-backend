/**
 * Script para asignar las MISMAS imágenes del frontend a Strapi
 * Usa las URLs de Unsplash que ya están en packages.js
 * Ejecutar con: node scripts/sync-frontend-images.js
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const https = require('https');

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

// Imágenes del frontend exactas (de packages.js)
const FRONTEND_ITINERARY_IMAGES = {
    'hut-2-hut-dolomitas-clasico': [
        'https://images.unsplash.com/photo-1519681393798-38e43269d877?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&q=80&w=800',
    ],
    'hut-2-hut-alta-via-1': [
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1519681393798-38e43269d877?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800',
    ],
    'hiking-lagos-alpinos': [
        'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    ],
    'city-lights-norte-italia': [
        'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&q=80&w=800',
    ],
    'ski-pull-cortina-classic': [
        'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1565992441121-4367c2967103?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1520208422220-d12a3c588e6c?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1610389051254-64849803c8fd?auto=format&fit=crop&q=80&w=800',
    ],
    'ski-family-val-gardena': [
        'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1565992441121-4367c2967103?auto=format&fit=crop&q=80&w=800',
    ],
    'navidad-mercados-bolzano': [
        'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1512389142860-9c449e58a814?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&q=80&w=800',
    ],
};

async function downloadImage(url, filename) {
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const filepath = path.join(tempDir, filename);

    return new Promise((resolve, reject) => {
        const request = https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                downloadImage(response.headers.location, filename)
                    .then(resolve)
                    .catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }

            const file = fs.createWriteStream(filepath);
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(filepath);
            });
        });

        request.on('error', reject);
        request.setTimeout(30000, () => {
            request.destroy();
            reject(new Error('Timeout'));
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
            timeout: 60000,
        });
        return response.data[0];
    } catch (error) {
        console.error('      Error upload:', error.message);
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
        console.error('Error updating:', error.response?.data || error.message);
        return null;
    }
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log('🚀 Sincronizando imágenes del frontend a Strapi...');
    console.log(`🔑 API Token: ${STRAPI_API_TOKEN ? 'Configurado' : 'NO CONFIGURADO'}\n`);

    const packages = await getPackages();
    console.log(`📦 Encontrados ${packages.length} paquetes\n`);

    const tempDir = path.join(__dirname, 'temp');

    for (const pkg of packages) {
        const slug = pkg.slug;
        const frontendImages = FRONTEND_ITINERARY_IMAGES[slug];

        if (!frontendImages) {
            console.log(`⏭️  ${pkg.title}: No hay mapeo de imágenes frontend`);
            continue;
        }

        if (!pkg.itinerary || pkg.itinerary.length === 0) {
            console.log(`⏭️  ${pkg.title}: Sin itinerario`);
            continue;
        }

        console.log(`\n📸 ${pkg.title}`);
        console.log(`   Días: ${pkg.itinerary.length}`);

        const updatedItinerary = [];

        for (let i = 0; i < pkg.itinerary.length; i++) {
            const day = pkg.itinerary[i];
            const imageUrl = frontendImages[i];

            if (!imageUrl) {
                console.log(`   ⚠️  Día ${day.day}: Sin imagen frontend`);
                updatedItinerary.push({
                    day: day.day,
                    title: day.title,
                    description: day.description,
                });
                continue;
            }

            console.log(`   📷 Día ${day.day}: Descargando...`);

            try {
                const filename = `${slug}_day${day.day}_${Date.now()}.jpg`;
                const filepath = await downloadImage(imageUrl, filename);

                console.log(`   ⬆️  Día ${day.day}: Subiendo...`);
                const uploaded = await uploadImageToStrapi(filepath);

                // Limpiar archivo
                try { fs.unlinkSync(filepath); } catch { }

                if (uploaded) {
                    updatedItinerary.push({
                        day: day.day,
                        title: day.title,
                        description: day.description,
                        image: uploaded.id,
                    });
                    console.log(`   ✅ Día ${day.day}: OK (ID: ${uploaded.id})`);
                } else {
                    updatedItinerary.push({
                        day: day.day,
                        title: day.title,
                        description: day.description,
                    });
                }

                // Pausa entre uploads
                await delay(1000);

            } catch (error) {
                console.log(`   ❌ Día ${day.day}: ${error.message}`);
                updatedItinerary.push({
                    day: day.day,
                    title: day.title,
                    description: day.description,
                });
            }
        }

        console.log(`   💾 Guardando...`);
        const result = await updatePackageItinerary(pkg.documentId, updatedItinerary);

        if (result) {
            console.log(`   ✅ ${pkg.title}: Actualizado`);
        } else {
            console.log(`   ❌ ${pkg.title}: Error`);
        }

        // Pausa entre paquetes
        await delay(2000);
    }

    // Limpiar temp
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true });
    }

    console.log('\n✨ ¡Completado!');
}

main().catch(console.error);
