# 🗾 Japasea - Plataforma de Turismo de Paraguay

**Japasea** es una aplicación web moderna y escalable para descubrir y explorar los mejores lugares de Paraguay. Construida con **Clean Architecture** y **Domain-Driven Design**, ofrece una experiencia completa desde restaurantes y hoteles hasta atracciones turísticas y servicios locales.

## 🎯 Arquitectura Moderna

- **Frontend**: React 18 + TypeScript con arquitectura por features
- **Backend**: Node.js + Express con Clean Architecture y DDD
- **Base de datos**: MongoDB con repositorios especializados
- **IA**: Integración con Google Gemini para planes de viaje personalizados

## 🚀 Estado del Proyecto

- **Versión**: 2.0 (Refactored Architecture)
- **Estado**: Migración arquitectónica en progreso (Fase 3.3)
- **Demo**: [Próximamente]
- **Branch actual**: `refactor/order-folders-and-files`

## ✨ Características Principales

### Para Usuarios
- 🔍 **Búsqueda Inteligente**: Encuentra lugares por nombre, tipo o ubicación
- 🗺️ **Mapa Interactivo**: Visualiza lugares en un mapa con filtros en tiempo real
- ⭐ **Sistema de Favoritos**: Guarda tus lugares preferidos
- 💬 **Reseñas y Calificaciones**: Lee y comparte experiencias
- 📱 **Diseño Responsivo**: Funciona perfectamente en móvil y desktop
- 🔐 **Autenticación Segura**: Registro con verificación de email

### Para Administradores
- 📊 **Panel de Control Completo**: Dashboard con estadísticas en tiempo real
- 👥 **Gestión de Usuarios**: Control total sobre usuarios y roles
- 📍 **Gestión de Lugares**: CRUD completo con operaciones masivas
- 📝 **Moderación de Reseñas**: Aprobación/rechazo de contenido
- 📈 **Estadísticas Avanzadas**: Gráficos interactivos con Recharts
- 🔍 **Registro de Auditoría**: Seguimiento de todas las acciones
- ⚙️ **Configuración del Sistema**: Ajustes globales desde el panel

## 🛠️ Stack Tecnológico Modular

### Frontend - Arquitectura por Features
- **React 18** con TypeScript y arquitectura modular
- **Material-UI (MUI) v7** con componentes reutilizables
- **React Router DOM** para navegación por features
- **React Leaflet** para mapas interactivos
- **Recharts** para visualizaciones de datos
- **Axios** con servicios especializados por feature
- **Vite** para build optimizado y lazy loading

### Backend - Clean Architecture + DDD
- **Node.js 18+** con Express.js modular
- **MongoDB** con Mongoose y repositorios especializados
- **Clean Architecture**: Separación clara de capas
- **Domain-Driven Design**: Módulos por dominio de negocio
- **JWT + Refresh Tokens** para autenticación segura
- **Google Generative AI** para chatbot y planes de viaje
- **Express Validator** con validadores por módulo
- **Nodemailer** integrado en servicios de dominio

### Herramientas de Desarrollo
- **TypeScript** para tipado estático
- **ESLint + Prettier** para código consistente
- **Jest** para testing unitario y de integración
- **Dependency Injection Container** para gestión de dependencias
- **Rate Limiting** especializado por endpoint
- **Winston** para logging estructurado

## 🏗️ Nueva Arquitectura Modular

