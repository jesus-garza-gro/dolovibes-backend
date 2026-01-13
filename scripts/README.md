# 🏔️ Scripts de Dolovibes Backend

Documentación de scripts para poblar y gestionar contenido en Strapi.

## ⚡ Instalación Limpia (Primera Vez)

Para una instalación nueva desde cero, ejecuta:

```bash
./scripts/fresh-install.sh
```

Este script te guiará paso a paso para:
1. Instalar dependencias
2. Configurar el archivo `.env`
3. Crear usuario admin en Strapi
4. Generar API Token
5. Configurar locales (ES, EN, IT, DE)
6. Poblar todo el contenido

---

## 📦 Scripts Disponibles

### Script Maestro

| Script | Descripción |
|--------|-------------|
| `fresh-install.sh` | **Instalación guiada completa** - Ejecutar para setup inicial |
| `seed-all.js` | Ejecuta todos los seeds en orden correcto |

### Scripts de Seed (Idempotentes ✅)

| Script | Descripción |
|--------|-------------|
| `create-spanish-content.js` | Contenido base ES (packages, experiences, hero, about) |
| `upload-images.js` | Sube imágenes desde `downloads/` a Strapi |
| `seed-english-content.js` | Traducciones EN de packages |
| `seed-experiences-english.js` | Traducciones EN de experiences |
| `seed-italian-packages.js` | Traducciones IT de packages |
| `seed-italian-content.js` | Traducciones IT de experiences |
| `seed-german-packages.js` | Traducciones DE de packages |
| `seed-german-content.js` | Traducciones DE de experiences |
| `seed-hero-about-automated.js` | Hero/About para IT y DE |

### Verificación

| Script | Descripción |
|--------|-------------|
| `verify-completion.js` | Audita estado de contenido por locale |

---

## 🚀 Uso Rápido

### Primera instalación
```bash
./scripts/fresh-install.sh
```

### Repoblar contenido (si ya tienes Strapi configurado)
```bash
node scripts/seed-all.js
```

### Verificar estado actual
```bash
node scripts/seed-all.js --verify
```

### Solo un idioma específico
```bash
node scripts/seed-all.js --lang=it
```

### Ver plan sin ejecutar
```bash
node scripts/seed-all.js --dry-run
```

---

## 📋 Requisitos Previos

1. **Node.js 20+ LTS**
2. **Strapi ejecutándose**: `npm run develop`
3. **API Token configurado** en `.env`:
   ```
   STRAPI_API_TOKEN=tu_token_aqui
   ```
4. **Locales habilitados**: `es` (default), `en`, `it`, `de`
5. **Permisos públicos**: find/findOne para Experience, Package, Hero Section, About Page

---

## 📊 Estado Final Esperado

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

---

## 🔧 Troubleshooting

### Error: "STRAPI_API_TOKEN no configurado"
- Genera un API Token en Settings → API Tokens
- Agrégalo al archivo `.env`

### Error: "Strapi no está ejecutándose"
- Ejecuta: `npm run develop`

### Locale no existe
- Settings → Internationalization → Add locale
- Códigos: `es`, `en`, `it`, `de`

---

## 📚 Referencias

- [Documentación principal](../README.md)
- [Strapi i18n Docs](https://docs.strapi.io/dev-docs/plugins/i18n)
