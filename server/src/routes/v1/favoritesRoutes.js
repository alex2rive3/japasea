const express = require('express')
const router = express.Router()
const FavoritesController = require('../../controllers/favoritesController')
const { authenticateToken } = require('../../middleware/authMiddleware')

// Todas las rutas requieren autenticación
router.use(authenticateToken)

// Obtener todos los favoritos del usuario
router.get('/', FavoritesController.getFavorites)

// Obtener estadísticas de favoritos
router.get('/stats', FavoritesController.getFavoriteStats)

// Verificar si un lugar es favorito
router.get('/check/:placeId', FavoritesController.checkFavorite)

// Verificar múltiples lugares
router.post('/check-multiple', FavoritesController.checkMultipleFavorites)

// Agregar un lugar a favoritos
router.post('/:placeId', FavoritesController.addFavorite)

// Eliminar un lugar de favoritos
router.delete('/:placeId', FavoritesController.removeFavorite)

// Sincronizar favoritos (para PWA offline)
router.post('/sync', FavoritesController.syncFavorites)

module.exports = router