### Frontend: Arquitectura por Features con Clean Code
```
client/src/
├── app/                          # Configuración de aplicación
│   ├── App.tsx                   # Componente raíz
│   ├── router.tsx                # Configuración de rutas
│   └── providers.tsx             # Providers globales
├── shared/                       # Recursos compartidos
│   ├── components/               # Componentes reutilizables
│   │   ├── ui/                   # Componentes base (Button, Input, Modal)
│   │   ├── layout/               # Componentes de layout
│   │   ├── forms/                # Componentes de formularios
│   │   └── common/               # Componentes comunes
│   ├── hooks/                    # Hooks reutilizables
│   ├── services/                 # Servicios API
│   ├── utils/                    # Utilidades
│   ├── types/                    # Tipos TypeScript globales
│   └── styles/                   # Estilos globales y temas
├── features/                     # Módulos por funcionalidad
│   ├── auth/                     # Autenticación
│   │   ├── components/           # Componentes específicos de auth
│   │   ├── hooks/                # Hooks de autenticación
│   │   ├── services/             # Servicios de auth
│   │   ├── types/                # Tipos específicos
│   │   └── pages/                # Páginas de auth
│   ├── places/                   # Gestión de lugares
│   │   ├── components/           # Cards, forms, filters
│   │   ├── hooks/                # usePlace, usePlaceSearch
│   │   ├── services/             # placesService
│   │   └── types/                # Lugar, PlaceFilter
│   ├── chat/                     # Chat con IA y planes de viaje
│   ├── favorites/                # Sistema de favoritos
│   ├── admin/                    # Panel administrativo
│   ├── profile/                  # Perfil de usuario
│   └── map/                      # Mapa interactivo
└── pages/                        # Páginas principales
    ├── HomePage.tsx
    ├── LandingPage.tsx
    └── NotFoundPage.tsx
```

### Backend: Clean Architecture with Domain-Driven Design
```
server/src/
├── app.js                        # Configuración de aplicación
├── shared/                       # Recursos compartidos
│   ├── infrastructure/
│   │   ├── database/             # Configuración MongoDB
│   │   ├── external-apis/        # Google AI, email services
│   │   └── middleware/           # Middleware global (auth, cors, helmet)
│   ├── domain/
│   │   ├── entities/             # Entidades base
│   │   ├── value-objects/        # Objetos de valor
│   │   └── exceptions/           # Excepciones personalizadas
│   └── utils/                    # Utilidades compartidas
├── modules/                      # Módulos por dominio
│   ├── auth/                     # Autenticación y autorización
│   │   ├── domain/
│   │   │   ├── entities/         # User, Session, Token
│   │   │   ├── repositories/     # Interfaces de repositorios
│   │   │   └── services/         # PasswordService, TokenService
│   │   ├── application/
│   │   │   ├── use-cases/        # RegisterUser, LoginUser, etc.
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   └── validators/       # Validadores específicos
│   │   └── infrastructure/
│   │       ├── repositories/     # UserRepository implementación
│   │       ├── controllers/      # AuthController (liviano)
│   │       └── routes/           # authRoutes modulares
│   ├── places/                   # Gestión de lugares
│   │   ├── domain/
│   │   │   ├── entities/         # Place, Category
│   │   │   └── services/         # PlaceService, SearchService
│   │   ├── application/
│   │   │   ├── use-cases/        # GetPlaces, SearchPlaces, etc.
│   │   │   └── dto/              # PlaceDto, SearchDto
│   │   └── infrastructure/
│   │       ├── repositories/     # PlaceRepository
│   │       ├── controllers/      # PlacesController
│   │       └── routes/           # placesRoutes
│   ├── chat/                     # Chat con IA y planes de viaje
│   │   ├── application/
│   │   │   └── use-cases/        # GenerateTravelPlan, SaveHistory
│   │   └── infrastructure/
│   │       └── external-apis/    # GoogleAIService
│   ├── reviews/                  # Sistema de reseñas
│   ├── favorites/                # Favoritos de usuario
│   └── admin/                    # Panel administrativo
│       ├── application/
│       │   └── use-cases/        # GetDashboardStats, ManageUsers
│       └── infrastructure/
│           └── controllers/      # AdminController
├── config/                       # Configuraciones centralizadas
└── tests/                        # Tests organizados por módulo
```

### Principios Arquitectónicos Aplicados

#### Clean Architecture
- **Inversión de dependencias**: Los casos de uso no dependen de la infraestructura
- **Separación de responsabilidades**: Cada capa tiene una función específica
- **Testabilidad**: Lógica de negocio independiente de frameworks

#### Domain-Driven Design
- **Módulos por dominio**: Organización según el negocio, no por tecnología
- **Entidades de dominio**: Lógica de negocio encapsulada
- **Repositorios**: Abstracciones para acceso a datos

#### Frontend Clean Code
- **Componentes pequeños**: Máximo 150 líneas por componente
- **Custom hooks**: Reutilización de lógica de estado
- **Feature modules**: Organización por funcionalidad

