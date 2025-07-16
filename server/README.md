# Japasea Server

Backend server para la aplicación Japasea construido con Node.js, Express y arquitectura MVC.

## Estructura del Proyecto

```
server/
├── src/
│   ├── app.js              # Archivo principal de la aplicación
│   ├── config/
│   │   └── config.js       # Configuración del servidor
│   ├── controllers/
│   │   └── apiController.js # Controladores de la API
│   ├── middleware/
│   │   └── middleware.js   # Middlewares personalizados
│   ├── models/
│   │   └── serverModel.js  # Modelos de datos
│   └── routes/
│       └── apiRoutes.js    # Rutas de la API
├── package.json
├── .env                    # Variables de entorno
└── README.md
```

## Instalación

1. Navegar al directorio del servidor:
```bash
cd server
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

## Scripts Disponibles

- `npm start` - Ejecutar el servidor en producción
- `npm run dev` - Ejecutar el servidor en modo desarrollo con nodemon
- `npm test` - Ejecutar tests (Jest)

## Endpoints Disponibles

### Endpoints de Prueba

- `GET /` - Información básica del servidor
- `GET /api/` - Bienvenida a la API
- `GET /api/health` - Health check del servidor
- `GET /api/status` - Estado detallado del servidor
- `GET /api/test` - Endpoint de prueba GET
- `POST /api/test` - Endpoint de prueba POST

### Ejemplos de Uso

```bash
# Health check
curl http://localhost:3001/api/health

# Estado del servidor
curl http://localhost:3001/api/status

# Test GET
curl http://localhost:3001/api/test

# Test POST
curl -X POST http://localhost:3001/api/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello World"}'
```

## Arquitectura MVC

- **Models**: Manejo de datos y lógica de negocio
- **Views**: Respuestas JSON (API REST)
- **Controllers**: Lógica de control y coordinación

## Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **CORS** - Middleware para Cross-Origin Resource Sharing
- **Helmet** - Middleware de seguridad
- **Morgan** - Logger HTTP
- **dotenv** - Manejo de variables de entorno
- **Nodemon** - Reinicio automático en desarrollo

## Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| PORT | Puerto del servidor | 3001 |
| NODE_ENV | Entorno de ejecución | development |
| CORS_ORIGIN | Origen permitido para CORS | http://localhost:5173 |

## Estado del Servidor

El servidor incluye endpoints para monitorear:
- Tiempo de actividad
- Uso de memoria
- Información del sistema
- Estadísticas de requests

## Próximas Funcionalidades

- Integración con base de datos
- Autenticación JWT
- Sistema de logging avanzado
- Rate limiting
- Validación de entrada
- Tests unitarios
