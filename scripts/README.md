# Scripts de Población de Contenido - DoloVibes

Este directorio contiene scripts para poblar y gestionar el contenido en Strapi.

## � Scripts Idempotentes

**Todos los scripts son idempotentes**: pueden ejecutarse múltiples veces de forma segura.
- Si el contenido ya existe: se actualiza
- Si el contenido no existe: se crea nuevo
- No se crean duplicados

Esto permite:
- Re-ejecutar scripts sin preocupaciones
- Actualizar traducciones existentes
- Recuperarse de ejecuciones interrumpidas
- Poblar ambientes (dev, staging, producción) múltiples veces

## �🚀 Scripts de Población Principal (Para nuevas instalaciones)

### Orden de ejecución recomendado:

1. **create-spanish-content.js** - Crea contenido base en español
   ```bash
   node scripts/create-spanish-content.js
   ```
   - Crea packages y experiences en español (contenido base)
   - Debe ejecutarse primero

2. **seed-english-content.js** - Traduce contenido a inglés
   ```bash
   node scripts/seed-english-content.js
   ```
   - Crea traducciones de packages en inglés
   - Requiere que exista contenido en español

3. **seed-experiences-english.js** - Traduce experiences a inglés
   ```bash
   node scripts/seed-experiences-english.js
   ```
   - Crea traducciones de experiences en inglés

4. **seed-italian-packages.js** ✅ - Traduce packages a italiano
   ```bash
   node scripts/seed-italian-packages.js
   ```
   - Crea/actualiza 7 packages con itinerarios completos en italiano
   - Requiere packages en español
   - **Idempotente**: actualiza si ya existen

5. **seed-german-packages.js** ✅ - Traduce packages a alemán
   ```bash
   node scripts/seed-german-packages.js
   ```
   - Crea/actualiza 7 packages con itinerarios completos en alemán
   - Requiere packages en español
   - **Idempotente**: actualiza si ya existen

6. **seed-italian-content.js** - Traduce experiences a italiano
   ```bash
   node scripts/seed-italian-content.js
   ```
   - Crea traducciones de experiences en italiano

7. **seed-german-content.js** - Traduce experiences a alemán
   ```bash
   node scripts/seed-german-content.js
   ```
   - Crea traducciones de experiences en alemán

8. **seed-hero-about-automated.js** ✅ - Crea Hero Section en IT/DE
   ```bash
   node scripts/seed-hero-about-automated.js
   ```
   - **Idempotente**: actualiza si ya existe
   - Crea/actualiza Hero Section en italiano y alemán
   - Usa PUT con `?locale=` (Strapi 5 single types)

## 📋 Scripts de Utilidad

- **verify-completion.js** ✅ - Verifica estado de traduciones
  ```bash
  node scripts/verify-completion.js
  ```
  - Muestra tabla con conteo por locale (ES/EN/IT/DE)
  - Útil para auditar progreso

- **check-missing.js** - Identifica contenido faltante
  ```bash
  node scripts/check-missing.js
  ```

- **publish-english-content.js** - Publica contenido inglés
  ```bash
  node scripts/publish-english-content.js
  ```

## 🖼️ Scripts de Imágenes

- **upload-images.js** - Sube imágenes a Strapi
- **populate-gallery-images.js** - Asigna imágenes a galerías
- **seed-itinerary-images.js** - Asigna imágenes a itinerarios
- **sync-frontend-images.js** - Sincroniza imágenes con frontend
- **migrate-itinerary-images.js** - Migra imágenes de itinerarios

## 🔧 Scripts de Mantenimiento

- **fix-package-experience-relations.js** - Corrige relaciones
- **cleanup-duplicates.js** - Elimina duplicados
- **restore-packages.js** - Restaura packages desde backup
- **assign-existing-images.js** - Asigna imágenes existentes

## 🧪 Scripts de Prueba

- **test-link.js** - Prueba enlaces
- **test-upload.js** - Prueba subida de archivos

## ⚙️ Requisitos

1. **Strapi ejecutándose en localhost:1337**
   ```bash
   cd /path/to/dolovibes-backend
   npm run dev
   ```

2. **Variable de entorno STRAPI_API_TOKEN en .env**
   ```env
   STRAPI_API_TOKEN=tu_token_aqui
   ```

3. **i18n configurado con locales: es, en, it, de**

## 📦 Población Completa desde Cero

Para poblar una instalación limpia de Strapi con todo el contenido:

```bash
# 1. Asegurarse que Strapi esté corriendo
npm run dev

# 2. En otra terminal, ejecutar scripts en orden:
node scripts/create-spanish-content.js
node scripts/seed-english-content.js
node scripts/seed-experiences-english.js
node scripts/seed-italian-packages.js
node scripts/seed-german-packages.js
node scripts/seed-italian-content.js
node scripts/seed-german-content.js
node scripts/seed-hero-about-automated.js

# 3. Verificar resultado
node scripts/verify-completion.js
```

## ✅ Estado Actual del Proyecto

Ejecutando `verify-completion.js` deberías ver:

```
┌─────────────────┬─────┬─────┬─────┬─────┬──────────┐
│ Content Type    │  ES │  EN │  IT │  DE │ Estado   │
├─────────────────┼─────┼─────┼─────┼─────┼──────────┤
│ Packages        │  8  │  7  │  7  │  7  │  ✅ 100% │
│ Experiences     │  6  │  6  │  6  │  6  │  ✅ 100% │
│ Hero Section    │  1  │  1  │  1  │  1  │  ✅ 100% │
└─────────────────┴─────┴─────┴─────┴─────┴──────────┘
```

## 🌐 Locales Soportados

- **ES** (Español) - Contenido base, mercado MX (dueña mexicana)
- **EN** (English) - Mercado internacional
- **IT** (Italiano) - 75% del turismo + esposo italiano
- **DE** (Deutsch) - 75% del turismo en Dolomitas

## 💱 Monedas Configuradas

- **MXN** - Mercado mexicano (dueña del negocio)
- **EUR** - Europa (Italia, Alemania, destino)
- **USD** - Internacional
- **CHF** - Turismo suizo (8% del mercado)

## 📝 Notas Importantes

- **Strapi 5**: Single types usan `PUT /api/{type}?locale={code}`, NO `POST /localizations`
- Los scripts validan campos contra `schema.json` de cada content type
- Siempre verificar que Strapi esté corriendo antes de ejecutar scripts
- Los packages "test-en-pkg" y similares se omiten automáticamente en traducciones
