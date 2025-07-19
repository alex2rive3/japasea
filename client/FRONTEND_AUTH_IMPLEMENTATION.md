# Sistema de Autenticación Frontend - Japasea

Este documento describe la implementación completa del sistema de autenticación en el frontend de la aplicación Japasea usando React, TypeScript y Material-UI.

## 🚀 Características Implementadas

### ✅ Componentes de Autenticación
- **LoginComponent** - Componente de inicio de sesión con validación
- **RegisterComponent** - Componente de registro con validación avanzada
- **ProfileComponent** - Gestión completa del perfil de usuario
- **AuthNavbar** - Barra de navegación con estado de autenticación

### ✅ Sistema de Rutas
- **ProtectedRoute** - Protección de rutas que requieren autenticación
- **PublicOnlyRoute** - Rutas solo accesibles para usuarios no autenticados
- **AppRoutes** - Configuración completa de rutas de la aplicación

### ✅ Gestión de Estado
- **AuthContext** - Contexto global para el estado de autenticación
- **useAuth Hook** - Hook personalizado para acceder al contexto
- **Persistencia de tokens** - Almacenamiento seguro en localStorage

### ✅ Servicios y Utilidades
- **authService** - Servicio completo para comunicación con la API
- **useForm Hook** - Hook personalizado para manejo de formularios
- **Interceptores HTTP** - Manejo automático de tokens y renovación

## 📁 Estructura de Archivos Frontend

```
client/src/
├── components/
│   ├── LoginComponent.tsx        # Formulario de inicio de sesión
│   ├── RegisterComponent.tsx     # Formulario de registro
│   ├── ProfileComponent.tsx      # Perfil de usuario
│   ├── AuthNavbar.tsx           # Navegación con autenticación
│   ├── ProtectedRoute.tsx       # Rutas protegidas
│   ├── AppRoutes.tsx            # Configuración de rutas
│   └── MainContent.tsx          # Contenido principal de la app
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticación
├── hooks/
│   ├── useAuth.ts              # Hook de autenticación
│   └── useForm.ts              # Hook para formularios
├── services/
│   └── authService.ts          # Servicio de API
├── types/
│   └── auth.ts                 # Tipos TypeScript
└── App.tsx                     # Componente raíz
```

## 🛠️ Tecnologías Utilizadas

- **React 19** - Framework principal
- **TypeScript** - Tipado estático
- **Material-UI (MUI)** - Biblioteca de componentes
- **React Router** - Navegación y rutas
- **Axios** - Cliente HTTP
- **Vite** - Herramientas de desarrollo

## 🔧 Instalación y Configuración

### 1. Instalar Dependencias

```bash
cd client
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Variables de configuración:
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_NODE_ENV=development
VITE_DEBUG_MODE=true
```

### 3. Iniciar la Aplicación

```bash
npm run dev
```

## 📖 Uso del Sistema de Autenticación

### AuthContext y useAuth Hook

El contexto de autenticación proporciona el estado global:

```tsx
import { useAuth } from '../hooks/useAuth'

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    register,
    isLoading 
  } = useAuth()

  // Usar el estado y métodos de autenticación
}
```

### Rutas Protegidas

```tsx
import { ProtectedRoute } from '../components/ProtectedRoute'

// Ruta que requiere autenticación
<Route path="/profile" element={
  <ProtectedRoute>
    <ProfileComponent />
  </ProtectedRoute>
} />

// Ruta que requiere rol admin
<Route path="/admin" element={
  <ProtectedRoute requireAdmin>
    <AdminPanel />
  </ProtectedRoute>
} />
```

### Formularios con Validación

```tsx
import { useForm } from '../hooks/useForm'

function MyForm() {
  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      await login(values)
    },
    validate: (values) => {
      const errors: Record<string, string> = {}
      if (!values.email) errors.email = 'Email requerido'
      return errors
    }
  })

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        value={values.email}
        onChange={handleChange('email')}
        error={!!errors.email}
        helperText={errors.email}
      />
    </form>
  )
}
```

## 🔐 Flujo de Autenticación

### 1. Registro de Usuario

```tsx
// Ejemplo de uso del registro
const handleRegister = async (userData: RegisterData) => {
  try {
    await register(userData)
    navigate('/')
  } catch (error) {
    setError(error.message)
  }
}
```

