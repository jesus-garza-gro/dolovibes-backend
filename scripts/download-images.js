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

// Archivo de configuración de URLs
const URLS_CONFIG = path.join(__dirname, 'image-urls.json');

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
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        return reject(new Error(`Failed to download: ${response.statusCode}`));
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`   ✅ Descargado: ${path.basename(destPath)}`);
        resolve();
      });
    }).on('error', err => {
      fs.unlinkSync(destPath);
      reject(err);
    });
    
    file.on('error', err => {
      fs.unlinkSync(destPath);
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
  let totalFailed = 0;
  
  // Descargar experiences
  console.log('\n📦 Descargando imágenes de experiences...\n');
  for (const [filename, url] of Object.entries(urlsConfig.experiences || {})) {
    const destPath = path.join(EXPERIENCES_DIR, filename);
    
    if (fs.existsSync(destPath)) {
      console.log(`   ⏭️  Ya existe: ${filename}`);
      totalSkipped++;
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
      totalSkipped++;
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
    Object.keys(urlsConfig.packages || {}).length;
  
  console.log(`📊 Total de imágenes a descargar: ${totalImages}`);
  
  // Descargar todas las imágenes
  const results = await downloadAllImages(urlsConfig);
  
  // Resumen
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  📊 RESUMEN');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  ✅ Descargadas: ${results.totalDownloaded}`);
  console.log(`  ⏭️  Saltadas:    ${results.totalSkipped}`);
  console.log(`  ❌ Fallidas:    ${results.totalFailed}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  if (results.totalFailed > 0) {
    console.log('⚠️  Algunas imágenes fallaron. Verifica las URLs en image-urls.json\n');
    process.exit(1);
  }
  
  if (results.totalDownloaded > 0) {
    console.log('✅ ¡Listo! Ahora puedes ejecutar:');
    console.log('   node scripts/seed-all.js');
    console.log('   node scripts/upload-images.js\n');
  } else {
    console.log('ℹ️  Todas las imágenes ya estaban descargadas\n');
  }
}

main().catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
