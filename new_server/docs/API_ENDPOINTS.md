# 📚 Documentación de API Endpoints - Japasea

- Base URL: http://localhost:3001/api/v1
- Autenticación: JWT Bearer en rutas protegidas
- Versión: v1 (URI)

## 🩺 Salud (`/health`)
- GET `/health`
- GET `/health/database`
- GET `/health/detailed`
- GET `/health/memory`

## 🔐 Autenticación (`/auth`)
- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/logout`
- POST `/auth/refresh-token`
- POST `/auth/forgot-password`
- POST `/auth/reset-password`
- GET  `/auth/me`
- PUT  `/auth/me`
- PATCH `/auth/change-password`

## 👤 Usuarios (`/users`)
- GET `/users`
- GET `/users/:id`
- POST `/users`
- PUT  `/users/:id`
- PATCH `/users/:id/soft-delete`

## 📍 Lugares (`/places`)
- GET  `/places`
- GET  `/places/:id`
- GET  `/places/search`
- GET  `/places/random`
- POST `/places`
- PUT  `/places/:id`
- PATCH `/places/:id/soft-delete`

### Chat asociado a lugares (`/places/chat`)
- POST `/places/chat`
- GET  `/places/chat/history`
- GET  `/places/chat/session/:sessionId`

## ⭐ Favoritos (`/favorites`)
- GET  `/favorites`
- GET  `/favorites/check/:placeId`
- GET  `/favorites/stats`
- POST `/favorites/:placeId`
- POST `/favorites/check/multiple`
- POST `/favorites/sync`
- DELETE `/favorites/:placeId`

## 🗂️ Archivos (`/files`)
- POST   `/files/upload/single`
- POST   `/files/upload/multiple`
- POST   `/files/places/:placeId/images`
- DELETE `/files/:folder/:fileName`

## 💬 Chat (`/chat`)
- POST `/chat/process`
- GET  `/chat/history`
- GET  `/chat/session/:sessionId`

## 📝 Reseñas (`/reviews`)
- GET  `/reviews/place/:placeId`
- GET  `/reviews/user/my-reviews`
- POST `/reviews/place/:placeId`
- PUT  `/reviews/:reviewId`
- POST `/reviews/:reviewId/vote`
- DELETE `/reviews/:reviewId`

## 👨‍💼 Admin

### Usuarios (`/admin/users`)
- GET   `/admin/users`
- GET   `/admin/users/:id`
- PATCH `/admin/users/:id/role`
- PATCH `/admin/users/:id/suspend`
- PATCH `/admin/users/:id/activate`
- DELETE `/admin/users/:id`

### Lugares (`/admin/places`)
- GET   `/admin/places`
- GET   `/admin/places/:id`
- PATCH `/admin/places/:id/status`
- PATCH `/admin/places/:id/verify`
- PATCH `/admin/places/:id/feature`

### Estadísticas (`/admin/stats`)
- GET `/admin/stats`
- GET `/admin/stats/places`

### Reseñas (`/admin/reviews`)
- GET    `/admin/reviews`
- PATCH  `/admin/reviews/:id/approve`
- PATCH  `/admin/reviews/:id/reject`
- DELETE `/admin/reviews/:id`

### Configuración (`/admin/settings`)
- GET `/admin/settings`
- PUT `/admin/settings`

### Notificaciones (`/admin/notifications`)
- POST `/admin/notifications/bulk`

---

Notas
- Todas las rutas anteriores deben anteponer `/api/v1` en consumo real.
- Swagger disponible en: `/api/v1/docs`.
- Códigos de estado y validación siguen las convenciones REST (200, 201, 400, 401, 403, 404, 422, 429, 500).