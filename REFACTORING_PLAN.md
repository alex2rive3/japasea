# Plan de Refactorización: Cliente con Arquitectura de Features + Redux Toolkit

## 🎯 Objetivos

1. **Migrar de Context API a Redux Toolkit** para mejor gestión de estado global
2. **Implementar arquitectura basada en features** para mejor organización del código
3. **Mantener TypeScript** con tipado estricto
4. **Preservar funcionalidades existentes** durante la migración
5. **Seguir las coding instructions** (inglés para código, español para UI)

## 📁 Nueva Estructura de Arquitectura por Features

```
new_client/
├── public/                     # Assets estáticos
├── src/
│   ├── app/                   # Configuración de la aplicación
│   │   ├── store.ts           # Configuración de Redux store
│   │   ├── rootReducer.ts     # Combinación de reducers
│   │   └── middleware.ts      # Middleware personalizado
│   │
│   ├── shared/                # Código compartido entre features
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── ui/            # Componentes UI básicos
│   │   │   ├── layout/        # Componentes de layout
│   │   │   └── forms/         # Componentes de formularios
│   │   ├── hooks/             # Custom hooks compartidos
│   │   ├── utils/             # Utilidades generales
│   │   ├── types/             # Tipos TypeScript globales
│   │   ├── constants/         # Constantes de la aplicación
│   │   ├── api/               # Configuración base de API
│   │   └── i18n/              # Configuración de internacionalización
│   │
│   ├── features/              # Features de la aplicación
│   │   ├── auth/              # Feature de autenticación
│   │   │   ├── components/    # Componentes específicos de auth
│   │   │   ├── hooks/         # Hooks específicos de auth
│   │   │   ├── services/      # API calls de auth
│   │   │   ├── store/         # Redux slice de auth
│   │   │   ├── types/         # Tipos específicos de auth
│   │   │   └── index.ts       # Exports públicos
│   │   │
│   │   ├── places/            # Feature de lugares
│   │   │   ├── components/    # Componentes de lugares
│   │   │   ├── hooks/         # Hooks de lugares
│   │   │   ├── services/      # API de lugares
│   │   │   ├── store/         # Redux slice de lugares
│   │   │   ├── types/         # Tipos de lugares
│   │   │   └── index.ts
│   │   │
│   │   ├── reviews/           # Feature de reseñas
│   │   ├── favorites/         # Feature de favoritos
│   │   ├── chat/              # Feature de chat
│   │   ├── admin/             # Feature de administración
│   │   └── dashboard/         # Feature de dashboard
│   │
│   ├── pages/                 # Páginas/Rutas principales
│   │   ├── HomePage.tsx
│   │   ├── PlacesPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── AdminPage.tsx
│   │
│   ├── App.tsx                # Componente principal
│   ├── main.tsx               # Entry point
│   └── vite-env.d.ts
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🛠 Tecnologías y Dependencias

### Nuevas dependencias para Redux Toolkit:
- `@reduxjs/toolkit` - Redux Toolkit oficial
- `react-redux` - Bindings de React para Redux
- `redux-persist` - Persistencia del estado
- `reselect` - Selectores memoizados

### Dependencias existentes a mantener:
- Material-UI v7
- React Leaflet 5.0
- React Router DOM
- Axios
- React Hook Form + Yup
- i18next

## 📋 Fases de Implementación

### Fase 1: Configuración Base ✅
- [x] Crear estructura de carpetas en `new_client`
- [x] Configurar package.json con Redux Toolkit
- [x] Configurar store de Redux
- [x] Configurar TypeScript
- [x] Migrar configuración de Vite

### Fase 2: Shared/Core ✅
- [x] Migrar tipos TypeScript compartidos
- [x] Configurar API base con axios
- [x] Migrar configuración de i18n
- [x] Crear componentes UI base
- [x] Crear hooks compartidos

### Fase 3: Feature Auth ✅
- [x] Crear Redux slice para auth
- [x] Crear tipos TypeScript para auth
- [x] Crear servicios de auth
- [x] Implementar hooks de auth
- [x] Migrar componentes de autenticación
- [x] Configurar persistencia de auth

### Fase 4: Feature Places ✅
- [x] Crear Redux slice para places
- [x] Crear tipos TypeScript para places
- [x] Crear servicios de places
- [x] Implementar hooks de places
- [x] Migrar componentes de lugares
- [x] Migrar MapComponent con Leaflet
- [x] Migrar PlaceDetailsModal
- [x] Migrar FeaturedPlaceCard
- [x] Actualizar MainContent para usar Redux
- [x] Integración completa con Redux Toolkit

### Fase 5: Features Adicionales ✅
- [x] Feature Reviews
  - [x] Crear Redux slice para reviews
  - [x] Crear tipos TypeScript para reviews
  - [x] Crear servicios de reviews
  - [x] Implementar hooks de reviews
  - [x] Migrar ReviewForm component
  - [x] Integrar con store principal
- [x] Feature Favorites
  - [x] Crear Redux slice para favorites
  - [x] Crear tipos TypeScript para favorites
  - [x] Crear servicios de favorites
  - [x] Implementar hooks de favorites
  - [x] Migrar FavoriteButton component
  - [x] Migrar FavoritesComponent
  - [x] Integrar con store principal
- [x] Feature Chat
  - [x] Crear Redux slice para chat
  - [x] Crear tipos TypeScript para chat
  - [x] Crear servicios de chat
  - [x] Implementar hooks de chat
  - [x] Migrar ChatComponent
  - [x] Integrar con store principal
- [x] Feature Admin
  - [x] Crear Redux slice para admin
  - [x] Crear tipos TypeScript para admin
  - [x] Crear servicios de admin
  - [x] Implementar hooks de admin
  - [x] Migrar AdminPlacesComponent
  - [x] Implementar permisos y roles
  - [x] Integrar con store principal

### Fase 6: Pages y Routing ✅
- [x] Migrar páginas principales
  - [x] HomePage - migrada con diseño simplificado
  - [x] LandingPage - migrada con CSS Grid
  - [x] LoginPage - usa LoginForm de auth feature
  - [x] RegisterPage - usa RegisterForm de auth feature
  - [x] AdminPage - usa AdminPlacesComponent de admin feature
  - [x] PlacesPage - página básica con listado de lugares
- [x] Configurar React Router
  - [x] BrowserRouter configurado en App.tsx
  - [x] Rutas anidadas implementadas
  - [x] Separación entre rutas públicas y protegidas
- [x] Implementar rutas protegidas
  - [x] ProtectedRoute component migrado
  - [x] PublicOnlyRoute para rutas de autenticación
  - [x] Protección por roles de admin
- [x] Migrar Layout principal
  - [x] Layout component migrado con navegación
  - [x] LanguageSwitcher integrado
  - [x] Menú responsive con drawer

### Fase 7: Testing y Optimización 🔄
- [ ] Validar funcionalidades básicas
  - [ ] Verificar login/logout funciona
  - [ ] Probar navegación entre páginas
  - [ ] Validar persistencia de estado
- [ ] Optimizar performance
  - [ ] Lazy loading de páginas
  - [ ] Code splitting por features
  - [ ] Optimización de bundle
- [ ] Verificar tipado TypeScript
  - [ ] Resolver errores de compilación
  - [ ] Mejorar tipos en features
  - [ ] Validar tipos en componentes
- [ ] Testing final
  - [ ] Smoke tests básicos
  - [ ] Verificar responsive design
  - [ ] Probar en diferentes navegadores

## 🎨 Patrones de Diseño a Implementar

### Redux Toolkit Patterns:
```typescript
// Feature slice pattern
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  }
});
```

### Feature-based Architecture:
```typescript
// features/auth/index.ts - Public API
export { authSlice } from './store/authSlice';
export { useAuth } from './hooks/useAuth';
export { LoginForm } from './components/LoginForm';
export type { AuthState, User } from './types';
```

### Component Organization:
```typescript
// Shared components
export { Button } from './shared/components/ui/Button';
export { Layout } from './shared/components/layout/Layout';

