# 📖 Guía de Administración de Contenido - DoloVibes

## 🎯 Para el Equipo de Marketing

Esta guía explica cómo administrar el contenido del sitio web de DoloVibes usando Strapi CMS.

---

## 📍 Acceso al Panel de Administración

1. **URL**: `http://localhost:1337/admin`
2. **Inicio de sesión**: Usa tus credenciales proporcionadas

---

## 📦 Contenido Principal

### Paquetes (Packages)

Los paquetes son los productos principales del sitio. Cada paquete es un viaje específico.

**Campos importantes:**

| Campo | Descripción | ¿Traducible? |
|-------|-------------|:------------:|
| Title | Nombre del paquete (ej: "Hut 2 Hut - Dolomitas Clásico") | ✅ Sí |
| Description | Descripción corta del paquete | ✅ Sí |
| Location | Ubicación del viaje | ✅ Sí |
| Duration | Duración (ej: "5 Días" / "5 Days") | ✅ Sí |
| Price Amount | Precio en MXN (número) | ❌ No |
| Season | Temporada (summer/winter) | ❌ No |
| Itinerary | Días del itinerario | ✅ Sí |
| Includes | Qué incluye el paquete | ✅ Sí |
| Gallery | Fotos adicionales con caption | ✅ Sí |

### Experiencias (Experiences)

Las experiencias son categorías de viajes (Hut 2 Hut, Hiking, Ski, etc.).

---

## 🌍 Idiomas (Internacionalización)

El sitio soporta 6 idiomas:
- 🇪🇸 Español (ES) - Idioma principal
- 🇺🇸 Inglés (EN)
- 🇮🇹 Italiano (IT)
- 🇵🇹 Portugués (PT)
- 🇫🇷 Francés (FR)
- 🇩🇪 Alemán (DE)

### Cómo crear contenido en otro idioma:

1. Ve a **Content Manager** → **Packages**
2. Abre el paquete que quieres traducir
3. En la esquina superior derecha, haz clic en el **selector de idioma** (muestra "ES")
4. Selecciona el idioma al que quieres traducir (ej: "EN")
5. Verás un botón **"Fill in from another locale"** - úsalo para copiar el contenido de español
6. Traduce los campos marcados con 🌐 (son los únicos que cambian por idioma)
7. Haz clic en **Save** y luego **Publish**

### Campos que NO necesitan traducirse:
- Precio
- Rating
- Temporada (summer/winter)
- Imágenes
- Fechas de inicio

---

## 🖼️ Gestión de Imágenes

### Galería de Paquetes

Cada paquete puede tener una galería de fotos adicionales.

**Para agregar fotos a la galería:**

1. Abre el paquete
2. Busca la sección **"🖼️ Foto de Galería"**
3. Haz clic en **"Add component"**
4. Sube la imagen
5. Escribe un **caption** (pie de foto) - este SÍ se traduce por idioma
6. Guarda

### Itinerario con Imágenes

Cada día del itinerario puede tener su propia imagen:

1. Abre el paquete
2. Busca **"📅 Día de Itinerario"**
3. Cada día tiene un campo **image** - haz clic para subir foto
4. Las imágenes son las mismas en todos los idiomas

---

## ✅ Checklist para Nuevo Paquete

- [ ] Crear paquete en español (idioma base)
- [ ] Agregar título y descripción
- [ ] Subir imagen principal (thumbnail y heroImage)
- [ ] Configurar precio y duración
- [ ] Agregar itinerario día por día con imágenes
- [ ] Agregar "includes" y "not includes"
- [ ] Agregar fotos a la galería con captions
- [ ] Relacionar con la Experiencia correcta
- [ ] **PUBLICAR** (botón verde)
- [ ] Crear versiones en otros idiomas (opcional pero recomendado)

---

## 🔄 Flujo de Publicación

```
Draft (Borrador)  →  Published (Publicado)
     ↑                      |
     |                      ↓
     └─── Modified (Modificado)
```

- **Draft**: No visible en el sitio
- **Published**: Visible para todos los usuarios
- **Modified**: Hay cambios sin publicar

Para publicar contenido, haz clic en el botón verde **"Publish"**.

---

## ❓ Preguntas Frecuentes

### ¿Por qué no veo el contenido en el sitio?
- Verifica que el contenido esté **Published** (no en Draft)
- Espera unos segundos después de publicar

### ¿Puedo eliminar un idioma de un paquete?
- Sí, ve al paquete en el idioma que quieres eliminar y haz clic en "Delete"

### ¿Qué pasa si no traduzco a todos los idiomas?
- El sitio automáticamente muestra el contenido en español si no existe traducción

### ¿Cómo cambio el precio?
- Los precios se manejan en el campo `Price Amount` (número)
- El formato de moneda se controla desde el frontend según el país del usuario

---

## 📞 Soporte

Si tienes problemas o dudas, contacta al equipo de desarrollo.
