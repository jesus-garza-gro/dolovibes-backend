# Cómo Subir y Configurar Imágenes para el Script de Descarga

Este documento explica cómo preparar las imágenes para que tu equipo pueda descargarlas automáticamente.

## Opción 1: GitHub Release (Recomendado)

1. **Comprimir las imágenes:**
```bash
cd dolovibes-backend
tar -czf downloads-images.tar.gz downloads/
```

2. **Crear un Release en GitHub:**
- Ve a tu repositorio en GitHub
- Releases → Create a new release
- Tag: `images-v1.0`
- Title: "Project Images"
- Adjuntar `downloads-images.tar.gz`
- Publish release

3. **Obtener la URL de descarga:**
```
https://github.com/usuario/dolovibes-backend/releases/download/images-v1.0/downloads-images.tar.gz
```

4. **Usar esta URL en el script:**
```bash
# Tu compañero ejecuta:
wget https://github.com/.../downloads-images.tar.gz
tar -xzf downloads-images.tar.gz
```

---

## Opción 2: Google Drive

1. **Subir carpeta downloads/ a Google Drive**

2. **Compartir con acceso público:**
- Click derecho → Share → Anyone with the link can view
- Copiar el link compartido

3. **Convertir a URL de descarga directa:**

Usar herramienta: https://sites.google.com/site/gdocs2direct/

O manualmente:
```
Link: https://drive.google.com/file/d/XXXXX/view?usp=sharing
Directo: https://drive.google.com/uc?export=download&id=XXXXX
```

---

## Opción 3: Dropbox

1. **Subir a Dropbox**

2. **Obtener enlace compartido**

3. **Modificar URL:**
```
Original: https://www.dropbox.com/s/abc123/file.jpg?dl=0
Directo:  https://www.dropbox.com/s/abc123/file.jpg?dl=1
```
(Cambiar `dl=0` por `dl=1`)

---

## Opción 4: URLs Individuales

Si prefieres URLs individuales por imagen, edita `scripts/image-urls.json`:

```json
{
  "experiences": {
    "city-lights-hero.jpg": "https://ejemplo.com/img1.jpg",
    "city-lights-thumbnail.jpg": "https://ejemplo.com/img2.jpg"
  },
  "packages": {
    "city-lights-norte-italia-hero.jpg": "https://ejemplo.com/img3.jpg"
  }
}
```

---

## Script de Descarga Automática

Una vez configuradas las URLs, tu compañero ejecuta:

```bash
cd dolovibes-backend

# Si usas archivo comprimido (Opción 1):
wget URL_DEL_ARCHIVO_TAR_GZ
tar -xzf downloads-images.tar.gz

# Si usas URLs individuales (Opción 4):
node scripts/download-images.js
```

---

## Recomendación

**GitHub Release** es la mejor opción porque:
- ✅ Versionado de assets
- ✅ Integrado con el proyecto
- ✅ Descarga rápida y confiable
- ✅ No requiere cuentas externas
