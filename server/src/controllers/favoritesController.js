const User = require('../models/userModel')
const Place = require('../models/placeModel')

class FavoritesController {
  // Obtener todos los favoritos del usuario
  static async getFavorites(req, res) {
    try {
      const user = await User.findById(req.user.id)
        .populate({
          path: 'favorites.place',
          select: 'name description type location address images rating status',
          match: { status: 'active' }
        })
        .lean()

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        })
      }

      const favorites = (user.favorites || [])
        .filter(fav => fav && fav.place !== null) // Filtrar lugares eliminados
        .map(fav => ({
          ...fav.place,
          isFavorite: true,
          favoritedAt: fav.addedAt
        }))

      res.status(200).json({
        success: true,
        count: favorites.length,
        data: favorites
      })
    } catch (error) {
      console.error('Error getting favorites:', error)
      res.status(500).json({
        success: false,
        message: 'Error al obtener favoritos',
        error: error.message
      })
    }
  }

  // Agregar un lugar a favoritos
  static async addFavorite(req, res) {
    try {
      const { placeId } = req.params

      // Verificar que el lugar existe y está activo
      const place = await Place.findOne({ 
        _id: placeId, 
        status: 'active' 
      })
      
      if (!place) {
        return res.status(404).json({
          success: false,
          message: 'Lugar no encontrado o inactivo'
        })
      }

      // Obtener usuario con el método select para incluir favorites
      const user = await User.findById(req.user.id).select('+favorites')
      
      // Verificar límite de favoritos para usuarios free
      const maxFavorites = user.role === 'premium' ? -1 : 5
      if (maxFavorites !== -1 && user.favorites.length >= maxFavorites) {
        return res.status(400).json({
          success: false,
          message: `Límite de favoritos alcanzado (${maxFavorites}). Actualiza a premium para favoritos ilimitados.`
        })
      }

      await user.addFavorite(placeId)

      res.status(200).json({
        success: true,
        message: 'Lugar agregado a favoritos',
        data: {
          placeId,
          place: {
            id: place._id,
            name: place.name,
            type: place.type
          }
        }
      })
    } catch (error) {
      console.error('Error adding favorite:', error)
      res.status(500).json({
        success: false,
        message: 'Error al agregar a favoritos',
        error: error.message
      })
    }
  }

  // Eliminar un lugar de favoritos
  static async removeFavorite(req, res) {
    try {
      const { placeId } = req.params

      const user = await User.findById(req.user.id).select('+favorites')
      await user.removeFavorite(placeId)

      res.status(200).json({
        success: true,
        message: 'Lugar eliminado de favoritos',
        data: { placeId }
      })
    } catch (error) {
      console.error('Error removing favorite:', error)
      res.status(500).json({
        success: false,
        message: 'Error al eliminar de favoritos',
        error: error.message
      })
    }
  }

  // Verificar si un lugar es favorito
  static async checkFavorite(req, res) {
    try {
      const { placeId } = req.params

      const user = await User.findById(req.user.id).select('+favorites')
      const isFavorite = user.isFavorite(placeId)

      res.status(200).json({
        success: true,
        data: { 
          placeId,
          isFavorite 
        }
      })
    } catch (error) {
      console.error('Error checking favorite:', error)
      res.status(500).json({
        success: false,
        message: 'Error al verificar favorito',
        error: error.message
      })
    }
  }

  // Verificar múltiples lugares
  static async checkMultipleFavorites(req, res) {
    try {
      const { placeIds } = req.body

      if (!Array.isArray(placeIds)) {
        return res.status(400).json({
          success: false,
          message: 'placeIds debe ser un array'
        })
      }

      const user = await User.findById(req.user.id).select('+favorites')
      
      const favorites = placeIds.reduce((acc, placeId) => {
        acc[placeId] = user.isFavorite(placeId)
        return acc
      }, {})

      res.status(200).json({
        success: true,
        data: favorites
      })
    } catch (error) {
      console.error('Error checking multiple favorites:', error)
      res.status(500).json({
        success: false,
        message: 'Error al verificar favoritos',
        error: error.message
      })
    }
  }

  // Obtener estadísticas de favoritos
  static async getFavoriteStats(req, res) {
    try {
      const user = await User.findById(req.user.id)
        .populate({
          path: 'favorites.place',
          select: 'type'
        })
        .lean()

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        })
      }

      const userFavorites = user.favorites || []

      const stats = {
        total: userFavorites.length,
        byType: {},
        recentlyAdded: userFavorites
          .sort((a, b) => {
            const dateA = a?.addedAt ? new Date(a.addedAt) : new Date(0)
            const dateB = b?.addedAt ? new Date(b.addedAt) : new Date(0)
            return dateB - dateA
          })
          .slice(0, 5)
          .map(fav => ({
            placeId: fav?.place?._id,
            addedAt: fav?.addedAt
          }))
      }

      // Contar por tipo
      userFavorites.forEach(fav => {
        if (fav && fav.place && fav.place.type) {
          const type = fav.place.type
          stats.byType[type] = (stats.byType[type] || 0) + 1
        }
      })

      res.status(200).json({
        success: true,
        data: stats
      })
    } catch (error) {
      console.error('Error getting favorite stats:', error)
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas de favoritos',
        error: error.message
      })
    }
  }

  // Sincronizar favoritos (útil para PWA offline)
  static async syncFavorites(req, res) {
    try {
      const { favorites } = req.body

      if (!Array.isArray(favorites)) {
        return res.status(400).json({
          success: false,
          message: 'favorites debe ser un array'
        })
      }

      const user = await User.findById(req.user.id).select('+favorites')
      
      // Limpiar favoritos actuales
      user.favorites = []

      // Agregar nuevos favoritos
      for (const placeId of favorites) {
        const place = await Place.findOne({ 
          _id: placeId, 
          status: 'active' 
        })
        if (place) {
          user.favorites.push({ place: placeId })
        }
      }

      await user.save()

      res.status(200).json({
        success: true,
        message: 'Favoritos sincronizados',
        data: {
          synced: user.favorites.length,
          requested: favorites.length
        }
      })
    } catch (error) {
      console.error('Error syncing favorites:', error)
      res.status(500).json({
        success: false,
        message: 'Error al sincronizar favoritos',
        error: error.message
      })
    }
  }
}

module.exports = FavoritesController