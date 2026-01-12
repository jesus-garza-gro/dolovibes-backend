/**
 * Script para Descargar Imágenes de Unsplash
 * 
 * Descarga todas las imágenes referenciadas en migrate-data.js
 * y las organiza en carpetas por tipo.
 * 
 * USO:
 * node scripts/download-images.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Crear directorios si no existen
const DOWNLOAD_DIR = path.join(__dirname, '../downloads');
const EXPERIENCES_DIR = path.join(DOWNLOAD_DIR, 'experiences');
const PACKAGES_DIR = path.join(DOWNLOAD_DIR, 'packages');

[DOWNLOAD_DIR, EXPERIENCES_DIR, PACKAGES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Función para descargar imagen
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Función para sanitizar nombres de archivo
function sanitizeFilename(name) {
  return name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 50);
}

// ============================================
// EXPERIENCIAS
// ============================================
const experiences = [
  {
    name: "Hut 2 Hut",
    thumbnailUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1920"
  },
  {
    name: "Hiking",
    thumbnailUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1920"
  },
  {
    name: "City Lights",
    thumbnailUrl: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&q=80&w=1920"
  },
  {
    name: "Ski Pull",
    thumbnailUrl: "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=1920"
  },
  {
    name: "Ski Family",
    thumbnailUrl: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=1920"
  },
  {
    name: "Navidad",
    thumbnailUrl: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=1920"
  }
];

// ============================================
// PAQUETES
// ============================================
const packages = [
  {
    name: "Hut 2 Hut - Dolomitas Clasico",
    thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1920"
  },
  {
    name: "Hut 2 Hut - Alta Via 1",
    thumbnailUrl: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&q=80&w=1920"
  },
  {
    name: "Hiking - Lagos Alpinos",
    thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1920"
  },
  {
    name: "City Lights - Norte de Italia",
    thumbnailUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=1920"
  },
  {
    name: "Ski Pull - Cortina Classic",
    thumbnailUrl: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=1920"
  },
  {
    name: "Ski Family - Val Gardena",
    thumbnailUrl: "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=1920"
  },
  {
    name: "Ski Pull - Sella Ronda",
    thumbnailUrl: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&q=80&w=1920"
  },
  {
    name: "Ski Family - Kronplatz",
    thumbnailUrl: "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=1920"
  },
  {
    name: "Navidad - Mercados de Bolzano",
    thumbnailUrl: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=1920"
  },
  {
    name: "Navidad - Val Pusteria",
    thumbnailUrl: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&q=80&w=1920"
  }
];

// ============================================
// PROCESO DE DESCARGA
// ============================================
async function downloadAll() {
  console.log('═══════════════════════════════════════════════');
  console.log('  📥 DESCARGANDO IMÁGENES DE UNSPLASH');
  console.log('═══════════════════════════════════════════════\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  // Descargar Experiencias
  console.log('📦 Descargando Experiencias...\n');
  for (const exp of experiences) {
    const slug = sanitizeFilename(exp.name);
    
    try {
      // Thumbnail
      const thumbnailPath = path.join(EXPERIENCES_DIR, `${slug}-thumbnail.jpg`);
      await downloadImage(exp.thumbnailUrl, thumbnailPath);
      console.log(`  ✅ ${exp.name} - Thumbnail`);
      successCount++;
      
      // Hero
      const heroPath = path.join(EXPERIENCES_DIR, `${slug}-hero.jpg`);
      await downloadImage(exp.heroImageUrl, heroPath);
      console.log(`  ✅ ${exp.name} - Hero`);
      successCount++;
      
      // Pequeña pausa para no saturar el servidor
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`  ❌ Error en ${exp.name}:`, error.message);
      errorCount += 2;
    }
  }
  
  // Descargar Paquetes
  console.log('\n🎒 Descargando Paquetes...\n');
  for (const pkg of packages) {
    const slug = sanitizeFilename(pkg.name);
    
    try {
      // Thumbnail
      const thumbnailPath = path.join(PACKAGES_DIR, `${slug}-thumbnail.jpg`);
      await downloadImage(pkg.thumbnailUrl, thumbnailPath);
      console.log(`  ✅ ${pkg.name} - Thumbnail`);
      successCount++;
      
      // Hero
      const heroPath = path.join(PACKAGES_DIR, `${slug}-hero.jpg`);
      await downloadImage(pkg.heroImageUrl, heroPath);
      console.log(`  ✅ ${pkg.name} - Hero`);
      successCount++;
      
      // Pequeña pausa
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`  ❌ Error en ${pkg.name}:`, error.message);
      errorCount += 2;
    }
  }
  
  console.log('\n═══════════════════════════════════════════════');
  console.log('  ✅ DESCARGA COMPLETADA');
  console.log('═══════════════════════════════════════════════\n');
  console.log(`✅ Exitosas: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`\n📁 Archivos guardados en: ${DOWNLOAD_DIR}\n`);
  console.log('📝 Próximos pasos:');
  console.log('1. Revisar las imágenes en downloads/');
  console.log('2. Subir a Strapi Admin manualmente');
  console.log('3. O usar imágenes propias más relevantes\n');
}

// Ejecutar
downloadAll().catch(console.error);
