# 📚 Documentación de API Endpoints - Japasea

## 📊 Resumen de Estado

| Dominio | Total | Implementados | Pendientes |
|---------|-------|---------------|------------|
| Autenticación | 11 | 11 | 0 |
| Lugares | 11 | 11 | 0 |
| Favoritos | 4 | 4 | 0 |
| Chat | 2 | 2 | 0 |
| Admin - Usuarios | 7 | 7 | 0 |
| Admin - Lugares | 5 | 5 | 0 |
| Admin - Estadísticas | 2 | 2 | 0 |
| Admin - Reseñas | 5 | 5 | 0 |
| Admin - Auditoría | 2 | 2 | 0 |
| Admin - Configuración | 2 | 2 | 0 |
| Admin - Notificaciones | 1 | 1 | 0 |
| Reseñas Públicas | 6 | 6 | 0 |
| **TOTAL** | **58** | **58** | **0** |

✅ **100% de endpoints implementados**

## 🔐 Autenticación (`/api/v1/auth`)

| Método | Endpoint | Descripción | Estado |
|--------|----------|-------------|--------|
| POST | `/register` | Registro de nuevo usuario | ✅ IMPLEMENTADO |
| POST | `/login` | Inicio de sesión | ✅ IMPLEMENTADO |
| POST | `/logout` | Cerrar sesión | ✅ IMPLEMENTADO |
| POST | `/refresh-token` | Renovar token de acceso | ✅ IMPLEMENTADO |
| POST | `/forgot-password` | Solicitar recuperación de contraseña | ✅ IMPLEMENTADO |
| POST | `/reset-password` | Restablecer contraseña | ✅ IMPLEMENTADO |
| POST | `/verify-email` | Verificar email con token | ✅ IMPLEMENTADO |
| POST | `/resend-verification` | Reenviar email de verificación | ✅ IMPLEMENTADO |
| GET | `/me` | Obtener perfil del usuario actual | ✅ IMPLEMENTADO |
| PUT | `/me` | Actualizar perfil | ✅ IMPLEMENTADO |
| POST | `/change-password` | Cambiar contraseña | ✅ IMPLEMENTADO |

### Ejemplos de Uso

#### Registro
```bash
POST /api/v1/auth/register
{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "password123",
  "phone": "+595981234567"
}
```

#### Login
```bash
POST /api/v1/auth/login
{
  "email": "juan@ejemplo.com",
  "password": "password123"
}
```

## 📍 Lugares (`/api/v1/places`)

| Método | Endpoint | Descripción | Estado |
|--------|----------|-------------|--------|
| GET | `/` | Listar lugares con filtros | ✅ IMPLEMENTADO |
| GET | `/:id` | Obtener detalle de lugar | ✅ IMPLEMENTADO |
| GET | `/search` | Buscar lugares | ✅ IMPLEMENTADO |
| GET | `/featured` | Lugares destacados | ✅ IMPLEMENTADO |
| GET | `/nearby` | Lugares cercanos | ✅ IMPLEMENTADO |
| GET | `/types` | Listar tipos disponibles | ✅ IMPLEMENTADO |
| POST | `/` | Crear lugar (admin) | ✅ IMPLEMENTADO |
| PUT | `/:id` | Actualizar lugar (admin) | ✅ IMPLEMENTADO |
| DELETE | `/:id` | Eliminar lugar (admin) | ✅ IMPLEMENTADO |
| POST | `/:id/photos` | Subir fotos (admin) | ✅ IMPLEMENTADO |
| DELETE | `/:id/photos/:photoId` | Eliminar foto (admin) | ✅ IMPLEMENTADO |

### Parámetros de Consulta

- `type`: Filtrar por tipo (restaurant, hotel, etc.)
- `city`: Filtrar por ciudad
- `q`: Búsqueda por texto
- `lat`, `lng`, `radius`: Búsqueda por proximidad
- `page`, `limit`: Paginación
- `sort`: Ordenamiento (name, rating, created)

## ⭐ Favoritos (`/api/v1/favorites`)

