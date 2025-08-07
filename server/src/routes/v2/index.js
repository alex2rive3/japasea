const express = require('express')
const router = express.Router()
const { deprecate } = require('../../middleware/apiVersioning')

// Importar rutas v2 (heredan de v1 con mejoras)
const placesRoutes = require('./placesRoutes')
const authRoutes = require('../v1/authRoutes') // Reutilizar v1
const favoritesRoutes = require('../v1/favoritesRoutes') // Reutilizar v1
const chatRoutes = require('../v1/chatRoutes') // Reutilizar v1

// Información de la versión
router.get('/', (req, res) => {
  res.json({
    version: 'v2',
    status: 'beta',
    endpoints: {
      auth: '/api/v2/auth',
      places: '/api/v2/places',
      favorites: '/api/v2/favorites',
      chat: '/api/v2/chat',
      reviews: '/api/v2/reviews', // Nuevo en v2
      bookings: '/api/v2/bookings' // Nuevo en v2
    },
    newFeatures: [
      'Búsqueda mejorada con filtros avanzados',
      'Sistema de reseñas completo',
      'API de reservas',
      'Soporte para paginación mejorada',
      'Respuestas más detalladas'
    ],
    documentation: '/api/docs/v2'
  })
})

// Montar rutas
router.use('/auth', authRoutes) // Mismas rutas que v1
router.use('/places', placesRoutes) // Versión mejorada
router.use('/favorites', favoritesRoutes) // Mismas rutas que v1
router.use('/chat', chatRoutes) // Mismas rutas que v1

// Nuevas rutas en v2
// router.use('/reviews', reviewsRoutes) // TODO: Implementar
// router.use('/bookings', bookingsRoutes) // TODO: Implementar

module.exports = router