# Sistema de Autenticación - Japasea Backend

Este documento describe la implementación completa del sistema de autenticación para la aplicación Japasea.

## 🚀 Características Implementadas

### ✅ Funcionalidades Principales
- **Registro de usuarios** con validación completa
- **Inicio de sesión** con protección contra ataques
- **Tokens JWT** (Access Token + Refresh Token)
- **Gestión de perfil** de usuario
- **Cambio de contraseña** seguro
- **Cierre de sesión** con invalidación de tokens
- **Desactivación de cuenta** (soft delete)

### ✅ Seguridad
- **Rate Limiting** para prevenir ataques de fuerza bruta
- **Bloqueo temporal** de cuentas tras múltiples intentos fallidos
- **Encriptación de contraseñas** con bcrypt (12 rounds)
- **Tokens JWT firmados** con clave secreta
- **Validación de entrada** con express-validator
- **Middleware de seguridad** con helmet

### ✅ Base de Datos
- **MongoDB** con Mongoose ODM
- **Esquemas validados** con tipos estrictos
- **Índices optimizados** para consultas rápidas
- **Conexión persistente** con manejo de errores

## 📁 Estructura de Archivos

```
server/src/
├── config/
│   ├── config.js          # Configuración general
│   └── database.js        # Conexión MongoDB
├── models/
│   └── userModel.js       # Modelo de usuario
├── controllers/
│   └── authController.js  # Lógica de autenticación
├── middleware/
│   └── authMiddleware.js  # Middleware de auth y validación
├── routes/
│   └── authRoutes.js      # Rutas de autenticación
├── utils/
│   └── authUtils.js       # Utilidades de autenticación
└── tests/
    └── auth.test.js       # Tests unitarios
```

## 🛠️ Instalación y Configuración

### 1. Instalar Dependencias
```bash
cd server
npm install
```

### 2. Configurar Variables de Entorno
Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

Variables importantes:
```env
MONGODB_URI=mongodb://localhost:27017/japasea_db
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
```

### 3. Instalar y Configurar MongoDB

#### Opción A: MongoDB Local
```bash
# Windows (usando Chocolatey)
choco install mongodb

# macOS (usando Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
```

#### Opción B: MongoDB Atlas (Recomendado)
1. Visita [MongoDB Atlas](https://cloud.mongodb.com/)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster
4. Configura la conexión y obtén la URI
5. Actualiza `MONGODB_URI` en tu archivo `.env`

### 4. Iniciar el Servidor
```bash
npm run dev
```

## 🧪 Testing

### Ejecutar Tests
```bash
npm test
```

### Tests Incluidos
- Registro de usuarios (válido/inválido)
- Inicio de sesión (credenciales válidas/inválidas)
- Obtención de perfil (con/sin token)
- Validaciones de entrada
- Rate limiting

## 📖 Uso de la API

### Base URL
```
http://localhost:3001/api/auth
```

### Ejemplo de Uso en Frontend (JavaScript)

#### 1. Registro
```javascript
const registerUser = async (userData) => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Guardar tokens
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      return data.data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

// Uso
const newUser = await registerUser({
  name: 'Juan Pérez',
  email: 'juan@ejemplo.com',
  password: 'MiPassword123',
  phone: '+595987654321'
});
```

#### 2. Inicio de Sesión
```javascript
const loginUser = async (credentials) => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      return data.data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};
```

#### 3. Obtener Perfil
```javascript
const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch('http://localhost:3001/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    throw error;
  }
};
```

#### 4. Renovar Token
```javascript
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    const response = await fetch('http://localhost:3001/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken })
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error renovando token:', error);
    throw error;
  }
};
```

## 🔧 Configuración Avanzada

### Personalizar Rate Limiting
En `config/config.js`:
```javascript
RATE_LIMIT: {
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por ventana
  skipSuccessfulRequests: true
}
```

### Personalizar Tokens JWT
```javascript
JWT_SECRET: 'tu-clave-super-secreta',
JWT_EXPIRES_IN: '24h', // 24 horas
JWT_REFRESH_EXPIRES_IN: '7d' // 7 días
```

### Personalizar Validaciones de Contraseña
En `middleware/authMiddleware.js`:
```javascript
body('password')
  .isLength({ min: 8 }) // Mínimo 8 caracteres
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/) // Incluir símbolos
```

## 🚨 Seguridad y Mejores Prácticas

### ✅ Implementado
- Encriptación de contraseñas con bcrypt
- Tokens JWT con expiración
- Rate limiting por IP
- Validación de entrada
- CORS configurado
- Headers de seguridad con Helmet
- Bloqueo temporal de cuentas

### 🔮 Futuras Mejoras Recomendadas
- [ ] Verificación por email
- [ ] Recuperación de contraseña por email
- [ ] Autenticación de dos factores (2FA)
- [ ] Login con redes sociales (Google, Facebook)
- [ ] Logs de auditoría
- [ ] Detección de ubicación sospechosa

## 🐛 Troubleshooting

### Error: No se puede conectar a MongoDB
```bash
# Verificar si MongoDB está ejecutándose
sudo systemctl status mongod

# Iniciar MongoDB si no está activo
sudo systemctl start mongod
```

### Error: JWT Token expirado
- El token de acceso expira en 24 horas
- Usar el refresh token para obtener un nuevo access token
- Implementar renovación automática en el frontend

### Error: Rate limit excedido
- Esperar el tiempo especificado antes de intentar nuevamente
- Para desarrollo, puedes ajustar los límites en `config.js`

## 📚 Documentación Adicional

- [Documentación completa de la API](./docs/AUTH_API.md)
- [Códigos de MongoDB](https://docs.mongodb.com/manual/)
- [Documentación de JWT](https://jwt.io/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request
