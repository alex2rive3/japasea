# 📚 Documentación del Proyecto Japasea

## 🎯 Acerca del Proyecto

Japasea es una plataforma turística digital para Encarnación, Paraguay, que utiliza inteligencia artificial para proporcionar recomendaciones personalizadas de lugares, actividades y servicios turísticos. La plataforma incluye una interfaz web responsiva, panel de administración completo, y chat inteligente con IA.

## 🏗️ Arquitectura

- **Frontend**: React 19 + TypeScript + Material-UI + Vite
- **Backend**: Node.js + Express + MongoDB + Mongoose  
- **Autenticación**: JWT con refresh tokens
- **Chat IA**: Integración con Google AI (Gemini)
- **Mapas**: Leaflet + React Leaflet
- **Gráficos**: Recharts

## 📖 Documentación Disponible

### 🔧 Documentación Técnica

| Documento | Descripción | Estado |
|-----------|-------------|--------|
| [`API_ENDPOINTS.md`](./API_ENDPOINTS.md) | Documentación completa de todos los endpoints de la API | ✅ Actualizado |
| [`AUTH_API.md`](./AUTH_API.md) | Especificación detallada de la API de autenticación | ✅ Actualizado |
| [`DOCUMENTATION.md`](./DOCUMENTATION.md) | Documentación técnica completa del proyecto | ✅ Actualizado |
| [`CHAT_HISTORY_SPEC.md`](./CHAT_HISTORY_SPEC.md) | Especificación del sistema de historial de chat | ✅ Actualizado |
| [`I18N_GUIDE.md`](./I18N_GUIDE.md) | Guía de internacionalización (ES/EN/PT) | ✅ Actualizado |
| [`TECHNICAL_IMPLEMENTATION_PLAN.md`](./TECHNICAL_IMPLEMENTATION_PLAN.md) | Plan de implementación técnica | ✅ Actualizado |

### 👨‍💼 Documentación de Usuario y Administración

| Documento | Descripción | Estado |
|-----------|-------------|--------|
| [`ADMIN_GUIDE.md`](./ADMIN_GUIDE.md) | Guía completa del panel de administración | ✅ Actualizado |

### 📋 Gestión de Proyecto

| Documento | Descripción | Estado |
|-----------|-------------|--------|
| [`FEATURES_SUMMARY.md`](./FEATURES_SUMMARY.md) | Resumen de características implementadas | ✅ Actualizado |
| [`TODO_BACKLOG.md`](./TODO_BACKLOG.md) | Lista de tareas pendientes y mejoras | ✅ Actualizado |
| [`LAUNCH_CHECKLIST.md`](./LAUNCH_CHECKLIST.md) | Checklist para el lanzamiento a producción | ✅ Actualizado |

### 💼 Información Comercial

| Documento | Descripción | Estado |
|-----------|-------------|--------|
| [`BUSINESS_OVERVIEW.md`](./BUSINESS_OVERVIEW.md) | Resumen ejecutivo y estrategia de negocio | ✅ Actualizado |

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- MongoDB 6.0+
- Docker (opcional)

### Instalación con Docker (Recomendado)
```bash
# Clonar el repositorio
git clone <repo-url>
cd japasea

# Configurar variables de entorno
cp server/env.example server/.env
cp client/env.example client/.env

# Iniciar con Docker Compose
docker-compose up -d --build
```

### Instalación Manual
```bash
# Backend
cd server
npm install
cp env.example .env
npm run dev

# Frontend (en otra terminal)
cd client
npm install
cp env.example .env
npm run dev
```

### URLs de Desarrollo
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Mongo Express**: http://localhost:8081
- **Admin Panel**: http://localhost:5173/admin

## 📊 Estado del Proyecto

| Componente | Estado | Progreso |
|------------|--------|-----------|
| **Autenticación** | ✅ Completo | 100% |
| **Gestión de Lugares** | ✅ Completo | 100% |
| **Chat con IA** | ✅ Completo | 100% |
| **Panel Admin** | ✅ Completo | 100% |
| **Mapas Interactivos** | ✅ Completo | 100% |
| **Sistema de Favoritos** | ✅ Completo | 100% |
| **Sistema de Reseñas** | ✅ Completo | 100% |
| **PWA** | 🔄 En Progreso | 70% |
| **Tests** | 🔄 En Progreso | 40% |
| **Internacionalización** | 🔄 En Progreso | 60% |

## 🛠️ Comandos Útiles

### Docker
```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down

# Reiniciar un servicio
docker-compose restart server
```

### Desarrollo
```bash
# Servidor - Tests
npm test
npm run test:coverage

# Servidor - Base de datos
npm run db:seed
npm run db:clear

# Cliente - Build
npm run build
npm run preview
```

## 🔐 Configuración

### Variables de Entorno del Servidor
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/japasea_db
JWT_SECRET=your-secret-key
GOOGLE_AI_API_KEY=your-google-ai-key
```

### Variables de Entorno del Cliente
```env
VITE_API_URL=http://localhost:3001
```

## 👥 Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **Guest** | Ver lugares, usar chat (limitado) |
| **User** | Todo lo anterior + favoritos, reseñas, historial |
| **Admin** | Todo lo anterior + panel admin, gestión completa |

## 📱 Características Principales

### Para Usuarios
- 🤖 Chat inteligente con IA multilingüe
- 🗺️ Mapas interactivos con marcadores
- ❤️ Sistema de favoritos
- ⭐ Reseñas y calificaciones
- 📱 PWA instalable
- 🌐 Soporte multi-idioma

### Para Administradores
- 📊 Dashboard con métricas en tiempo real
- 👥 Gestión completa de usuarios
- 📍 CRUD de lugares con verificación
- ⭐ Moderación de reseñas
- 🔍 Sistema de auditoría
- ⚙️ Configuración del sistema

## 🔧 API

La API REST está completamente documentada y versionada:

- **Base URL**: `http://localhost:3001/api/v1`
- **Autenticación**: JWT Bearer Token
- **Documentación**: Consultar [`API_ENDPOINTS.md`](./API_ENDPOINTS.md)

### Endpoints Principales
- `POST /auth/login` - Autenticación
- `GET /places` - Listar lugares
- `POST /chat/message` - Chat con IA
- `GET /admin/stats` - Estadísticas (admin)

## 🧪 Testing

### Ejecutar Tests
```bash
# Backend
cd server
npm test
npm run test:coverage

# Frontend
cd client
npm test
```

### Coverage Objetivo
- **Backend**: > 80%
- **Frontend**: > 70%

## 🚀 Deployment

### Preparación para Producción
1. Revisar [`LAUNCH_CHECKLIST.md`](./LAUNCH_CHECKLIST.md)
2. Configurar variables de entorno de producción
3. Configurar MongoDB Atlas o servidor dedicado
4. Configurar HTTPS y certificados SSL
5. Configurar monitoring y backups

### Stack de Producción Recomendado
- **Hosting**: VPS o Docker containers
- **Base de Datos**: MongoDB Atlas
- **CDN**: CloudFlare
- **Monitoring**: PM2 + Uptime Robot
- **Backups**: Automáticos cada 24h

## 📞 Soporte

Para consultas técnicas:
- **Issues**: Usar el sistema de issues del repositorio
- **Documentación**: Consultar los archivos en `/docs`
- **Chat**: Contactar al equipo de desarrollo

---

**Última actualización**: Enero 2025  
**Versión**: 2.0  
**Estado**: MVP Completado - Preparando Producción


