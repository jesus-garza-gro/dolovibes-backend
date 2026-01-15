# 🛠️ Guía Técnica - DoloVibes Backend (Strapi 5)

## Arquitectura del Proyecto

```
dolovibes-backend/          # Strapi 5 CMS
├── src/
│   ├── api/                # Content Types
│   │   ├── package/        # Paquetes de viaje
│   │   ├── experience/     # Categorías de experiencia
│   │   ├── site-setting/   # Configuración global
│   │   ├── site-text/      # Textos administrables
│   │   ├── hero-section/   # Banner principal
│   │   └── about-page/     # Página About
│   ├── admin/
│   │   ├── app.tsx         # Configuración del admin
│   │   └── translations/   # Labels en ES/EN
│   └── extensions/         # Extensiones personalizadas
├── config/                 # Configuración Strapi
├── database/               # Migraciones
└── public/                 # Archivos estáticos

dolovibes/                  # Frontend React + Vite
├── src/
│   ├── components/         # Componentes React
│   ├── pages/              # Páginas
│   ├── services/           # API client y hooks
│   ├── locales/            # Traducciones i18n (fallback)
│   └── utils/              # Utilidades (currency, etc.)
└── public/                 # Assets estáticos
```

---

## 🚀 Configuración Inicial

### Requisitos

- Node.js 20.x o superior
- npm 10.x o superior
- Git

### 1. Clonar repositorios

```bash
# Backend (Strapi)
git clone git@github.com:jesus-garza-gro/dolovibes-backend.git
cd dolovibes-backend
git checkout integracion-strapi

# Frontend (React)
git clone git@github.com:jesus-garza-gro/dolovibes.git
cd dolovibes
git checkout integracion-strapi
```

### 2. Configurar Backend (Strapi)

```bash
cd dolovibes-backend

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env
```

**Editar `.env`:**
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# Producción: Cloudinary para media
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_KEY=your-cloudinary-key
CLOUDINARY_SECRET=your-cloudinary-secret
```

```bash
# Construir el admin panel (IMPORTANTE para traducciones)
npm run build

# Iniciar en desarrollo
npm run develop
```

### 3. Crear usuario administrador

1. Abre `http://localhost:1337/admin`
2. Completa el formulario de registro inicial
3. Guarda las credenciales de forma segura

### 4. Configurar Frontend

```bash
cd dolovibes

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env
```

**Editar `.env`:**
```env
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_API_TOKEN=your-api-token-here
```

```bash
# Iniciar en desarrollo
npm run dev
```

---

## 📊 Content Types (Modelos de Datos)

### Package (Collection Type)

| Campo | Tipo | i18n | Descripción |
|-------|------|------|-------------|
| `displayOrder` | Integer | ❌ | Orden de visualización |
| `title` | String | ✅ | Título del paquete |
| `slug` | UID | ❌ | URL amigable |
| `experience` | Relation | - | Experiencia relacionada |
| `location` | String | ✅ | Ubicación |
| `priceAmount` | Decimal | ❌ | Precio en EUR |
| `priceCurrency` | Enum | ❌ | Siempre "EUR" |
| `originalPriceAmount` | Decimal | ❌ | Precio original (si hay descuento) |
| `duration` | String | ✅ | Ej: "7 días / 6 noches" |
| `rating` | Decimal | ❌ | 0-5 |
| `thumbnail` | Media | ❌ | Imagen miniatura |
| `heroImage` | Media | ❌ | Imagen principal |
| `gallery` | Component (repeatable) | ✅ | Galería de fotos |
| `hasDiscount` | Boolean | ❌ | ¿Tiene descuento? |
| `season` | Enum | ❌ | summer/winter |
| `description` | RichText | ✅ | Descripción larga |
| `itinerary` | Component (repeatable) | ✅ | Itinerario día a día |
| `includes` | Component (repeatable) | ✅ | Qué incluye |
| `notIncludes` | Component (repeatable) | ✅ | Qué no incluye |
| `difficulty` | String | ✅ | Nivel de dificultad |
| `groupSize` | String | ✅ | Tamaño del grupo |
| `guideType` | String | ✅ | Tipo de guía |
| `availableDates` | String | ✅ | Fechas disponibles |
| `startDates` | Component (repeatable) | ❌ | Fechas de inicio |
| `locationInfo` | Component | ✅ | Info de ubicación |

### Experience (Collection Type)

