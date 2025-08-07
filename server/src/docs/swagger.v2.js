// Configuración de Swagger (OpenAPI) para la API v2

let swaggerJSDoc
try {
  swaggerJSDoc = require('swagger-jsdoc')
} catch (e) {
  module.exports = null
  return
}

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Japasea API - v2',
      version: '2.0.0',
      description:
        'Documentación de la API v2 (beta) de Japasea. Incluye mejoras de lugares, paginación y endpoints nuevos.',
    },
    servers: [{ url: 'http://localhost:3001/api/v2', description: 'Local v2' }],
    tags: [
      { name: 'Auth', description: 'Autenticación y usuario' },
      { name: 'Places', description: 'Lugares (v2 mejorado)' },
      { name: 'Favorites', description: 'Favoritos' },
      { name: 'Chat', description: 'Chat e historial' },
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
        PaginatedPlaces: {
          type: 'object',
          properties: {
            data: { type: 'array', items: { $ref: '#/components/schemas/Place' } },
            metadata: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' },
                hasNextPage: { type: 'boolean' },
                hasPrevPage: { type: 'boolean' },
              },
            },
            links: {
              type: 'object',
              properties: {
                self: { type: 'string' },
                next: { type: 'string', nullable: true },
                prev: { type: 'string', nullable: true },
                first: { type: 'string' },
                last: { type: 'string' },
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
  apis: ['src/routes/v2/**/*.js'],
}

const swaggerSpecV2 = swaggerJSDoc(options)

module.exports = swaggerSpecV2


