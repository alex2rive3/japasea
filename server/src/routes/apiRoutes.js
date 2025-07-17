const express = require('express')
const router = express.Router()
const PlacesController = require('../controllers/placesController')

router.get('/places', PlacesController.getPlaces)
router.get('/places/search', PlacesController.searchPlaces)
router.get('/places/random', PlacesController.getRandomPlaces)

router.post('/chat', PlacesController.processChat)

router.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de Japasea',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /api/places - Obtener todos los lugares o filtrar por tipo',
      'GET /api/places/search?q=query - Buscar lugares',
      'GET /api/places/random?count=N - Obtener lugares aleatorios',
      'POST /api/chat - Procesar mensajes de chat con IA'
    ]
  })
})

module.exports = router
