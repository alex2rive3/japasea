const express = require('express')
const router = express.Router()
const PlacesController = require('../../controllers/placesController')

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

module.exports = router