### Beneficios de la Nueva Arquitectura

#### Mantenibilidad
- 📝 **Archivos más pequeños**: Promedio de 150 líneas vs 400+ anteriores
- 🔍 **Ubicación fácil**: Cada funcionalidad tiene su lugar específico
- 🧪 **Testing simplificado**: Componentes y servicios más fáciles de probar

#### Escalabilidad
- 👥 **Desarrollo en paralelo**: Múltiples desarrolladores sin conflictos
- ➕ **Nuevas features**: Agregar módulos sin afectar existentes
- 🔄 **Reutilización**: Componentes y servicios compartibles

#### Performance
- 🚀 **Lazy loading**: Carga solo lo necesario por ruta
- 🌳 **Tree shaking**: Elimina código no utilizado
- 💾 **Caching inteligente**: Optimización por caso de uso

## 🚦 Instalación y Uso

### Requisitos Previos
- Node.js 18+
- MongoDB 6+
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/alex2rive3/japasea.git
cd japasea
```

2. **Configurar el Backend (Nueva Arquitectura Modular)**
```bash
cd server
npm install

# Configurar variables de entorno
cp .env.example .env  # Configurar según tu entorno

# Ejecutar migraciones (si existen)
npm run migrate

# Cargar datos de prueba (opcional)
npm run db:seed

# Iniciar en modo desarrollo con arquitectura modular
npm run dev
```

3. **Configurar el Frontend (Estructura por Features)**
```bash
cd ../client
npm install

# Iniciar servidor de desarrollo con Vite
npm run dev
```

4. **Verificar la nueva arquitectura**
```bash
# Backend: Verificar estructura modular
ls -la server/src/modules/

# Frontend: Verificar estructura por features  
ls -la client/src/features/

# Probar endpoints modulares
curl http://localhost:3001/api/v1/places
curl http://localhost:3001/api/v1/auth/health
```

5. **Acceder a la aplicación**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Health Check: http://localhost:3001/api/v1/health
- Documentación API: http://localhost:3001/api-docs (próximamente)

### Variables de Entorno

#### Backend (.env) - Configuración Modular
```env
# Configuración del servidor
PORT=3001
NODE_ENV=development

# Base de datos MongoDB
MONGODB_URI=mongodb://localhost:27017/japasea

# JWT y seguridad
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
JWT_REFRESH_SECRET=tu_refresh_secret_aqui
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Servicios de email (para módulo Auth)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password_gmail

# Google AI (para módulo Chat)
GOOGLE_AI_API_KEY=tu_google_ai_api_key

# URLs y CORS
FRONTEND_URL=http://localhost:5173
API_VERSION=v1

# Rate limiting y seguridad
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Configuración de caché (futuro)
REDIS_URL=redis://localhost:6379
CACHE_TTL=300
```

#### Frontend (.env) - Variables de Desarrollo
```env
# API Base URL (apunta al backend modular)
VITE_API_BASE_URL=http://localhost:3001/api/v1

# Configuración de mapas
VITE_MAP_DEFAULT_LAT=-27.330
VITE_MAP_DEFAULT_LNG=-55.865
VITE_MAP_DEFAULT_ZOOM=13

# Configuración de la app
VITE_APP_NAME="Japasea - Descubre Paraguay"
VITE_APP_VERSION="2.0.0"

