const express = require('express')
const router = express.Router()
const PlacesController = require('../../controllers/placesController')
const { authenticateToken } = require('../../middleware/authMiddleware')

// Rutas públicas de lugares
/**
 * @openapi
 * /places:
 *   get:
 *     tags: [Places]
 *     summary: Listar lugares
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de lugar
 *     responses:
 *       200:
 *         description: Lista de lugares
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Place'
 */
router.get('/', PlacesController.getPlaces)
/**
 * @openapi
 * /places/search:
 *   get:
 *     tags: [Places]
 *     summary: Buscar lugares
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Place'
 *       400:
 *         description: Falta parámetro q
 */
router.get('/search', PlacesController.searchPlaces)
/**
 * @openapi
 * /places/random:
 *   get:
 *     tags: [Places]
 *     summary: Obtener lugares aleatorios
 *     parameters:
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *           default: 3
 *     responses:
 *       200:
 *         description: Lugares aleatorios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Place'
 */
router.get('/random', PlacesController.getRandomPlaces)

/**
 * @openapi
 * /places/nearby:
 *   get:
 *     tags: [Places]
 *     summary: Buscar lugares cercanos
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitud
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitud
 *       - in: query
 *         name: radius
 *         schema:
 *           type: integer
 *           default: 5000
 *         description: Radio en metros
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad máxima de resultados
 *     responses:
 *       200:
 *         description: Lugares cercanos encontrados
 *       400:
 *         description: Faltan parámetros de ubicación
 */
router.get('/nearby', async (req, res) => {
  const { lat, lng, radius = 5000, limit = 10 } = req.query
  
  if (!lat || !lng) {
    return res.status(400).json({
      error: 'Ubicación requerida',
      message: 'Debes proporcionar latitud (lat) y longitud (lng)'
    })
  }
  
  // TODO: Implementar búsqueda geoespacial real
  res.json({
    data: [],
    metadata: {
      center: { lat: parseFloat(lat), lng: parseFloat(lng) },
      radius: parseInt(radius),
      totalFound: 0
    }
  })
})

/**
 * @openapi
 * /places/trending:
 *   get:
 *     tags: [Places]
 *     summary: Obtener lugares en tendencia
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *           default: week
 *         description: Período de tiempo
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad máxima de resultados
 *     responses:
 *       200:
 *         description: Lista de lugares trending
 */
router.get('/trending', async (req, res) => {
  const { period = 'week', limit = 10 } = req.query
  
  // TODO: Implementar lógica de trending real
  res.json({
    data: [],
    period: period,
    lastUpdated: new Date().toISOString()
  })
})

/**
 * @openapi
 * /places/ensure:
 *   post:
 *     tags: [Places]
 *     summary: Crear o devolver un lugar mínimo (para obtener un id)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [key, name]
 *             properties:
 *               key: { type: string }
 *               name: { type: string }
 *               description: { type: string }
 *               type: { type: string }
 *               address: { type: string }
 *               location:
 *                 type: object
 *                 properties:
 *                   lat: { type: number }
 *                   lng: { type: number }
 *     responses:
 *       200:
 *         description: Devuelve lugar existente
 *       201:
 *         description: Crea y devuelve lugar
 */
router.post('/ensure', authenticateToken, PlacesController.ensurePlace)

module.exports = router