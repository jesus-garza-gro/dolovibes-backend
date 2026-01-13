#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  🏔️ DOLOVIBES - INSTALACIÓN LIMPIA DE STRAPI
# ═══════════════════════════════════════════════════════════════
#
# Este script configura una instalación nueva desde cero.
# Ejecutar desde la raíz del proyecto dolovibes-backend.
#
# REQUISITOS:
#   - Node.js 20+ LTS
#   - npm instalado
#
# USO:
#   chmod +x scripts/fresh-install.sh
#   ./scripts/fresh-install.sh
#
# ═══════════════════════════════════════════════════════════════

set -e  # Salir si hay error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funciones de utilidad
print_header() {
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  🏔️  DOLOVIBES - Instalación Limpia${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# ═══════════════════════════════════════════════════════════════
# INICIO
# ═══════════════════════════════════════════════════════════════

print_header

# Verificar que estamos en la carpeta correcta
if [ ! -f "package.json" ]; then
    print_error "Ejecuta este script desde la raíz del proyecto dolovibes-backend"
    exit 1
fi

# ───────────────────────────────────────────────────────────────
# PASO 1: Verificar/Instalar dependencias
# ───────────────────────────────────────────────────────────────
print_step "PASO 1: Verificando dependencias..."

if [ ! -d "node_modules" ]; then
    print_warning "node_modules no encontrado, instalando dependencias..."
    npm install
else
    print_success "Dependencias ya instaladas"
fi

# ───────────────────────────────────────────────────────────────
# PASO 2: Configurar archivo .env
# ───────────────────────────────────────────────────────────────
print_step "PASO 2: Verificando configuración..."

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_warning "Archivo .env creado desde .env.example"
        print_warning "⚠️  IMPORTANTE: Deberás agregar STRAPI_API_TOKEN después del primer login"
    else
        print_error "No se encontró .env ni .env.example"
        exit 1
    fi
else
    print_success "Archivo .env existente"
fi

# ───────────────────────────────────────────────────────────────
# PASO 3: Limpiar base de datos (opcional)
# ───────────────────────────────────────────────────────────────
echo ""
print_step "PASO 3: ¿Deseas limpiar la base de datos existente?"
echo "   Esto borrará TODO el contenido actual de Strapi."
read -p "   Limpiar base de datos? (s/N): " clean_db

if [[ "$clean_db" =~ ^[Ss]$ ]]; then
    print_warning "Limpiando base de datos..."
    rm -rf .tmp/data.db 2>/dev/null || true
    rm -rf database/*.db 2>/dev/null || true
    print_success "Base de datos limpiada"
else
    print_success "Base de datos conservada"
fi

# ───────────────────────────────────────────────────────────────
# PASO 4: Instrucciones de configuración inicial
# ───────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  📋 CONFIGURACIÓN INICIAL REQUERIDA${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Ahora debes completar estos pasos manualmente:"
echo ""
echo -e "${YELLOW}1. INICIAR STRAPI:${NC}"
echo "   npm run develop"
echo ""
echo -e "${YELLOW}2. CREAR USUARIO ADMIN:${NC}"
echo "   Abre http://localhost:1337/admin"
echo "   Crea tu cuenta de administrador"
echo ""
echo -e "${YELLOW}3. GENERAR API TOKEN:${NC}"
echo "   Settings → API Tokens → Create new API Token"
echo "   Name: 'Frontend Token'"
echo "   Token type: 'Full access'"
echo "   Copia el token al archivo .env:"
echo "   STRAPI_API_TOKEN=tu_token_aqui"
echo ""
echo -e "${YELLOW}4. CONFIGURAR LOCALES (i18n):${NC}"
echo "   Settings → Internationalization → Add new locale"
echo "   Agregar: en (English), it (Italiano), de (Deutsch)"
echo "   Nota: es (Español) debe ser el default"
echo ""
echo -e "${YELLOW}5. CONFIGURAR PERMISOS PÚBLICOS:${NC}"
echo "   Settings → Users & Permissions → Roles → Public"
echo "   Habilitar find y findOne para:"
echo "   - Experience"
echo "   - Package"
echo "   - Hero Section"
echo "   - About Page"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
read -p "Presiona ENTER cuando hayas completado los pasos anteriores..."

# ───────────────────────────────────────────────────────────────
# PASO 5: Verificar que Strapi está corriendo
# ───────────────────────────────────────────────────────────────
print_step "PASO 5: Verificando conexión con Strapi..."

max_retries=3
retry_count=0

while [ $retry_count -lt $max_retries ]; do
    if curl -s http://localhost:1337/_health > /dev/null 2>&1; then
        print_success "Strapi está ejecutándose"
        break
    else
        retry_count=$((retry_count + 1))
        if [ $retry_count -lt $max_retries ]; then
            print_warning "Strapi no responde. Reintentando en 5 segundos... ($retry_count/$max_retries)"
            sleep 5
        else
            print_error "Strapi no está ejecutándose en localhost:1337"
            echo "   Asegúrate de ejecutar: npm run develop"
            exit 1
        fi
    fi
done

# ───────────────────────────────────────────────────────────────
# PASO 6: Verificar API Token
# ───────────────────────────────────────────────────────────────
print_step "PASO 6: Verificando API Token..."

if grep -q "STRAPI_API_TOKEN=.\+" .env; then
    print_success "API Token configurado"
else
    print_error "STRAPI_API_TOKEN no configurado en .env"
    echo "   Genera un token en Strapi Admin y agrégalo al .env"
    exit 1
fi

# ───────────────────────────────────────────────────────────────
# PASO 7: Poblar contenido
# ───────────────────────────────────────────────────────────────
echo ""
print_step "PASO 7: Poblando contenido con seed-all.js..."
echo ""

node scripts/seed-all.js

# ───────────────────────────────────────────────────────────────
# PASO 8: Verificación final
# ───────────────────────────────────────────────────────────────
echo ""
print_step "PASO 8: Verificación final..."

node scripts/verify-completion.js

# ───────────────────────────────────────────────────────────────
# FIN
# ───────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  🎉 ¡INSTALACIÓN COMPLETADA!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Tu backend de Strapi está listo con:"
echo "  • 7 Packages en 4 idiomas (ES, EN, IT, DE)"
echo "  • 6 Experiences en 4 idiomas"
echo "  • Hero Section en 4 idiomas"
echo "  • About Page en 4 idiomas"
echo ""
echo "Próximos pasos:"
echo "  1. Frontend: cd ../dolovibes && npm run dev"
echo "  2. Admin: http://localhost:1337/admin"
echo ""
