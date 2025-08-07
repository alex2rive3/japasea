# Lista de Endpoints API - Japasea

Base URL: `http://localhost:3001`

## 🔐 Autenticación (`/api/v1/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Registrar nuevo usuario | No |
| POST | `/login` | Iniciar sesión | No |
| POST | `/logout` | Cerrar sesión | Sí |
| POST | `/refresh-token` | Renovar tokens | No |
| POST | `/forgot-password` | Solicitar recuperación de contraseña | No |
| POST | `/reset-password` | Restablecer contraseña con token | No |
| GET | `/verify-email/:token` | Verificar email con token | No |
| GET | `/profile` | Obtener perfil del usuario | Sí |
| PUT | `/profile` | Actualizar perfil del usuario | Sí |
| POST | `/change-password` | Cambiar contraseña | Sí |
| DELETE | `/account` | Desactivar cuenta del usuario | Sí |
| POST | `/resend-verification` | Reenviar email de verificación | Sí |

## 📍 Lugares (`/api/v1/places`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar todos los lugares | No |
| GET | `/search?q=query` | Buscar lugares por texto | No |
| GET | `/random?count=3` | Obtener lugares aleatorios | No |
| GET | `/nearby?lat=x&lng=y&radius=5000` | Buscar lugares cercanos | No |
| GET | `/trending?period=week&limit=10` | Obtener lugares en tendencia | No |

## ❤️ Favoritos (`/api/v1/favorites`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar favoritos del usuario | Sí |
| GET | `/stats` | Obtener estadísticas de favoritos | Sí |
| GET | `/check/:placeId` | Verificar si un lugar es favorito | Sí |
| POST | `/check-multiple` | Verificar múltiples lugares | Sí |
| POST | `/:placeId` | Agregar lugar a favoritos | Sí |
| DELETE | `/:placeId` | Eliminar lugar de favoritos | Sí |
| POST | `/sync` | Sincronizar favoritos (PWA) | Sí |

## 💬 Chat (`/api/v1/chat`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/` | Procesar mensaje de chat con IA | Opcional |
| GET | `/history?limit=10` | Obtener historial del chat | Sí |
| GET | `/session/:sessionId` | Obtener sesión específica | Sí |

## ⭐ Reseñas (`/api/v1/reviews`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/places/:placeId` | Obtener reseñas de un lugar | Opcional |
| POST | `/places/:placeId` | Crear nueva reseña | Sí |
| GET | `/user` | Obtener mis reseñas | Sí |
| PUT | `/:reviewId` | Actualizar reseña propia | Sí |
| DELETE | `/:reviewId` | Eliminar reseña propia | Sí |
| POST | `/:reviewId/vote` | Votar si reseña es útil | Sí |

## 🛡️ Administración (`/api/v1/admin`)

### Lugares (Admin)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/places` | Listar lugares con filtros avanzados | Admin |
| POST | `/places` | Crear nuevo lugar | Admin |
| GET | `/places/:id` | Obtener detalle de lugar | Admin |
| PUT | `/places/:id` | Actualizar lugar | Admin |
| DELETE | `/places/:id` | Desactivar lugar | Admin |
| PATCH | `/places/:id/status` | Cambiar estado del lugar | Admin |
| POST | `/places/:id/verify` | Verificar lugar | Admin |
| POST | `/places/:id/feature` | Destacar lugar | Admin |

### Usuarios (Admin)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/users` | Listar usuarios | Admin |
| GET | `/users/:id` | Obtener detalle de usuario | Admin |
| PATCH | `/users/:id/role` | Cambiar rol de usuario | Admin |
| PATCH | `/users/:id/suspend` | Suspender usuario | Admin |
| PATCH | `/users/:id/activate` | Activar usuario | Admin |
| DELETE | `/users/:id` | Eliminar usuario | Admin |

### Estadísticas (Admin)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/stats` | Obtener estadísticas generales | Admin |
| GET | `/stats/places` | Estadísticas de lugares | Admin |

### Reseñas (Admin)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/reviews` | Listar reseñas | Admin |
| PATCH | `/reviews/:id/approve` | Aprobar reseña | Admin |
| PATCH | `/reviews/:id/reject` | Rechazar reseña | Admin |
| DELETE | `/reviews/:id` | Eliminar reseña | Admin |

### Auditoría (Admin)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/audit/logs` | Obtener logs de auditoría | Admin |
| POST | `/audit/export` | Exportar logs | Admin |

### Configuración (Admin)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/settings` | Obtener configuración del sistema | Admin |
| PUT | `/settings` | Actualizar configuración | Admin |

### Notificaciones (Admin)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/notifications/bulk` | Enviar notificación masiva | Admin |

## 🔧 Sistema y Salud

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Información del servidor | No |
| GET | `/api/` | Información de la API | No |
| GET | `/api/health` | Estado de salud del servidor | No |
| GET | `/api/status` | Estado detallado del sistema | No |
| GET | `/api/v1/` | Información de la versión v1 | No |

## 📝 Notas

### Estados de Autenticación
- **No**: Endpoint público, no requiere autenticación
- **Sí**: Requiere token JWT válido (Bearer token)
- **Admin**: Requiere token JWT válido y rol de administrador
- **Opcional**: Funciona sin auth pero con funcionalidad limitada

### Headers Requeridos
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Respuestas Estándar

#### Éxito
```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

#### Error
```json
{
  "success": false,
  "error": "Código de error",
  "message": "Descripción del error"
}
```

#### Paginación
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Rate Limits
- Login: 5 intentos por minuto
- Registro: 3 intentos por minuto
- API general: 100 requests por minuto

### Estado de Implementación

✅ **Endpoints Completados (100%)**
- Autenticación completa (12 endpoints)
- Lugares públicos (5 endpoints)
- Favoritos (7 endpoints)
- Chat con IA (3 endpoints)
- Reseñas públicas (6 endpoints)
- Admin - Lugares (8 endpoints)
- Admin - Usuarios (6 endpoints)
- Admin - Estadísticas (2 endpoints)
- Admin - Reseñas (4 endpoints)
- Admin - Auditoría (2 endpoints)
- Admin - Configuración (2 endpoints)
- Admin - Notificaciones (1 endpoint)
- Sistema y Salud (5 endpoints)

**Total: 63 endpoints implementados**

### Próximas Características

1. **Notificaciones Push** - Para web y móvil
2. **Sistema de Pagos** - Integración con MercadoPago
3. **API Pública v2** - Con GraphQL
4. **Webhooks** - Para integraciones externas
5. **Sistema de Reservas** - Para lugares y servicios

---

**Última actualización**: Enero 2025  
**Versión API**: v1.0.0
