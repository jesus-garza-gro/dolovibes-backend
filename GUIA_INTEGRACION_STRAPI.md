# 🏔️ Guía de Integración Strapi - Dolovibes

## Estado Actual
✅ Código integrado en ramas `integracion-strapi` (frontend y backend)  
✅ **NUEVO:** Funcionalidades de moneda e idioma implementadas y activadas  
⏳ Pendiente: Configuración de Strapi y pruebas finales

**Última actualización:** 6 de enero de 2026

---

## 📋 Pasos Siguientes

### 1️⃣ Iniciar Strapi Backend

```bash
cd /Users/jesusgarza/Dev/Repositorios/dolovibes-backend
npm run develop
```

**Resultado esperado:**
- Strapi se abrirá en http://localhost:1337/admin
- Primera vez: te pedirá crear usuario administrador

---

### 2️⃣ Crear Usuario Administrador

En el navegador (http://localhost:1337/admin):

1. **Nombre**: Tu nombre
2. **Email**: tu@email.com
3. **Password**: (mínimo 8 caracteres)
4. Hacer clic en "Let's start"

---

### 3️⃣ Crear API Token para Migración

**Ruta**: Settings > API Tokens > Create new API Token

**Configuración del Token:**
- **Name**: Migration Token
- **Description**: Token para script de migración de datos
- **Token duration**: Unlimited
- **Token type**: Full access

**⚠️ IMPORTANTE**: Copia el token generado (solo se muestra una vez)

---

### 4️⃣ Ejecutar Script de Migración

```bash
# En la terminal del backend (desde dolovibes-backend/)
export STRAPI_API_TOKEN="tu_token_copiado_aqui"
node scripts/migrate-data.js
```

**Qué hace este script:**
- ✅ Migra 6 experiencias (Hut 2 Hut, Hiking, City Lights, Ski Pull, Ski Family, Navidad)
- ✅ Migra 7 paquetes con itinerarios completos
- ✅ Configura Hero Section
- ✅ Configura About Page
- ✅ Configura Site Settings

**Resultado esperado:**
```
═══════════════════════════════════════════════
  🏔️  DOLOVIBES - Migración de Datos a Strapi
═══════════════════════════════════════════════

📦 Migrando Experiencias...
  ✅ Hut 2 Hut (ID: 1)
  ✅ Hiking (ID: 2)
  ...

🎒 Migrando Paquetes...
  ✅ Hut 2 Hut - Dolomitas Clásico (ID: 1)
  ...

✅ Migración completada exitosamente
```

---

### 5️⃣ Verificar Datos en Strapi Admin

Entra a http://localhost:1337/admin y verifica:

**Content Manager > Collection Types:**
- ✅ **Experiences** (6 entradas)
- ✅ **Packages** (7 entradas)
- ✅ **Guides** (vacío por ahora)
- ✅ **Testimonials** (vacío por ahora)

**Content Manager > Single Types:**
- ✅ **Hero Section**
- ✅ **About Page**
- ✅ **Site Settings**

---

### 6️⃣ Subir Imágenes a Strapi

**⚠️ IMPORTANTE**: El script de migración **NO** sube imágenes. Las URLs de Unsplash se guardaron como referencia.

**Proceso manual:**
1. Ve a Content Manager > Experiences
2. Abre cada experiencia
3. Sube imágenes en los campos `thumbnail` y `heroImage`
4. Guarda y publica

Repite para:
- Packages (thumbnail, heroImage, gallery)
- Itinerary Days (campo `image` en cada día)
- About Page (mainPhoto)

**Alternativa rápida (desarrollo):** Dejar las URLs de Unsplash por ahora.

---

### 7️⃣ Configurar Permisos Públicos

**Ruta**: Settings > Users & Permissions Plugin > Roles > Public

**Habilitar acciones `find` y `findOne` para:**

- ✅ **experience**
  - [x] find
  - [x] findOne
  
- ✅ **package**
  - [x] find
  - [x] findOne
  
- ✅ **hero-section**
  - [x] find
  
- ✅ **about-page**
  - [x] find
  
- ✅ **site-setting**
  - [x] find
  
- ✅ **guide**
  - [x] find
  - [x] findOne
  
- ✅ **testimonial**
  - [x] find
  - [x] findOne

**Guardar** los cambios.

---

### 8️⃣ Probar API de Strapi

Abre en el navegador o Postman:

```
http://localhost:1337/api/experiences?locale=es&populate=*
http://localhost:1337/api/packages?locale=es&populate=deep
http://localhost:1337/api/hero-section?locale=es&populate=*
```

**Resultado esperado:** JSON con los datos migrados.

---

### 9️⃣ Configurar Frontend

```bash
cd /Users/jesusgarza/Dev/Repositorios/dolovibes
```

**Crear archivo `.env.local`:**

```bash
cp .env.example .env.local
```

**Editar `.env.local`:**

```env
# Backend Strapi
VITE_STRAPI_URL=http://localhost:1337

# CAMBIAR A true PARA USAR STRAPI
VITE_USE_STRAPI=true
```

---

### 🔟 Iniciar Frontend

```bash
cd /Users/jesusgarza/Dev/Repositorios/dolovibes
npm run dev
```

**Resultado esperado:**
- Frontend se abre en http://localhost:5173
- Los datos ahora vienen de Strapi
- Busca en consola del navegador: `[Strapi] GET /experiences`

---

## ✅ Verificación Final

### Checklist de Funcionalidad

- [ ] **Home Page** carga experiencias desde Strapi
- [ ] **Experience Page** muestra detalles de experiencia
- [ ] **Package Info Page** muestra paquete completo con itinerario
- [ ] **ExperienceSelector** filtra por temporada correctamente
- [x] **Cambio de idioma ES/EN** funciona ✅ (Implementado)
- [x] **Detección automática de idioma** ✅ (Implementado)
- [x] **Selector de moneda MXN/USD/EUR/GBP** ✅ (Implementado)
- [x] **Conversión automática de precios** ✅ (Implementado)
- [ ] Las imágenes se muestran correctamente

### Pruebas Específicas

1. **Experiencias por temporada:**
   - Seleccionar "Verano" → debe mostrar Hut 2 Hut, Hiking, City Lights
   - Seleccionar "Invierno" → debe mostrar Ski Pull, Ski Family, Navidad

2. **Paquete completo:**
   - Ir a `/package/hut-2-hut-dolomitas-clasico`
   - Verificar itinerario de 5 días
   - Verificar includes/notIncludes
   - Verificar fechas de inicio

3. **Multiidioma:**
   - Cambiar idioma a EN
   - Verificar que los textos cambian
   - Verificar que Strapi devuelve contenido en inglés
   - ✅ **Idioma se detecta automáticamente al cargar**

4. **Conversión de moneda:** ✅
   - Verificar selector de moneda en navbar
   - Cambiar entre MXN/USD/EUR/GBP
   - Verificar que precios se convierten correctamente
   - Verificar que la preferencia se guarda (recargar página)

---

## 🔄 Volver a Datos Estáticos

## 🔄 Volver a Datos Estáticos

Si necesitas desactivar Strapi temporalmente:

**En `.env.local`:**
```env
VITE_USE_STRAPI=false
```

El frontend volverá a usar `packages.js` y `experiences.js` (datos estáticos).

**Nota:** Las funcionalidades de moneda e idioma seguirán funcionando independientemente de si usas Strapi o datos estáticos.

---

## 🚀 Features Implementadas y Activas ✅

### 💱 Conversión Automática de Moneda

**Estado:** ✅ **IMPLEMENTADO Y ACTIVADO** (6 enero 2026)  
**Inversión:** $4,000-6,000 MXN

**Funcionalidades:**
- ✅ Detección automática de moneda por ubicación IP (ipapi.co)
- ✅ Conversión en tiempo real con cache de 1 hora
- ✅ Soporte para 4 monedas: MXN 🇲🇽, USD 🇺🇸, EUR 🇪🇺, GBP 🇬🇧
- ✅ Selector de moneda en navbar (desktop y móvil)
- ✅ Persistencia de preferencia en localStorage
- ✅ Tasas de fallback cuando API no disponible
- ✅ Compatibilidad con navegadores antiguos

**Componentes agregados:**
- `src/utils/currency.js` - Sistema completo de conversión
- `src/components/CurrencySelector.jsx` - Selector dropdown accesible
- `CurrencyProvider` envuelve la app en `main.jsx`

**Uso en componentes:**
```jsx
import { useCurrencyContext, parsePrice } from '../utils/currency';

const { formatPrice, currency } = useCurrencyContext();
const converted = formatPrice(parsePrice(pkg.price)); // "$1,450 USD"
```

**Configuración opcional (para tasas actualizadas):**
1. Registrarse en https://exchangerate-api.com (gratis: 1500 requests/mes)
2. Agregar en `.env.local`:
```env
VITE_EXCHANGE_RATE_API_KEY=tu_api_key_aqui
```

**Sin API key:** Usa tasas de fallback aproximadas (funcional).

---

### 🌍 Detección Automática de Idioma

**Estado:** ✅ **IMPLEMENTADO Y ACTIVADO** (6 enero 2026)  
**Inversión:** $1,500-2,500 MXN

**Funcionalidades:**
- ✅ Detección automática del idioma del navegador
- ✅ Prioridad: localStorage > navegador > español (fallback)
- ✅ Selector mejorado con banderas 🇪🇸 🇺🇸
- ✅ Navegación por teclado (Escape, Arrow keys)
- ✅ Accesibilidad completa (ARIA roles)
- ✅ Persistencia en localStorage

**Componentes actualizados:**
- `src/i18n.js` - `LANGUAGE_DETECTION_ENABLED = true`
- `src/components/LanguageSwitcher.jsx` - Mejorado con banderas y accesibilidad

**Código activado:**
```js
// src/i18n.js
const LANGUAGE_DETECTION_ENABLED = true; // ✅ Activado
```

---

## 📋 Pasos Siguientes para Completar Integración

### URLs de Imágenes
- Las imágenes actualmente son URLs de Unsplash
- Para producción, subirlas a Strapi o usar CDN

### Videos del Hero
- Necesitas subir videos manualmente en Hero Section
- Formato recomendado: MP4, H.264
- Tamaño desktop: ~10-20MB máximo
- Tamaño mobile: ~5-10MB máximo

### Base de Datos
- Desarrollo: SQLite (archivo `.tmp/data.db`)
- Producción: Cambiar a PostgreSQL o MySQL

### i18n
- Español (es) es idioma por defecto
- Inglés (en) está configurado
- Para agregar más idiomas: editar `config/plugins.ts`

---

## 🐛 Solución de Problemas

### Error: "CORS blocked"
**Solución:** Verificar `config/middlewares.ts` tiene tu frontend URL.

### Error: "Cannot read property 'data' of undefined"
**Solución:** Los permisos públicos no están habilitados (Paso 7).

### Error: "API Token invalid"
**Solución:** 
1. Regenerar token en Strapi Admin
2. Actualizar variable `STRAPI_API_TOKEN`
3. Volver a ejecutar `node scripts/migrate-data.js`

### Frontend muestra datos vacíos
**Solución:**
1. Verificar `VITE_USE_STRAPI=true` en `.env.local`
2. Verificar Strapi corriendo en http://localhost:1337
3. Abrir consola del navegador y buscar errores

### Imágenes no se muestran
**Solución:**
1. Verificar que las imágenes se subieron a Strapi
2. Verificar permisos de `upload` en Public role
3. URLs de Unsplash pueden fallar (usar imágenes locales)

---

## 📞 Resumen de Inversión

- **Integración Strapi Base:** $28,000 MXN ✅
- **Conversión de Moneda:** $4,000-6,000 MXN ✅ **IMPLEMENTADO**
- **Detección de Idioma:** $1,500-2,500 MXN ✅ **IMPLEMENTADO**
- **Total Invertido:** ~$33,500-36,500 MXN

**Stack Tecnológico:**
- Backend: Strapi 5.31.2 + TypeScript
- Frontend: React 19 + Vite + TailwindCSS
- i18n: react-i18next + i18next-browser-languagedetector
- Moneda: API exchangerate-api.com + ipapi.co
- Queries: @tanstack/react-query

**Fecha de implementación features:** 6 de enero de 2026

---

## 🎯 Próximos Pasos (Post-Integración)

1. **Contenido Real:**
   - Reemplazar textos de ejemplo
   - Subir fotos profesionales
   - Agregar guías reales
   - Agregar testimonios reales

2. **SEO:**
   - Completar campos SEO en cada content type
   - Configurar sitemap
   - Meta tags dinámicos

3. **Producción:**
   - Deploy de Strapi (Railway, Heroku, VPS)
   - Deploy de Frontend (Vercel, Netlify)
   - Configurar dominio
   - SSL/HTTPS

4. **Optimización:**
   - Lazy loading de imágenes
   - Optimización de videos
   - Cache de API
   - Analytics (Google Analytics)

---

**✨ ¡Listo para comenzar la integración!**
