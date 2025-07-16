const express = require('express')
const router = express.Router()
const ApiController = require('../controllers/apiController')

// Rutas de prueba y estado del servidor
router.get('/health', ApiController.getHealth)
router.get('/status', ApiController.getStatus)
router.get('/test', ApiController.getTest)
router.post('/test', ApiController.postTest)

// Rutas de lugares
router.get('/lugares', ApiController.getLugares)
router.get('/lugares/buscar', ApiController.buscarLugares)
router.get('/lugares/aleatorios', ApiController.getLugaresAleatorios)

// Ruta de bienvenida de la API
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Japasea API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /api/health - Server health check',
      'GET /api/status - Detailed server status',
      'GET /api/test - Simple test endpoint',
      'POST /api/test - POST test endpoint',
      'GET /api/lugares - Get all places or filter by type',
      'GET /api/lugares/buscar?q=query - Search places',
      'GET /api/lugares/aleatorios?cantidad=N - Get random places'
    ]
  })
})

module.exports = router
