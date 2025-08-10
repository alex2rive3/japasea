# 📸 Tests de Regresión de API - Japasea

## 🎯 Objetivo

Estos tests verifican que las respuestas de los endpoints del backend **no cambien inesperadamente** entre versiones, detectando modificaciones no intencionadas en la estructura de datos, campos, tipos o comportamiento de la API.

## 🔧 Configuración

### Variables de Entorno

```bash
# Usar backend real (requiere que esté ejecutándose)
export USE_REAL_BACKEND=true

# Usar mocks (por defecto)
export USE_REAL_BACKEND=false

# Actualizar snapshots intencionalmente
export UPDATE_SNAPSHOTS=true
```

### URL del Backend

```bash
# Por defecto
export VITE_API_URL=http://localhost:3001

# Backend de desarrollo/staging
export VITE_API_URL=https://api-dev.japasea.com
```

## 🚀 Comandos de Ejecución

### Ejecutar Tests con Mocks (Desarrollo)
```bash
npm test integration/
```

### Ejecutar Tests con Backend Real
```bash
USE_REAL_BACKEND=true npm test integration/
```

### Actualizar Snapshots Intencionalmente
```bash
UPDATE_SNAPSHOTS=true npm test integration/
```

### Ejecutar Test Específico
```bash
npm test auth.regression.test.ts
npm test places.regression.test.ts
npm test favorites.regression.test.ts
```

## 📁 Estructura de Archivos

```
__tests__/
├── integration/
│   ├── auth.regression.test.ts        # Endpoints de autenticación
│   ├── places.regression.test.ts      # Endpoints de lugares
│   ├── favorites.regression.test.ts   # Endpoints de favoritos
│   └── README.md                      # Esta documentación
├── snapshots/
│   ├── auth-login-success.json        # Snapshot de login exitoso
│   ├── places-list-all.json          # Snapshot de lista de lugares
│   ├── favorites-list.json           # Snapshot de favoritos
│   └── ...                           # Más snapshots por endpoint
└── helpers/
    └── apiTestUtils.ts                # Utilidades para tests de API
```

## 🔍 Cómo Funcionan los Tests

### 1. Ejecución Inicial
Al ejecutar un test por primera vez:
- Se hace la petición al endpoint (real o mock)
- Se valida que el status HTTP sea 200
- Se guarda la respuesta como **snapshot**
- El test pasa ✅

### 2. Ejecuciones Posteriores
En ejecuciones siguientes:
- Se hace la petición nuevamente
- Se compara la respuesta actual con el **snapshot guardado**
- Si hay diferencias → Test falla ❌ con detalle de cambios
- Si no hay diferencias → Test pasa ✅

### 3. Detección de Cambios
El sistema detecta cambios en:
- **Status HTTP**: 200 → 401, 404, 500, etc.
- **Estructura JSON**: Campos añadidos/removidos
- **Tipos de datos**: string → number, object → array
- **Valores específicos**: IDs, mensajes, formatos de fecha
- **Headers importantes**: Content-Type, Authorization

### 4. Actualización Intencional
Si el cambio es **intencional** (nueva versión de API):
```bash
UPDATE_SNAPSHOTS=true npm test integration/
```

## 📊 Tests Implementados

### Auth API (`auth.regression.test.ts`)
- ✅ **POST /api/v1/auth/login** - Login exitoso
- ✅ **POST /api/v1/auth/login** - Credenciales inválidas
- ✅ **POST /api/v1/auth/register** - Registro exitoso  
- ✅ **POST /api/v1/auth/register** - Email duplicado
- ✅ **GET /api/v1/auth/profile** - Perfil de usuario
- ✅ **GET /api/v1/auth/profile** - Token inválido
- ✅ **POST /api/v1/auth/refresh-token** - Renovación de tokens
- ✅ **POST /api/v1/auth/logout** - Logout exitoso

### Places API (`places.regression.test.ts`)
- ✅ **GET /api/v1/places** - Lista completa
- ✅ **GET /api/v1/places?type=historical** - Filtro por tipo
- ✅ **GET /api/v1/places/search?q=machu** - Búsqueda con resultados
- ✅ **GET /api/v1/places/search?q=noexiste** - Búsqueda sin resultados
- ✅ **GET /api/v1/places/random?count=3** - Lugares aleatorios
- ✅ **GET /api/v1/places/:id** - Lugar específico
- ✅ **POST /api/v1/places/ensure** - Crear lugar
- ✅ **POST /api/v1/chat** - Chat con IA
- ✅ **GET /api/v1/chat/history** - Historial de chat

