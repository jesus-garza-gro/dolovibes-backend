# 🏔️ Dolovibes Backend - Strapi CMS

Backend en Strapi 5 para el sitio web de Dolovibes, agencia de viajes especializada en experiencias en los Dolomitas.

## 📋 Requisitos Previos

- Node.js 20+ LTS
- npm o yarn
- PostgreSQL, MySQL, SQLite o MariaDB (desarrollo usa SQLite)

## 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd dolovibes-backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Editar .env con tus credenciales
# STRAPI_API_TOKEN=tu-token-aqui (generado después del primer login)
# DATABASE_CLIENT=sqlite (o postgres para producción)

# 5. Ejecutar migraciones y seed inicial
npm run develop
# Primera vez: crear usuario admin en http://localhost:1337/admin
```

## ⚙️ Configuración Inicial

### 1. Crear Usuario Admin
1. Ejecuta `npm run develop`
2. Abre http://localhost:1337/admin
3. Crea tu cuenta de administrador

### 2. Generar API Token
1. Settings → API Tokens → Create new API Token
2. Name: `Frontend Token`
3. Token type: `Full access`
4. Copia el token y agrégalo al `.env`:
   ```
   STRAPI_API_TOKEN=tu-token-generado-aqui
   ```

### 3. Configurar i18n
1. Settings → Internationalization
2. Verifica que estén habilitados: `es` (default), `en`, `it`, `de`

### 4. Configurar Permisos Públicos
1. Settings → Users & Permissions Plugin → Roles → Public
2. Habilitar permisos de lectura (find, findOne) para:
   - Experience
   - Package
   - Hero Section
   - Site Setting
   - About Page
   - Guide
   - Testimonial

## 📦 Poblar Contenido

### Orden Recomendado

```bash
# 1. Contenido base en español
node scripts/create-spanish-content.js

# 2. Subir imágenes a Strapi
node scripts/upload-images.js

# 3. Crear traducciones EN (idempotente)
node scripts/seed-english-content.js
node scripts/seed-experiences-english.js

# 4. Crear traducciones IT (idempotente)
node scripts/seed-italian-packages.js
node scripts/seed-italian-content.js

# 5. Crear traducciones DE (idempotente)
node scripts/seed-german-packages.js
node scripts/seed-german-content.js

# 6. Hero Section y About Page IT/DE (idempotente)
node scripts/seed-hero-about-automated.js

# 7. Sincronizar orden en todos los idiomas
node scripts/sync-package-order.js
```

### Script Todo-en-Uno (Recomendado)

```bash
node scripts/seed-all.js
```

## 📝 Scripts Disponibles

### Desarrollo
```bash
npm run develop    # Servidor con hot-reload en http://localhost:1337
npm run start      # Servidor de producción
npm run build      # Compilar admin panel
```

### Gestión de Contenido
```bash
# Seed por idioma
node scripts/create-spanish-content.js       # Base ES
node scripts/seed-english-content.js         # Packages EN ✅
node scripts/seed-experiences-english.js     # Experiences EN ✅
node scripts/seed-italian-packages.js        # Packages IT ✅
node scripts/seed-italian-content.js         # Experiences IT ✅
node scripts/seed-german-packages.js         # Packages DE ✅
node scripts/seed-german-content.js          # Experiences DE ✅
node scripts/seed-hero-about-automated.js    # Hero/About IT,DE ✅

# Utilidades
node scripts/upload-images.js                # Subir imágenes desde downloads/
node scripts/sync-package-order.js           # Sincronizar orden ✅
node scripts/verify-completion.js            # Auditar contenido

