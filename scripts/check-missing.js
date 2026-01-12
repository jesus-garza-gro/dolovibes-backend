const axios = require('axios');
const fs = require('fs');

const STRAPI_URL = 'http://localhost:1337';
const env = fs.readFileSync('.env', 'utf8');
const token = env.match(/STRAPI_API_TOKEN=(.+)/)[1].trim();
const headers = { 'Authorization': `Bearer ${token}` };

async function findMissing() {
    const [es, en] = await Promise.all([
        axios.get(`${STRAPI_URL}/api/packages`, { headers, params: { locale: 'es', 'pagination[pageSize]': 100 }}),
        axios.get(`${STRAPI_URL}/api/packages`, { headers, params: { locale: 'en', 'pagination[pageSize]': 100 }})
    ]);

    const esPackages = es.data.data.filter(p => p.title !== 'Test EN');
    const enSlugs = en.data.data.map(p => p.slug.replace('-en', ''));

    console.log('\n🔍 Paquetes en ES sin traducción EN:\n');
    esPackages.forEach(pkg => {
        if (!enSlugs.includes(pkg.slug)) {
            console.log(`  ❌ ${pkg.title} (${pkg.slug})`);
        }
    });

    const withTranslation = esPackages.filter(pkg => enSlugs.includes(pkg.slug));
    console.log(`\n✅ ${withTranslation.length} paquetes con traducción`);
    console.log(`❌ ${esPackages.length - withTranslation.length} paquetes sin traducción\n`);
}

findMissing().catch(console.error);
