/**
 * Script para Subir Imágenes a Strapi
 * 
 * Sube automáticamente las imágenes descargadas desde downloads/
 * y las vincula con las experiencias y paquetes correspondientes.
 * 
 * USO:
 * 1. Asegurar que Strapi esté corriendo: npm run develop
 * 2. Ejecutar: node scripts/upload-images.js
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

// Leer .env manualmente
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && !key.startsWith('#')) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const STRAPI_URL = envVars.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = envVars.STRAPI_API_TOKEN;

const DOWNLOADS_DIR = path.join(__dirname, '../downloads');

// Cliente HTTP con token
const strapiClient = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`
  }
});

// ============================================
// FUNCIONES HELPER
// ============================================

/**
 * Sube un archivo a Strapi Media Library
 */
async function uploadFile(filePath) {
  const formData = new FormData();
  const filename = path.basename(filePath);
  
  formData.append('files', fs.createReadStream(filePath), {
    filename: filename,
    contentType: 'image/jpeg'
  });
  
  const response = await axios.post(
    `${STRAPI_URL}/api/upload`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      }
    }
  );
  
  return response.data[0]; // Retorna el primer archivo subido
}

/**
 * Obtiene una experiencia por slug
 */
async function getExperienceBySlug(slug) {
  const response = await strapiClient.get('/api/experiences', {
    params: {
      'filters[slug][$eq]': slug,
      locale: 'es'
    }
  });
  return response.data.data[0];
}

/**
 * Obtiene un paquete por slug
 */
async function getPackageBySlug(slug) {
  const response = await strapiClient.get('/api/packages', {
    params: {
      'filters[slug][$eq]': slug,
      locale: 'es'
    }
  });
  return response.data.data[0];
}

/**
 * Actualiza una experiencia con imágenes
 */
async function updateExperience(documentId, thumbnailId, heroImageId) {
  const response = await strapiClient.put(
    `/api/experiences/${documentId}`,
    {
      data: {
        thumbnail: thumbnailId,
        heroImage: heroImageId
      }
    },
    {
      params: { locale: 'es' }
    }
  );
  return response.data;
}

/**
 * Actualiza un paquete con imágenes
 */
async function updatePackage(documentId, thumbnailId, heroImageId) {
  const response = await strapiClient.put(
    `/api/packages/${documentId}`,
    {
      data: {
        thumbnail: thumbnailId,
        heroImage: heroImageId
      }
    },
    {
      params: { locale: 'es' }
    }
  );
  return response.data;
}

// ============================================
// MAPEO DE ARCHIVOS
// ============================================

const experienceImages = [
  { slug: 'hut-2-hut', files: ['hut-2-hut-thumbnail.jpg', 'hut-2-hut-hero.jpg'] },
  { slug: 'hiking', files: ['hiking-thumbnail.jpg', 'hiking-hero.jpg'] },
  { slug: 'city-lights', files: ['city-lights-thumbnail.jpg', 'city-lights-hero.jpg'] },
  { slug: 'ski-pull', files: ['ski-pull-thumbnail.jpg', 'ski-pull-hero.jpg'] },
  { slug: 'ski-family', files: ['ski-family-thumbnail.jpg', 'ski-family-hero.jpg'] },
  { slug: 'navidad', files: ['navidad-thumbnail.jpg', 'navidad-hero.jpg'] }
];

const packageImages = [
  { slug: 'hut-2-hut-dolomitas-clasico', files: ['hut-2-hut---dolomitas-clasico-thumbnail.jpg', 'hut-2-hut---dolomitas-clasico-hero.jpg'] },
  { slug: 'hut-2-hut-alta-via-1', files: ['hut-2-hut---alta-via-1-thumbnail.jpg', 'hut-2-hut---alta-via-1-hero.jpg'] },
  { slug: 'hiking-lagos-alpinos', files: ['hiking---lagos-alpinos-thumbnail.jpg', 'hiking---lagos-alpinos-hero.jpg'] },
  { slug: 'city-lights-norte-de-italia', files: ['city-lights---norte-de-italia-thumbnail.jpg', 'city-lights---norte-de-italia-hero.jpg'] },
  { slug: 'ski-pull-cortina-classic', files: ['ski-pull---cortina-classic-thumbnail.jpg', 'ski-pull---cortina-classic-hero.jpg'] },
  { slug: 'ski-family-val-gardena', files: ['ski-family---val-gardena-thumbnail.jpg', 'ski-family---val-gardena-hero.jpg'] },
  { slug: 'ski-pull-sella-ronda', files: ['ski-pull---sella-ronda-thumbnail.jpg', 'ski-pull---sella-ronda-hero.jpg'] },
  { slug: 'ski-family-kronplatz', files: ['ski-family---kronplatz-thumbnail.jpg', 'ski-family---kronplatz-hero.jpg'] },
  { slug: 'navidad-mercados-de-bolzano', files: ['navidad---mercados-de-bolzano-thumbnail.jpg', 'navidad---mercados-de-bolzano-hero.jpg'] },
  { slug: 'navidad-val-pusteria', files: ['navidad---val-pusteria-thumbnail.jpg', 'navidad---val-pusteria-hero.jpg'] }
];

