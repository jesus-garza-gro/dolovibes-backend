/**
 * Script para asignar imágenes EXISTENTES a los días del itinerario
 * Reusa las imágenes ya subidas en Strapi
 * Ejecutar con: node scripts/assign-existing-images.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

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

async function getUploadedFiles() {
    try {
        const response = await axios.get(`${STRAPI_URL}/api/upload/files`, {
            headers: authHeaders,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching files:', error.message);
        return [];
    }
}

async function getPackages() {
    try {
        const response = await axios.get(`${STRAPI_URL}/api/packages`, {
            params: {
                'populate[itinerary]': true,
                'populate[heroImage]': true,
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
    console.log('🚀 Asignando imágenes existentes a itinerarios...');
    console.log(`🔑 API Token: ${STRAPI_API_TOKEN ? 'Configurado' : 'NO CONFIGURADO'}\n`);

    // Obtener archivos ya subidos
    const files = await getUploadedFiles();
    console.log(`📂 Encontrados ${files.length} archivos en media library\n`);

    // Filtrar solo imágenes hero (las usaremos para los itinerarios)
    const heroImages = files.filter(f => f.name.includes('hero') && f.mime?.startsWith('image'));
    console.log(`🖼️  Imágenes hero disponibles: ${heroImages.length}\n`);

    // Obtener paquetes
    const packages = await getPackages();
    console.log(`📦 Encontrados ${packages.length} paquetes\n`);

    for (const pkg of packages) {
        if (!pkg.itinerary || pkg.itinerary.length === 0) {
            console.log(`⏭️  ${pkg.title}: Sin itinerario, saltando...`);
            continue;
        }

        console.log(`\n📸 Procesando: ${pkg.title}`);
        console.log(`   Días de itinerario: ${pkg.itinerary.length}`);

        // Buscar imágenes que coincidan con el slug del paquete
        const slugBase = pkg.slug.replace(/-/g, '_');
        let packageImages = files.filter(f =>
            f.name.includes(slugBase) &&
            f.mime?.startsWith('image') &&
            !f.name.includes('thumbnail') &&
            !f.name.includes('small_') &&
            !f.name.includes('medium_') &&
            !f.name.includes('large_')
        );

        // Si no hay imágenes específicas, usar las hero generales
        if (packageImages.length === 0) {
            packageImages = heroImages.slice(0, pkg.itinerary.length);
        }

        if (packageImages.length === 0) {
            console.log(`   ⚠️  No hay imágenes disponibles para este paquete`);
            continue;
        }

        console.log(`   🖼️  Imágenes encontradas: ${packageImages.length}`);

        const updatedItinerary = pkg.itinerary.map((day, index) => {
            const imageToUse = packageImages[index % packageImages.length];
            return {
                day: day.day,
                title: day.title,
                description: day.description,
                image: imageToUse.id,
            };
        });

        console.log(`   💾 Guardando cambios...`);
        const result = await updatePackageItinerary(pkg.documentId, updatedItinerary);

        if (result) {
            console.log(`   ✅ ${pkg.title}: Actualizado exitosamente`);
        } else {
            console.log(`   ❌ ${pkg.title}: Error al actualizar`);
        }

        // Pausa pequeña entre paquetes
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✨ ¡Proceso completado!');
}

main().catch(console.error);