| Método | Endpoint | Descripción | Estado |
|--------|----------|-------------|--------|
| GET | `/` | Listar favoritos del usuario | ✅ IMPLEMENTADO |
| POST | `/` | Agregar a favoritos | ✅ IMPLEMENTADO |
| DELETE | `/:placeId` | Quitar de favoritos | ✅ IMPLEMENTADO |
| GET | `/check/:placeId` | Verificar si es favorito | ✅ IMPLEMENTADO |

## 💬 Chat (`/api/v1/chat`)

| Método | Endpoint | Descripción | Estado |
|--------|----------|-------------|--------|
| POST | `/message` | Enviar mensaje al chat | ✅ IMPLEMENTADO |
| GET | `/history` | Obtener historial | ✅ IMPLEMENTADO |

## 👨‍💼 Admin - Gestión de Usuarios (`/api/v1/admin/users`)

| Método | Endpoint | Descripción | Estado |
|--------|----------|-------------|--------|
| GET | `/` | Listar usuarios | ✅ IMPLEMENTADO |
| GET | `/:id` | Detalle de usuario | ✅ IMPLEMENTADO |
| PATCH | `/:id/role` | Cambiar rol | ✅ IMPLEMENTADO |
| PATCH | `/:id/suspend` | Suspender usuario | ✅ IMPLEMENTADO |
| PATCH | `/:id/activate` | Activar usuario | ✅ IMPLEMENTADO |
| DELETE | `/:id` | Eliminar usuario | ✅ IMPLEMENTADO |
| GET | `/export` | Exportar usuarios | ✅ IMPLEMENTADO |

### Parámetros de Consulta
- `search`: Buscar por nombre o email
- `role`: Filtrar por rol (user, admin)
- `status`: Filtrar por estado (active, suspended)
- `page`, `limit`: Paginación

## 📍 Admin - Gestión de Lugares (`/api/v1/admin/places`)

| Método | Endpoint | Descripción | Estado |
|--------|----------|-------------|--------|
| GET | `/` | Listar lugares (admin) | ✅ IMPLEMENTADO |
| PATCH | `/:id/status` | Cambiar estado | ✅ IMPLEMENTADO |
| PATCH | `/:id/verify` | Verificar lugar | ✅ IMPLEMENTADO |
| PATCH | `/:id/feature` | Destacar lugar | ✅ IMPLEMENTADO |
| POST | `/bulk-action` | Acciones masivas | ✅ IMPLEMENTADO |

## 📊 Admin - Estadísticas (`/api/v1/admin/stats`)

| Método | Endpoint | Descripción | Estado |
|--------|----------|-------------|--------|
| GET | `/` | Estadísticas generales | ✅ IMPLEMENTADO |
| GET | `/places` | Estadísticas de lugares | ✅ IMPLEMENTADO |