### 2. Inicio de Sesión

```tsx
// Ejemplo de uso del login
const handleLogin = async (credentials: LoginCredentials) => {
  try {
    await login(credentials)
    navigate('/')
  } catch (error) {
    setError(error.message)
  }
}
```

### 3. Renovación Automática de Tokens

El servicio de autenticación maneja automáticamente la renovación de tokens:

```typescript
// En authService.ts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await this.refreshToken()
        return this.api(originalRequest)
      } catch (refreshError) {
        // Redirigir a login
      }
    }
  }
)
```

## 🎨 Componentes de UI

### LoginComponent

Características:
- Validación en tiempo real
- Mostrar/ocultar contraseña
- Rate limiting visual
- Diseño responsivo
- Enlaces a registro

```tsx
<LoginComponent />
```

### RegisterComponent

Características:
- Validación de contraseña fuerte
- Confirmación de contraseña
- Campos opcionales
- Mensajes de error específicos
- Enlaces a login

```tsx
<RegisterComponent />
```

### ProfileComponent

Características:
- Edición de perfil
- Cambio de contraseña
- Información de rol
- Botón de logout
- Historial de actividad

```tsx
<ProfileComponent />
```

### AuthNavbar

Características:
- Estado de autenticación visual
- Menú desplegable de usuario
- Notificaciones
- Búsqueda integrada
- Navegación responsiva

```tsx
<AuthNavbar onSearch={handleSearch} />
```

## 🛡️ Seguridad Frontend

### Validaciones Implementadas

#### Contraseñas
- Mínimo 6 caracteres
- Al menos una minúscula
- Al menos una mayúscula
- Al menos un número

#### Emails
- Formato válido usando regex
- Normalización automática

#### Formularios
- Sanitización de entrada
- Validación en tiempo real
- Prevención de doble envío

### Manejo de Tokens

```typescript
class AuthService {
  // Almacenamiento seguro
  private setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }

  // Verificación de expiración
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp < Date.now() / 1000
    } catch {
      return true
    }
  }
}
```

## 🎯 Estados de la Aplicación

### Estados de Carga

```tsx
function LoadingStates() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <CircularProgress />
  }

  return <AppContent />
}
```

### Estados de Error

```tsx
function ErrorHandling() {
  const [error, setError] = useState('')

  return (
    <>
      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}
    </>
  )
}
```

## 🔄 Integración con Backend

### Configuración de Axios

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### Endpoints Utilizados

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/change-password` - Cambiar contraseña
- `POST /api/auth/refresh-token` - Renovar token

## 📱 Diseño Responsivo

### Breakpoints de Material-UI

```tsx
sx={{
  display: { xs: 'block', md: 'flex' },
  width: { xs: '100%', sm: '400px' },
  padding: { xs: 2, md: 4 }
}}
```

### Componentes Adaptativos

- **Navegación**: Hamburger menu en móvil, barra completa en desktop
- **Formularios**: Stack vertical en móvil, diseño optimizado en tablet
- **Layout**: Sidebar colapsable, contenido fluido

## 🧪 Testing

### Estructura de Tests

```typescript
// Ejemplo de test de componente
describe('LoginComponent', () => {
  it('should login successfully', async () => {
    render(<LoginComponent />)
    
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))
    
    expect(screen.getByText('Login successful')).toBeInTheDocument()
  })
})
```

## 🚀 Despliegue

### Variables de Producción

```env
VITE_API_BASE_URL=https://api.japasea.com
VITE_NODE_ENV=production
VITE_DEBUG_MODE=false
```

### Build de Producción

```bash
npm run build
npm run preview
```

## 🔮 Mejoras Futuras

### Características Pendientes
- [ ] Verificación por email
- [ ] Recuperación de contraseña
- [ ] Autenticación de dos factores (2FA)
- [ ] Login con redes sociales
- [ ] Persistencia offline
- [ ] PWA capabilities

### Optimizaciones
- [ ] Code splitting por rutas
- [ ] Lazy loading de componentes
- [ ] Cache de API con React Query
- [ ] Service Worker para offline
- [ ] Optimización de bundle

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📚 Recursos Adicionales

- [Documentación de React](https://react.dev/)
- [Material-UI Docs](https://mui.com/)
- [React Router](https://reactrouter.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