# Features flags (para desarrollo incremental)
VITE_ENABLE_CHAT=true
VITE_ENABLE_ADMIN=true
VITE_ENABLE_PWA=false
```

## 📋 API Endpoints - Nueva Estructura Modular

### Arquitectura de API
La API ahora sigue patrones REST con estructura modular por dominio:

#### Autenticación (`/api/v1/auth`)
- `POST /api/v1/auth/register` - Registro de usuario con casos de uso dedicados
- `POST /api/v1/auth/login` - Inicio de sesión con TokenService
- `POST /api/v1/auth/logout` - Cerrar sesión
- `POST /api/v1/auth/verify-email` - Verificar email con EmailService
- `POST /api/v1/auth/refresh-token` - Renovar tokens JWT
- `POST /api/v1/auth/forgot-password` - Recuperar contraseña
- `POST /api/v1/auth/reset-password` - Restablecer contraseña

#### Lugares (`/api/v1/places`)
- `GET /api/v1/places` - Listar lugares con casos de uso GetPlaces
- `GET /api/v1/places/search` - Búsqueda con SearchPlaces use case
- `GET /api/v1/places/:id` - Detalle de lugar
- `POST /api/v1/places` - Crear lugar (admin) con validación de dominio
- `PUT /api/v1/places/:id` - Actualizar lugar (admin)
- `DELETE /api/v1/places/:id` - Eliminar lugar (admin)

#### Chat y IA (`/api/v1/chat`)
- `POST /api/v1/chat/travel-plan` - Generar plan de viaje con GoogleAI
- `GET /api/v1/chat/history/:conversationId` - Historial de conversación
- `POST /api/v1/chat/feedback` - Feedback sobre respuestas de IA

#### Favoritos (`/api/v1/favorites`)
- `GET /api/v1/favorites` - Listar favoritos del usuario
- `POST /api/v1/favorites/:placeId` - Agregar a favoritos
- `DELETE /api/v1/favorites/:placeId` - Remover de favoritos

#### Reseñas (`/api/v1/reviews`)
- `GET /api/v1/reviews/place/:placeId` - Reseñas de un lugar
- `POST /api/v1/reviews` - Crear reseña con validación
- `PUT /api/v1/reviews/:id` - Actualizar reseña propia
- `DELETE /api/v1/reviews/:id` - Eliminar reseña

#### Administración (`/api/v1/admin`)
- `GET /api/v1/admin/dashboard` - Estadísticas del dashboard con casos de uso
- `GET /api/v1/admin/users` - Gestión de usuarios con ManageUsers
- `POST /api/v1/admin/users/:id/ban` - Banear usuario con auditoría
- `POST /api/v1/admin/users/:id/activate` - Activar usuario
- `GET /api/v1/admin/places/pending` - Lugares pendientes de aprobación
- `GET /api/v1/admin/reviews/pending` - Reseñas pendientes de moderación
- `GET /api/v1/admin/audit` - Logs de auditoría con filtros
- `POST /api/v1/admin/bulk-actions` - Acciones masivas

### Características de la Nueva API

#### Controladores Livianos
- **Responsabilidad única**: Solo manejan HTTP (request/response)
- **Delegación**: Casos de uso manejan la lógica de negocio
- **Middleware especializado**: Validación y autorización por módulo

#### Casos de Uso
- **RegisterUser**: Registro con validaciones, hash de password y email de verificación
- **LoginUser**: Autenticación con TokenService y auditoría
- **GetPlaces**: Obtención con filtros, caché y optimizaciones
- **SearchPlaces**: Búsqueda inteligente con múltiples criterios
- **GenerateTravelPlan**: Integración con GoogleAI y gestión de historial

#### Repositorios Especializados
- **UserRepository**: 15 métodos específicos para operaciones de usuario
- **PlaceRepository**: Consultas optimizadas con índices y agregaciones
- **ChatHistoryRepository**: Gestión de conversaciones e historial

#### Servicios de Dominio
- **PasswordService**: Hash, validación de fortaleza, comparación
- **TokenService**: JWT generation, refresh tokens, validación
- **EmailService**: Plantillas, verificación, notificaciones
- **GoogleAIService**: Integración con Gemini Pro para planes de viaje

### Desarrollo con Nueva Arquitectura

#### Scripts de Desarrollo Backend
```bash
# Desarrollar módulos específicos
npm run dev:auth          # Solo módulo de autenticación
npm run dev:places        # Solo módulo de lugares
npm run dev:admin         # Solo módulo de administración

# Testing por módulos
npm test auth             # Tests del módulo Auth
npm test places           # Tests del módulo Places
npm run test:integration  # Tests de integración

# Validar arquitectura
npm run validate:structure # Verificar estructura modular
npm run lint:architecture  # Validar reglas arquitectónicas
```

#### Scripts de Desarrollo Frontend
```bash
# Desarrollo por features
npm run dev:feature auth      # Solo feature de autenticación
npm run dev:feature places    # Solo feature de lugares

