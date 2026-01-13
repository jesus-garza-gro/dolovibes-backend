/**
 * ELIMINAR CONTENIDO EN INGLÉS
 * =============================
 * 
 * Elimina todas las versiones EN de packages y experiences
 * para permitir recrearlas como traducciones correctas.
 * 
 * NOTA: Solo elimina contenido EN, no afecta a ES/IT/DE
 * 
 * Uso: node scripts/delete-english-content.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

// Función para preguntar confirmación
function askConfirmation(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
        });
    });
}

async function deleteEnglishPackages() {
    console.log('\n📦 Obteniendo packages en inglés...');
    
    try {
        const response = await axios.get(`${STRAPI_URL}/api/packages`, {
            params: {
                locale: 'en',
                'pagination[pageSize]': 100,
            },
            headers: authHeaders,
        });

        const packages = response.data.data;
        console.log(`   Encontrados: ${packages.length} packages EN`);

        if (packages.length === 0) {
            console.log('   ✓ No hay packages EN para eliminar');
            return 0;
        }

        let deleted = 0;
        for (const pkg of packages) {
            try {
                // DELETE con documentId y locale elimina solo esa localización
                await axios.delete(
                    `${STRAPI_URL}/api/packages/${pkg.documentId}?locale=en`,
                    { headers: authHeaders }
                );
                console.log(`   ✓ Eliminado: ${pkg.title}`);
                deleted++;
            } catch (error) {
                console.log(`   ✗ Error al eliminar ${pkg.title}: ${error.message}`);
            }
        }

        return deleted;
    } catch (error) {
        console.error('❌ Error al obtener packages:', error.message);
        return 0;
    }
}

async function deleteEnglishExperiences() {
    console.log('\n🎯 Obteniendo experiences en inglés...');
    
    try {
        const response = await axios.get(`${STRAPI_URL}/api/experiences`, {
            params: {
                locale: 'en',
                'pagination[pageSize]': 100,
            },
            headers: authHeaders,
        });

        const experiences = response.data.data;
        console.log(`   Encontrados: ${experiences.length} experiences EN`);

        if (experiences.length === 0) {
            console.log('   ✓ No hay experiences EN para eliminar');
            return 0;
        }

        let deleted = 0;
        for (const exp of experiences) {
            try {
                // DELETE con documentId y locale elimina solo esa localización
                await axios.delete(
                    `${STRAPI_URL}/api/experiences/${exp.documentId}?locale=en`,
                    { headers: authHeaders }
                );
                console.log(`   ✓ Eliminado: ${exp.title}`);
                deleted++;
            } catch (error) {
                console.log(`   ✗ Error al eliminar ${exp.title}: ${error.message}`);
            }
        }

        return deleted;
    } catch (error) {
        console.error('❌ Error al obtener experiences:', error.message);
        return 0;
    }
}

async function main() {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║  🗑️  ELIMINAR CONTENIDO EN INGLÉS                  ║');
    console.log('╚════════════════════════════════════════════════════╝');

    if (!STRAPI_API_TOKEN) {
        console.log('\n❌ Error: STRAPI_API_TOKEN no configurado');
        process.exit(1);
    }

    console.log('\n⚠️  Este script eliminará TODO el contenido en inglés:');
    console.log('   - Packages EN');
    console.log('   - Experiences EN');
    console.log('\n   El contenido en ES/IT/DE NO se verá afectado.\n');

    const confirmed = await askConfirmation('¿Continuar? (y/n): ');

    if (!confirmed) {
        console.log('\n❌ Operación cancelada\n');
        process.exit(0);
    }

    console.log('\n🚀 Iniciando eliminación...');

    const deletedPackages = await deleteEnglishPackages();
    const deletedExperiences = await deleteEnglishExperiences();

    console.log('\n' + '═'.repeat(56));
    console.log('📊 RESUMEN');
    console.log('═'.repeat(56));
    console.log(`✓ Packages eliminados: ${deletedPackages}`);
    console.log(`✓ Experiences eliminados: ${deletedExperiences}`);
    console.log('\n✨ Proceso completado!');
    console.log('\n💡 Ahora puedes ejecutar:');
    console.log('   node scripts/seed-english-content.js');
    console.log('   node scripts/seed-experiences-english.js\n');
}

if (require.main === module) {
    main().catch(error => {
        console.error('\n💥 Error fatal:', error.message);
        process.exit(1);
    });
}

module.exports = { deleteEnglishPackages, deleteEnglishExperiences };