# Limpieza (usar con precaución)
node scripts/delete-english-content.js       # Eliminar Packages+Experiences EN
node scripts/delete-duplicate-packages.js    # Eliminar duplicados IT/DE
node scripts/delete-experiences-it-de.js     # Eliminar Experiences IT/DE
```

> ✅ = Script idempotente (seguro ejecutar múltiples veces)

## 🌍 Gestión de Idiomas

### Estructura i18n
```
ES (español) - Locale por defecto
├── EN (inglés) - Traducción completa
├── IT (italiano) - Traducción completa  
└── DE (alemán) - Traducción completa
```

### Cómo Agregar un Nuevo Idioma

1. **Habilitar locale en Strapi**
   ```
   Settings → Internationalization → Add new locale
   ```

2. **Crear script de seed** (copiar y adaptar `seed-german-packages.js`)

3. **Agregar traducciones al diccionario** en el script

4. **Ejecutar seed**
   ```bash
   node scripts/seed-<idioma>-packages.js
   node scripts/seed-<idioma>-content.js  # experiences
   ```

### Cómo Agregar un Nuevo Package

1. **Agregar a `create-spanish-content.js`** en el array `packages`

2. **Agregar traducciones** en cada script de idioma:
   - `seed-english-content.js` → `PACKAGE_TRANSLATIONS`
   - `seed-italian-packages.js` → `PACKAGE_TRANSLATIONS`
   - `seed-german-packages.js` → `PACKAGE_TRANSLATIONS`

3. **Preparar imágenes** en `downloads/packages/`:
   ```
   <slug>-thumbnail.jpg
   <slug>-hero.jpg
   ```

4. **Actualizar `upload-images.js`** agregando al array `packageImages`

5. **Ejecutar seed**
   ```bash
   node scripts/create-spanish-content.js
   node scripts/upload-images.js
   node scripts/seed-all.js  # O cada idioma individualmente
   ```

## 📂 Estructura del Proyecto

```
dolovibes-backend/
├── config/           # Configuración de Strapi
├── database/         # Migraciones
├── downloads/        # Imágenes para subir a Strapi
│   ├── experiences/
│   └── packages/
├── public/uploads/   # Media library de Strapi
├── scripts/          # Scripts de seed y utilidades
│   ├── seed-*.js     # Scripts de población
│   ├── delete-*.js   # Scripts de limpieza
│   └── README.md     # Documentación de scripts
├── src/
│   ├── api/          # Content-Types (Experience, Package, etc)
│   └── extensions/   # Extensiones de Strapi
└── types/            # TypeScript definitions

```

## 🔄 Flujo de Trabajo

### Para Desarrollo Local
1. `npm run develop` - Backend en http://localhost:1337
2. Modificar content-types en Admin Panel si es necesario
3. Los cambios en `schema.json` se commitean automáticamente

### Para Agregar Contenido
1. Agregar/editar en scripts de seed
2. Ejecutar script correspondiente
3. Verificar en Admin Panel
4. Commit de scripts actualizados

### Para Producción
1. Push de cambios al repo
2. En servidor: `npm install && npm run build && npm start`
3. Ejecutar scripts de seed en producción si hay contenido nuevo

## 🐛 Troubleshooting

### Error: "STRAPI_API_TOKEN no configurado"
- Genera un API Token en Settings → API Tokens
- Agrégalo al archivo `.env`

### Las imágenes no se ven en el frontend
1. Verifica que existan en `public/uploads/`
2. Ejecuta `node scripts/upload-images.js`
3. Verifica permisos públicos en Settings → Roles → Public

### Content type schema changes
- Si cambias un content-type, Strapi puede pedir rebuild
- `npm run build` y reiniciar servidor

### Scripts fallan con "documentId no encontrado"
- Asegúrate de haber ejecutado el contenido ES primero
- Los scripts EN/IT/DE dependen de que exista contenido ES

## 📚 Documentación

- [Guía de Scripts](scripts/README.md)
- [Inventario de Scripts](scripts/SCRIPTS-INVENTORY.md)
- [Strapi Documentation](https://docs.strapi.io)
- [API Reference](http://localhost:1337/documentation)

## 🤝 Contribuir

1. Crear branch desde `integracion-strapi`
2. Hacer cambios y commit
3. Push y crear Pull Request
4. Asegurar que scripts sean idempotentes

## 📄 Licencia

Ver `license.txt`


---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
