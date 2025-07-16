const express = require('express')
const router = express.Router()
const ApiController = require('../controllers/apiController')

// Rutas de lugares
router.get('/lugares', ApiController.getLugares)
router.get('/lugares/buscar', ApiController.buscarLugares)
router.get('/lugares/aleatorios', ApiController.getLugaresAleatorios)

// Ruta de chat con AI
router.post('/chat', ApiController.processChat)

// Ruta de bienvenida de la API
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Japasea API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /api/lugares - Get all places or filter by type',
      'GET /api/lugares/buscar?q=query - Search places',
      'GET /api/lugares/aleatorios?cantidad=N - Get random places',
      'POST /api/chat - Process chat messages with AI'
    ]
  })
})

module.exports = router
