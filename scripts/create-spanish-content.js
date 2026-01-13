/**
 * Script para crear contenido en español para Single Types
 * 
 * Copia hero-section y site-settings de inglés a español
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Leer .env manualmente
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
let STRAPI_API_TOKEN = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('STRAPI_API_TOKEN=')) {
    STRAPI_API_TOKEN = line.split('=')[1].trim();
  }
});

const STRAPI_URL = 'http://localhost:1337';

const client = axios.create({
  baseURL: STRAPI_URL,
  headers: { 
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function createSpanishContent() {
  console.log('═══════════════════════════════════════════════');
  console.log('  🌐 CREANDO CONTENIDO EN ESPAÑOL');
  console.log('═══════════════════════════════════════════════\n');

  try {
    // 1. Hero Section
    console.log('📌 Procesando Hero Section...');
    
    // Obtener hero-section en inglés
    const heroEN = await client.get('/api/hero-section', {
      params: { locale: 'en', populate: '*' }
    });
    
    if (heroEN.data.data) {
      const heroData = heroEN.data.data;
      console.log('  ✅ Hero Section encontrado en inglés');
      
      // Crear localización en español
      try {
        const createHeroES = await client.post(
          `/api/hero-section/localizations`,
          {
            locale: 'es',
            titleLine1: heroData.titleLine1 || 'Vive experiencias',
            titleLine2: heroData.titleLine2 || 'inolvidables',
            subtitle: heroData.subtitle || 'DESCUBRE TU PRÓXIMA AVENTURA',
            description: heroData.description || 'Explora los Dolomitas con guías expertos',
            publishedAt: new Date().toISOString()
          }
        );
        console.log('  ✅ Hero Section creado en español');
      } catch (e) {
        if (e.response?.status === 400 && e.response?.data?.error?.message?.includes('already exists')) {
          console.log('  ⚠️ Hero Section ya existe en español');
        } else {
          console.error('  ❌ Error creando Hero Section ES:', e.response?.data?.error?.message || e.message);
        }
      }
    } else {
      console.log('  ⚠️ No se encontró Hero Section en inglés');
    }

    // 2. Site Settings
    console.log('\n📌 Procesando Site Settings...');
    
    const siteEN = await client.get('/api/site-settings', {
      params: { locale: 'en', populate: '*' }
    });
    
    if (siteEN.data.data) {
      const siteData = siteEN.data.data;
      console.log('  ✅ Site Settings encontrado en inglés');
      
      try {
        const createSiteES = await client.post(
          `/api/site-settings/localizations`,
          {
            locale: 'es',
            siteName: siteData.siteName || 'Dolovibes',
            address: siteData.address || 'Monterrey, México',
            phone: siteData.phone || '+52 81 1234 5678',
            email: siteData.email || 'info@dolovibes.com',
            whatsapp: siteData.whatsapp || '+521234567890',
            instagram: siteData.instagram || 'https://instagram.com/dolovibes',
            facebook: siteData.facebook || 'https://facebook.com/dolovibes',
            tiktok: siteData.tiktok || 'https://tiktok.com/@dolovibes',
            footerDescription: siteData.footerDescription || 'Experiencias únicas en los Dolomitas italianos.',
            copyright: siteData.copyright || '© 2025 Dolovibes. Todos los derechos reservados.',
            defaultCurrency: siteData.defaultCurrency || 'MXN',
            publishedAt: new Date().toISOString()
          }
        );
        console.log('  ✅ Site Settings creado en español');
      } catch (e) {
        if (e.response?.status === 400 && e.response?.data?.error?.message?.includes('already exists')) {
          console.log('  ⚠️ Site Settings ya existe en español');
        } else {
          console.error('  ❌ Error creando Site Settings ES:', e.response?.data?.error?.message || e.message);
        }
      }
    } else {
      console.log('  ⚠️ No se encontró Site Settings en inglés');
    }

    // 3. About Page
    console.log('\n📌 Procesando About Page...');
    
    try {
      const aboutEN = await client.get('/api/about-page', {
        params: { locale: 'en', populate: '*' }
      });
      
      if (aboutEN.data.data) {
        const aboutData = aboutEN.data.data;
        console.log('  ✅ About Page encontrado en inglés');
        
        try {
          const createAboutES = await client.post(
            `/api/about-page/localizations`,
            {
              locale: 'es',
              title: aboutData.title || 'Sobre Nosotros',
              subtitle: aboutData.subtitle || 'Nuestra Historia',
              missionTitle: aboutData.missionTitle || 'Nuestra Misión',
              missionDescription: aboutData.missionDescription || 'Crear experiencias inolvidables en los Dolomitas.',
              visionTitle: aboutData.visionTitle || 'Nuestra Visión',
              visionDescription: aboutData.visionDescription || 'Ser la agencia líder en turismo alpino.',
              publishedAt: new Date().toISOString()
            }
          );
          console.log('  ✅ About Page creado en español');
        } catch (e) {
          if (e.response?.status === 400 && e.response?.data?.error?.message?.includes('already exists')) {
            console.log('  ⚠️ About Page ya existe en español');
          } else {
            console.error('  ❌ Error creando About Page ES:', e.response?.data?.error?.message || e.message);
          }
        }
      }
    } catch (e) {
      console.log('  ⚠️ About Page no encontrado o sin permisos');
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('  ✅ PROCESO COMPLETADO');
    console.log('═══════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error general:', error.response?.data || error.message);
  }
}

createSpanishContent();
