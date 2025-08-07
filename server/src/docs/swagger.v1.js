// Configuración de Swagger (OpenAPI) para la API v1
// Usa swagger-jsdoc para generar el esquema desde anotaciones JSDoc

let swaggerJSDoc
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
      title: 'Japasea API - v1',
      version: '1.0.0',
      description:
        'Documentación de la API v1 de Japasea. Incluye endpoints de autenticación, lugares, favoritos y chat.',
      contact: {
        name: 'Japasea',
      },
    },
    servers: [
      { url: 'http://localhost:3001/api/v1', description: 'Local v1' },
      { url: 'http://localhost:3001/api', description: 'Legacy sin versión' },
    ],
    tags: [
      { name: 'Auth', description: 'Autenticación y usuario' },
      { name: 'Places', description: 'Lugares' },
      { name: 'Favorites', description: 'Favoritos' },
      { name: 'Chat', description: 'Chat e historial' },
      { name: 'Legacy', description: 'Rutas legacy sin versión (redirigen a v1)' },
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
            type: { type: 'string' },
            address: { type: 'string' },
            location: {
              type: 'object',
              properties: {
                lat: { type: 'number' },
                lng: { type: 'number' },
              },
            },
          },
        },
      },
    },
  },
  // Archivos a escanear para anotaciones
  apis: [
    'src/routes/v1/**/*.js',
    'src/routes/*.js', // legacy
  ],
}

const swaggerSpecV1 = swaggerJSDoc(options)

module.exports = swaggerSpecV1


