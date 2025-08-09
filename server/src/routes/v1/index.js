const express = require('express')
const router = express.Router()

// Importar rutas v1
const placesRoutes = require('./placesRoutes')
const authRoutes = require('./authRoutes')
const favoritesRoutes = require('./favoritesRoutes')
const chatRoutes = require('./chatRoutes')
const adminRoutes = require('./adminRoutes')
const reviewsRoutes = require('./reviewsRoutes')

// Información de la versión
router.get('/', (req, res) => {
  res.json({
    version: 'v1',
    status: 'stable',
    endpoints: {
      auth: '/api/v1/auth',
      places: '/api/v1/places',
      favorites: '/api/v1/favorites',
      chat: '/api/v1/chat',
      admin: '/api/v1/admin'
    },
    documentation: '/api/docs/v1'
  })
})

// Montar rutas
router.use('/auth', authRoutes)
router.use('/places', placesRoutes)
router.use('/favorites', favoritesRoutes)
router.use('/chat', chatRoutes)
router.use('/admin', adminRoutes)
router.use('/reviews', reviewsRoutes)

module.exports = router