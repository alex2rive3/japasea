# Documentación Técnica - Japasea

## Índice
1. [Descripción General](#descripción-general)
2. [Arquitectura](#arquitectura)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Sistema de Autenticación](#sistema-de-autenticación)
5. [Panel de Administración](#panel-de-administración)
6. [Funcionalidades de Usuario](#funcionalidades-de-usuario)
7. [Servicios y APIs](#servicios-y-apis)
8. [Componentes Principales](#componentes-principales)
9. [Guía de Instalación](#guía-de-instalación)
10. [Variables de Entorno](#variables-de-entorno)

## Descripción General

Japasea es una plataforma web para descubrir lugares en Paraguay. El sistema incluye:
- Portal de usuarios para explorar lugares
- Chat con IA para recomendaciones personalizadas
- Sistema de favoritos
- Panel de administración completo
- Sistema de autenticación con JWT
- Gestión de lugares, usuarios y reseñas

## Arquitectura

### Frontend
- **Framework**: React 18 con TypeScript
- **Bundler**: Vite
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **Estado**: Context API
- **Formularios**: React Hook Form con Yup
- **HTTP Client**: Axios
- **Mapas**: Leaflet

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: JWT (Access + Refresh tokens)
- **Validación**: Express Validator
- **Email**: Nodemailer
- **Documentación API**: Swagger

## Estructura del Proyecto

```
japasea/
├── client/                      # Frontend React
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   │   ├── admin/         # Componentes exclusivos de admin
│   │   │   └── ...           # Componentes de usuario
│   │   ├── contexts/         # Context API providers
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # Servicios API
│   │   ├── styles/         # Estilos y temas
│   │   └── types/         # Definiciones TypeScript
│   └── public/           # Archivos estáticos
│
├── server/                    # Backend Node.js
│   ├── src/
│   │   ├── controllers/     # Controladores de rutas
│   │   ├── middleware/     # Middleware Express
│   │   ├── models/        # Modelos Mongoose
│   │   ├── routes/       # Definición de rutas
│   │   ├── services/    # Lógica de negocio
│   │   └── utils/      # Utilidades
│   └── scripts/       # Scripts de migración
│
└── docs/            # Documentación adicional
```

## Sistema de Autenticación

### Características
- Registro con verificación de email
- Login con JWT (access + refresh tokens)
- Recuperación de contraseña
- Cambio de contraseña
- Actualización de perfil
- Logout con invalidación de tokens
- Roles: `user` y `admin`

### Flujo de Autenticación
1. Usuario se registra → Email de verificación
2. Usuario verifica email → Cuenta activa
3. Login → Recibe access token (15min) + refresh token (7días)
4. Token expira → Auto-refresh con refresh token
5. Logout → Tokens invalidados

### Endpoints de Auth
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/profile
PUT    /api/v1/auth/profile
PUT    /api/v1/auth/change-password
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/verify-email/:token
POST   /api/v1/auth/resend-verification
POST   /api/v1/auth/refresh-token
DELETE /api/v1/auth/account
```

## Panel de Administración

### Acceso
- Solo usuarios con rol `admin`
- Ruta base: `/admin`
- Layout exclusivo sin acceso a funciones de usuario

### Módulos Implementados

#### 1. Dashboard (`/admin`)
- KPIs principales (usuarios, lugares, reseñas)
- Alertas de acciones pendientes
- Accesos rápidos
- Estadísticas generales

#### 2. Gestión de Lugares (`/admin/places`)
- CRUD completo de lugares
- Filtros por tipo y estado
- Verificación de lugares
- Destacar lugares (featured)
- Cambio de estado (active/inactive/pending)
- **Operaciones masivas**:
  - Selección múltiple
  - Verificación masiva
  - Activación masiva
  - Eliminación masiva

#### 3. Gestión de Usuarios (`/admin/users`)
- Listado con filtros
- Cambio de roles (user/admin)
- Suspender/activar usuarios
- Eliminación de usuarios
- Búsqueda por nombre/email
- Vista de último acceso

#### 4. Gestión de Reseñas (`/admin/reviews`)
- Moderación de reseñas
- Aprobación/rechazo con razones
- Vista detallada
- Filtros por estado
- Eliminación de contenido

#### 5. Registro de Auditoría (`/admin/audit`)
- Log de todas las acciones
- Filtros por fecha, acción, recurso
- Exportación CSV
- Seguimiento de IP
- Historial detallado

#### 6. Estadísticas (`/admin/stats`)
- Métricas por tipo de lugar
- Estados de recursos
- Análisis de datos
- Visualización de tendencias

#### 7. Configuración (`/admin/settings`)
- **General**: Nombre, descripción, contacto
- **Características**: Habilitar/deshabilitar funciones
- **Notificaciones**: Canales de comunicación
- **Seguridad**: Políticas de contraseñas, 2FA
- **Pagos**: Pasarelas y comisiones

#### 8. Sistema de Notificaciones
- Panel en el header de admin
- Notificaciones en tiempo real
- Envío masivo a usuarios
- Diferentes tipos y prioridades
- Marcado como leído

### Servicios Admin
```javascript
// adminService.ts
- getAdminStats()
- getUsers()
- updateUserRole()
- suspendUser()
- getReviews()
- approveReview()
- getActivityLogs()
- exportActivityLogs()
- getSystemSettings()
- updateSystemSettings()
- sendBulkNotification()
```

## Funcionalidades de Usuario

### 1. Exploración de Lugares
- Mapa interactivo con Leaflet
- Búsqueda por nombre/tipo
- Filtros por categoría
- Vista de detalles

### 2. Chat con IA
- Recomendaciones personalizadas
- Planificación de viajes
- Historial de conversaciones
- Contexto de lugares

### 3. Sistema de Favoritos
- Agregar/quitar favoritos
- Lista personal
- Sincronización con cuenta

### 4. Perfil de Usuario
- Información personal
- Cambio de contraseña
- Preferencias
- Historial de actividad

### 5. Autenticación
- Login/Registro
- Verificación de email
- Recuperación de contraseña
- Sesión persistente

## Servicios y APIs

### Frontend Services

#### authService.ts
```typescript
- login(credentials)
- register(userData)
- logout()
- getProfile()
- updateProfile(data)
- changePassword(data)
- forgotPassword(email)
- resetPassword(token, password)
- verifyEmail(token)
- refreshToken()
```

#### placesService.ts
```typescript
- getPlacesByType(type)
- searchPlaces(query)
- getRandomPlaces(count)
- processChatMessage(message, context)
- getChatHistory()
- adminListPlaces(params)
- adminCreatePlace(data)
- adminUpdatePlace(id, data)
- adminVerifyPlace(id)
- adminFeaturePlace(id, featured)
```

#### favoritesService.ts
```typescript
- getFavorites()
- addFavorite(placeId)
- removeFavorite(placeId)
- checkIsFavorite(placeId)
```

### Backend APIs

#### Places API
```
GET    /api/v1/places
GET    /api/v1/places/:id
GET    /api/v1/places/search
GET    /api/v1/places/random
POST   /api/v1/places/:id/review
```

#### Admin API
```
GET    /api/v1/admin/places
POST   /api/v1/admin/places
PUT    /api/v1/admin/places/:id
PATCH  /api/v1/admin/places/:id/status
POST   /api/v1/admin/places/:id/verify
POST   /api/v1/admin/places/:id/feature
```

## Componentes Principales

### Layout Components
- `Layout.tsx` - Layout principal para usuarios
- `AdminLayout.tsx` - Layout exclusivo para admin
- `AuthNavbar.tsx` - Navbar para usuarios autenticados
- `ProtectedRoute.tsx` - Protección de rutas

### User Components
- `HomeComponent.tsx` - Página principal
- `MapComponent.tsx` - Mapa interactivo
- `ChatComponent.tsx` - Chat con IA
- `PlaceCards.tsx` - Tarjetas de lugares
- `FavoritesComponent.tsx` - Gestión de favoritos
- `ProfileComponent.tsx` - Perfil de usuario

### Auth Components
- `LoginComponent.tsx` - Formulario de login
- `RegisterComponent.tsx` - Formulario de registro
- `ForgotPasswordComponent.tsx` - Recuperación de contraseña
- `ResetPasswordComponent.tsx` - Restablecer contraseña
- `VerifyEmailComponent.tsx` - Verificación de email

### Admin Components
- `AdminDashboard.tsx` - Panel principal
- `AdminPlacesComponent.tsx` - Gestión de lugares
- `AdminUsers.tsx` - Gestión de usuarios
- `AdminReviews.tsx` - Moderación de reseñas
- `AdminAudit.tsx` - Registro de auditoría
- `AdminStats.tsx` - Estadísticas
- `AdminSettings.tsx` - Configuración del sistema
- `AdminNotifications.tsx` - Sistema de notificaciones

## Guía de Instalación

### Requisitos
- Node.js v16+
- MongoDB 4.4+
- NPM o Yarn

### Instalación Backend
```bash
cd server
npm install
cp .env.example .env
# Configurar variables de entorno
npm run dev
```

### Instalación Frontend
```bash
cd client
npm install
npm run dev
```

### Scripts de Base de Datos
```bash
cd server/scripts
node seedDatabase.js        # Crear datos de prueba
node migratePlacesToMongoDB.js  # Migrar lugares
```

## Variables de Entorno

### Backend (.env)
```env
# Server
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/japasea

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@japasea.com

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3001
```

## Estados y Tipos

### User States
- `active` - Usuario activo
- `suspended` - Usuario suspendido
- `deleted` - Usuario eliminado

### Place States
- `active` - Lugar activo y visible
- `inactive` - Lugar inactivo
- `pending` - Pendiente de aprobación
- `seasonal` - Lugar estacional

### Review States
- `pending` - Pendiente de moderación
- `approved` - Aprobada y visible
- `rejected` - Rechazada

## Seguridad Implementada

1. **Autenticación JWT** con refresh tokens
2. **Validación de entrada** en todos los endpoints
3. **Rate limiting** para prevenir ataques
4. **CORS** configurado
5. **Bcrypt** para hash de contraseñas
6. **Verificación de email** obligatoria
7. **Roles y permisos** (user/admin)
8. **Sanitización** de datos
9. **HTTPS** en producción (configurar)
10. **Tokens seguros** con expiración

## Próximos Pasos

1. **Implementar gráficos** en el dashboard admin
2. **Sistema de pagos** con MercadoPago
3. **Notificaciones push** para móvil
4. **API de terceros** para clima/eventos
5. **Sistema de reservas** para lugares
6. **Multi-idioma** (español/guaraní/inglés)
7. **App móvil** con React Native
8. **Analytics avanzado** con métricas
9. **Sistema de afiliados** para negocios
10. **Optimización SEO** y performance
