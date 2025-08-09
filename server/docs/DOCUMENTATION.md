# 📚 Documentación Técnica - Japasea

## 📋 Tabla de Contenidos

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Modelos de Datos](#modelos-de-datos)
5. [Flujos de Autenticación](#flujos-de-autenticación)
6. [Servicios y APIs](#servicios-y-apis)
7. [Componentes Frontend](#componentes-frontend)
8. [Seguridad](#seguridad)
9. [Performance](#performance)
10. [Deployment](#deployment)

## 🏗️ Arquitectura del Sistema

### Visión General

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Cliente Web   │────▶│   API Server    │────▶│    MongoDB      │
│   (React/TS)    │     │   (Node/Express)│     │                 │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                        │
         │                       │                        │
    ┌────▼──────┐         ┌─────▼─────┐          ┌──────▼──────┐
    │  Vite Dev │         │   JWT     │          │   Mongoose  │
    │  Server   │         │   Auth    │          │     ODM     │
    └───────────┘         └───────────┘          └─────────────┘
```

### Arquitectura en Capas

1. **Capa de Presentación** (Frontend)
   - React con TypeScript
   - Material-UI para componentes
   - Context API para estado global
   - React Router para navegación

2. **Capa de Aplicación** (Backend)
   - Express.js como framework
   - Controladores para lógica de negocio
   - Middleware para funciones transversales
   - Servicios para operaciones específicas

3. **Capa de Datos**
   - MongoDB como base de datos
   - Mongoose para modelado
   - Índices para optimización
   - Agregaciones para consultas complejas

## 💻 Stack Tecnológico

### Frontend
```json
{
  "core": {
    "react": "^18.3.1",
    "typescript": "~5.6.2",
    "vite": "^6.0.5"
  },
  "ui": {
    "@mui/material": "^6.3.1",
    "@mui/icons-material": "^6.3.1",
    "@emotion/react": "^11.14.0"
  },
  "routing": {
    "react-router-dom": "^7.1.1"
  },
  "state": {
    "context-api": "built-in",
    "local-storage": "for-persistence"
  },
  "http": {
    "axios": "^1.7.9"
  },
  "maps": {
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1"
  },
  "charts": {
    "recharts": "^2.15.0"
  }
}
```

### Backend
```json
{
  "core": {
    "node": "^18.0.0",
    "express": "^4.21.2",
    "typescript": "not-used"
  },
  "database": {
    "mongodb": "^6.0.0",
    "mongoose": "^8.9.2"
  },
  "auth": {
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3"
  },
  "validation": {
    "express-validator": "^7.2.1"
  },
  "security": {
    "helmet": "^8.0.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.5.0"
  },
  "email": {
    "nodemailer": "^6.9.17"
  },
  "utilities": {
    "dotenv": "^16.4.7",
    "multer": "^1.4.5-lts.1",
    "sharp": "for-image-processing"
  }
}
```

## 📁 Estructura del Proyecto

### Frontend (`/client`)
```
client/
├── src/
│   ├── components/          # Componentes React
│   │   ├── admin/          # Componentes del panel admin
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminUsers.tsx
│   │   │   ├── AdminReviews.tsx
│   │   │   ├── AdminStats.tsx
│   │   │   ├── AdminAudit.tsx
│   │   │   └── AdminSettings.tsx
│   │   ├── auth/           # Componentes de autenticación
│   │   ├── places/         # Componentes de lugares
│   │   └── shared/         # Componentes compartidos
│   ├── services/           # Servicios API
│   │   ├── apiConfig.ts    # Configuración axios
│   │   ├── authService.ts  # Servicio de auth
│   │   ├── adminService.ts # Servicio admin
│   │   └── placesService.ts
│   ├── contexts/           # Context providers
│   │   └── AuthContext.tsx
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.ts
│   │   └── useFavorites.ts
│   ├── types/              # TypeScript types
│   │   ├── auth.ts
│   │   ├── places.ts
│   │   └── admin.ts
│   └── styles/             # Estilos globales
│       └── theme.ts
├── public/                 # Assets estáticos
└── index.html             # Entry point HTML
```

### Backend (`/server`)
```
server/
├── src/
│   ├── controllers/        # Controladores
│   │   ├── authController.js
│   │   ├── placesController.js
│   │   ├── adminController.js
│   │   └── reviewsController.js
│   ├── models/            # Modelos Mongoose
│   │   ├── userModel.js
│   │   ├── placeModel.js
│   │   ├── reviewModel.js
│   │   ├── auditModel.js
│   │   └── settingsModel.js
│   ├── routes/            # Definición de rutas
│   │   └── v1/           # API v1
│   │       ├── index.js
│   │       ├── authRoutes.js
│   │       ├── placesRoutes.js
│   │       ├── adminRoutes.js
│   │       └── reviewsRoutes.js
│   ├── middleware/        # Middleware
│   │   ├── authMiddleware.js
│   │   ├── adminValidation.js
│   │   ├── auditMiddleware.js
│   │   └── errorHandler.js
│   ├── services/          # Servicios
│   │   └── emailService.js
│   ├── config/            # Configuración
│   │   ├── config.js
│   │   └── database.js
│   └── app.js            # App principal
├── scripts/              # Scripts útiles
│   └── seedDatabase.js
└── tests/               # Tests
```

## 🗃️ Modelos de Datos

### User Model
```javascript
{
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  phone: String,
  role: ['user', 'admin'],
  status: ['active', 'suspended', 'deleted'],
  emailVerified: Boolean,
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  refreshToken: String,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Place Model
```javascript
{
  name: String (required),
  type: String (indexed),
  description: String,
  address: String,
  location: {
    type: 'Point',
    coordinates: [longitude, latitude]
  },
  city: String,
  phone: String,
  email: String,
  website: String,
  images: [{
    url: String,
    caption: String
  }],
  openingHours: {
    monday: { open: String, close: String },
    // ... otros días
  },
  features: [String],
  tags: [String],
  priceRange: Number,
  rating: {
    average: Number,
    count: Number
  },
  status: ['active', 'inactive', 'pending'],
  metadata: {
    featured: Boolean,
    verified: Boolean,
    featuredUntil: Date,
    verifiedAt: Date
  },
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Review Model
```javascript
{
  userId: ObjectId (ref: 'User'),
  placeId: ObjectId (ref: 'Place'),
  rating: Number (1-5),
  comment: String,
  status: ['pending', 'approved', 'rejected'],
  rejectionReason: String,
  approvedBy: ObjectId,
  rejectedBy: ObjectId,
  helpful: [ObjectId], // usuarios que marcaron útil
  createdAt: Date,
  updatedAt: Date
}
```

### Audit Model
```javascript
{
  userId: ObjectId,
  action: String,
  resource: String,
  resourceId: ObjectId,
  description: String,
  previousData: Object,
  metadata: {
    ip: String,
    userAgent: String,
    endpoint: String
  },
  createdAt: Date
}
```

## 🔐 Flujos de Autenticación

### Registro de Usuario
```
1. Cliente → POST /api/v1/auth/register
2. Server valida datos
3. Server hashea password con bcrypt
4. Server crea usuario en DB
5. Server genera token de verificación
6. Server envía email de verificación
7. Server responde con success
```

### Login
```
1. Cliente → POST /api/v1/auth/login
2. Server valida credenciales
3. Server verifica password con bcrypt
4. Server genera JWT access token (15min)
5. Server genera refresh token (7d)
6. Server actualiza lastLogin
7. Cliente guarda tokens
```

### Refresh Token
```
1. Cliente detecta token expirado
2. Cliente → POST /api/v1/auth/refresh-token
3. Server valida refresh token
4. Server genera nuevo access token
5. Cliente actualiza token
6. Request original se reintenta
```

## 🌐 Servicios y APIs

### API REST Structure
```
BASE_URL: http://localhost:3001/api/v1

Headers requeridos:
- Content-Type: application/json
- Authorization: Bearer {token} (rutas protegidas)

Respuesta estándar:
{
  "success": true/false,
  "data": {} | [],
  "message": "string",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Servicios Frontend

#### ApiConfig
- Instancia global de axios
- Interceptores para auth
- Manejo de errores centralizado
- Retry logic para tokens expirados

#### AuthService
- Login/logout
- Registro
- Refresh tokens
- Gestión de sesión
- Verificación de email

#### AdminService
- Estadísticas
- Gestión de usuarios
- Moderación de contenido
- Configuración del sistema
- Auditoría

## 🎨 Componentes Frontend

### Componentes de Layout
- **Layout**: Wrapper principal con navbar y footer
- **AdminLayout**: Layout específico para admin con sidebar
- **ProtectedRoute**: HOC para rutas autenticadas
- **PublicOnlyRoute**: HOC para rutas solo públicas

### Componentes de Autenticación
- **LoginComponent**: Formulario de login
- **RegisterComponent**: Registro con validación
- **ForgotPasswordComponent**: Recuperación de contraseña
- **EmailVerificationBanner**: Banner para verificar email

### Componentes Admin
- **AdminDashboard**: Panel principal con métricas
- **AdminUsers**: Gestión completa de usuarios
- **AdminPlaces**: CRUD de lugares
- **AdminReviews**: Moderación de reseñas
- **AdminStats**: Estadísticas avanzadas con gráficos
- **AdminAudit**: Logs de auditoría
- **AdminSettings**: Configuración del sistema

### Hooks Personalizados

#### useAuth
```typescript
const { user, isAuthenticated, isLoading, login, logout } = useAuth()
```

#### useFavorites
```typescript
const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()
```

#### useForm
```typescript
const { values, errors, handleChange, handleSubmit } = useForm(initialValues, validate)
```

## 🔒 Seguridad

### Medidas Implementadas

1. **Autenticación y Autorización**
   - JWT con expiración corta
   - Refresh tokens seguros
   - Roles y permisos granulares
   - Sesiones con timeout

2. **Validación y Sanitización**
   - Express-validator en todos los endpoints
   - Sanitización de HTML/scripts
   - Validación de tipos TypeScript
   - Límites de longitud

3. **Protección contra Ataques**
   - Rate limiting por IP
   - CORS configurado
   - Helmet.js headers
   - CSRF protection
   - XSS prevention
   - SQL injection prevention (usando ODM)

4. **Encriptación**
   - Passwords con bcrypt (10 rounds)
   - HTTPS en producción
   - Tokens seguros con crypto

5. **Auditoría y Monitoreo**
   - Logging de acciones sensibles
   - Tracking de IPs
   - Alertas de actividad sospechosa

## ⚡ Performance

### Optimizaciones Frontend
- Code splitting por rutas
- Lazy loading de componentes
- Imágenes optimizadas con lazy load
- Bundle size < 500KB
- Service worker para cache
- Debounce en búsquedas

### Optimizaciones Backend
- Índices en campos frecuentes
- Paginación con cursor
- Caché de respuestas frecuentes
- Compresión gzip
- Connection pooling MongoDB
- Agregaciones optimizadas

### Métricas Objetivo
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- API response time: < 200ms
- Lighthouse score: > 90

## 🚀 Deployment

### Requisitos de Producción
- Node.js 18+ LTS
- MongoDB 6.0+
- 2GB RAM mínimo
- SSL certificado
- Dominio configurado

### Variables de Entorno
```env
# Server
NODE_ENV=production
PORT=3001

# Database
MONGODB_URI=mongodb://localhost:27017/japasea

# Auth
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASS=your-password

# Frontend
FRONTEND_URL=https://japasea.com

# Storage
UPLOAD_PATH=/uploads
MAX_FILE_SIZE=5MB
```

### Proceso de Deploy

1. **Build Frontend**
```bash
cd client
npm run build
# Archivos en dist/
```

2. **Configurar Backend**
```bash
cd server
npm install --production
pm2 start src/app.js --name japasea-api
```

3. **Configurar Nginx**
```nginx
server {
    listen 80;
    server_name japasea.com;
    
    # Frontend
    location / {
        root /var/www/japasea/client/dist;
        try_files $uri /index.html;
    }
    
    # API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

4. **Configurar MongoDB**
- Habilitar autenticación
- Crear usuario específico
- Configurar réplicas para HA
- Backups automáticos

5. **Monitoreo**
- PM2 para process management
- Logs con Winston
- Métricas con Prometheus
- Alertas con email/Slack

---

**Última actualización**: Enero 2025
**Versión**: 2.0