// Feature components
export { LoginForm } from './features/auth/components/LoginForm';
```

## 🔍 Análisis de la Estructura Actual del Cliente

### Componentes Identificados en `/client/src/components/`:
- **Auth**: `LoginComponent.tsx`, `RegisterComponent.tsx`, `ForgotPasswordComponent.tsx`, `ResetPasswordComponent.tsx`, `VerifyEmailComponent.tsx`
- **Admin**: `AdminPlacesComponent.tsx`, `admin/` (directorio)
- **Places**: `MapComponent.tsx`, `PlaceCards.tsx`, `PlaceDetailsModal.tsx`, `FeaturedPlaceCard.tsx`
- **UI/Layout**: `Layout.tsx`, `Navbar.tsx`, `AuthNavbar.tsx`, `LanguageSwitcher.tsx`
- **Features**: `ChatComponent.tsx`, `FavoritesComponent.tsx`, `FavoriteButton.tsx`, `ProfileComponent.tsx`, `TravelPlanComponent.tsx`
- **Forms**: `ReviewForm.tsx`
- **Routing**: `AppRoutes.tsx`, `ProtectedRoute.tsx`, `HomeRedirect.tsx`

### Servicios Identificados en `/client/src/services/`:
- `authService.ts` - Autenticación y usuarios
- `placesService.ts` - Gestión de lugares
- `favoritesService.ts` - Favoritos de usuarios
- `reviewsService.ts` - Reseñas y comentarios
- `adminService.ts` - Funciones administrativas
- `apiConfig.ts` - Configuración de API

### Tipos Identificados en `/client/src/types/`:
- `auth.ts` - Tipos de autenticación
- `places.ts` - Tipos de lugares
- `lugares.ts` - Tipos legacy (a migrar)

## 🗂 Mapeo de Migración por Features

### Feature: Auth
**Componentes a migrar:**
- `LoginComponent.tsx` → `features/auth/components/LoginForm.tsx`
- `RegisterComponent.tsx` → `features/auth/components/RegisterForm.tsx`
- `ForgotPasswordComponent.tsx` → `features/auth/components/ForgotPasswordForm.tsx`
- `ResetPasswordComponent.tsx` → `features/auth/components/ResetPasswordForm.tsx`
- `VerifyEmailComponent.tsx` → `features/auth/components/EmailVerificationForm.tsx`
- `ProfileComponent.tsx` → `features/auth/components/ProfileForm.tsx`

**Servicios a migrar:**
- `authService.ts` → `features/auth/services/authService.ts`

**Tipos a migrar:**
- `auth.ts` → `features/auth/types/index.ts`

### Feature: Places
**Componentes a migrar:**
- `MapComponent.tsx` → `features/places/components/MapComponent.tsx`
- `PlaceCards.tsx` → `features/places/components/PlaceCards.tsx`
- `PlaceDetailsModal.tsx` → `features/places/components/PlaceDetailsModal.tsx`
- `FeaturedPlaceCard.tsx` → `features/places/components/FeaturedPlaceCard.tsx`

**Servicios a migrar:**
- `placesService.ts` → `features/places/services/placesService.ts`

**Tipos a migrar:**
- `places.ts` → `features/places/types/index.ts`
- `lugares.ts` → `features/places/types/legacy.ts` (deprecar)

### Feature: Reviews
**Componentes a migrar:**
- `ReviewForm.tsx` → `features/reviews/components/ReviewForm.tsx`

**Servicios a migrar:**
- `reviewsService.ts` → `features/reviews/services/reviewsService.ts`

### Feature: Favorites
**Componentes a migrar:**
- `FavoritesComponent.tsx` → `features/favorites/components/FavoritesList.tsx`
- `FavoriteButton.tsx` → `features/favorites/components/FavoriteButton.tsx`

**Servicios a migrar:**
- `favoritesService.ts` → `features/favorites/services/favoritesService.ts`

### Feature: Chat
**Componentes a migrar:**
- `ChatComponent.tsx` → `features/chat/components/ChatInterface.tsx`

### Feature: Admin
**Componentes a migrar:**
- `AdminPlacesComponent.tsx` → `features/admin/components/PlacesManagement.tsx`
- `admin/` → `features/admin/components/`

**Servicios a migrar:**
- `adminService.ts` → `features/admin/services/adminService.ts`

### Shared Components
**Componentes a migrar a `/shared/components/`:**
- `Layout.tsx` → `shared/components/layout/Layout.tsx`
- `Navbar.tsx` → `shared/components/layout/Navbar.tsx`
- `AuthNavbar.tsx` → `shared/components/layout/AuthNavbar.tsx`
- `LanguageSwitcher.tsx` → `shared/components/ui/LanguageSwitcher.tsx`
- `EmailVerificationBanner.tsx` → `shared/components/ui/EmailVerificationBanner.tsx`

### Routing
**Componentes a migrar a `/pages/`:**
- `AppRoutes.tsx` → `App.tsx` (integrado)
- `ProtectedRoute.tsx` → `shared/components/routing/ProtectedRoute.tsx`
- `HomeComponent.tsx` → `pages/HomePage.tsx`
- `LandingPage.tsx` → `pages/LandingPage.tsx`
- `HomeRedirect.tsx` → `shared/components/routing/HomeRedirect.tsx`

## 🔧 Configuración Redux Toolkit

### Store Configuration (`app/store.ts`):
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { rootReducer } from './rootReducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'favorites'] // Solo persistir estos slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Root Reducer (`app/rootReducer.ts`):
```typescript
import { combineReducers } from '@reduxjs/toolkit';
import { authSlice } from '../features/auth/store/authSlice';
import { placesSlice } from '../features/places/store/placesSlice';
import { reviewsSlice } from '../features/reviews/store/reviewsSlice';
import { favoritesSlice } from '../features/favorites/store/favoritesSlice';
import { chatSlice } from '../features/chat/store/chatSlice';
import { adminSlice } from '../features/admin/store/adminSlice';

