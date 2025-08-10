# Plan de Refactorización de Arquitectura - Japasea

## Análisis del Estado Actual

### Problemas Identificados

#### Frontend (Cliente)
- **Archivos muy extensos**: 
  - `ProfileComponent.tsx` (737 líneas)
  - `AdminSettings.tsx` (599 líneas) 
  - `ChatComponent.tsx` (529 líneas)
  - `RegisterComponent.tsx` (490 líneas)
  - `Layout.tsx` (449 líneas)
  - `PlaceDetailsModal.tsx` (434 líneas)

- **Responsabilidades mezcladas**: Componentes que manejan múltiples funcionalidades
- **Lógica de negocio en componentes**: Validaciones, transformaciones y llamadas API directamente en la UI
- **Estilos dispersos**: Algunos en archivos separados, otros inline
- **Hooks personalizados limitados**: Poca reutilización de lógica

#### Backend (Servidor)
- **Controladores gigantes**:
  - `placesController.js` (976 líneas)
  - `adminController.js` (972 líneas) 
  - `authController.js` (625 líneas)

- **Controladores que hacen demasiado**: Validación, transformación, lógica de negocio y respuesta HTTP en un solo lugar
- **Falta de capa de servicios**: La lógica de negocio está directamente en los controladores
- **Modelos con lógica**: Los modelos tienen más responsabilidades de las que deberían
- **Rutas con lógica**: Algunas validaciones y transformaciones están en las rutas

### Métricas Actuales
- **Cliente**: 12,761 líneas en 51 archivos TypeScript/React
- **Servidor**: 7,876 líneas en 32 archivos JavaScript/Node.js
- **Promedio por archivo cliente**: 250 líneas
- **Promedio por archivo servidor**: 246 líneas

---

## Nueva Arquitectura Propuesta

### Frontend: Arquitectura por Capas con Feature Modules

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
│   ├── constants/                # Constantes
│   ├── types/                    # Tipos TypeScript globales
│   └── styles/                   # Estilos globales y temas
├── features/                     # Módulos por funcionalidad
│   ├── auth/                     # Autenticación
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── pages/
│   ├── places/                   # Gestión de lugares
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── pages/
│   ├── chat/                     # Chat con IA
│   ├── favorites/                # Favoritos
│   ├── admin/                    # Panel administrativo
│   ├── profile/                  # Perfil de usuario
│   └── map/                      # Mapa interactivo
└── pages/                        # Páginas principales
    ├── HomePage.tsx
    ├── LandingPage.tsx
    └── NotFoundPage.tsx
