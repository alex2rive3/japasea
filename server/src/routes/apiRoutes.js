const express = require('express')
const router = express.Router()
const PlacesController = require('../controllers/placesController')
const { authenticateToken, optionalAuth } = require('../middleware/authMiddleware')

/**
 * @openapi
 * /places:
 *   get:
 *     tags: [Legacy]
 *     summary: (Legacy) Listar lugares
 */
router.get('/places', PlacesController.getPlaces)
/**
 * @openapi
 * /places/search:
 *   get:
 *     tags: [Legacy]
 *     summary: (Legacy) Buscar lugares
 */
router.get('/places/search', PlacesController.searchPlaces)
/**
 * @openapi
 * /places/random:
 *   get:
 *     tags: [Legacy]
 *     summary: (Legacy) Lugares aleatorios
 */
router.get('/places/random', PlacesController.getRandomPlaces)

// Chat con autenticación opcional
/**
 * @openapi
 * /chat:
 *   post:
 *     tags: [Legacy]
 *     summary: (Legacy) Chat con IA
 */
router.post('/chat', optionalAuth, PlacesController.processChat)

// Rutas del historial del chat (requieren autenticación)
/**
 * @openapi
 * /chat/history:
 *   get:
 *     tags: [Legacy]
 *     summary: (Legacy) Historial de chat
 */
router.get('/chat/history', authenticateToken, PlacesController.getChatHistory)
/**
 * @openapi
 * /chat/session/{sessionId}:
 *   get:
 *     tags: [Legacy]
 *     summary: (Legacy) Sesión específica de chat
 */
router.get('/chat/session/:sessionId', authenticateToken, PlacesController.getChatSession)

router.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de Japasea',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /api/places - Obtener todos los lugares o filtrar por tipo',
      'GET /api/places/search?q=query - Buscar lugares',
      'GET /api/places/random?count=N - Obtener lugares aleatorios',
      'POST /api/chat - Procesar mensajes de chat con IA (autenticación opcional)',
      'GET /api/chat/history - Obtener historial del chat (requiere autenticación)',
      'GET /api/chat/session/:sessionId - Obtener sesión específica del chat (requiere autenticación)'
    ]
  })
})

module.exports = router
