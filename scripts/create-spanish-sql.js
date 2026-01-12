/**
 * Script para crear contenido en español mediante SQL directo
 */

const { execSync } = require('child_process');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '.tmp', 'data.db');

function runSQL(sql) {
  try {
    const result = execSync(`sqlite3 "${DB_PATH}" "${sql}"`, { encoding: 'utf8' });
    return result.trim();
  } catch (e) {
    console.error('SQL Error:', e.message);
    return null;
  }
}

console.log('═══════════════════════════════════════════════');
console.log('  🌐 CREANDO CONTENIDO EN ESPAÑOL (SQL)');
console.log('═══════════════════════════════════════════════\n');

// 1. Verificar si ya existe contenido en español
const heroES = runSQL("SELECT COUNT(*) FROM hero_sections WHERE locale='es';");
const siteES = runSQL("SELECT COUNT(*) FROM site_settings WHERE locale='es';");

console.log(`📊 Estado actual:`);
console.log(`   Hero Section ES: ${heroES === '0' ? 'No existe' : 'Ya existe'}`);
console.log(`   Site Settings ES: ${siteES === '0' ? 'No existe' : 'Ya existe'}\n`);

// 2. Crear Hero Section en español si no existe
if (heroES === '0') {
  console.log('📌 Creando Hero Section en español...');
  
  // Obtener el document_id del hero en inglés
  const docId = runSQL("SELECT document_id FROM hero_sections WHERE locale='en' LIMIT 1;");
  
  if (docId) {
    const now = Date.now();
    // Columnas correctas: title, title_highlight, badge, subtitle
    const sql = `INSERT INTO hero_sections (document_id, title, title_highlight, badge, subtitle, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) 
                 VALUES ('${docId}', 'Vive experiencias', 'inolvidables', 'DESCUBRE TU PRÓXIMA AVENTURA', 'Explora los Dolomitas con guías expertos', ${now}, ${now}, ${now}, 1, 1, 'es');`;
    runSQL(sql);
    console.log('  ✅ Hero Section creado en español');
  } else {
    console.log('  ❌ No se encontró document_id de Hero Section');
  }
} else {
  console.log('📌 Hero Section en español ya existe');
}

// 3. Crear Site Settings en español si no existe
if (siteES === '0') {
  console.log('📌 Creando Site Settings en español...');
  
  // Obtener el document_id del site settings en inglés
  const docId = runSQL("SELECT document_id FROM site_settings WHERE locale='en' LIMIT 1;");
  
  if (docId) {
    const now = Date.now();
    // Columnas correctas: site_name, location, phone, email, whatsapp_number, instagram_url, facebook_url, tiktok_url, footer_description, copyright_text, default_currency
    const sql = `INSERT INTO site_settings (document_id, site_name, location, phone, email, whatsapp_number, instagram_url, facebook_url, tiktok_url, footer_description, copyright_text, default_currency, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) 
                 VALUES ('${docId}', 'Dolovibes', 'Monterrey, México', '+52 81 1234 5678', 'info@dolovibes.com', '+521234567890', 'https://instagram.com/dolovibes', 'https://facebook.com/dolovibes', 'https://tiktok.com/@dolovibes', 'Experiencias únicas en los Dolomitas italianos.', '© 2025 Dolovibes. Todos los derechos reservados.', 'MXN', ${now}, ${now}, ${now}, 1, 1, 'es');`;
    runSQL(sql);
    console.log('  ✅ Site Settings creado en español');
  } else {
    console.log('  ❌ No se encontró document_id de Site Settings');
  }
} else {
  console.log('📌 Site Settings en español ya existe');
}

// 4. Verificar About Page
const aboutES = runSQL("SELECT COUNT(*) FROM about_pages WHERE locale='es';");
console.log(`\n📊 About Page ES: ${aboutES === '0' ? 'No existe' : 'Ya existe'}`);

if (aboutES === '0') {
  console.log('📌 Creando About Page en español...');
  
  const docId = runSQL("SELECT document_id FROM about_pages WHERE locale='en' LIMIT 1;");
  
  if (docId) {
    const now = Date.now();
    // Columnas correctas: page_title, photo_alt
    const sql = `INSERT INTO about_pages (document_id, page_title, photo_alt, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) 
                 VALUES ('${docId}', 'Sobre Nosotros', 'Equipo Dolovibes', ${now}, ${now}, ${now}, 1, 1, 'es');`;
    runSQL(sql);
    console.log('  ✅ About Page creado en español');
  } else {
    console.log('  ⚠️ About Page no existe en inglés, creando nuevo...');
    const newDocId = 'about' + Date.now().toString(36);
    const now = Date.now();
    const sql = `INSERT INTO about_pages (document_id, page_title, photo_alt, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) 
                 VALUES ('${newDocId}', 'Sobre Nosotros', 'Equipo Dolovibes', ${now}, ${now}, ${now}, 1, 1, 'es');`;
    runSQL(sql);
    console.log('  ✅ About Page creado en español');
  }
}

console.log('\n═══════════════════════════════════════════════');
console.log('  ✅ PROCESO COMPLETADO');
console.log('═══════════════════════════════════════════════\n');

// Verificación final
console.log('📊 Verificación final:');
console.log(`   Hero Section ES: ${runSQL("SELECT COUNT(*) FROM hero_sections WHERE locale='es';")}`);
console.log(`   Site Settings ES: ${runSQL("SELECT COUNT(*) FROM site_settings WHERE locale='es';")}`);
console.log(`   About Page ES: ${runSQL("SELECT COUNT(*) FROM about_pages WHERE locale='es';")}`);
