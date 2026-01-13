/**
 * ELIMINAR EXPERIENCES IT Y DE CON DOCUMENTIDS INCORRECTOS
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

async function deleteExperiences() {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║  🗑️  ELIMINAR EXPERIENCES IT/DE                    ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    // Obtener ES documentIds
    const esRes = await axios.get(`${STRAPI_URL}/api/experiences`, {
        params: { locale: 'es', 'pagination[pageSize]': 100 },
        headers: authHeaders,
    });
    
    const esDocIds = new Set(esRes.data.data.map(e => e.documentId));
    console.log(`✅ ES tiene ${esDocIds.size} experiences\n`);

    let toDelete = [];

    // Encontrar IT con documentIds incorrectos
    const itRes = await axios.get(`${STRAPI_URL}/api/experiences`, {
        params: { locale: 'it', 'pagination[pageSize]': 100 },
        headers: authHeaders,
    });
    
    itRes.data.data.forEach(exp => {
        if (!esDocIds.has(exp.documentId)) {
            toDelete.push({ locale: 'it', ...exp });
        }
    });

    // Encontrar DE con documentIds incorrectos
    const deRes = await axios.get(`${STRAPI_URL}/api/experiences`, {
        params: { locale: 'de', 'pagination[pageSize]': 100 },
        headers: authHeaders,
    });
    
    deRes.data.data.forEach(exp => {
        if (!esDocIds.has(exp.documentId)) {
            toDelete.push({ locale: 'de', ...exp });
        }
    });

    console.log('⚠️  Experiences a eliminar:\n');
    toDelete.forEach(exp => {
        console.log(`   [${exp.locale.toUpperCase()}] ${exp.title} (${exp.slug})`);
    });

    console.log(`\n📊 Total: ${toDelete.length} experiences\n`);

    const confirmed = await askConfirmation('¿Continuar? (y/n): ');

    if (!confirmed) {
        console.log('\n❌ Cancelado\n');
        process.exit(0);
    }

    let deleted = 0;
    for (const exp of toDelete) {
        try {
            await axios.delete(
                `${STRAPI_URL}/api/experiences/${exp.documentId}?locale=${exp.locale}`,
                { headers: authHeaders }
            );
            console.log(`   ✓ ${exp.locale.toUpperCase()}: ${exp.title}`);
            deleted++;
        } catch (error) {
            console.log(`   ✗ Error: ${exp.title}`);
        }
    }

    console.log(`\n✅ Eliminados: ${deleted}\n`);
}

if (require.main === module) {
    if (!STRAPI_API_TOKEN) {
        console.log('\n❌ Error: STRAPI_API_TOKEN no configurado\n');
        process.exit(1);
    }
    deleteExperiences().catch(console.error);
}
