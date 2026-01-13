# Deployment Guide - Dolovibes

Guía paso a paso para hacer deployment de Dolovibes en producción.

---

## 📋 Requisitos de Producción

### Backend (Strapi)
- Node.js 20 LTS
- Base de datos PostgreSQL o MySQL (recomendado)
- Servidor con al menos 1GB RAM
- Storage para imágenes subidas

### Frontend (React)
- Servidor web estático (Nginx, Apache, Vercel, Netlify)
- Node.js 20 LTS (solo para build)

---

## 🚀 Backend Deployment

### 1. Preparar Base de Datos

**PostgreSQL (Recomendado):**
```bash
# Crear base de datos
createdb dolovibes_prod

# O via psql
psql -U postgres
CREATE DATABASE dolovibes_prod;
CREATE USER dolovibes_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE dolovibes_prod TO dolovibes_user;
```

### 2. Configurar Variables de Entorno

Crear archivo `.env` en el servidor:

```bash
# Entorno
NODE_ENV=production

# Servidor
HOST=0.0.0.0
PORT=1337

# Seguridad - GENERAR NUEVAS KEYS
APP_KEYS="key1_generada,key2_generada,key3_generada,key4_generada"
API_TOKEN_SALT=salt_generado
ADMIN_JWT_SECRET=secret_generado
TRANSFER_TOKEN_SALT=salt_generado
JWT_SECRET=secret_generado
ENCRYPTION_KEY=key_generada

# Frontend URL (tu dominio de producción)
FRONTEND_URL=https://www.dolovibes.com

# Base de datos PostgreSQL
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=dolovibes_prod
DATABASE_USERNAME=dolovibes_user
DATABASE_PASSWORD=tu_password_seguro
DATABASE_SSL=false

# API Token para scripts
STRAPI_API_TOKEN=tu_token_generado
```

**Generar keys seguras:**
```bash
openssl rand -base64 32  # Repetir para cada KEY/SALT/SECRET
```

### 3. Clonar y Configurar

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/dolovibes-backend.git
cd dolovibes-backend

# Instalar dependencias de producción
npm ci --omit=dev

# Construir Strapi
npm run build
```

### 4. Poblar Contenido Inicial

```bash
# Iniciar Strapi temporalmente
npm run develop

# En otra terminal:
# 1. Crear usuario admin en http://tu-servidor:1337/admin
# 2. Configurar locales (ES, EN, IT, DE) en Settings → Internationalization
# 3. Generar API Token en Settings → API Tokens
# 4. Agregar token al .env

# Copiar imágenes a downloads/
# (transferir via scp, rsync, o similar)

# Ejecutar seeds
node scripts/seed-all.js
```

### 5. Configurar Process Manager (PM2)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar Strapi
pm2 start npm --name "dolovibes-backend" -- run start

# Auto-restart en reboot
pm2 startup
pm2 save

# Ver logs
pm2 logs dolovibes-backend
```

### 6. Configurar Nginx como Reverse Proxy

```nginx
# /etc/nginx/sites-available/dolovibes-backend

server {
    listen 80;
    server_name api.dolovibes.com;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Activar configuración
sudo ln -s /etc/nginx/sites-available/dolovibes-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. SSL con Certbot (HTTPS)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.dolovibes.com
```

---

## 🌐 Frontend Deployment

### Opción 1: Vercel (Recomendado - Más Fácil)

1. **Push a GitHub**
```bash
git push origin main
```

2. **Conectar en Vercel**
- Ir a https://vercel.com
- Import Project → Seleccionar repositorio
- Framework Preset: Vite
- Root Directory: `./`

3. **Configurar Variables de Entorno en Vercel:**
```
VITE_STRAPI_URL=https://api.dolovibes.com
NODE_ENV=production
```

4. **Deploy**
- Vercel hará build y deploy automáticamente
- Dominio custom: Settings → Domains

---

### Opción 2: Servidor Propio (VPS/Nginx)

#### 1. Build Local

```bash
# En tu máquina local o CI/CD
cd dolovibes

# Configurar variables para producción
cat > .env.production << EOF
VITE_STRAPI_URL=https://api.dolovibes.com
NODE_ENV=production
EOF

# Construir
npm run build
# Output: dist/
```

#### 2. Subir a Servidor

```bash
# Via rsync
rsync -avz --delete dist/ user@servidor:/var/www/dolovibes/

# O via scp
scp -r dist/* user@servidor:/var/www/dolovibes/
```

#### 3. Configurar Nginx

```nginx
# /etc/nginx/sites-available/dolovibes-frontend

server {
    listen 80;
    server_name www.dolovibes.com dolovibes.com;
    root /var/www/dolovibes;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Cache estático
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/dolovibes-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 4. SSL

```bash
sudo certbot --nginx -d www.dolovibes.com -d dolovibes.com
```

---

## 🔄 Actualizar Deployment

### Backend
```bash
cd dolovibes-backend
git pull
npm ci --omit=dev
npm run build
pm2 restart dolovibes-backend
```

### Frontend
```bash
cd dolovibes
git pull
npm ci
npm run build
rsync -avz --delete dist/ user@servidor:/var/www/dolovibes/
```

---

## ✅ Checklist Post-Deployment

- [ ] Backend accesible en https://api.dolovibes.com
- [ ] Frontend accesible en https://www.dolovibes.com
- [ ] Admin panel: https://api.dolovibes.com/admin
- [ ] Strapi API funcionando: https://api.dolovibes.com/api/experiences
- [ ] Imágenes cargando correctamente
- [ ] Cambio de idioma funciona
- [ ] Formularios de contacto funcionan
- [ ] HTTPS configurado en ambos
- [ ] Backups de base de datos configurados
- [ ] Monitoring configurado (opcional: UptimeRobot, PM2 Plus)

---

## 🚨 Troubleshooting

### Error "Cannot connect to Strapi"
- Verificar VITE_STRAPI_URL en frontend
- Verificar CORS en backend (.env → FRONTEND_URL)

### Imágenes no cargan
- Verificar permisos en public/uploads/: `chmod -R 755`
- Verificar que las imágenes se subieron con scripts

### 502 Bad Gateway
- Verificar que Strapi está corriendo: `pm2 status`
- Ver logs: `pm2 logs dolovibes-backend`

### Build falla
- Limpiar caché: `rm -rf node_modules dist && npm install`
- Verificar versión de Node: `node -v` (debe ser 20+)