```

### Backend: Clean Architecture con DDD

```
server/src/
├── app.js                        # Configuración de la aplicación
├── shared/                       # Recursos compartidos
│   ├── infrastructure/
│   │   ├── database/             # Configuración de BD
│   │   ├── external-apis/        # APIs externas (Google AI)
│   │   └── middleware/           # Middleware global
│   ├── domain/
│   │   ├── entities/             # Entidades base
│   │   ├── value-objects/        # Objetos de valor
│   │   └── exceptions/           # Excepciones personalizadas
│   └── utils/                    # Utilidades compartidas
├── modules/                      # Módulos por dominio
│   ├── auth/                     # Autenticación y autorización
│   │   ├── domain/
│   │   │   ├── entities/         # User, Session
│   │   │   ├── repositories/     # Interfaces de repositorios
│   │   │   └── services/         # Servicios de dominio
│   │   ├── application/
│   │   │   ├── use-cases/        # Casos de uso
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   └── validators/       # Validadores
│   │   └── infrastructure/
│   │       ├── repositories/     # Implementaciones
│   │       ├── controllers/      # Controladores HTTP
│   │       └── routes/           # Definición de rutas
│   ├── places/                   # Gestión de lugares
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   ├── chat/                     # Chat con IA
│   ├── reviews/                  # Reseñas
│   ├── favorites/                # Favoritos
│   └── admin/                    # Administración
├── config/                       # Configuraciones
├── docs/                         # Documentación API
└── tests/                        # Tests organizados por módulo
```

---

## Plan de Migración por Fases

### Fase 1: Preparación y Estructura Base (2-3 días)

#### Frontend
- [ ] **Crear estructura de directorios**
  - Crear carpetas `shared/`, `features/`, `app/`
  - Reorganizar archivos existentes sin modificar contenido

- [ ] **Migrar componentes base a `shared/`**
  - Extraer componentes UI reutilizables de Material-UI
  - Mover tipos globales a `shared/types/`
  - Consolidar estilos en `shared/styles/`

- [ ] **Configurar barrel exports**
  - Crear `index.ts` en cada carpeta para exports limpios

#### Backend
- [ ] **Crear estructura modular**
  - Crear carpetas `shared/`, `modules/`
  - Reorganizar archivos existentes por dominio

- [ ] **Separar configuraciones**
  - Consolidar toda la configuración en `config/`
  - Centralizar conexiones de BD y servicios externos

### Fase 2: Refactoring de Frontend (5-7 días)

#### 2.1: Componentes más grandes (Días 1-2)
- [ ] **ProfileComponent.tsx** → Feature module completo
  ```
  features/profile/
  ├── components/
  │   ├── ProfileTabs.tsx
  │   ├── PersonalInfoForm.tsx
  │   ├── PasswordChangeForm.tsx
  │   ├── PreferencesPanel.tsx
  │   ├── FavoritesList.tsx
  │   └── ActivityHistory.tsx
  ├── hooks/
  │   ├── useProfile.ts
  │   ├── usePreferences.ts
  │   └── useProfileTabs.ts
  ├── services/
  │   └── profileService.ts
  ├── types/
  │   └── profile.types.ts
  └── pages/
      └── ProfilePage.tsx
  ```

- [ ] **ChatComponent.tsx** → Feature module
  ```
  features/chat/
  ├── components/
  │   ├── ChatInterface.tsx
  │   ├── MessageList.tsx
  │   ├── MessageInput.tsx
  │   ├── TravelPlanDisplay.tsx
  │   └── PlaceRecommendations.tsx
  ├── hooks/
  │   ├── useChat.ts
  │   ├── useTravelPlans.ts
  │   └── useMessageHistory.ts
  └── services/
      └── chatService.ts
  ```

#### 2.2: Componentes administrativos (Días 3-4)
- [ ] **AdminSettings.tsx** → Módulo admin completo
- [ ] **AdminDashboard.tsx** → Componentes más pequeños
- [ ] **AdminUsers.tsx** → Separar lista, formularios y acciones

#### 2.3: Layout y navegación (Día 5)
- [ ] **Layout.tsx** → Componentes especializados
  ```
  shared/components/layout/
  ├── AppLayout.tsx
  ├── Navbar.tsx
  ├── Sidebar.tsx
  ├── MobileMenu.tsx
  └── UserMenu.tsx
  ```

#### 2.4: Formularios y validación (Días 6-7)
- [ ] **RegisterComponent.tsx** → Formulario modular
- [ ] **LoginComponent.tsx** → Simplificar y extraer validaciones
- [ ] Crear hook `useFormValidation` genérico

### Fase 3: Refactoring de Backend (10-14 días)

#### 3.1: Preparación de estructura modular (Días 1-2)

##### Día 1: Crear estructura base
- [ ] **Crear directorios modulares**
  ```bash
  mkdir -p server/src/shared/{infrastructure,domain,utils}
  mkdir -p server/src/shared/infrastructure/{database,external-apis,middleware}
  mkdir -p server/src/shared/domain/{entities,value-objects,exceptions}
  mkdir -p server/src/modules/{auth,places,chat,reviews,favorites,admin}
  
  # Para cada módulo crear estructura completa
  for module in auth places chat reviews favorites admin; do
    mkdir -p server/src/modules/$module/{domain,application,infrastructure}
    mkdir -p server/src/modules/$module/domain/{entities,repositories,services}
    mkdir -p server/src/modules/$module/application/{use-cases,dto,validators}
    mkdir -p server/src/modules/$module/infrastructure/{repositories,controllers,routes}
  done
  ```

- [ ] **Mover configuraciones a shared**
  ```bash
  mv server/src/config/* server/src/shared/infrastructure/
  mv server/src/middleware/* server/src/shared/infrastructure/middleware/
  mv server/src/utils/* server/src/shared/utils/
  ```

##### Día 2: Migrar modelos actuales
- [ ] **Separar modelos por dominio**
  - `server/src/models/userModel.js` → `modules/auth/domain/entities/User.js`
  - `server/src/models/placeModel.js` → `modules/places/domain/entities/Place.js`
  - `server/src/models/reviewModel.js` → `modules/reviews/domain/entities/Review.js`
  - `server/src/models/chatHistoryModel.js` → `modules/chat/domain/entities/ChatHistory.js`

#### 3.2: Migración del módulo Places (Días 3-4)

##### Día 3: Dividir placesController.js (976 líneas)

**Crear casos de uso específicos:**

```javascript
// modules/places/application/use-cases/GetPlaces.js
class GetPlaces {
  constructor(placeRepository) {
    this.placeRepository = placeRepository
  }

  async execute(filters = {}) {
    const { type, status = 'active' } = filters
    
    const query = { status }
    if (type) query.type = new RegExp(type, 'i')

    return await this.placeRepository.findByFilters(query, {
      sort: { 'rating.average': -1, 'metadata.views': -1 }
    })
  }
}
```

```javascript
// modules/places/application/use-cases/SearchPlaces.js
class SearchPlaces {
  constructor(placeRepository) {
    this.placeRepository = placeRepository
  }

  async execute(query) {
    if (!query) {
      throw new ValidationError('El parámetro de consulta es requerido')
    }

    const searchCriteria = {
      $and: [
        { status: 'active' },
        {
          $or: [
            { name: new RegExp(query, 'i') },
            { description: new RegExp(query, 'i') },
            { address: new RegExp(query, 'i') },
            { type: new RegExp(query, 'i') }
          ]
        }
      ]
    }

    return await this.placeRepository.search(searchCriteria)
  }
}
```

```javascript
// modules/places/application/use-cases/GenerateTravelPlan.js
const { GoogleGenAI } = require('@google/genai')

class GenerateTravelPlan {
  constructor(placeRepository, chatHistoryRepository, aiService) {
    this.placeRepository = placeRepository
    this.chatHistoryRepository = chatHistoryRepository
    this.aiService = aiService
  }

  async execute(userId, message, conversationId) {
    // Obtener historial de chat
    const history = await this.chatHistoryRepository.findByConversation(conversationId)
    
    // Obtener lugares disponibles
    const places = await this.placeRepository.findActive()
    
    // Generar respuesta con IA
    const response = await this.aiService.generateTravelPlan({
      message,
      history,
      places,
      userId
    })

    // Guardar en historial
    await this.chatHistoryRepository.save({
      userId,
      conversationId,
      userMessage: message,
      botResponse: response,
      timestamp: new Date()
    })

    return response
  }
}
```

##### Día 4: Crear servicios de dominio y repositorios

```javascript
// modules/places/domain/services/PlaceService.js
class PlaceService {
  constructor(placeRepository, validationService) {
    this.placeRepository = placeRepository
    this.validationService = validationService
  }

  async createPlace(placeData) {
    // Validaciones de dominio
    await this.validationService.validatePlaceData(placeData)
    
    // Lógica de negocio específica
    if (await this.placeRepository.existsByName(placeData.name)) {
      throw new DomainError('Ya existe un lugar con ese nombre')
    }

    // Enriquecer datos
    const enrichedData = {
      ...placeData,
      slug: this.generateSlug(placeData.name),
      createdAt: new Date(),
      status: 'pending'
    }

    return await this.placeRepository.create(enrichedData)
  }

  generateSlug(name) {
    return name.toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
  }
}
```

```javascript
// modules/places/infrastructure/repositories/PlaceRepository.js
const Place = require('../../domain/entities/Place')

class PlaceRepository {
  async findByFilters(query, options = {}) {
    const { sort, limit, skip } = options
    return await Place.find(query)
      .sort(sort || {})
      .limit(limit || 0)
      .skip(skip || 0)
      .lean()
  }

  async search(criteria) {
    return await Place.find(criteria)
      .select('-__v')
      .sort({ 'rating.average': -1 })
      .lean()
  }

  async findActive() {
    return await Place.find({ status: 'active' })
      .select('name description type location address')
      .lean()
  }

  async existsByName(name) {
    const count = await Place.countDocuments({ 
      name: new RegExp(name, 'i') 
    })
    return count > 0
  }

  async create(placeData) {
    const place = new Place(placeData)
    return await place.save()
  }
}
```

#### 3.3: Migración del módulo Auth (Días 5-6)

##### Día 5: Dividir authController.js (625 líneas)

```javascript
// modules/auth/application/use-cases/RegisterUser.js
class RegisterUser {
  constructor(userRepository, passwordService, emailService, validationService) {
    this.userRepository = userRepository
    this.passwordService = passwordService
    this.emailService = emailService
    this.validationService = validationService
  }

  async execute(userData) {
    // Validaciones
    await this.validationService.validateRegistration(userData)
    
    // Verificar si usuario existe
    if (await this.userRepository.existsByEmail(userData.email)) {
      throw new ConflictError('El usuario ya existe')
    }

    // Hash password
    const hashedPassword = await this.passwordService.hash(userData.password)
    
    // Crear usuario
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
      emailVerified: false,
      verificationToken: this.generateToken()
    })

    // Enviar email de verificación
    await this.emailService.sendVerificationEmail(user.email, user.verificationToken)

    return { 
      id: user._id, 
      email: user.email, 
      name: user.name 
    }
  }

  generateToken() {
    return require('crypto').randomBytes(32).toString('hex')
  }
}
```

```javascript
// modules/auth/application/use-cases/LoginUser.js
const jwt = require('jsonwebtoken')

class LoginUser {
  constructor(userRepository, passwordService, jwtService) {
    this.userRepository = userRepository
    this.passwordService = passwordService
    this.jwtService = jwtService
  }

  async execute(email, password) {
    // Buscar usuario
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new UnauthorizedError('Credenciales inválidas')
    }

    // Verificar password
    const isValidPassword = await this.passwordService.compare(password, user.password)
    if (!isValidPassword) {
      throw new UnauthorizedError('Credenciales inválidas')
    }

    // Generar tokens
    const tokens = await this.jwtService.generateTokens(user)

    // Actualizar último login
    await this.userRepository.updateLastLogin(user._id)

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      tokens
    }
  }
}
```

##### Día 6: Servicios de dominio Auth

```javascript
// modules/auth/domain/services/AuthService.js
class AuthService {
  constructor(passwordService, tokenService) {
    this.passwordService = passwordService
    this.tokenService = tokenService
  }

  async validatePasswordStrength(password) {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasNonalphas = /\W/.test(password)

    if (password.length < minLength) {
      throw new ValidationError('La contraseña debe tener al menos 8 caracteres')
    }

    if (!(hasUpperCase && hasLowerCase && hasNumbers)) {
      throw new ValidationError('La contraseña debe incluir mayúsculas, minúsculas y números')
    }
  }

  async generateSecureToken() {
    return this.tokenService.generateSecure()
  }
}
```

#### 3.4: Migración del módulo Admin (Días 7-8)

##### Día 7: Dividir adminController.js (972 líneas)

```javascript
// modules/admin/application/use-cases/GetDashboardStats.js
class GetDashboardStats {
  constructor(userRepository, placeRepository, reviewRepository, auditRepository) {
    this.userRepository = userRepository
    this.placeRepository = placeRepository
    this.reviewRepository = reviewRepository
    this.auditRepository = auditRepository
  }

  async execute() {
    const [
      totalUsers,
      activeUsers,
      totalPlaces,
      activePlaces,
      pendingPlaces,
      totalReviews,
      pendingReviews,
      recentAudits
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.countActive(),
      this.placeRepository.count(),
      this.placeRepository.countByStatus('active'),
      this.placeRepository.countByStatus('pending'),
      this.reviewRepository.count(),
      this.reviewRepository.countPending(),
      this.auditRepository.findRecent(10)
    ])

    return {
      users: { total: totalUsers, active: activeUsers },
      places: { total: totalPlaces, active: activePlaces, pending: pendingPlaces },
      reviews: { total: totalReviews, pending: pendingReviews },
      audits: recentAudits
    }
  }
}
```

##### Día 8: Casos de uso Admin específicos

```javascript
// modules/admin/application/use-cases/ManageUsers.js
class ManageUsers {
  constructor(userRepository, emailService, auditService) {
    this.userRepository = userRepository
    this.emailService = emailService
    this.auditService = auditService
  }

  async listUsers(filters, pagination) {
    const users = await this.userRepository.findWithFilters(filters, pagination)
    return users
  }

  async banUser(userId, reason, adminId) {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundError('Usuario no encontrado')

    await this.userRepository.ban(userId, reason)
    await this.emailService.sendBanNotification(user.email, reason)
    
    await this.auditService.log({
      action: 'USER_BANNED',
      adminId,
      targetId: userId,
      details: { reason }
    })
  }

  async activateUser(userId, adminId) {
    await this.userRepository.activate(userId)
    
    await this.auditService.log({
      action: 'USER_ACTIVATED',
      adminId,
      targetId: userId
    })
  }
}
```

#### 3.5: Capa de servicios compartidos (Días 9-10)

##### Día 9: Servicios de infraestructura

```javascript
// shared/infrastructure/external-apis/GoogleAIService.js
const { GoogleGenAI } = require('@google/genai')

class GoogleAIService {
  constructor() {
    this.ai = new GoogleGenAI({})
  }

  async generateTravelPlan(params) {
    const { message, history, places, userId } = params
    
    const prompt = this.buildTravelPlanPrompt(message, history, places)
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-pro',
        prompt,
        maxTokens: 2000
      })

      return this.parseResponse(response)
    } catch (error) {
      throw new ExternalServiceError('Error al generar plan de viaje', error)
    }
  }

  buildTravelPlanPrompt(message, history, places) {
    // Lógica para construir prompt optimizado
    return `
      Contexto: ${history.slice(-5).map(h => h.userMessage).join('\n')}
      Lugares disponibles: ${JSON.stringify(places)}
      Consulta actual: ${message}
      
      Genera un plan de viaje detallado en español...
    `
  }
}
```

```javascript
// shared/infrastructure/database/DatabaseService.js
class DatabaseService {
  constructor() {
    this.connection = null
  }

  async connect(uri) {
    try {
      this.connection = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    } catch (error) {
      throw new DatabaseConnectionError('Error conectando a la base de datos', error)
    }
  }

  async disconnect() {
    if (this.connection) {
      await mongoose.disconnect()
    }
  }

  async transaction(operations) {
    const session = await mongoose.startSession()
    
    try {
      session.startTransaction()
      const results = await operations(session)
      await session.commitTransaction()
      return results
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }
}
```

##### Día 10: Servicios de validación y utilidades

```javascript
// shared/domain/services/ValidationService.js
class ValidationService {
  constructor() {
    this.rules = new Map()
  }

  addRule(entity, field, validator) {
    const key = `${entity}.${field}`
    if (!this.rules.has(key)) {
      this.rules.set(key, [])
    }
    this.rules.get(key).push(validator)
  }

  async validate(entity, data) {
    const errors = []
    
    for (const [field, value] of Object.entries(data)) {
      const key = `${entity}.${field}`
      const validators = this.rules.get(key) || []
      
      for (const validator of validators) {
        try {
          await validator(value)
        } catch (error) {
          errors.push({ field, message: error.message })
        }
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Errores de validación', errors)
    }
  }
}
```

#### 3.6: Integración y controladores livianos (Días 11-12)

##### Día 11: Controladores como orquestadores

```javascript
// modules/places/infrastructure/controllers/PlacesController.js
class PlacesController {
  constructor(container) {
    this.getPlacesUseCase = container.resolve('GetPlaces')
    this.searchPlacesUseCase = container.resolve('SearchPlaces')
    this.generateTravelPlanUseCase = container.resolve('GenerateTravelPlan')
  }

  async getPlaces(req, res, next) {
    try {
      const places = await this.getPlacesUseCase.execute(req.query)
      res.status(200).json(places)
    } catch (error) {
      next(error)
    }
  }

  async searchPlaces(req, res, next) {
    try {
      const places = await this.searchPlacesUseCase.execute(req.query.q)
      res.status(200).json(places)
    } catch (error) {
      next(error)
    }
  }

  async generateTravelPlan(req, res, next) {
    try {
      const { message, conversationId } = req.body
      const userId = req.user.id
      
      const response = await this.generateTravelPlanUseCase.execute(
        userId, 
        message, 
        conversationId
      )
      
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }
}
```

##### Día 12: Dependency Injection Container

```javascript
// shared/infrastructure/container/Container.js
class Container {
  constructor() {
    this.services = new Map()
    this.singletons = new Map()
  }

  register(name, factory, options = {}) {
    this.services.set(name, { factory, options })
  }

  resolve(name) {
    const service = this.services.get(name)
    if (!service) {
      throw new Error(`Service ${name} not found`)
    }

    if (service.options.singleton) {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, service.factory(this))
      }
      return this.singletons.get(name)
    }

    return service.factory(this)
  }

  registerAll() {
    // Repositories
    this.register('PlaceRepository', () => new PlaceRepository(), { singleton: true })
    this.register('UserRepository', () => new UserRepository(), { singleton: true })
    
    // Services
    this.register('PlaceService', (c) => new PlaceService(
      c.resolve('PlaceRepository'),
      c.resolve('ValidationService')
    ))
    
    // Use Cases
    this.register('GetPlaces', (c) => new GetPlaces(
      c.resolve('PlaceRepository')
    ))
    
    this.register('SearchPlaces', (c) => new SearchPlaces(
      c.resolve('PlaceRepository')
    ))
  }
}
```

#### 3.7: Rutas modulares y middleware (Días 13-14)

##### Día 13: Reorganizar rutas por módulo

```javascript
// modules/places/infrastructure/routes/placesRoutes.js
const express = require('express')
const router = express.Router()

module.exports = (container) => {
  const controller = container.resolve('PlacesController')
  const authMiddleware = container.resolve('AuthMiddleware')

  router.get('/', controller.getPlaces.bind(controller))
  router.get('/search', controller.searchPlaces.bind(controller))
  router.post('/chat', 
    authMiddleware.requireAuth,
    controller.generateTravelPlan.bind(controller)
  )

  return router
}
```

```javascript
// modules/auth/infrastructure/routes/authRoutes.js
const express = require('express')
const { body } = require('express-validator')
const router = express.Router()

module.exports = (container) => {
  const controller = container.resolve('AuthController')
  
  router.post('/register',
    [
      body('email').isEmail().normalizeEmail(),
      body('password').isLength({ min: 8 }),
      body('name').notEmpty().trim()
    ],
    controller.register.bind(controller)
  )

  router.post('/login',
    [
      body('email').isEmail().normalizeEmail(),
      body('password').notEmpty()
    ],
    controller.login.bind(controller)
  )

  return router
}
```

##### Día 14: Middleware especializado y manejo de errores

```javascript
// shared/infrastructure/middleware/ErrorHandler.js
class ErrorHandler {
  static handle(error, req, res, next) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: error.message,
        errors: error.errors
      })
    }

    if (error.name === 'UnauthorizedError') {
      return res.status(401).json({
        status: 'error',
        message: 'No autorizado'
      })
    }

    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        status: 'error',
        message: error.message
      })
    }

    // Error no controlado
    console.error('Unhandled error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    })
  }
}
```

```javascript
// app.js - Nueva configuración modular
const express = require('express')
const Container = require('./shared/infrastructure/container/Container')
const ErrorHandler = require('./shared/infrastructure/middleware/ErrorHandler')

const app = express()
const container = new Container()

// Inicializar contenedor
container.registerAll()

// Middleware global
app.use(express.json())
app.use(helmet())
app.use(cors())

// Rutas modulares
app.use('/api/v1/auth', require('./modules/auth/infrastructure/routes/authRoutes')(container))
app.use('/api/v1/places', require('./modules/places/infrastructure/routes/placesRoutes')(container))
app.use('/api/v1/admin', require('./modules/admin/infrastructure/routes/adminRoutes')(container))

// Manejo de errores
app.use(ErrorHandler.handle)

module.exports = app
```

### Fase 4: Optimización y Mejoras (4-5 días)

#### Frontend (Días 1-2)
- [ ] **Optimizar renders** con React.memo y useMemo
- [ ] **Implementar lazy loading** para rutas y componentes
- [ ] **Mejorar gestión de estado** con Context API o Zustand
- [ ] **Crear hooks personalizados** para lógica repetitiva

#### Backend (Días 3-5)  
- [ ] **Implementar caching** con Redis para consultas frecuentes
  ```javascript
  // shared/infrastructure/cache/RedisCache.js
  class RedisCache {
    async get(key, fallback) {
      const cached = await redis.get(key)
      if (cached) return JSON.parse(cached)
      
      const result = await fallback()
      await redis.setex(key, 300, JSON.stringify(result)) // 5min TTL
      return result
    }
  }
  ```
- [ ] **Optimizar consultas** de base de datos con índices y agregaciones
- [ ] **Añadir rate limiting** específico por endpoint
- [ ] **Mejorar logging** estructurado con Winston
- [ ] **Implementar health checks** y monitoring
- [ ] **Añadir circuit breakers** para servicios externos

### Fase 5: Testing y Documentación (3-4 días)

- [ ] **Tests unitarios** para casos de uso críticos
- [ ] **Tests de integración** para APIs principales
- [ ] **Tests de componentes** con React Testing Library
- [ ] **Documentar APIs** con Swagger
- [ ] **Actualizar README** con nueva arquitectura

---

## Beneficios Esperados

### Mantenibilidad
- **Archivos más pequeños**: Máximo 150-200 líneas por archivo
- **Responsabilidades claras**: Cada archivo tiene una función específica
- **Facilidad de testing**: Componentes y funciones más simples de probar

### Escalabilidad
- **Desarrollo paralelo**: Múltiples desarrolladores pueden trabajar sin conflictos
- **Nuevas funcionalidades**: Fácil agregar nuevos módulos sin afectar existentes
- **Reutilización**: Componentes y servicios reutilizables entre módulos

### Performance
- **Lazy loading**: Carga solo lo necesario
- **Tree shaking**: Elimina código no utilizado
- **Caching inteligente**: Mejora tiempos de respuesta

### Experiencia del desarrollador
- **Navegación clara**: Fácil encontrar código relacionado
- **Menos conflictos**: Estructura organizada reduce merge conflicts
- **Onboarding rápido**: Nuevos desarrolladores entienden la estructura fácilmente

---

## Métricas de Éxito

### Antes vs Después
| Métrica | Actual | Objetivo |
|---------|--------|----------|
| Líneas por archivo promedio | 250 | 150 |
| Archivos > 300 líneas | 15 | 0 |
| Tiempo de build (dev) | ? | <5s |
| Tiempo de test suite | ? | <30s |
| Complejidad ciclomática | Alta | Media |

### KPIs de Calidad
- [ ] Cobertura de tests > 70%
- [ ] Tiempo de build < 5 segundos
- [ ] Bundle size < 500KB (gzipped)
- [ ] Lighthouse Performance > 90
- [ ] Cero vulnerabilidades críticas

---

## Riesgos y Mitigaciones

### Riesgos
1. **Tiempo de desarrollo**: Refactor extenso puede tomar más tiempo del estimado
2. **Bugs introducidos**: Cambios grandes pueden introducir errores
3. **Conflictos de merge**: Múltiples cambios en paralelo
4. **Learning curve**: Equipo necesita adaptarse a nueva estructura

### Mitigaciones
1. **Desarrollo incremental**: Migrar módulo por módulo
2. **Testing exhaustivo**: Tests antes y después de cada cambio
3. **Ramas feature**: Cambios aislados en ramas separadas
4. **Documentación**: Guías claras de la nueva arquitectura

---

## Cronograma Detallado

### Semana 1
- **Lunes-Martes**: Fase 1 - Estructura base
- **Miércoles-Jueves**: Fase 2.1 - Componentes grandes
- **Viernes**: Fase 2.2 - Inicio admin

### Semana 2  
- **Lunes-Martes**: Fase 2.2-2.4 - Completar frontend
- **Miércoles-Viernes**: Fase 3.1-3.2 - Estructura modular backend

### Semana 3
- **Lunes-Miércoles**: Fase 3.3-3.5 - Migrar módulos principales
- **Jueves-Viernes**: Fase 3.6-3.7 - Integración y rutas modulares

### Semana 4
- **Lunes**: Finalizar Fase 3 - Ajustes backend
- **Martes-Miércoles**: Fase 4 - Optimizaciones
- **Jueves**: Fase 5 - Testing y documentación  
- **Viernes**: Buffer para ajustes finales

---

## Conclusión

Esta refactorización transformará Japasea de una aplicación monolítica con archivos extensos a una arquitectura modular, mantenible y escalable. La inversión en tiempo se recuperará rápidamente con el aumento en productividad del desarrollo y la reducción de bugs en producción.

La nueva estructura permitirá:
- **Desarrollo más rápido** de nuevas funcionalidades
- **Onboarding más fácil** para nuevos desarrolladores  
- **Mayor calidad** del código con mejor testing
- **Mejor performance** con optimizaciones targeted
- **Escalabilidad horizontal** para crecimiento futuro

**Tiempo estimado total**: 4-5 semanas de desarrollo full-time
**ROI esperado**: Positivo en 2-3 meses por aumento de productividad

---

## Anexo: Comandos de Migración Backend

### Scripts de migración automatizados

```bash
#!/bin/bash
# migrate-backend.sh - Script para automatizar migración

echo "🚀 Iniciando migración de backend..."

# Crear estructura de directorios
echo "📁 Creando estructura modular..."
mkdir -p server/src/shared/{infrastructure,domain,utils}
mkdir -p server/src/shared/infrastructure/{database,external-apis,middleware}
mkdir -p server/src/shared/domain/{entities,value-objects,exceptions}

# Crear módulos
for module in auth places chat reviews favorites admin; do
    echo "📦 Creando módulo: $module"
    mkdir -p server/src/modules/$module/{domain,application,infrastructure}
    mkdir -p server/src/modules/$module/domain/{entities,repositories,services}
    mkdir -p server/src/modules/$module/application/{use-cases,dto,validators}
    mkdir -p server/src/modules/$module/infrastructure/{repositories,controllers,routes}
    
    # Crear archivos index para barrel exports
    touch server/src/modules/$module/domain/index.js
    touch server/src/modules/$module/application/index.js
    touch server/src/modules/$module/infrastructure/index.js
done

echo "✅ Estructura creada exitosamente"

# Migrar archivos existentes
echo "🔄 Migrando archivos existentes..."
mv server/src/config/* server/src/shared/infrastructure/ 2>/dev/null || true
mv server/src/middleware/* server/src/shared/infrastructure/middleware/ 2>/dev/null || true
mv server/src/utils/* server/src/shared/utils/ 2>/dev/null || true

echo "✅ Migración de backend completada"
```

### Guía de refactoring por controlador

```javascript
// Ejemplo de migración paso a paso
// ANTES: server/src/controllers/placesController.js (976 líneas)

// PASO 1: Extraer lógica a casos de uso
// modules/places/application/use-cases/GetPlaces.js
class GetPlaces {
  // ... código anterior
}

// PASO 2: Crear repositorio
// modules/places/infrastructure/repositories/PlaceRepository.js  
class PlaceRepository {
  // ... código anterior
}

// PASO 3: Nuevo controlador liviano
// modules/places/infrastructure/controllers/PlacesController.js
class PlacesController {
  // Solo orquestación HTTP - 20-30 líneas por método
}
```
