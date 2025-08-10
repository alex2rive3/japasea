# 🧪 Guía de Tests de Regresión de API - Japasea

## 🎯 Resumen

Sistema completo de **tests de regresión de API** que detecta automáticamente cambios no intencionados en las respuestas del backend, validando estructura de datos, tipos, campos y comportamiento entre versiones.

## ✨ Características Implementadas

### 🔍 **Detección Automática de Cambios**
- ✅ Cambios en status HTTP (200 → 401, 404, 500)
- ✅ Campos agregados/removidos
- ✅ Cambios en tipos de datos (string → number)
- ✅ Modificaciones en valores
- ✅ Cambios en estructura de arrays y objetos
- ✅ Headers importantes modificados

### 📸 **Sistema de Snapshots**
- ✅ Guardado automático de respuestas la primera vez
- ✅ Comparación automática en ejecuciones posteriores
- ✅ Actualización intencional de snapshots
- ✅ Diferencias detalladas con emojis y colores

### 🚀 **Múltiples Modos de Ejecución**
- ✅ **Mocks**: Testing rápido sin backend
- ✅ **Backend Local**: Validación con servidor local
- ✅ **Staging**: Testing contra entorno de staging
- ✅ **CI/CD**: Integración con pipelines automatizados

### 📊 **Validaciones Completas**
- ✅ Status HTTP y estructura básica
- ✅ Tipos de datos y rangos de valores
- ✅ Formatos específicos (fechas, emails, coordenadas)
- ✅ Lógica de negocio (ratings 0-5, coordenadas -90/90)

## 🚀 Comandos Rápidos

```bash
# 🎭 Tests rápidos con mocks (desarrollo)
npm run test:regression

# 🌐 Tests con backend local real
npm run test:regression:backend

# 🚀 Tests contra staging
npm run test:regression:staging

# 📸 Actualizar snapshots (cambios intencionados)
npm run test:regression:update

# 👀 Modo watch para desarrollo
npm run test:regression:watch

# 🤖 Modo CI/CD
npm run test:regression:ci
```

## 📁 Estructura de Archivos

```
src/
├── __tests__/
│   ├── integration/
│   │   ├── api.regression.test.js        # 🔥 Test principal completo
│   │   ├── demo.changes.test.js          # 🎯 Demostración de cambios
│   │   └── README.md                     # 📖 Documentación detallada
│   ├── snapshots/                        # 📸 Snapshots guardados
│   │   ├── auth-login-success.json
│   │   ├── places-list.json
│   │   └── ...
│   └── helpers/
│       └── apiTestUtils.ts               # 🛠️ Utilidades de testing
├── test/
│   └── setup.js                          # ⚙️ Configuración de Jest
├── scripts/
│   └── test-regression.sh                # 🚀 Scripts para casos de uso
└── jest.config.js                        # 🔧 Configuración Jest
```

## 🧪 Tests Implementados

### 🔐 **Auth API** (`api.regression.test.js`)
```javascript
✅ Login exitoso (estructura completa de usuario + tokens)
✅ Error de credenciales inválidas (401)
✅ Validaciones de tipos de datos
✅ Estructura de respuesta consistente
```

### 🗺️ **Places API** 
```javascript
✅ Lista de lugares (array de lugares con coordenadas)
✅ Búsqueda con resultados
✅ Validación de coordenadas (-90/90, -180/180)
✅ Estructura de rating (0-5)
```

### 💖 **Favorites API**
```javascript
✅ Lista de favoritos de usuario
✅ Estadísticas y contadores
✅ Validación de autenticación requerida
```

### 🎯 **Demo Interactiva**
```javascript
✅ Demostración visual de cambios detectados
✅ Ejemplos de todos los tipos de cambios
✅ Flujo completo de actualización
```

## 📈 Ejemplo de Output

### ✅ **Tests Exitosos (Sin Cambios)**
```
✓ DEBE mantener estructura de login exitoso (2ms)
✓ DEBE mantener estructura de lista de lugares (1ms)
✓ DEBE mantener estructura de búsqueda de lugares (1ms)

Tests: 6 passed
📸 Usando snapshots existentes
```

