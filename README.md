# 🏖️ Japasea 2.0

Una aplicación web full-stack moderna de turismo para Encarnación, Paraguay. Combina un frontend interactivo en React con un backend robusto en Node.js para proporcionar información turística, mapas interactivos y asistencia por chat con IA.

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Componentes](#-componentes)
- [Documentación Adicional](#-documentación-adicional)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## 🎯 Descripción

Japasea 2.0 es una plataforma turística completa diseñada para ayudar a los visitantes de Encarnación, Paraguay, a descubrir lugares de interés, restaurantes, alojamientos y actividades. La aplicación incluye:

- **Mapas Interactivos**: Visualización de lugares en tiempo real usando Leaflet
- **Chat con IA**: Asistente virtual para recomendaciones personalizadas
- **Información Detallada**: Datos completos sobre establecimientos locales
- **Interfaz Responsiva**: Diseño adaptable para desktop y móviles

## ✨ Características

### Frontend
- 🗺️ **Mapas Interactivos** con React Leaflet
- 🤖 **Chat Bot** con integración de IA para recomendaciones
- 💾 **Historial de Chat Persistente** para usuarios autenticados
- 📱 **Diseño Responsivo** con Material-UI
- 🎨 **Interfaz Moderna** y minimalista
- 🔍 **Búsqueda en Tiempo Real** de lugares
- 📍 **Marcadores Personalizados** por categoría
- 🔐 **Sistema de Autenticación** completo con JWT

### Backend
- 🚀 **API RESTful** con Express.js
- 🧠 **Integración con Google Generative AI**
- 🏗️ **Arquitectura MVC** bien estructurada
- 🔒 **Seguridad** con Helmet, CORS y autenticación JWT
- 📊 **Logging** con Morgan
- 🔄 **Hot Reload** en desarrollo
- 🗄️ **MongoDB** para persistencia de datos
- 📝 **Historial de Chat** con sesiones persistentes

## 🛠️ Tecnologías

### Frontend Stack
- **React 19.1** - Framework principal
- **TypeScript** - Tipado estático
- **Vite 7.0** - Build tool y dev server
- **Material-UI v7** - Biblioteca de componentes
  - `@mui/material` - Componentes principales
  - `@mui/icons-material` - Iconos Material Design
  - `@emotion/react` & `@emotion/styled` - CSS-in-JS
- **React Leaflet 5.0** - Mapas interactivos
- **Leaflet 1.9** - Biblioteca de mapas

### Backend Stack
- **Node.js** - Runtime de JavaScript
- **Express.js 4.18** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Google Generative AI** - Integración de IA
- **JWT** - JSON Web Tokens para autenticación
- **Bcrypt** - Encriptación de contraseñas
- **Helmet** - Headers de seguridad
- **CORS** - Compartir recursos entre orígenes
- **Morgan** - Logging de peticiones HTTP
- **Dotenv** - Gestión de variables de entorno

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **TypeScript** - Verificación de tipos
- **Nodemon** - Auto-restart del servidor
- **Jest** - Testing framework

## 📁 Estructura del Proyecto

```
japasea2.0/
├── client/                          # Frontend React + Vite
│   ├── src/
│   │   ├── components/              # Componentes React
│   │   │   ├── ChatComponent.tsx    # Chat con IA
│   │   │   ├── MapComponent.tsx     # Mapa interactivo
│   │   │   ├── PlaceCards.tsx       # Tarjetas de lugares
│   │   │   ├── Sidebar.tsx          # Navegación lateral
│   │   │   └── TravelPlanComponent.tsx
│   │   ├── services/                # Servicios API
│   │   │   └── placesService.ts     # Servicio de lugares
│   │   ├── types/                   # Definiciones TypeScript
│   │   │   ├── lugares.ts           # Tipos de lugares
│   │   │   └── places.ts            # Tipos de lugares (inglés)
│   │   ├── utils/                   # Utilidades
│   │   ├── App.tsx                  # Componente principal
│   │   ├── main.tsx                 # Punto de entrada

│   │   └── index.css                # Estilos globales
│   ├── public/                      # Archivos públicos
│   ├── package.json                 # Dependencias frontend
│   ├── vite.config.ts               # Configuración Vite
│   └── tsconfig.json                # Configuración TypeScript
├── server/                          # Backend Node.js + Express
│   ├── src/
│   │   ├── controllers/             # Controladores MVC
│   │   │   └── placesController.js  # Controlador de lugares
│   │   ├── models/                  # Modelos de datos
│   │   │   └── serverModel.js       # Modelo del servidor
│   │   ├── routes/                  # Rutas API
│   │   │   └── apiRoutes.js         # Rutas principales
│   │   ├── middleware/              # Middleware personalizado
│   │   │   └── middleware.js        # Middleware de logging
│   │   ├── config/                  # Configuraciones
│   │   │   └── config.js            # Configuración del servidor
│   │   └── app.js                   # Aplicación principal
│   ├── places.json                  # Datos de lugares turísticos
│   ├── package.json                 # Dependencias backend
│   └── .env                         # Variables de entorno
├── .github/
│   └── copilot-instructions.md      # Instrucciones para Copilot
├── .gitignore                       # Archivos ignorados por Git
└── README.md                        # Este archivo
```

## 🚀 Instalación

### Prerrequisitos
- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Git**

### Clonar el Repositorio
```bash
git clone https://github.com/alex2rive3/japasea.git
cd japasea2.0
```

### Configurar el Backend
```bash
cd server
npm install

# Crear archivo .env
cp .env.example .env
# Editar .env con tus configuraciones
```

### Configurar el Frontend
```bash
cd ../client
npm install
```

### Variables de Entorno
Crear un archivo `.env` en la carpeta `server/` con:

```env
PORT=3001
GOOGLE_AI_API_KEY=tu_api_key_aqui
NODE_ENV=development
```

## 💻 Uso

### Desarrollo Local

#### Opción 1: Ejecutar Ambos Servicios Simultáneamente
```bash
# Desde la raíz del proyecto
npm run dev
```

#### Opción 2: Ejecutar por Separado

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Acceso a la Aplicación
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

### Producción
```bash
# Construir frontend
cd client
npm run build

# Iniciar servidor de producción
cd ../server
npm start
```

## 🔌 API Endpoints

### Información del Servidor
- `GET /` - Mensaje de bienvenida
- `GET /api/` - Información de la API
- `GET /api/health` - Estado de salud del servidor
- `GET /api/status` - Estado detallado del sistema

### Lugares
- `GET /api/lugares` - Obtener todos los lugares
- `GET /api/lugares/tipo/:tipo` - Filtrar por tipo
- `POST /api/lugares/buscar` - Buscar lugares
- `POST /api/chat` - Procesar mensajes del chat

### Ejemplo de Respuesta
```json
{
  "lugares": [
    {
      "key": "Costanera de Encarnación",
      "description": "Hermoso paseo junto al río Paraná...",
      "location": {
        "lat": -27.331130,
        "lng": -55.865929
      },
      "type": "Turístico",
      "address": "Avda. Costanera"
    }
  ],
  "message": "Lugares encontrados exitosamente"
}
```

## 🧩 Componentes

### ChatComponent
- **Propósito**: Interfaz de chat con IA
- **Características**: Historial de mensajes, envío automático, avatares
- **Props**: `height`, `onPlacesUpdate`

### MapComponent
- **Propósito**: Mapa interactivo con marcadores
- **Características**: Zoom, popups informativos, marcadores personalizados
- **Props**: `center`, `zoom`, `height`, `places`

### PlaceCards
- **Propósito**: Tarjetas de información de lugares
- **Características**: Imágenes, categorías, información de contacto
- **Props**: `places`, `onLocationClick`

### Sidebar
- **Propósito**: Navegación lateral responsiva
- **Características**: Menú colapsible, diseño mobile-first
- **Props**: `children`

## 🎨 Diseño y Tema

### Paleta de Colores
- **Primario**: `#2196F3` (Azul Material)
- **Secundario**: `#FF9800` (Naranja)
- **Fondo**: `#FAFAFA` (Gris claro)
- **Texto**: `#263238` (Gris oscuro)

### Principios de Diseño
- **Minimalismo**: Diseño limpio y funcional
- **Consistencia**: Colores y espaciado uniformes
- **Responsividad**: Adaptable a todos los dispositivos
- **Accesibilidad**: Contraste adecuado y navegación intuitiva

## 🌍 Separación de Idiomas

### Código (Inglés)
- Variables: `selectedPlaces`, `searchType`, `placesController`
- Funciones: `getPlaces()`, `searchPlaces()`, `processChat()`
- Archivos: `placesController.js`, `placesService.ts`

### Interfaz (Español)
- Mensajes de error: "Error al obtener lugares"
- Respuestas de API: "Bienvenido a la API de Japasea"
- Textos de usuario: Todo el contenido visible para el usuario

## 🤝 Contribución

### Flujo de Trabajo
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-caracteristica`
3. Commit de cambios: `git commit -m 'Agregar nueva característica'`
4. Push a la rama: `git push origin feature/nueva-caracteristica`
5. Crear Pull Request

### Estándares de Código
- **ESLint**: Seguir las reglas configuradas
- **TypeScript**: Usar tipado estricto
- **Commits**: Mensajes descriptivos en inglés
- **Testing**: Incluir pruebas para nuevas características

### Estructura de Commits
```
tipo(alcance): descripción breve

Descripción detallada del cambio si es necesario

- Cambio específico 1
- Cambio específico 2
```

## 📝 Scripts Disponibles

### Frontend (`client/`)
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construcción para producción
npm run preview      # Vista previa de producción
npm run lint         # Ejecutar ESLint
```

### Backend (`server/`)
```bash
npm start            # Servidor de producción
npm run dev          # Servidor de desarrollo con nodemon
npm test             # Ejecutar pruebas
```

## 🐛 Resolución de Problemas

### Problemas Comunes

**Puerto ya en uso:**
```bash
# Cambiar puerto en .env o matar proceso
lsof -ti:3001 | xargs kill -9
```

**Errores de dependencias:**
```bash
# Limpiar cache e instalar
rm -rf node_modules package-lock.json
npm install
```

**Problemas de CORS:**
- Verificar configuración en `server/src/app.js`
- Asegurar que el frontend use la URL correcta del backend

## 📊 Monitoring y Logs

### Logs del Servidor
```bash
# Logs en tiempo real
tail -f server/logs/app.log

# Logs de errores
tail -f server/logs/error.log
```

### Métricas
- Tiempo de respuesta de API
- Uso de memoria del servidor
- Errores de aplicación

## 🔐 Seguridad

### Medidas Implementadas
- **Helmet.js** para headers de seguridad
- **CORS** configurado apropiadamente
- **Validación** de entrada en endpoints
- **Variables de entorno** para datos sensibles

### Recomendaciones
- Mantener dependencias actualizadas
- Usar HTTPS en producción
- Implementar rate limiting
- Monitorear logs de seguridad

## 📚 Documentación Adicional

### Documentos de Negocio
- **[Resumen Ejecutivo](EXECUTIVE_SUMMARY.md)** - Presentación del proyecto para inversores y socios
- **[Estrategia de Monetización](MONETIZATION_STRATEGY.md)** - Análisis detallado de modelos de negocio
- **[Tips Monetización Paraguay](MONETIZATION_TIPS_PARAGUAY.md)** - Estrategias específicas para el mercado local

### Documentos de Desarrollo
- **[Plan de Desarrollo](DEVELOPMENT_ROADMAP.md)** - Roadmap completo con fases de desarrollo
- **[Implementación Técnica](TECHNICAL_IMPLEMENTATION_PLAN.md)** - Arquitectura y stack tecnológico
- **[Checklist de Lanzamiento](LAUNCH_CHECKLIST.md)** - Lista completa de tareas para el launch

### Documentos Técnicos
- **[API de Autenticación](server/docs/AUTH_API.md)** - Documentación del sistema de autenticación
- **[Estado de Integración](INTEGRATION_COMPLETE.md)** - Estado actual de componentes integrados

## 📈 Roadmap

### Próximas Características (Ver [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) para detalles)
- [x] Autenticación de usuarios ✅
- [x] Historial de chat persistente ✅
- [ ] Favoritos personalizados
- [ ] Reseñas y calificaciones
- [ ] Integración con redes sociales
- [ ] App móvil nativa
- [ ] Sistema de reservas

### Mejoras Técnicas
- [ ] Tests unitarios completos
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)

## 📞 Soporte

### Contacto
- **Issues**: [GitHub Issues](https://github.com/alex2rive3/japasea/issues)
- **Email**: contacto@japasea.com
- **Documentación**: [Wiki del Proyecto](https://github.com/alex2rive3/japasea/wiki)

### Recursos Útiles
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Express.js Guide](https://expressjs.com/)
- [Leaflet Documentation](https://leafletjs.com/)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">
  <strong>🏖️ Hecho con ❤️ para Encarnación, Paraguay</strong>
</div>
