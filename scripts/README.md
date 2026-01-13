# Scripts de Población de Contenido - Dolovibes Backend

Documentación técnica de scripts para poblar y mantener contenido en Strapi.

## ⚡ TL;DR

```bash
# Poblar todo desde cero
node scripts/create-spanish-content.js
node scripts/upload-images.js
node scripts/seed-english-content.js
node scripts/seed-experiences-english.js
node scripts/seed-italian-packages.js
node scripts/seed-italian-content.js
node scripts/seed-german-packages.js
node scripts/seed-german-content.js

# Verificar
node scripts/verify-completion.js
```

---

## 📋 Scripts de Seed (Production-Ready)

### Contenido Base

**`create-spanish-content.js`**
- Crea contenido español (ES) - locale por defecto
- Packages (7), Experiences (6), Hero Section, About Page
- **Requisito**: Ejecutar primero siempre

**`upload-images.js`**
- Sube imágenes desde `downloads/` a Strapi Media Library
- Vincula automáticamente a packages y experiences
- 26 imágenes totales (thumbnails + heroes)

### Traducciones - Inglés

**`seed-english-content.js`** ✅ Idempotente
- Crea traducciones EN de 7 packages
- Usa PUT con documentId (comparte con ES)
- Preserva thumbnail y heroImage IDs

**`seed-experiences-english.js`** ✅ Idempotente
- Crea traducciones EN de 6 experiences
- Usa PUT con documentId
- Preserva imágenes de español

### Traducciones - Italiano

**`seed-italian-packages.js`** ✅ Idempotente
- Crea traducciones IT de 7 packages
- Comparte documentId con ES
- Diccionario de traducciones incluido

**`seed-italian-content.js`** ✅ Idempotente
- Crea traducciones IT de 6 experiences
- Usa PUT con documentId (no POST)
- Preserva thumbnail y heroImage de ES

### Traducciones - Alemán

**`seed-german-packages.js`** ✅ Idempotente
- Crea traducciones DE de 7 packages
- Comparte documentId con ES
- Diccionario de traducciones incluido

**`seed-german-content.js`** ✅ Idempotente
- Crea traducciones DE de 6 experiences
- Usa PUT con documentId
- Preserva imágenes de español

### Verificación

**`verify-completion.js`**
- Audita estado de contenido por locale
- Reporta packages, experiences, hero, about
- Valida que todos tengan mismos documentIds

---

## 🧹 Scripts de Utilidad

### Limpieza

**`delete-english-content.js`**
- Elimina todos los packages y experiences EN
- Útil para resetear traducciones inglesas

**`delete-duplicate-packages.js`**
- Encuentra packages con documentIds que no existen en ES
- Elimina duplicados de IT/DE creados incorrectamente

**`delete-experiences-it-de.js`**
- Elimina experiences IT/DE con documentIds incorrectos
- Para limpiar antes de recrear como traducciones

### Sincronización

**`sync-package-order.js`** ✅ Preserva imágenes
- Sincroniza displayOrder en todos los locales
- Actualizado para NO borrar thumbnail/heroImage

### Desarrollo (No usar en producción)

**`test-link.js`** - Test de endpoints
**`test-upload.js`** - Test de subida de imágenes

---

## 🌍 Arquitectura i18n

### Concepto: documentId

En Strapi 5, las traducciones comparten el mismo `documentId`:

```javascript
// ES (original)
{ id: 123, documentId: "abc123", slug: "navidad-en-los-dolomitas", locale: "es" }

// EN (traducción)
{ id: 456, documentId: "abc123", slug: "navidad-en-los-dolomitas", locale: "en" }

// IT (traducción)
{ id: 789, documentId: "abc123", slug: "navidad-en-los-dolomitas", locale: "it" }
```

**Key**: El `slug` es el MISMO para todas las localizaciones. Strapi maneja las versiones por idioma internamente.

### Patrón de Idempotencia

```javascript
// ❌ MAL: POST crea duplicados
await axios.post(`${STRAPI_URL}/api/packages`, { data: { locale: "en", ... } });

// ✅ BIEN: PUT con documentId crea O actualiza
await axios.put(
  `${STRAPI_URL}/api/packages/${esPackage.documentId}?locale=en`,
  { data: translatedData }
);
```

