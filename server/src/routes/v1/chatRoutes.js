const express = require('express')
const router = express.Router()
const PlacesController = require('../../controllers/placesController')
const { authenticateToken, optionalAuth } = require('../../middleware/authMiddleware')

// Chat con autenticación opcional
router.post('/', optionalAuth, PlacesController.processChat)

// Rutas del historial del chat (requieren autenticación)
router.get('/history', authenticateToken, PlacesController.getChatHistory)
router.get('/session/:sessionId', authenticateToken, PlacesController.getChatSession)

module.exports = router