# 🏔️ Dolovibes Backend - Strapi CMS

Backend en Strapi 5 para el sitio web de Dolovibes, agencia de viajes especializada en experiencias en los Dolomitas.

## ⚡ Instalación Rápida (Primera Vez)

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd dolovibes-backend

# 2. Instalar dependencias
npm install

# 3. Ejecutar instalación guiada
./scripts/fresh-install.sh
```

El script `fresh-install.sh` te guiará paso a paso para configurar todo.

---

## 📋 Requisitos Previos

- Node.js 20+ LTS
- npm o yarn

## 🚀 Comandos

### Desarrollo
```bash
npm run develop    # Servidor con hot-reload en http://localhost:1337
npm run start      # Servidor de producción
npm run build      # Compilar admin panel
```

### Poblar contenido
```bash
node scripts/seed-all.js           # Ejecutar todos los seeds
node scripts/seed-all.js --verify  # Solo verificar estado
node scripts/seed-all.js --lang=it # Solo un idioma
node scripts/seed-all.js --dry-run # Ver plan sin ejecutar
```

---

## ⚙️ Configuración Manual (Alternativa)

Si prefieres configurar manualmente en lugar de usar `fresh-install.sh`:

### 1. Configurar Variables de Entorno
```bash
cp .env.example .env
```

### 2. Iniciar Strapi
```bash
npm run develop
```

### 3. Crear Usuario Admin
1. Abre http://localhost:1337/admin
2. Crea tu cuenta de administrador

### 4. Generar API Token
1. Settings → API Tokens → Create new API Token
2. Name: `Frontend Token`
3. Token type: `Full access`
4. Copia el token al `.env`:
   ```
   STRAPI_API_TOKEN=tu_token_aqui
   ```

### 5. Configurar Locales (i18n)
1. Settings → Internationalization
2. Agregar: `en`, `it`, `de`
3. Verificar que `es` sea default

### 6. Configurar Permisos Públicos
1. Settings → Users & Permissions → Roles → Public
2. Habilitar `find` y `findOne` para:
   - Experience
   - Package
   - Hero Section
   - About Page

### 7. Poblar Contenido
```bash
node scripts/seed-all.js
```

---

## 📂 Estructura del Proyecto

```
dolovibes-backend/
├── config/           # Configuración de Strapi
├── database/         # Base de datos SQLite (dev)
├── downloads/        # Imágenes para subir a Strapi
│   ├── experiences/
│   └── packages/
├── public/uploads/   # Media library de Strapi
├── scripts/          # Scripts de instalación y seed
│   ├── fresh-install.sh    # ⭐ Instalación guiada
│   ├── seed-all.js         # Script maestro de seeds
│   └── README.md           # Documentación de scripts
├── src/
│   ├── api/          # Content-Types
│   └── extensions/   # Extensiones de Strapi
└── types/            # TypeScript definitions
```

---

## 🌍 Idiomas Soportados

| Código | Idioma | Estado |
|--------|--------|--------|
| `es` | Español | Default |
| `en` | English | ✅ Completo |
| `it` | Italiano | ✅ Completo |
| `de` | Deutsch | ✅ Completo |

### Contenido por Idioma

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

---

## 🐛 Troubleshooting

### Error: "STRAPI_API_TOKEN no configurado"
- Genera un API Token en Settings → API Tokens
- Agrégalo al archivo `.env`

### Las imágenes no se ven en el frontend
1. Verifica que existan en `public/uploads/`
2. Ejecuta `node scripts/upload-images.js`
3. Verifica permisos públicos

### Error: "documentId no encontrado"
- Ejecuta el contenido español primero: `node scripts/create-spanish-content.js`

---

## 📚 Documentación

- [Guía de Scripts](scripts/README.md)
- [Strapi Documentation](https://docs.strapi.io)
- [API Reference](http://localhost:1337/documentation)

---

## 📄 Licencia

Ver `license.txt`
