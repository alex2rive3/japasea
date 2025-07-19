# API de Autenticación - Japasea

Esta documentación describe los endpoints de autenticación disponibles en la API de Japasea.

## Base URL
```
http://localhost:3001/api/auth
```

## Endpoints

### 1. Registro de Usuario
**POST** `/register`

Registra un nuevo usuario en el sistema.

**Rate Limit:** 3 intentos por hora por IP

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "MiPassword123",
  "phone": "+595987654321"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "647abc123def456789012345",
      "name": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "phone": "+595987654321",
      "role": "user",
      "isEmailVerified": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Iniciar Sesión
**POST** `/login`

Autentica un usuario existente.

**Rate Limit:** 5 intentos por 15 minutos por IP

**Body:**
```json
{
  "email": "juan@ejemplo.com",
  "password": "MiPassword123"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": "647abc123def456789012345",
      "name": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "phone": "+595987654321",
      "role": "user",
      "isEmailVerified": false,
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Renovar Token
**POST** `/refresh-token`

Renueva un token de acceso usando un refresh token válido.

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Token renovado exitosamente",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 4. Cerrar Sesión
**POST** `/logout`

Cierra la sesión del usuario actual.

**Headers:** `Authorization: Bearer <token>`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

### 5. Obtener Perfil
**GET** `/profile`

Obtiene la información del perfil del usuario autenticado.

**Headers:** `Authorization: Bearer <token>`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Perfil obtenido exitosamente",
  "data": {
    "user": {
      "id": "647abc123def456789012345",
      "name": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "phone": "+595987654321",
      "role": "user",
      "profilePicture": null,
      "isEmailVerified": false,
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### 6. Actualizar Perfil
**PUT** `/profile`

Actualiza la información del perfil del usuario.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "Juan Carlos Pérez",
  "phone": "+595987654322"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "user": {
      "id": "647abc123def456789012345",
      "name": "Juan Carlos Pérez",
      "email": "juan@ejemplo.com",
      "phone": "+595987654322",
      "role": "user",
      "profilePicture": null,
      "isEmailVerified": false,
      "updatedAt": "2024-01-15T11:30:00.000Z"
    }
  }
}
```

### 7. Cambiar Contraseña
**PUT** `/change-password`

Cambia la contraseña del usuario autenticado.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "currentPassword": "MiPasswordAnterior123",
  "newPassword": "MiNuevoPassword456"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Contraseña cambiada exitosamente"
}
```

### 8. Desactivar Cuenta
**DELETE** `/account`

Desactiva la cuenta del usuario (soft delete).

**Headers:** `Authorization: Bearer <token>`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Cuenta desactivada exitosamente"
}
```

## Códigos de Error Comunes

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Datos de entrada inválidos",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido",
      "value": "email-invalido"
    }
  ]
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Token de acceso requerido"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "Permisos insuficientes"
}
```

### 409 - Conflict
```json
{
  "success": false,
  "message": "El usuario ya existe con este email"
}
```

### 423 - Locked
```json
{
  "success": false,
  "message": "Cuenta bloqueada temporalmente debido a múltiples intentos fallidos"
}
```

### 429 - Too Many Requests
```json
{
  "success": false,
  "message": "Demasiados intentos de inicio de sesión. Intente nuevamente en 15 minutos."
}
```

## Validaciones

### Contraseña
- Mínimo 6 caracteres
- Al menos una letra minúscula
- Al menos una letra mayúscula  
- Al menos un número

### Email
- Formato de email válido
- Máximo 100 caracteres

### Nombre
- Mínimo 2 caracteres
- Máximo 50 caracteres

### Teléfono
- Formato de número móvil válido (opcional)

## Seguridad

### Rate Limiting
- **Login:** 5 intentos por 15 minutos por IP
- **Registro:** 3 intentos por hora por IP

### Bloqueo de Cuenta
- Cuenta bloqueada por 2 horas después de 5 intentos fallidos de login

### Tokens JWT
- **Access Token:** Válido por 24 horas
- **Refresh Token:** Válido por 7 días
- Tokens firmados con HS256

### Encriptación
- Contraseñas hasheadas con bcrypt (12 rounds)
- Tokens JWT firmados con clave secreta