export const rootReducer = combineReducers({
  auth: authSlice.reducer,
  places: placesSlice.reducer,
  reviews: reviewsSlice.reducer,
  favorites: favoritesSlice.reducer,
  chat: chatSlice.reducer,
  admin: adminSlice.reducer
});
```

## 📦 Package.json Configuration

### Nuevas dependencias a agregar:
```json
{
  "dependencies": {
    "@reduxjs/toolkit": "^2.2.1",
    "react-redux": "^9.1.0",
    "redux-persist": "^6.0.0",
    "reselect": "^5.1.0"
  }
}
```

## 🧪 Hooks Personalizados por Feature

### Auth Hooks:
```typescript
// features/auth/hooks/useAuth.ts
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector(selectAuth);
  
  const login = useCallback((credentials: LoginCredentials) => {
    return dispatch(loginAsync(credentials));
  }, [dispatch]);
  
  return { user, loading, error, login, logout, register };
};
```

### Places Hooks:
```typescript
// features/places/hooks/usePlaces.ts
export const usePlaces = () => {
  const dispatch = useAppDispatch();
  const { places, loading, filters } = useAppSelector(selectPlaces);
  
  const fetchPlaces = useCallback(() => {
    return dispatch(fetchPlacesAsync());
  }, [dispatch]);
  
  return { places, loading, filters, fetchPlaces, searchPlaces };
};
```

## 🎯 Criterios de Éxito

### Funcionales:
- [ ] Todas las funcionalidades actuales mantienen su comportamiento
- [ ] El estado se gestiona correctamente con Redux Toolkit
- [ ] La navegación funciona sin errores
- [ ] Las llamadas a API funcionan correctamente
- [ ] Los formularios validan y envían datos

### Técnicos:
- [ ] TypeScript compila sin errores
- [ ] Tests pasan (si existen)
- [ ] Performance similar o mejor que la versión actual
- [ ] Bundle size no aumenta significativamente
- [ ] Code splitting funciona correctamente

### Arquitectura:
- [ ] Separación clara entre features
- [ ] API pública bien definida para cada feature
- [ ] Código compartido está en `/shared/`
- [ ] Redux state está normalizado
- [ ] Selectores están memoizados con reselect

## 📝 Próximos Pasos

1. **Iniciar Fase 1**: Crear la estructura básica en `new_client/`
2. **Configurar tooling**: Redux store, TypeScript, Vite
3. **Migrar shared components**: Empezar con componentes base
4. **Implementar feature por feature**: Comenzar con Auth
5. **Testing continuo**: Verificar funcionalidad en cada paso
6. **Performance monitoring**: Medir y optimizar durante la migración

## 🔄 Comandos de Desarrollo

```bash
# Instalar dependencias
cd new_client && npm install

# Desarrollo
npm run dev

# Build
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint
```

---

*Este plan será actualizado conforme avance la refactorización.*
