const express = require('express')
const router = express.Router()
const FavoritesController = require('../../controllers/favoritesController')
const { authenticateToken } = require('../../middleware/authMiddleware')

// Todas las rutas requieren autenticación
router.use(authenticateToken)

// Obtener todos los favoritos del usuario
/**
 * @openapi
 * /favorites:
 *   get:
 *     tags: [Favorites]
 *     summary: Listar favoritos del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de favoritos
 */
router.get('/', FavoritesController.getFavorites)

// Obtener estadísticas de favoritos
/**
 * @openapi
 * /favorites/stats:
 *   get:
 *     tags: [Favorites]
 *     summary: Obtener estadísticas de favoritos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas por tipo y recientes
 */
router.get('/stats', FavoritesController.getFavoriteStats)

// Verificar si un lugar es favorito
/**
 * @openapi
 * /favorites/check/{placeId}:
 *   get:
 *     tags: [Favorites]
 *     summary: Verificar si un lugar es favorito
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultado de verificación
 */
router.get('/check/:placeId', FavoritesController.checkFavorite)

// Verificar múltiples lugares
/**
 * @openapi
 * /favorites/check-multiple:
 *   post:
 *     tags: [Favorites]
 *     summary: Verificar múltiples lugares
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [placeIds]
 *             properties:
 *               placeIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Mapa de placeId -> boolean
 */
router.post('/check-multiple', FavoritesController.checkMultipleFavorites)

// Agregar un lugar a favoritos
/**
 * @openapi
 * /favorites/{placeId}:
 *   post:
 *     tags: [Favorites]
 *     summary: Agregar lugar a favoritos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favorito agregado
 */
router.post('/:placeId', FavoritesController.addFavorite)

// Eliminar un lugar de favoritos
/**
 * @openapi
 * /favorites/{placeId}:
 *   delete:
 *     tags: [Favorites]
 *     summary: Eliminar lugar de favoritos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favorito eliminado
 */
router.delete('/:placeId', FavoritesController.removeFavorite)

// Sincronizar favoritos (para PWA offline)
/**
 * @openapi
 * /favorites/sync:
 *   post:
 *     tags: [Favorites]
 *     summary: Sincronizar favoritos (reemplaza por lista enviada)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [favorites]
 *             properties:
 *               favorites:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Resumen de sincronización
 */
router.post('/sync', FavoritesController.syncFavorites)

module.exports = router