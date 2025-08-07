const express = require('express')
const router = express.Router()
const PlacesController = require('../../controllers/placesController')
const { authenticateToken, optionalAuth } = require('../../middleware/authMiddleware')

// Chat con autenticación opcional
/**
 * @openapi
 * /chat:
 *   post:
 *     tags: [Chat]
 *     summary: Procesar mensaje de chat con IA
 *     description: Si el usuario está autenticado, se guarda el historial.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *               context:
 *                 type: string
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Respuesta del asistente
 */
router.post('/', optionalAuth, PlacesController.processChat)

// Rutas del historial del chat (requieren autenticación)
/**
 * @openapi
 * /chat/history:
 *   get:
 *     tags: [Chat]
 *     summary: Obtener historial del chat del usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Historial
 */
router.get('/history', authenticateToken, PlacesController.getChatHistory)

/**
 * @openapi
 * /chat/session/{sessionId}:
 *   get:
 *     tags: [Chat]
 *     summary: Obtener una sesión específica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sesión encontrada
 *       404:
 *         description: No encontrada
 */
router.get('/session/:sessionId', authenticateToken, PlacesController.getChatSession)

module.exports = router