/**
 * Script para Descargar Imágenes desde URLs
 * 
 * Descarga automáticamente las imágenes necesarias para el proyecto
 * y las guarda en la estructura correcta de downloads/
 * 
 * CONFIGURACIÓN:
 * Editar image-urls.json con las URLs de tus imágenes
 * 
 * USO:
 * node scripts/download-images.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Directorios
const DOWNLOADS_DIR = path.join(__dirname, '../downloads');
const EXPERIENCES_DIR = path.join(DOWNLOADS_DIR, 'experiences');
const PACKAGES_DIR = path.join(DOWNLOADS_DIR, 'packages');

// URLs de Unsplash para las imágenes (placeholder - reemplazar con URLs finales)
const IMAGE_URLS = {
  experiences: {
    'city-lights-hero.jpg': 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1920&q=80',
    'city-lights-thumbnail.jpg': 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&q=80',
    'hiking-hero.jpg': 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&q=80',
    'hiking-thumbnail.jpg': 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80',
    'hut-2-hut-hero.jpg': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    'hut-2-hut-thumbnail.jpg': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    'navidad-hero.jpg': 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1920&q=80',
    'navidad-thumbnail.jpg': 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&q=80',
    'ski-family-hero.jpg': 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=1920&q=80',
    'ski-family-thumbnail.jpg': 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=400&q=80',
    'ski-pull-hero.jpg': 'https://images.unsplash.com/photo-1498146831523-fbe41acdc5ad?w=1920&q=80',
    'ski-pull-thumbnail.jpg': 'https://images.unsplash.com/photo-1498146831523-fbe41acdc5ad?w=400&q=80',
  },
  packages: {
    'city-lights-norte-italia-hero.jpg': 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1920&q=80',
    'city-lights-norte-italia-thumbnail.jpg': 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=80',
    'hiking---lagos-alpinos-hero.jpg': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    'hiking---lagos-alpinos-thumbnail.jpg': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
    'hut-2-hut---alta-via-1-hero.jpg': 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
    'hut-2-hut---alta-via-1-thumbnail.jpg': 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&q=80',
    'hut-2-hut---dolomitas-clasico-hero.jpg': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    'hut-2-hut---dolomitas-clasico-thumbnail.jpg': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    'navidad---val-pusteria-hero.jpg': 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=1920&q=80',
    'navidad---val-pusteria-thumbnail.jpg': 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&q=80',
    'navidad-mercados-bolzano-hero.jpg': 'https://images.unsplash.com/photo-1544967082-d9d25d867eeb?w=1920&q=80',
    'navidad-mercados-bolzano-thumbnail.jpg': 'https://images.unsplash.com/photo-1544967082-d9d25d867eeb?w=400&q=80',
    'ski-family---kronplatz-hero.jpg': 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=1920&q=80',
    'ski-family---kronplatz-thumbnail.jpg': 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=400&q=80',
    'ski-family---val-gardena-hero.jpg': 'https://images.unsplash.com/photo-1483381719261-36b88ac7c9da?w=1920&q=80',
    'ski-family---val-gardena-thumbnail.jpg': 'https://images.unsplash.com/photo-1483381719261-36b88ac7c9da?w=400&q=80',
    'ski-pull---cortina-classic-hero.jpg': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1920&q=80',
    'ski-pull---cortina-classic-thumbnail.jpg': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&q=80',
    'ski-pull---sella-ronda-hero.jpg': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1920&q=80',
    'ski-pull---sella-ronda-thumbnail.jpg': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=80',
  }
};

// ============================================
// FUNCIONES HELPER
// ============================================

/**
 * Descarga un archivo desde una URL
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    console.log(`   Descargando: ${path.basename(destPath)}`);
    
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const file = fs.createWriteStream(destPath);
    
    protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    }, response => {
      // Seguir redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(destPath);
        return downloadFile(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
      }
      
   Obtiene la configuración de URLs (desde archivo o hardcoded)
 */
function getImageUrls() {
  const customConfig = path.join(__dirname, 'image-urls.json');
  
  // Si existe configuración personalizada, usarla
  if (fs.existsSync(customConfig)) {
    console.log('ℹ️  Usando configuración personalizada: image-urls.json\n');
    return JSON.parse(fs.readFileSync(customConfig, 'utf8'));
  }
  
  // Usar URLs de Unsplash por defecto
  console.log('ℹ️  Usando URLs de Unsplash por defecto\n');
  console.log('💡 Tip: Crea scripts/image-urls.json para usar URLs personalizadas\n');
  return IMAGE_URLS
      reject(err);
    });
  });
}