### Favorites API (`favorites.regression.test.ts`)
- ✅ **GET /api/v1/favorites** - Lista de favoritos
- ✅ **GET /api/v1/favorites** - Lista vacía
- ✅ **POST /api/v1/favorites/:id** - Agregar favorito
- ✅ **POST /api/v1/favorites/:id** - Favorito duplicado
- ✅ **DELETE /api/v1/favorites/:id** - Remover favorito
- ✅ **GET /api/v1/favorites/check/:id** - Verificar favorito
- ✅ **POST /api/v1/favorites/check-multiple** - Verificar múltiples
- ✅ **GET /api/v1/favorites/stats** - Estadísticas
- ✅ **POST /api/v1/favorites/sync** - Sincronización
- ✅ **Error sin autenticación** - Manejo de errores

## 🔧 Validaciones Implementadas

### Status HTTP
```typescript
expect(result.status).toBe(200)
expect(result.statusText).toBe('OK')
```

### Estructura JSON
```typescript
expect(result.data).toHaveProperty('success', true)
expect(result.data).toHaveProperty('data')
expect(Array.isArray(result.data.data)).toBe(true)
```

### Tipos de Datos
```typescript
expect(typeof user.id).toBe('string')
expect(typeof user.isEmailVerified).toBe('boolean')
expect(typeof place.rating.average).toBe('number')
```

### Rangos de Valores
```typescript
expect(place.rating.average).toBeGreaterThanOrEqual(0)
expect(place.rating.average).toBeLessThanOrEqual(5)
expect(place.location.lat).toBeGreaterThanOrEqual(-90)
expect(place.location.lat).toBeLessThanOrEqual(90)
```

### Formatos Específicos
```typescript
expect(new Date(user.createdAt).toISOString()).toBe(user.createdAt)
expect(['user', 'admin'].includes(user.role)).toBe(true)
```

## 📋 Ejemplo de Output

### ✅ Test Exitoso (Sin Cambios)
```
✓ DEBE mantener estructura de lista de lugares consistente (127ms)
✓ DEBE mantener estructura con filtro por tipo (89ms)
✓ DEBE mantener estructura de resultados de búsqueda (156ms)
```

### ❌ Test Fallido (Cambios Detectados)
```
✗ DEBE mantener estructura de lista de lugares consistente

🚨 CAMBIOS DETECTADOS EN RESPUESTA DE LISTA DE LUGARES:
  - data[0].rating.average: Valor cambió de 4.8 a 4.9
  - data[0].location.address: Nueva propiedad agregada
  - data[0].phone: Propiedad removida

💡 Para actualizar el snapshot intencionalmente:
   UPDATE_SNAPSHOTS=true npm test places.regression.test.ts

Error: Respuesta del endpoint ha cambiado. Diferencias encontradas:
data[0].rating.average: Valor cambió de 4.8 a 4.9
data[0].location.address: Nueva propiedad agregada
data[0].phone: Propiedad removida
```

### 📸 Snapshot Actualizado
```
📸 Snapshot guardado: places-list-all
✅ Snapshot actualizado
✓ DEBE mantener estructura de lista de lugares consistente (203ms)
```

## 🛠️ Casos de Uso

### 1. **Desarrollo Continuo**
Ejecutar tests con cada cambio para detectar regresiones:
```bash
npm test integration/
```

### 2. **Deploy a Staging**
Verificar que el backend nuevo sea compatible:
```bash
USE_REAL_BACKEND=true VITE_API_URL=https://api-staging.japasea.com npm test integration/
```

### 3. **Release de Nueva Versión**
Actualizar snapshots para nueva versión de API:
```bash
UPDATE_SNAPSHOTS=true npm test integration/
git add src/__tests__/snapshots/
git commit -m "Update API snapshots for v2.1.0"
```

### 4. **Debugging de Issues**
Identificar exactamente qué cambió en la API:
```bash
npm test auth.regression.test.ts
# Ver diff detallado en output
```

## 🔄 Flujo de Trabajo

1. **Desarrollador hace cambios en backend**
2. **CI/CD ejecuta tests de regresión**
3. **Si hay cambios no intencionados** → Build falla
4. **Si cambios son intencionados** → Actualizar snapshots
5. **Merge solo después de validación** 

## 📈 Beneficios

- ✅ **Detección temprana** de regresiones
- ✅ **Documentación viva** de la estructura de API
- ✅ **Confianza** en deploys y cambios
- ✅ **Visibilidad** de todos los cambios de API
- ✅ **Automatización** del testing de integración

Esta aproximación asegura que cualquier cambio en el backend sea **intencional y documentado**, previniendo errores en producción y facilitando la comunicación entre equipos de frontend y backend.
