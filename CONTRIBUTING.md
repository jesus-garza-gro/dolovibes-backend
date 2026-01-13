# Contributing to Dolovibes

Gracias por tu interés en contribuir a Dolovibes! Esta guía te ayudará a empezar.

## 🚀 Configuración Inicial

1. **Fork el repositorio**
2. **Clona tu fork:**
   ```bash
   git clone https://github.com/tu-usuario/dolovibes-backend.git
   cd dolovibes-backend
   ```
3. **Sigue la [guía de setup](./README.md)**

## 🌿 Branching Strategy

- `main` - Producción estable
- `integracion-strapi` - Desarrollo activo
- `feature/nombre` - Nuevas características
- `fix/nombre` - Correcciones de bugs

## 📝 Proceso de Contribución

1. **Crear una rama:**
   ```bash
   git checkout -b feature/mi-nueva-caracteristica
   ```

2. **Hacer cambios y commits:**
   ```bash
   git add .
   git commit -m "feat: descripción clara del cambio"
   ```

3. **Push y crear Pull Request:**
   ```bash
   git push origin feature/mi-nueva-caracteristica
   ```

## 💬 Formato de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato, sin cambios de código
- `refactor:` Refactorización
- `test:` Agregar tests
- `chore:` Mantenimiento

**Ejemplos:**
```
feat: add Italian language support to packages
fix: resolve CORS issue with frontend
docs: update installation instructions
```

## 🧪 Testing

Antes de hacer PR:
- Verificar que el servidor inicia: `npm run develop`
- Probar endpoints críticos
- Verificar que los seeds funcionan: `node scripts/seed-all.js --verify`

## 📋 Pull Request Checklist

- [ ] Código sigue las convenciones del proyecto
- [ ] Commits siguen Conventional Commits
- [ ] Documentación actualizada si es necesario
- [ ] Probado localmente
- [ ] Sin console.logs innecesarios

## 🐛 Reportar Bugs

Usa los [GitHub Issues](https://github.com/tu-org/dolovibes-backend/issues):

**Template:**
```markdown
**Descripción del bug:**
Descripción clara del problema.

**Pasos para reproducir:**
1. Ir a '...'
2. Click en '...'
3. Ver error

**Comportamiento esperado:**
Qué debería pasar.

**Screenshots:**
Si aplica.

**Entorno:**
- OS: [e.g. macOS 14.5]
- Node: [e.g. 20.11.0]
- Navegador: [e.g. Chrome 120]
```

## 💡 Sugerir Mejoras

También usa [GitHub Issues](https://github.com/tu-org/dolovibes-backend/issues):

**Template:**
```markdown
**¿Qué problema resuelve?**
Descripción del problema o necesidad.

**Propuesta de solución:**
Tu idea para resolverlo.

**Alternativas consideradas:**
Otras opciones que pensaste.
```

## 📚 Recursos

- [Strapi Documentation](https://docs.strapi.io/)
- [React Documentation](https://react.dev/)
- [Scripts README](./scripts/README.md)

## ❓ Preguntas

Si tienes dudas, abre un [Discussion](https://github.com/tu-org/dolovibes-backend/discussions) en GitHub.

---

**¡Gracias por contribuir! 🏔️**