// ============================================
// PROCESO DE SUBIDA
// ============================================

async function uploadAllImages() {
  console.log('═══════════════════════════════════════════════');
  console.log('  📤 SUBIENDO IMÁGENES A STRAPI');
  console.log('═══════════════════════════════════════════════\n');
  console.log(`🔑 API Token: ${STRAPI_API_TOKEN ? 'Configurado' : 'NO CONFIGURADO'}`);
  console.log(`🌐 URL: ${STRAPI_URL}\n`);
  
  if (!STRAPI_API_TOKEN) {
    console.error('❌ ERROR: STRAPI_API_TOKEN no está configurado en .env');
    process.exit(1);
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  // Subir imágenes de experiencias
  console.log('📦 Procesando Experiencias...\n');
  for (const exp of experienceImages) {
    try {
      // Obtener la experiencia
      const experience = await getExperienceBySlug(exp.slug);
      if (!experience) {
        console.error(`  ❌ Experiencia no encontrada: ${exp.slug}`);
        errorCount += 2;
        continue;
      }
      
      // Subir thumbnail
      const thumbnailPath = path.join(DOWNLOADS_DIR, 'experiences', exp.files[0]);
      if (!fs.existsSync(thumbnailPath)) {
        console.error(`  ❌ Archivo no existe: ${exp.files[0]}`);
        errorCount++;
      } else {
        const thumbnailFile = await uploadFile(thumbnailPath);
        console.log(`  ✅ Subido thumbnail: ${exp.files[0]}`);
        successCount++;
        
        // Subir hero image
        const heroPath = path.join(DOWNLOADS_DIR, 'experiences', exp.files[1]);
        const heroFile = await uploadFile(heroPath);
        console.log(`  ✅ Subido hero: ${exp.files[1]}`);
        successCount++;
        
        // Vincular con la experiencia
        await updateExperience(experience.documentId, thumbnailFile.id, heroFile.id);
        console.log(`  🔗 Vinculado con experiencia: ${exp.slug}\n`);
      }
      
      // Pausa para no saturar
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`  ❌ Error en ${exp.slug}:`, error.response?.data?.error || error.message || error);
      errorCount += 2;
    }
  }
  
  // Subir imágenes de paquetes
  console.log('\n🎒 Procesando Paquetes...\n');
  for (const pkg of packageImages) {
    try {
      // Obtener el paquete
      const packageData = await getPackageBySlug(pkg.slug);
      if (!packageData) {
        console.error(`  ❌ Paquete no encontrado: ${pkg.slug}`);
        errorCount += 2;
        continue;
      }
      
      // Subir thumbnail
      const thumbnailPath = path.join(DOWNLOADS_DIR, 'packages', pkg.files[0]);
      if (!fs.existsSync(thumbnailPath)) {
        console.error(`  ❌ Archivo no existe: ${pkg.files[0]}`);
        errorCount++;
      } else {
        const thumbnailFile = await uploadFile(thumbnailPath);
        console.log(`  ✅ Subido thumbnail: ${pkg.files[0]}`);
        successCount++;
        
        // Subir hero image
        const heroPath = path.join(DOWNLOADS_DIR, 'packages', pkg.files[1]);
        const heroFile = await uploadFile(heroPath);
        console.log(`  ✅ Subido hero: ${pkg.files[1]}`);
        successCount++;
        
        // Vincular con el paquete
        await updatePackage(packageData.documentId, thumbnailFile.id, heroFile.id);
        console.log(`  🔗 Vinculado con paquete: ${pkg.slug}\n`);
      }
      
      // Pausa
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`  ❌ Error en ${pkg.slug}:`, error.response?.data?.error || error.message || error);
      errorCount += 2;
    }
  }
  
  console.log('\n═══════════════════════════════════════════════');
  console.log('  ✅ SUBIDA COMPLETADA');
  console.log('═══════════════════════════════════════════════\n');
  console.log(`✅ Exitosas: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}\n`);
  console.log('📝 Próximos pasos:');
  console.log('1. Verificar en Strapi Admin que las imágenes estén vinculadas');
  console.log('2. Habilitar permisos públicos en Settings > Roles > Public');
  console.log('3. Probar el frontend con las imágenes\n');
}

// Ejecutar
uploadAllImages().catch(error => {
  console.error('\n❌ Error fatal:', error.message);
  process.exit(1);
});