### Respuesta de Estadísticas Generales
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 156,
      "active": 142,
      "inactive": 14
    },
    "places": {
      "total": 89,
      "active": 75,
      "pending": 8,
      "verified": 65,
      "featured": 12,
      "byType": [
        { "type": "restaurant", "count": 35 },
        { "type": "hotel", "count": 20 }
      ]
    },
    "activity": {
      "last7Days": {
        "newUsers": 12,
        "newPlaces": 5
      }
    }
  }
}
```

## 📝 Admin - Gestión de Reseñas (`/api/v1/admin/reviews`)

| Método | Endpoint | Descripción | Estado |
|--------|----------|-------------|--------|
| GET | `/` | Listar reseñas | ✅ IMPLEMENTADO |
| PATCH | `/:id/approve` | Aprobar reseña | ✅ IMPLEMENTADO |
| PATCH | `/:id/reject` | Rechazar reseña | ✅ IMPLEMENTADO |
| DELETE | `/:id` | Eliminar reseña | ✅ IMPLEMENTADO |
| GET | `/export` | Exportar reseñas | ✅ IMPLEMENTADO |

### Parámetros de Consulta
- `status`: pending, approved, rejected
- `placeId`: Filtrar por lugar
- `userId`: Filtrar por usuario
- `page`, `limit`: Paginación

## 🔍 Admin - Auditoría (`/api/v1/admin/audit`)

| Método | Endpoint | Descripción | Estado |
|--------|----------|-------------|--------|
| GET | `/logs` | Obtener logs | ✅ IMPLEMENTADO |
| GET | `/logs/export` | Exportar logs | ✅ IMPLEMENTADO |

### Parámetros de Consulta
- `action`: Tipo de acción
- `resource`: Tipo de recurso
- `userId`: Filtrar por usuario
- `startDate`, `endDate`: Rango de fechas
- `page`, `limit`: Paginación

## ⚙️ Admin - Configuración (`/api/v1/admin/settings`)

| Método | Endpoint | Descripción | Estado |
|--------|----------|-------------|--------|
| GET | `/` | Obtener configuración | ✅ IMPLEMENTADO |
| PUT | `/` | Actualizar configuración | ✅ IMPLEMENTADO |

### Estructura de Configuración
```json
{
  "general": {
    "siteName": "Japasea",
    "siteDescription": "Descubre los mejores lugares de Paraguay",
    "contactEmail": "contacto@japasea.com",
    "supportPhone": "+595 21 123 456"
  },
  "features": {
    "enableRegistration": true,
    "enableReviews": true,
    "requireEmailVerification": true,
    "enableChat": true
  },
  "notifications": {
    "emailNotifications": true,
    "newUserNotification": true,
    "newReviewNotification": true
  },
  "security": {
    "maxLoginAttempts": 5,
    "sessionTimeout": 30,
    "passwordMinLength": 8,
    "require2FA": false
  }
}
```

## 📣 Admin - Notificaciones (`/api/v1/admin/notifications`)

| Método | Endpoint | Descripción | Estado |
|--------|----------|-------------|--------|
| POST | `/bulk` | Enviar notificación masiva | ✅ IMPLEMENTADO |

## ⭐ Reseñas Públicas (`/api/v1/reviews`)

| Método | Endpoint | Descripción | Estado |
|--------|----------|-------------|--------|
| GET | `/places/:placeId` | Reseñas de un lugar | ✅ IMPLEMENTADO |
| POST | `/places/:placeId` | Crear reseña | ✅ IMPLEMENTADO |
| GET | `/user` | Mis reseñas | ✅ IMPLEMENTADO |
| PUT | `/:reviewId` | Actualizar mi reseña | ✅ IMPLEMENTADO |
| DELETE | `/:reviewId` | Eliminar mi reseña | ✅ IMPLEMENTADO |
| POST | `/:reviewId/vote` | Votar reseña útil | ✅ IMPLEMENTADO |

### Crear Reseña
```bash
POST /api/v1/reviews/places/:placeId
{
  "rating": 4,
  "comment": "Excelente lugar, muy recomendado"
}
```

## 🔒 Autenticación y Autorización

### Headers Requeridos
```http
Authorization: Bearer <jwt_token>
```

### Roles y Permisos
- **guest**: Acceso público (búsqueda, ver lugares)
- **user**: Usuario registrado (favoritos, reseñas)
- **admin**: Administrador (gestión completa)

## 🚦 Códigos de Estado

| Código | Descripción |
|--------|-------------|
| 200 | Éxito |
| 201 | Creado exitosamente |
| 400 | Error en la solicitud |
| 401 | No autorizado |
| 403 | Prohibido |
| 404 | No encontrado |
| 422 | Error de validación |
| 429 | Demasiadas solicitudes |
| 500 | Error del servidor |

## 🔄 Rate Limiting

- **Autenticación**: 5 intentos por IP cada 15 minutos
- **API General**: 100 solicitudes por IP cada 15 minutos
- **Búsqueda**: 30 solicitudes por IP cada minuto

## 📝 Validación

Todos los endpoints tienen validación automática con `express-validator`:
- Sanitización de inputs
- Validación de tipos
- Límites de longitud
- Formatos específicos (email, teléfono, etc.)

## 🔧 Middleware Aplicado

1. **Autenticación JWT**: Verifica tokens en rutas protegidas
2. **Autorización por Rol**: Valida permisos según el rol
3. **Rate Limiting**: Previene abuso de API
4. **Validación**: Valida y sanitiza inputs
5. **Auditoría**: Registra acciones importantes
6. **CORS**: Configurado para el frontend
7. **Compresión**: Respuestas comprimidas con gzip

---

**Última actualización**: Enero 2025