| Campo | Tipo | i18n |
|-------|------|------|
| `displayOrder` | Integer | ❌ |
| `title` | String | ✅ |
| `slug` | UID | ❌ |
| `season` | Enum | ❌ |
| `shortDescription` | Text | ✅ |
| `longDescription` | RichText | ✅ |
| `thumbnail` | Media | ❌ |
| `heroImage` | Media | ❌ |
| `difficulty` | String | ✅ |
| `bestFor` | String | ✅ |
| `packages` | Relation | - |

### Single Types

- **Site Settings**: Configuración global (logo, contacto, redes)
- **Site Text**: Textos globales administrables
- **Hero Section**: Banner principal
- **About Page**: Página institucional

---

## 🌐 Internacionalización (i18n)

### Locales soportados

| Código | Idioma | Strapi | Frontend |
|--------|--------|--------|----------|
| `es` | Español | ✅ | ✅ |
| `en` | English | ✅ | ✅ |
| `it` | Italiano | ✅ | ✅ |
| `de` | Deutsch | ✅ | ✅ |

### Configuración en Strapi

El i18n está habilitado a nivel de content type en `schema.json`:

```json
{
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  }
}
```

### Patrón Frontend (Strapi > i18n fallback)

```javascript
// En componentes React
const { data: siteTexts } = useSiteTexts();
const { t } = useTranslation('common');

// Prioriza Strapi, fallback a i18n local
const loadingText = siteTexts?.loadingExperience || t('loading.experience');
```

---

## 🔧 Personalización del Admin

### Traducciones de labels

Los labels del Content Manager se configuran en:
- `src/admin/translations/es.json`
- `src/admin/translations/en.json`

**Formato de claves:**
```
content-manager.content-types.api::[api_id].[singular_name].[field_name]
```

**Ejemplo:**
```json
{
  "content-manager.content-types.api::package.package.priceAmount": "Precio actual (EUR)"
}
```

### Aplicar cambios

Después de modificar traducciones:

```bash
npm run build   # Reconstruir admin
npm run develop # Reiniciar
```

---

## 🔌 API Endpoints

### Base URL
- Desarrollo: `http://localhost:1337/api`
- Producción: `https://api.dolovibes.com/api`

### Endpoints principales

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/packages` | GET | Lista de paquetes |
| `/packages?filters[slug][$eq]=slug` | GET | Paquete por slug |
| `/experiences` | GET | Lista de experiencias |
| `/experiences?filters[slug][$eq]=slug` | GET | Experiencia por slug |
| `/hero-section` | GET | Banner principal |
| `/about-page` | GET | Página About |
| `/site-setting` | GET | Configuración |
| `/site-text` | GET | Textos globales |

### Parámetros comunes

```
?locale=es                          # Idioma
?populate=*                         # Incluir relaciones
?sort=displayOrder:asc              # Ordenar
?filters[season][$eq]=summer        # Filtrar
```

---

## 🚢 Deploy a Producción

### Backend (Strapi)

**Opciones recomendadas:**
1. **Railway** - Fácil, económico
2. **Render** - Simple, escalable
3. **DigitalOcean App Platform** - Robusto

**Consideraciones:**
- Configurar PostgreSQL en lugar de SQLite
- Usar Cloudinary para media (no almacenar en disco)
- Variables de entorno seguras

### Frontend (React)

**Opciones recomendadas:**
1. **Vercel** - Óptimo para React/Vite
2. **Netlify** - Alternativa sólida

---

## 🔐 Seguridad

### Permisos de API

1. En Strapi Admin → Settings → Users & Permissions → Roles
2. Editar **Public**
3. Habilitar solo endpoints necesarios:
   - `find` y `findOne` para Package, Experience
   - `find` para Site Settings, Hero Section, etc.

### Rate Limiting

Configurar en `config/middlewares.js`:
```javascript
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
      },
    },
  },
  // ...
];
```

---

## 🐛 Troubleshooting

### Labels no se actualizan

```bash
# Limpiar y reconstruir
rm -rf dist .cache
npm run build
npm run develop
```

### Error de CORS

Verificar `config/middlewares.js`:
```javascript
'strapi::cors',
```

### Imágenes no cargan

1. Verificar que media esté en `populate`
2. En producción, configurar Cloudinary

---

## 📞 Contacto del Equipo

- **Lead Dev**: jesus@dolovibes.com
- **Repo Backend**: github.com/jesus-garza-gro/dolovibes-backend
- **Repo Frontend**: github.com/jesus-garza-gro/dolovibes

---

*Versión del documento: 1.0 | Enero 2026*
