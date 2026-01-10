# 📝 Guía de Campos de Package

## Campos de Precio

### `priceAmount` ✅ USAR
- **Tipo**: Decimal
- **Descripción**: Monto numérico del precio base
- **Moneda**: Siempre en MXN (pesos mexicanos)
- **Ejemplo**: `25000` (sin formato)
- **Uso**: Se convierte automáticamente a la moneda seleccionada por el usuario

### `baseCurrency` ⚠️ DEPRECADO
- **Tipo**: Enum (MXN, USD, EUR)
- **Estado**: Campo marcado como `private: true`
- **Razón**: Ahora usamos conversión automática de moneda
- **Valor**: Siempre debe ser `MXN`
- **Acción**: No modificar, se mantiene por compatibilidad

### `originalPriceAmount` ✅ USAR
- **Tipo**: Decimal (opcional)
- **Descripción**: Precio original para mostrar descuento
- **Ejemplo**: Si el precio es $25,000 con descuento, poner $35,000
- **Uso**: Se muestra tachado junto al precio con descuento

---

## Campos de Disponibilidad

### `availableDates` ✅ USAR - IMPORTANTE
- **Tipo**: String (localizado)
- **Descripción**: Rango amigable de meses de disponibilidad
- **Propósito**: Mostrar al visitante cuándo está disponible el tour
- **Localizado**: SÍ (debe traducirse)

**Ejemplos correctos:**
- ✅ `"Disponible de Junio a Septiembre"` (ES)
- ✅ `"Available from June to September"` (EN)
- ✅ `"Disponible todo el año"`
- ✅ `"Disponible en Verano"`
- ✅ `"Disponible en Invierno"`
- ✅ `"Julio - Agosto"`

**Ejemplos incorrectos:**
- ❌ `"15 Jun 2025"` (muy específico, usar startDates)
- ❌ `"Summer"` (usar formato completo)
- ❌ Dejar vacío (campo importante)

**Visualización:**
- Se muestra con icono de calendario 📅
- Estilo destacado con fondo verde
- Aparece en el hero section del paquete

### `startDates` ⚠️ USO INTERNO
- **Tipo**: Componente (array)
- **Descripción**: Fechas específicas de inicio de tours
- **Uso**: Para sistema de reservas futuro
- **Visibilidad**: NO se muestra en frontend actualmente
- **Ejemplo**: `["15 Jun 2025", "22 Jun 2025"]`

---

## Resumen de Cambios (10 enero 2026)

### Implementado:
✅ Sistema de conversión automática de moneda (MXN → USD/EUR/GBP)  
✅ Detección automática de idioma  
✅ Campo `availableDates` destacado visualmente  
✅ Campo `baseCurrency` marcado como privado  

### Campos a completar en Strapi:
1. **`priceAmount`** - Siempre en MXN
2. **`availableDates`** - Texto amigable de disponibilidad (traducido)
3. **`originalPriceAmount`** - Solo si hay descuento

### Campos opcionales:
- `startDates` - Para uso futuro (sistema de reservas)

---

## Ejemplo Completo

```json
{
  "title": "Hut 2 Hut - Dolomitas Clásico",
  "priceAmount": 25000,
  "baseCurrency": "MXN",
  "availableDates": {
    "es": "Disponible de Junio a Septiembre",
    "en": "Available from June to September"
  },
  "hasDiscount": false,
  "originalPriceAmount": null
}
```

Con descuento:
```json
{
  "title": "Hut 2 Hut - Alta Via 1",
  "priceAmount": 32000,
  "originalPriceAmount": 35000,
  "baseCurrency": "MXN",
  "availableDates": {
    "es": "Disponible en Verano",
    "en": "Available in Summer"
  },
  "hasDiscount": true
}
```