/**
 * Crea directorios si no existen
 */
function ensureDirectories() {
  [EXPERIENCES_DIR, PACKAGES_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

/**
 * Carga la configuración de URLs
 */
function loadUrlsConfig() {
  if (!fs.existsSync(URLS_CONFIG)) {
    console.error(`❌ Error: No se encontró ${URLS_CONFIG}`);
    console.log('\n📝 Crea el archivo image-urls.json con este formato:\n');
    console.log(JSON.stringify({
      experiences: {
        "city-lights-hero.jpg": "https://ejemplo.com/imagen1.jpg",
        "city-lights-thumbnail.jpg": "https://ejemplo.com/imagen2.jpg"
      },
      packages: {
        "city-lights-norte-italia-hero.jpg": "https://ejemplo.com/imagen3.jpg"
      }
    }, null, 2));
    console.log('\n');
    process.exit(1);
  }
  
  return JSON.parse(fs.readFileSync(URLS_CONFIG, 'utf8'));
}

/**
 * Descarga todas las imágenes
 */
async function downloadAllImages(urlsConfig) {
  let totalDownloaded = 0;
  let totalSkipped = 0;
  let totalFailed = 0; desde URLs
 */
async function downloadAllImages(imageUrls
  console.log('\n📦 Descargando imágenes de experiences...\n');
  for (const [filename, url] of Object.entries(urlsConfig.experiences || {})) {
    const destPath = path.join(EXPERIENCES_DIR, filename);
    
    if (fs.existsSync(destPath)) {
      console.l📦 Descargando imágenes de experiences...\n');
  for (const [filename, url] of Object.entries(imageUrls
      continue;
    }
    
    try {
      await downloadFile(url, destPath);
      totalDownloaded++;
    } catch (error) {
      console.error(`   ❌ Error descargando ${filename}: ${error.message}`);
      totalFailed++;
    }
  }
  
  // Descargar packages
  console.log('\n📦 Descargando imágenes de packages...\n');
  for (const [filename, url] of Object.entries(urlsConfig.packages || {})) {
    const destPath = path.join(PACKAGES_DIR, filename);
    
    if (fs.existsSync(destPath)) {
      console.log(`   ⏭️  Ya existe: ${filename}`);
      totalSkipped++;imageUrls
      continue;
    }
    
    try {
      await downloadFile(url, destPath);
      totalDownloaded++;
    } catch (error) {
      console.error(`   ❌ Error descargando ${filename}: ${error.message}`);
      totalFailed++;
    }
  }
  
  return { totalDownloaded, totalSkipped, totalFailed };
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  📥 DESCARGADOR DE IMÁGENES - Dolovibes');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Verificar y crear directorios
  ensureDirectories();
  
  // Cargar configuración
  const urlsConfig = loadUrlsConfig();
  
  const totalImages = 
    Object.keys(urlsConfig.experiences || {}).length +
    OObtener URLs de imágenes
  const imageUrls = getImageUrls();
  
  const totalImages = 
    Object.keys(imageUrls.experiences || {}).length +
    Object.keys(imageUrlswnloadAllImages(urlsConfig);
  
  // Resumen: ${totalImages}`);
  console.log('🌐 Fuente: Unsplash (imágenes de placeholder)\n');
  console.log('─'.repeat(60));
  
  // Descargar todas las imágenes
  const results = await downloadAllImages(imageUrls══════════════════════════');
  console.log(`  ✅ Descargadas: ${results.totalDownloaded}`);
  console.log(`  ⏭️  Saltadas:    ${results.totalSkipped}`);
  console.log(`  ❌ Fallidas:    ${results.totalFailed}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  if (results.totalFailed > 0) {
    console.log('⚠️  Algunas imágenes fallaron. Verifica las URLs en image-urls.json\n');
    process.exit(1);
  }
  tu conexión a internet\n');
    process.exit(1);
  }
  
  if (results.totalDownloaded > 0) {
    console.log('✅ ¡Imágenes descargadas! Próximos pasos:');
    console.log('   1. node scripts/seed-all.js');
    console.log('   2. node scripts/upload-images.js\n');
    console.log('💡 Nota: Estas son imágenes de placeholder de Unsplash.');
    console.log('   Para usar tus propias imágenes, crea scripts/image-urls.json
}

main().catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