# Build optimizado por features
npm run build:analyze         # Analizar bundle size
npm run build:features        # Build con lazy loading

# Testing por features
npm test features/auth        # Tests de feature específica
npm run test:components       # Tests de componentes compartidos
```

## 🏛️ Decisiones Arquitectónicas

### ¿Por qué Clean Architecture + DDD?

#### Problemas del Código Legacy
- **Controladores monolíticos**: 625-976 líneas por archivo
- **Acoplamiento alto**: Lógica de negocio mezclada con HTTP
- **Difícil testing**: Dependencias complejas entre capas
- **Escalabilidad limitada**: Agregar features afectaba código existente

#### Solución Implementada
- **Separación de responsabilidades**: Cada capa tiene una función específica
- **Inversión de dependencias**: La lógica de negocio no depende de frameworks
- **Modularidad**: Cada dominio es independiente y reutilizable
- **Testabilidad**: Casos de uso aislados y fáciles de probar

### Patrones Implementados

#### Backend Patterns
- **Use Cases**: Encapsulan reglas de negocio específicas
- **Repository Pattern**: Abstrae el acceso a datos
- **Service Layer**: Servicios de dominio para lógica compleja
- **Dependency Injection**: Container para gestión de dependencias
- **Command Pattern**: Para operaciones complejas con auditoría

#### Frontend Patterns
- **Feature-based Structure**: Organización por funcionalidad
- **Custom Hooks**: Reutilización de lógica de estado
- **Compound Components**: Componentes complejos descompuestos
- **Provider Pattern**: Gestión de estado global por contexto
- **Higher-Order Components**: Para funcionalidades transversales

### Métricas de Calidad Arquitectónica

#### Complejidad Reducida
```
Antes:
- authController.js: 625 líneas, complejidad ciclomática alta
- placesController.js: 976 líneas, múltiples responsabilidades
- Acoplamiento: Alto entre capas

Después:
- AuthController: ~50 líneas, solo orquestación HTTP
- 5 use cases específicos: promedio 117 líneas cada uno
- Acoplamiento: Bajo, inversión de dependencias
```

#### Mantenibilidad Mejorada
```
Antes:
- Modificar auth requería tocar 1 archivo de 625 líneas
- Tests complejos por dependencias acopladas
- Deploy riesgoso por impacto cruzado

Después:
- Modificar auth: archivo específico de ~100 líneas
- Tests aislados por use case
- Deploy seguro por módulos independientes
```

#### Performance Optimizada
```
Frontend:
- Lazy loading por features
- Tree shaking efectivo
- Bundle splitting automático