### Fallback de Imágenes (Frontend)

El frontend (`api.js`) usa `enrichWithSpanishMedia()`:
1. Agrupa packages/experiences por `documentId`
2. Si un locale no tiene thumbnail/heroImage
3. Busca el mismo `documentId` en español (ES)
4. Copia las imágenes de ES → locale sin imagen

**Resultado**: Aunque IT/DE no tengan imágenes en Strapi, se ven en el sitio.

---

## 📊 Estado Esperado

Después de ejecutar todos los scripts:

```
┌─────────────────┬─────┬─────┬─────┬─────┐
│ Content Type    │  ES │  EN │  IT │  DE │
├─────────────────┼─────┼─────┼─────┼─────┤
│ Packages        │  7  │  7  │  7  │  7  │
│ Experiences     │  6  │  6  │  6  │  6  │
│ Hero Section    │  1  │  1  │  1  │  1  │
│ About Page      │  1  │  1  │  1  │  1  │
└─────────────────┴─────┴─────┴─────┴─────┘
```

**Packages** (slug base):
1. `navidad-en-los-dolomitas`
2. `esqui-exclusivo-dolimiti`
3. `experiencia-patrimonio-unesco`
4. `via-ferrata-pasion`
5. `hut-to-hut-trekking`
6. `city-lights-norte-italia`
7. `navidad-mercados-bolzano`

**Experiences** (slug base):
1. `hut-2-hut`
2. `ski-touring`
3. `via-ferrata`
4. `cultural-tour`
5. `hiking-trails`
6. `dolomites-ski-resort`

---

## ⚙️ Requisitos Previos

1. **Strapi ejecutándose**
   ```bash
   cd dolovibes-backend
   npm run develop
   ```

2. **Token de API configurado**
   ```env
   # .env
   STRAPI_API_TOKEN=tu_token_aqui
   ```
   Generar en: Admin → Settings → API Tokens → Create (Full access)

3. **Locales habilitados**
   - Ir a http://localhost:1337/admin
   - Settings → Internationalization → Locales
   - Verificar: `es` (default), `en`, `it`, `de`

4. **Permisos públicos**
   - Settings → Users & Permissions → Roles → Public
   - Habilitar `find` y `findOne` para: Experience, Package, Hero Section, About Page

---

## 🔧 Orden de Ejecución

**Primer Setup (base de datos vacía):**
```bash
node scripts/create-spanish-content.js      # 1. Base ES
node scripts/upload-images.js               # 2. Subir imágenes
node scripts/seed-english-content.js        # 3. Packages EN
node scripts/seed-experiences-english.js    # 4. Experiences EN
node scripts/seed-italian-packages.js       # 5. Packages IT
node scripts/seed-italian-content.js        # 6. Experiences IT
node scripts/seed-german-packages.js        # 7. Packages DE
node scripts/seed-german-content.js         # 8. Experiences DE
node scripts/verify-completion.js           # 9. Verificar
```

**Re-ejecutar traducciones (seguro):**
```bash
# Todos los seed scripts marcados con ✅ son idempotentes
node scripts/seed-english-content.js        # Safe
node scripts/seed-italian-packages.js       # Safe
# etc...
```

**Sincronizar orden:**
```bash
node scripts/sync-package-order.js
# Actualiza displayOrder en ES, EN, IT, DE
# Ya preserva imágenes correctamente
```

---

## 🚨 Troubleshooting

### Error: "documentId not found"
- Ejecuta primero `create-spanish-content.js`
- Los scripts EN/IT/DE requieren contenido ES existente

### Error: "STRAPI_API_TOKEN no configurado"
- Revisa tu archivo `.env`
- Genera nuevo token en Strapi Admin

### Las imágenes desaparecen después de sync
- Ya está corregido en `sync-package-order.js`
- Re-ejecuta `upload-images.js` si es necesario

### Locale no existe en Strapi
- Settings → Internationalization → Add locale
- Código ISO 639-1: `es`, `en`, `it`, `de`

---

## 📚 Referencias

- Documentación principal: [../README.md](../README.md)
- Guía de Marketing: [../docs/GUIA-MARKETING.md](../docs/GUIA-MARKETING.md)
- Strapi i18n: https://docs.strapi.io/dev-docs/plugins/i18n
