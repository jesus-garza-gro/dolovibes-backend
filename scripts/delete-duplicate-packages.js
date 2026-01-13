/**
 * ELIMINAR PACKAGES DUPLICADOS DE IT Y DE
 * ========================================
 * 
 * Elimina packages IT/DE con documentIds que NO existen en español.
 * Estos son duplicados creados incorrectamente como documentos nuevos.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const STRAPI_URL = 'http://localhost:1337';

const envPath = path.join(__dirname, '..', '.env');
let STRAPI_API_TOKEN = '';
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/STRAPI_API_TOKEN=(.+)/);
    if (match) STRAPI_API_TOKEN = match[1].trim();
}

const authHeaders = { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` };

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

async function findAndDeleteDuplicates() {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║  🗑️  ELIMINAR PACKAGES DUPLICADOS IT/DE           ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    // Obtener packages ES
    const esRes = await axios.get(`${STRAPI_URL}/api/packages`, {
        params: { locale: 'es', 'pagination[pageSize]': 100 },
        headers: authHeaders,
    });
    
    const esDocIds = new Set(esRes.data.data.map(p => p.documentId));
    console.log(`✅ ES tiene ${esDocIds.size} packages\n`);

    let toDelete = [];

    // Encontrar duplicados IT
    const itRes = await axios.get(`${STRAPI_URL}/api/packages`, {
        params: { locale: 'it', 'pagination[pageSize]': 100 },
        headers: authHeaders,
    });
    
    itRes.data.data.forEach(pkg => {
        if (!esDocIds.has(pkg.documentId)) {
            toDelete.push({ locale: 'it', ...pkg });
        }
    });

    // Encontrar duplicados DE
    const deRes = await axios.get(`${STRAPI_URL}/api/packages`, {
        params: { locale: 'de', 'pagination[pageSize]': 100 },
        headers: authHeaders,
    });
    
    deRes.data.data.forEach(pkg => {
        if (!esDocIds.has(pkg.documentId)) {
            toDelete.push({ locale: 'de', ...pkg });
        }
    });

    console.log('⚠️  Packages a eliminar (documentId NO existe en ES):\n');
    toDelete.forEach(pkg => {
        console.log(`   [${pkg.locale.toUpperCase()}] ${pkg.title}`);
        console.log(`        documentId: ${pkg.documentId}\n`);
    });

    console.log(`📊 Total a eliminar: ${toDelete.length} packages\n`);

    const confirmed = await askConfirmation('¿Continuar con la eliminación? (y/n): ');

    if (!confirmed) {
        console.log('\n❌ Operación cancelada\n');
        process.exit(0);
    }

    console.log('\n🚀 Eliminando...\n');

    let deleted = 0;
    let errors = 0;

    for (const pkg of toDelete) {
        try {
            await axios.delete(
                `${STRAPI_URL}/api/packages/${pkg.documentId}?locale=${pkg.locale}`,
                { headers: authHeaders }
            );
            console.log(`   ✓ Eliminado [${pkg.locale.toUpperCase()}]: ${pkg.title}`);
            deleted++;
        } catch (error) {
            console.log(`   ✗ Error [${pkg.locale.toUpperCase()}]: ${pkg.title}`);
            errors++;
        }
    }

    console.log('\n' + '═'.repeat(56));
    console.log('📊 RESUMEN');
    console.log('═'.repeat(56));
    console.log(`✓ Eliminados: ${deleted}`);
    console.log(`✗ Errores: ${errors}`);
    console.log('\n✨ Proceso completado!\n');
}

if (require.main === module) {
    if (!STRAPI_API_TOKEN) {
        console.log('\n❌ Error: STRAPI_API_TOKEN no configurado\n');
        process.exit(1);
    }
    findAndDeleteDuplicates().catch(error => {
        console.error('\n💥 Error fatal:', error.message);
        process.exit(1);
    });
}

module.exports = { findAndDeleteDuplicates };
