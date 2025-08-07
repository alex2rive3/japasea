const express = require('express')
const router = express.Router()
const FavoritesController = require('../controllers/favoritesController')
const { authenticateToken } = require('../middleware/authMiddleware')

// Todas las rutas requieren autenticación
router.use(authenticateToken)

// Obtener todos los favoritos del usuario
/**
 * @openapi
 * /favorites:
 *   get:
 *     tags: [Legacy]
 *     summary: (Legacy) Listar favoritos
 */
router.get('/', FavoritesController.getFavorites)

// Obtener estadísticas de favoritos
/**
 * @openapi
 * /favorites/stats:
 *   get:
 *     tags: [Legacy]
 *     summary: (Legacy) Estadísticas de favoritos
 */
router.get('/stats', FavoritesController.getFavoriteStats)

// Verificar si un lugar es favorito
/**
 * @openapi
 * /favorites/check/{placeId}:
 *   get:
 *     tags: [Legacy]
 *     summary: (Legacy) Verificar un favorito
 */
router.get('/check/:placeId', FavoritesController.checkFavorite)

// Verificar múltiples lugares
/**
 * @openapi
 * /favorites/check-multiple:
 *   post:
 *     tags: [Legacy]
 *     summary: (Legacy) Verificar múltiples favoritos
 */
router.post('/check-multiple', FavoritesController.checkMultipleFavorites)

// Agregar un lugar a favoritos
/**
 * @openapi
 * /favorites/{placeId}:
 *   post:
 *     tags: [Legacy]
 *     summary: (Legacy) Agregar favorito
 */
router.post('/:placeId', FavoritesController.addFavorite)

// Eliminar un lugar de favoritos
/**
 * @openapi
 * /favorites/{placeId}:
 *   delete:
 *     tags: [Legacy]
 *     summary: (Legacy) Eliminar favorito
 */
router.delete('/:placeId', FavoritesController.removeFavorite)

// Sincronizar favoritos (para PWA offline)
/**
 * @openapi
 * /favorites/sync:
 *   post:
 *     tags: [Legacy]
 *     summary: (Legacy) Sincronizar favoritos
 */
router.post('/sync', FavoritesController.syncFavorites)

module.exports = router