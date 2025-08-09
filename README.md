# 🗾 Japasea - Descubre Paraguay

**Japasea** es una plataforma web moderna para descubrir y explorar los mejores lugares de Paraguay. Desde restaurantes y hoteles hasta atracciones turísticas y servicios locales.

## 🚀 Estado del Proyecto

- **Versión**: MVP Mejorado
- **Estado**: En desarrollo activo
- **Demo**: [Próximamente]

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

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** con TypeScript
- **Material-UI (MUI)** para componentes
- **React Router DOM** para navegación
- **Recharts** para gráficos
- **Leaflet** para mapas
- **Axios** para peticiones HTTP
- **Vite** como bundler

### Backend
- **Node.js** con Express.js
- **MongoDB** con Mongoose
- **JWT** para autenticación
- **Express Validator** para validación
- **Nodemailer** para emails
- **Rate Limiting** para seguridad

## 🏗️ Arquitectura

```
japasea/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   │   └── admin/    # Componentes del panel admin
│   │   ├── services/     # Servicios API
│   │   ├── contexts/     # Context API
│   │   ├── hooks/        # Custom hooks
│   │   └── types/        # TypeScript types
│   └── package.json
│
├── server/                # Backend Node.js
│   ├── src/
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── models/       # Modelos Mongoose
│   │   ├── routes/       # Rutas API
│   │   ├── middleware/   # Middleware personalizado
│   │   └── services/     # Servicios auxiliares
│   └── package.json
│
└── docs/                  # Documentación
```

## 🚦 Instalación y Uso

### Requisitos Previos
- Node.js 18+
- MongoDB 6+
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tuusuario/japasea.git
cd japasea
```

2. **Configurar el Backend**
```bash
cd server
npm install
cp .env.example .env  # Configurar variables de entorno
npm run db:seed       # (Opcional) Cargar datos de prueba
npm run dev
```

3. **Configurar el Frontend**
```bash
cd ../client
npm install
npm run dev
```

4. **Acceder a la aplicación**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Documentación API: http://localhost:3001/api-docs

### Variables de Entorno

#### Backend (.env)
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/japasea
JWT_SECRET=tu_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password
FRONTEND_URL=http://localhost:5173
```

## 📋 API Endpoints Principales

### Autenticación
- `POST /api/v1/auth/register` - Registro de usuario
- `POST /api/v1/auth/login` - Inicio de sesión
- `POST /api/v1/auth/logout` - Cerrar sesión
- `POST /api/v1/auth/verify-email` - Verificar email

### Lugares
- `GET /api/v1/places` - Listar lugares
- `GET /api/v1/places/:id` - Detalle de lugar
- `POST /api/v1/places` - Crear lugar (admin)
- `PUT /api/v1/places/:id` - Actualizar lugar (admin)

### Admin
- `GET /api/v1/admin/stats` - Estadísticas generales
- `GET /api/v1/admin/users` - Gestión de usuarios
- `GET /api/v1/admin/reviews` - Moderación de reseñas
- `GET /api/v1/admin/audit` - Logs de auditoría

[Ver documentación completa de API](./API_ENDPOINTS.md)

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

## 📊 Estado de Desarrollo

### ✅ Completado
- Sistema de autenticación completo
- Panel de administración funcional
- Gestión de lugares con CRUD
- Sistema de favoritos
- Búsqueda y filtros
- Mapas interactivos
- Sistema de reseñas con moderación
- Estadísticas con gráficos
- Auditoría de acciones
- Validación de formularios

### 🔄 En Progreso
- Sistema de notificaciones push
- Integración con pasarelas de pago
- PWA (Progressive Web App)
- Internacionalización (i18n)

### 📅 Próximamente
- App móvil nativa
- Sistema de reservas
- Chat en tiempo real
- Gamificación

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

- **Email**: contacto@japasea.com
- **Website**: [japasea.com](https://japasea.com)
- **GitHub**: [@japasea](https://github.com/japasea)

---

Hecho con ❤️ en Paraguay 🇵🇾