Backend:
- Queries optimizadas por repositorio
- Caching por caso de uso
- Middleware especializado
```

## 👤 Usuarios de Prueba

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@japasea.com | admin123 | Administrador |
| usuario@ejemplo.com | usuario123 | Usuario |

## 🔐 Seguridad

- ✅ Autenticación JWT con refresh tokens
- ✅ Validación de datos con express-validator
- ✅ Rate limiting en endpoints sensibles
- ✅ Sanitización de inputs
- ✅ CORS configurado
- ✅ Helmet.js para headers de seguridad
- ✅ Auditoría automática de acciones

## 📊 Estado de Desarrollo y Refactoring

### 🏗️ Refactoring Arquitectónico en Progreso

#### ✅ Completado (Fase 3.1-3.3)
- **Estructura modular**: Migración a Clean Architecture con DDD
- **Módulo Places**: Refactorizado de 976 líneas a estructura modular
  - 6 casos de uso especializados
  - PlaceService (141 líneas) y PlaceRepository (101 líneas)
  - GoogleAIService (260 líneas) para integración con IA
- **Módulo Auth**: Refactorizado de 625 líneas a componentes especializados
  - 5 casos de uso: RegisterUser, LoginUser, RefreshToken, VerifyEmail, ResetPassword
  - PasswordService (158 líneas) y TokenService (201 líneas)
  - UserRepository (245 líneas) con 15 métodos especializados
- **Principios SOLID**: Implementados en toda la nueva arquitectura
- **Dependency Injection**: Container para gestión de dependencias

#### 🔄 En Progreso (Fase 3.4-3.7)
- **Módulo Admin**: Migración de adminController.js (972 líneas)
- **Controladores livianos**: Transformación a orquestadores HTTP
- **Rutas modulares**: Organización por dominio con middleware especializado
- **Servicios compartidos**: Caching, validación, auditoría

### ✨ Funcionalidades del Sistema

#### ✅ Backend Completado
- Sistema de autenticación modular con JWT y refresh tokens
- Gestión de lugares con arquitectura limpia
- Chat con IA usando casos de uso especializados
- Base de datos MongoDB con repositorios optimizados
- Middleware de seguridad (helmet, cors, rate limiting)
- Validación de datos con express-validator
- Sistema de auditoría automática
- Manejo centralizado de errores

#### ✅ Frontend Completado  
- Panel de administración funcional (599 líneas → modularizado)
- Sistema de autenticación con Context API
- Gestión de lugares con CRUD completo
- Sistema de favoritos con persistencia
- Búsqueda y filtros en tiempo real
- Mapas interactivos con React Leaflet
- Sistema de reseñas con moderación
- Estadísticas con gráficos usando Recharts
- Formularios con validación (RegisterComponent 490 líneas → modularizado)
- Diseño responsivo con Material-UI

#### 🔄 En Migración Frontend
- **ProfileComponent** (737 líneas) → Feature module completo
- **ChatComponent** (529 líneas) → Componentes especializados
- **Layout** (449 líneas) → Componentes de layout modulares
- **PlaceDetailsModal** (434 líneas) → Modal components reutilizables

### 📈 Métricas de Mejora

#### Antes del Refactoring
- **Controladores monolíticos**: 
  - placesController.js: 976 líneas
  - adminController.js: 972 líneas  
  - authController.js: 625 líneas
- **Componentes grandes**:
  - ProfileComponent.tsx: 737 líneas
  - AdminSettings.tsx: 599 líneas
  - ChatComponent.tsx: 529 líneas

#### Después del Refactoring (Progreso Actual)
- **Places Module**: 976 → 81 líneas controlador (92% reducción)
- **Auth Module**: 625 → ~50 líneas controlador (92% reducción)
- **Casos de uso promedio**: 117 líneas cada uno
- **Repositorios especializados**: 15+ métodos específicos por dominio
- **Servicios de dominio**: Lógica de negocio encapsulada

### 🚀 Próximamente (Fases 4-5)
- Finalización de migración Admin Module
- Optimizaciones de performance con caching Redis
- Testing automatizado de toda la arquitectura modular
- Documentación automática con Swagger
- PWA (Progressive Web App) capabilities
- Internacionalización (i18n) con react-i18next
- Sistema de notificaciones push
- Integración con pasarelas de pago paraguayas

### 🎯 Objetivos de Calidad
- **Cobertura de tests**: > 70% (objetivo)
- **Bundle size**: < 500KB gzipped (objetivo)  
- **Lighthouse Performance**: > 90 (objetivo)
- **Tiempo de build**: < 5 segundos (objetivo)
- **Líneas por archivo**: Máximo 200 líneas (implementado)

## 🤝 Contribuir a Japasea

### Guías de Desarrollo

#### Estructura de Commits
```bash
# Formato: tipo(módulo): descripción
git commit -m "feat(auth): add password strength validation use case"
git commit -m "fix(places): resolve search service caching issue"
git commit -m "refactor(admin): migrate user management to use cases"
```

#### Proceso de Desarrollo

1. **Fork y clonar**
```bash
git clone https://github.com/tu-usuario/japasea.git
cd japasea
git checkout -b feature/nueva-funcionalidad
```

2. **Seguir la arquitectura modular**
```bash
# Backend: Crear en el módulo correcto
server/src/modules/{dominio}/{capa}/{tipo}/

# Frontend: Crear en el feature correcto  
client/src/features/{feature}/{tipo}/
```

3. **Desarrollar con casos de uso**
```javascript
// Ejemplo: Nuevo caso de uso
// server/src/modules/places/application/use-cases/UpdatePlaceRating.js
class UpdatePlaceRating {
  constructor(placeRepository, auditService) {
    this.placeRepository = placeRepository
    this.auditService = auditService
  }

