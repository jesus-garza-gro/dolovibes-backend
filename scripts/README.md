# Scripts de Población de Contenido - DoloVibes

Directorio de scripts para poblar Strapi en ambientes locales y producción.

## ✨ Características

- **100% Idempotentes**: Todos los scripts principales pueden ejecutarse múltiples veces sin crear duplicados
- **Verificación de existencia**: Detectan contenido existente y lo actualizan
- **Mensajes claros**: ✅ Creado | ♻️ Actualizado | ❌ Error
- **Preparados para CI/CD**: Pueden automatizarse sin riesgo

---

## 🚀 Uso Rápido

### Script Maestro (Recomendado)

```bash
# Ejecutar TODO (contenido ES, EN, IT, DE)
node scripts/seed-all.js

# Solo verificar estado actual
node scripts/seed-all.js --verify

# Solo un idioma específico
node scripts/seed-all.js --lang=it

# Ver qué haría sin ejecutar
node scripts/seed-all.js --dry-run
```

### Ejecución Manual (Por pasos)

```bash
# 1. Contenido base español
node scripts/create-spanish-content.js

# 2. Traducciones de Packages
node scripts/seed-english-content.js      # EN ✅ Idempotente
node scripts/seed-italian-packages.js     # IT ✅ Idempotente
node scripts/seed-german-packages.js      # DE ✅ Idempotente

# 3. Traducciones de Experiences
node scripts/seed-experiences-english.js  # EN
node scripts/seed-italian-content.js      # IT Experiences
node scripts/seed-german-content.js       # DE Experiences

# 4. Single Types (Hero, About)
node scripts/seed-hero-about-automated.js # IT/DE ✅ Idempotente

# 5. Verificar resultado
node scripts/verify-completion.js
```

---

## 📋 Inventario de Scripts

### Scripts Principales (Producción Ready)

| Script | Función | Idempotente |
|--------|---------|:-----------:|
| `seed-all.js` | Script maestro que ejecuta todo | ✅ |
| `seed-english-content.js` | Packages ES → EN | ✅ |
| `seed-italian-packages.js` | Packages ES → IT | ✅ |
| `seed-german-packages.js` | Packages ES → DE | ✅ |
| `seed-hero-about-automated.js` | Hero/About IT,DE | ✅ |
| `verify-completion.js` | Auditoría de estado | N/A |

### Scripts de Contenido

| Script | Función |
|--------|---------|
| `create-spanish-content.js` | Crea contenido base en español |
| `seed-experiences-english.js` | Experiences ES → EN |
| `seed-italian-content.js` | Experiences ES → IT |
| `seed-german-content.js` | Experiences ES → DE |

### Scripts de Utilidad

| Script | Función |
|--------|---------|
| `check-missing.js` | Identifica traducciones faltantes |
| `cleanup-duplicates.js` | Elimina packages duplicados |
| `publish-english-content.js` | Publica contenido EN (draft → published) |

### Scripts de Imágenes

| Script | Función |
|--------|---------|
| `upload-images.js` | Sube imágenes a Strapi Media |
| `populate-gallery-images.js` | Asigna imágenes a galerías |
| `seed-itinerary-images.js` | Asigna imágenes a itinerarios |
| `sync-frontend-images.js` | Sincroniza con frontend |
| `migrate-itinerary-images.js` | Migra estructura de imágenes |
| `assign-existing-images.js` | Re-asigna imágenes existentes |

### Scripts de Mantenimiento

| Script | Función |
|--------|---------|
| `fix-package-experience-relations.js` | Corrige relaciones rotas |
| `restore-packages.js` | Restaura desde backup |
| `migrate-data.js` | Migración general |

---

## ⚙️ Requisitos Previos

### 1. Strapi ejecutándose

```bash
cd dolovibes-backend
npm run develop
```

### 2. Token de API configurado

```env
# .env
STRAPI_API_TOKEN=tu_token_aqui
```

Obtener token: Admin → Settings → API Tokens → Create (Full access)

### 3. Locales configurados en Strapi Admin

**IMPORTANTE**: Antes de ejecutar scripts, configura los locales:

1. Ve a `http://localhost:1337/admin`
2. Settings → Internationalization → Locales
3. Asegúrate de tener:
   - ✅ Español (es) - Default
   - ✅ English (en)
   - ✅ Italiano (it)
   - ✅ Deutsch (de)

---

## 📊 Estado Esperado

Después de ejecutar `node scripts/seed-all.js`:

```
┌─────────────────┬─────┬─────┬─────┬─────┬──────────┐
│ Content Type    │  ES │  EN │  IT │  DE │ Estado   │
├─────────────────┼─────┼─────┼─────┼─────┼──────────┤
│ Packages        │  8  │  7  │  7  │  7  │  ✅ 100% │
│ Experiences     │  6  │  6  │  6  │  6  │  ✅ 100% │
│ Hero Section    │  1  │  1  │  1  │  1  │  ✅ 100% │
└─────────────────┴─────┴─────┴─────┴─────┴──────────┘
```

---

## 🔧 Patrón de Idempotencia (Strapi 5)

Los scripts usan este patrón para ser idempotentes:

```javascript
// PUT con documentId + ?locale crea O actualiza
await axios.put(
  `${STRAPI_URL}/api/packages/${pkg.documentId}?locale=it`,
  { data: translatedData }
);
```

**Clave**: El `slug` es el MISMO para todas las localizaciones. Strapi maneja internamente las versiones por idioma.

---

## 🌐 Locales Soportados

| Código | Idioma | Target |
|--------|--------|--------|
| `es` | Español | Mercado MX (base) |
| `en` | English | Internacional |
| `it` | Italiano | 75% turismo Dolomitas |
| `de` | Deutsch | 75% turismo Dolomitas |

---

## 📝 Notas Técnicas

- Strapi 5: Single Types usan `PUT /api/{type}?locale={code}`, NO `POST /localizations`
- Los scripts validan campos contra el schema de cada content type
- Packages de prueba (ej: `test-en-pkg`) se omiten automáticamente
- Pequeña pausa entre operaciones para no sobrecargar Strapi (500ms)