### 🚨 **Cambios Detectados**
```
🚨 CAMBIOS DETECTADOS EN LOGIN:
  1. data.user.name: 🔄 Valor cambió de Test User a Updated User
  2. data.user.lastLogin: ➕ Nueva propiedad agregada
  3. data.user.phone: ➖ Propiedad removida

💡 ACCIONES DISPONIBLES:
   ✅ Si los cambios son INTENCIONADOS:
      npm run test:regression:update
   ❌ Si los cambios son ERRORES:
      → Revisar y corregir el backend
      → Ejecutar tests nuevamente

Error: Respuesta de login ha cambiado
```

### 📸 **Snapshot Actualizado**
```
🎭 Ejecutando con mocks...
📸 Snapshot guardado: auth-login-success
✅ Snapshot actualizado

✓ DEBE mantener estructura de login exitoso (203ms)
Tests: 6 passed
```

## 🔄 Flujo de Trabajo Recomendado

### 1. **Desarrollo Continuo**
```bash
# Durante desarrollo de features
npm run test:regression          # Verificar que no rompes APIs existentes
```

### 2. **Antes de Deploy**
```bash
# Validar con backend real antes de subir
npm run test:regression:backend  # Con tu backend local
npm run test:regression:staging  # Con staging
```

### 3. **Cambios Intencionados en API**
```bash
# Cuando actualizas intencionalmente la API
npm run test:regression:update   # Actualizar snapshots
git add src/__tests__/snapshots/ 
git commit -m "docs: update API snapshots for v2.1.0"
```

### 4. **CI/CD Pipeline**
```yaml
# En tu archivo .github/workflows/test.yml
- name: API Regression Tests
  run: npm run test:regression:ci
  env:
    USE_REAL_BACKEND: false  # Usar mocks para CI rápido
```

### 5. **Debugging de Issues**
```bash
# Para investigar qué cambió exactamente
npm run test:regression:backend  # Ver diferencias detalladas
```

## 🛠️ Configuración Avanzada

### Variables de Entorno
```bash
# Backend real vs mocks
export USE_REAL_BACKEND=true/false      # default: false

# URL del backend
export VITE_API_URL=http://localhost:3001  # default

# Actualizar snapshots
export UPDATE_SNAPSHOTS=true/false      # default: false

# Entorno específico
export VITE_API_URL=https://api-staging.japasea.com
```

### Personalización
```javascript
// En apiTestUtils.ts
const mockResponses = {
  'nuevo-endpoint': {
    status: 200,
    data: { /* tu mock personalizado */ }
  }
}
```

## 📊 Beneficios del Sistema

### 🛡️ **Prevención de Regresiones**
- Detecta cambios no intencionados automáticamente
- Falla el build antes de llegar a producción
- Protege contra breaking changes accidentales

### 📚 **Documentación Viva**
- Los snapshots documentan la estructura actual de la API
- Historial de cambios en git
- Fácil de revisar qué cambió entre versiones

### 🤝 **Mejor Comunicación**
- Frontend y backend equipos alineados en cambios
- Cambios visibles y documentados
- Reduce bugs en producción

### 🚀 **Deploys Seguros**
- Confianza en que la API es estable
- Validación automática en CI/CD
- Rollback fácil si hay problemas

## 🆘 Troubleshooting

### ❓ **Test fallan inesperadamente**
```bash
# 1. Verificar si el backend cambió
npm run test:regression:backend

# 2. Si es cambio intencional, actualizar
npm run test:regression:update

# 3. Si es error, revisar el backend
```

### ❓ **Snapshots desactualizados**
```bash
# Forzar actualización desde staging
npm run test:regression:update-staging
```

### ❓ **Backend no disponible**
```bash
# Usar mocks para desarrollo
npm run test:regression  # Usa mocks por defecto
```

### ❓ **Tests muy lentos**
```bash
# Usar mocks en lugar de backend real
export USE_REAL_BACKEND=false
npm run test:regression
```

## 🎓 Siguientes Pasos

1. **Integrar en CI/CD**: Agregar a pipeline de GitHub Actions
2. **Expandir Coverage**: Añadir más endpoints según necesidades
3. **Alertas**: Configurar notificaciones cuando fallan tests
4. **Métricas**: Tracking de estabilidad de API over time

---

✨ **¡Sistema de Tests de Regresión completamente implementado y funcionando!** ✨

Este sistema asegura que cualquier cambio en el backend sea **intencional y documentado**, previniendo errores en producción y facilitando la comunicación entre equipos.
