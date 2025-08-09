// Configuración de Swagger (OpenAPI) para la API v1
// Usa swagger-jsdoc para generar el esquema desde anotaciones JSDoc

let swaggerJSDoc
const path = require('path')
try {
  swaggerJSDoc = require('swagger-jsdoc')
} catch (e) {
  // Si la dependencia no está instalada, exportar null para evitar romper la app
  module.exports = null
  return
}

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Japasea API',
      version: '1.0.0',
      description:
        'API completa de Japasea para gestión de lugares turísticos en Encarnación, Paraguay. Incluye autenticación, lugares, favoritos, chat con IA y administración.',
      contact: {
        name: 'Japasea',
      },
    },
    servers: [
      { url: 'http://localhost:3001/api/v1', description: 'Servidor Local' },
      { url: 'https://api.japasea.com/v1', description: 'Producción' }
    ],
    tags: [
      { name: 'Auth', description: 'Autenticación y usuario' },
      { name: 'Places', description: 'Lugares' },
      { name: 'Favorites', description: 'Favoritos' },
      { name: 'Chat', description: 'Chat e historial' },
      { name: 'Admin', description: 'Administración (requiere rol admin)' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            error: { type: 'string' },
          },
        },
        AuthUser: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            role: { type: 'string', example: 'user' },
            isEmailVerified: { type: 'boolean' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/AuthUser' },
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            },
          },
        },
        Place: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            type: { type: 'string', enum: ['Alojamiento', 'Gastronomía', 'Turístico', 'Compras', 'Entretenimiento', 'Desayunos y meriendas', 'Comida'] },
            address: { type: 'string' },
            location: {
              type: 'object',
              properties: {
                lat: { type: 'number' },
                lng: { type: 'number' },
                coordinates: { type: 'array', items: { type: 'number' } }
              },
            },
            status: { type: 'string', enum: ['active', 'inactive', 'pending', 'seasonal'] },
            metadata: {
              type: 'object',
              properties: {
                verified: { type: 'boolean' },
                featured: { type: 'boolean' },
                views: { type: 'integer' },
                likes: { type: 'integer' }
              }
            }
          },
        },
        AdminPlaceInput: {
          type: 'object',
          required: ['key', 'name', 'description', 'type', 'address', 'lat', 'lng'],
          properties: {
            key: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            type: { type: 'string', enum: ['Alojamiento', 'Gastronomía', 'Turístico', 'Compras', 'Entretenimiento', 'Desayunos y meriendas', 'Comida'] },
            address: { type: 'string' },
            lat: { type: 'number' },
            lng: { type: 'number' },
            status: { type: 'string', enum: ['active', 'inactive', 'pending', 'seasonal'] }
          }
        },
      },
    },
  },
  // Archivos a escanear para anotaciones
  apis: [
    path.join(__dirname, '../routes/v1/authRoutes.js'),
    path.join(__dirname, '../routes/v1/placesRoutes.js'),
    path.join(__dirname, '../routes/v1/favoritesRoutes.js'),
    path.join(__dirname, '../routes/v1/chatRoutes.js'),
    path.join(__dirname, '../routes/v1/adminRoutes.js')
  ],
}

const swaggerSpecV1 = swaggerJSDoc(options)

module.exports = swaggerSpecV1