  async execute(placeId, newRating, userId) {
    // Lógica de negocio específica
  }
}
```

4. **Crear tests correspondientes**
```javascript
// tests/modules/places/use-cases/UpdatePlaceRating.test.js
describe('UpdatePlaceRating Use Case', () => {
  it('should update place rating correctly', async () => {
    // Test aislado del use case
  })
})
```

5. **Validar arquitectura**
```bash
# Verificar que sigue los patrones
npm run validate:architecture

# Tests específicos del módulo
npm test places

# Lint del código
npm run lint
```

### Convenciones de Código

#### Backend (Módulos)
- **Use Cases**: Un caso de uso por archivo, máximo 200 líneas
- **Repositories**: Métodos específicos, no genéricos
- **Services**: Lógica de dominio pura, sin dependencias de frameworks
- **Controllers**: Solo orquestación HTTP, máximo 50 líneas por método

#### Frontend (Features)
- **Components**: Máximo 150 líneas, responsabilidad única
- **Hooks**: Lógica reutilizable, bien tipada con TypeScript
- **Services**: API calls organizadas por feature
- **Types**: Interfaces específicas por feature

### Arquitectura de Testing

```
tests/
├── unit/                    # Tests unitarios
│   ├── modules/
│   │   ├── auth/use-cases/  # Tests de casos de uso Auth
│   │   ├── places/services/ # Tests de servicios Places
│   └── features/
│       ├── auth/hooks/      # Tests de hooks Auth
│       └── places/components/ # Tests componentes Places
├── integration/             # Tests de integración
│   ├── api/                # Tests de endpoints completos
│   └── features/           # Tests de flujos de usuario
└── e2e/                    # Tests end-to-end
    └── scenarios/          # Escenarios completos de usuario
```

### Pull Request Checklist

- [ ] Sigue la estructura modular (módulos backend / features frontend)
- [ ] Casos de uso tienen responsabilidad única
- [ ] Tests incluidos para nueva funcionalidad
- [ ] Documentación actualizada (README, API docs)
- [ ] Lint y validación arquitectónica pasan
- [ ] No aumenta complejidad de archivos existentes
- [ ] Mantiene inversión de dependencias
- [ ] TypeScript types definidos correctamente

### Crear Nuevos Módulos

#### Backend Module Template
```bash
# Crear estructura completa para nuevo módulo
mkdir -p server/src/modules/nuevo-modulo/{domain,application,infrastructure}
mkdir -p server/src/modules/nuevo-modulo/domain/{entities,repositories,services}
mkdir -p server/src/modules/nuevo-modulo/application/{use-cases,dto,validators}
mkdir -p server/src/modules/nuevo-modulo/infrastructure/{repositories,controllers,routes}

# Crear archivos base
touch server/src/modules/nuevo-modulo/domain/index.js
touch server/src/modules/nuevo-modulo/application/index.js
touch server/src/modules/nuevo-modulo/infrastructure/index.js
```

#### Frontend Feature Template
```bash
# Crear estructura completa para nueva feature
mkdir -p client/src/features/nueva-feature/{components,hooks,services,types,pages}

# Crear archivos base
touch client/src/features/nueva-feature/index.ts
touch client/src/features/nueva-feature/types/index.ts
touch client/src/features/nueva-feature/hooks/index.ts
```

### Code Review Guidelines

#### Criterios de Aprobación
- **Arquitectura**: ¿Sigue Clean Architecture y DDD?
- **SOLID**: ¿Respeta los principios SOLID?
- **Testabilidad**: ¿Es fácil de probar?
- **Mantenibilidad**: ¿Es fácil de entender y modificar?
- **Performance**: ¿No introduce regressions de performance?

#### Red Flags
- ❌ Casos de uso que dependen de frameworks
- ❌ Controladores con lógica de negocio
- ❌ Componentes con más de 150 líneas
- ❌ Lógica duplicada entre módulos
- ❌ Tests que mockean demasiado
- ❌ Imports circulares entre módulos

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

- **Email**: contacto@japasea.com
- **Website**: [japasea.com](https://japasea.com)
- **GitHub**: [@japasea](https://github.com/japasea)

---

Hecho con ❤️ en Paraguay 🇵🇾