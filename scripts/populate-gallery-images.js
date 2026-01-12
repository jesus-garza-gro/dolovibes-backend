/**
 * Poblar galería de paquetes con imágenes
 * Usa las mismas imágenes que el itinerario para cada paquete
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

async function getPackages() {
    const response = await axios.get(`${STRAPI_URL}/api/packages`, {
        params: {
            'populate[gallery][populate]': 'image',
            'populate[itinerary][populate]': 'image',
            'pagination[pageSize]': 100,
        },
        headers: authHeaders,
    });
    return response.data.data;
}

async function updatePackageGallery(documentId, gallery) {
    const response = await axios.put(
        `${STRAPI_URL}/api/packages/${documentId}`,
        { data: { gallery } },
        { headers: authHeaders }
    );
    return response.data;
}

async function main() {
    console.log('🖼️  Poblando galería de paquetes con imágenes...\n');

    const packages = await getPackages();
    console.log(`📦 Encontrados ${packages.length} paquetes\n`);

    for (const pkg of packages) {
        console.log(`📸 ${pkg.title}`);

        if (!pkg.gallery || pkg.gallery.length === 0) {
            console.log(`   ⏭️  Sin galería definida, saltando`);
            continue;
        }

        if (!pkg.itinerary || pkg.itinerary.length === 0) {
            console.log(`   ⏭️  Sin itinerario para usar como fuente, saltando`);
            continue;
        }

        // Verificar si la galería ya tiene imágenes
        const hasImages = pkg.gallery.some(g => g.image?.id);
        if (hasImages) {
            console.log(`   ✅ Ya tiene imágenes, saltando`);
            continue;
        }

        // Obtener IDs de imágenes del itinerario
        const itineraryImages = pkg.itinerary
            .filter(day => day.image?.id)
            .map(day => day.image.id);

        if (itineraryImages.length === 0) {
            console.log(`   ⚠️  El itinerario no tiene imágenes, saltando`);
            continue;
        }

        console.log(`   📷 Usando ${itineraryImages.length} imágenes del itinerario`);

        // Actualizar galería con imágenes
        const updatedGallery = pkg.gallery.map((item, index) => ({
            caption: item.caption,
            image: itineraryImages[index % itineraryImages.length], // Ciclar si hay más items que imágenes
        }));

        try {
            await updatePackageGallery(pkg.documentId, updatedGallery);
            console.log(`   ✅ Galería actualizada con ${updatedGallery.length} items`);
        } catch (error) {
            console.log(`   ❌ Error: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    console.log('\n✨ Listo!');
}

main().catch(console.error);
