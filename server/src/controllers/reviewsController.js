const Review = require('../models/reviewModel')
const Place = require('../models/placeModel')
const Audit = require('../models/auditModel')

class ReviewsController {
  // Obtener reseñas de un lugar
  static async getPlaceReviews(req, res) {
    try {
      const { placeId } = req.params
      const { page = 1, limit = 10, sort = 'recent' } = req.query

      // Verificar que el lugar existe
      const place = await Place.findById(placeId)
      if (!place) {
        return res.status(404).json({
          success: false,
          message: 'Lugar no encontrado'
        })
      }

      // Configurar ordenamiento
      let sortOption = { createdAt: -1 } // Por defecto, más recientes
      if (sort === 'rating-high') sortOption = { rating: -1, createdAt: -1 }
      if (sort === 'rating-low') sortOption = { rating: 1, createdAt: -1 }
      if (sort === 'helpful') sortOption = { helpful: -1, createdAt: -1 }

      const skip = (parseInt(page) - 1) * parseInt(limit)

      // Obtener solo reseñas aprobadas
      const [reviews, total] = await Promise.all([
        Review.find({ placeId, status: 'approved' })
          .populate('userId', 'name')
          .sort(sortOption)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Review.countDocuments({ placeId, status: 'approved' })
      ])

      // Calcular estadísticas
      const stats = await Review.aggregate([
        { $match: { placeId: place._id, status: 'approved' } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
            distribution: {
              $push: '$rating'
            }
          }
        }
      ])

      // Calcular distribución de ratings
      let ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      if (stats.length > 0 && stats[0].distribution) {
        stats[0].distribution.forEach(rating => {
          ratingDistribution[rating]++
        })
      }

      return res.status(200).json({
        success: true,
        data: {
          reviews: reviews.map(review => ({
            id: review._id,
            userId: review.userId._id,
            userName: review.userId.name,
            rating: review.rating,
            comment: review.comment,
            helpful: review.helpful,
            images: review.images,
            createdAt: review.createdAt,
            isHelpful: req.user ? review.helpfulVotes.some(vote => 
              vote.userId.toString() === req.user.id && vote.vote === 'yes'
            ) : false
          })),
          stats: {
            avgRating: stats[0]?.avgRating || 0,
            totalReviews: total,
            distribution: ratingDistribution
          },
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit))
          }
        }
      })
    } catch (error) {
      console.error('Error obteniendo reseñas:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener las reseñas' 
      })
    }
  }

  // Crear nueva reseña
  static async createReview(req, res) {
    try {
      const { placeId } = req.params
      const { rating, comment, images = [] } = req.body
      const userId = req.user.id

      // Verificar que el lugar existe
      const place = await Place.findById(placeId)
      if (!place) {
        return res.status(404).json({
          success: false,
          message: 'Lugar no encontrado'
        })
      }

      // Verificar si el usuario ya tiene una reseña para este lugar
      const existingReview = await Review.findOne({ userId, placeId })
      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: 'Ya has dejado una reseña para este lugar'
        })
      }

      // Crear la reseña
      const review = new Review({
        userId,
        placeId,
        rating,
        comment,
        images,
        status: 'pending', // Las reseñas requieren aprobación
        metadata: {
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        }
      })

      await review.save()

      // Registrar en auditoría
      await Audit.log({
        userId,
        action: 'create',
        resource: 'review',
        resourceId: review._id,
        description: `Nueva reseña creada para ${place.name}`,
        metadata: {
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        }
      })

      return res.status(201).json({
        success: true,
        data: review,
        message: 'Reseña creada exitosamente. Será visible después de ser aprobada.'
      })
    } catch (error) {
      console.error('Error creando reseña:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error al crear la reseña' 
      })
    }
  }

  // Actualizar reseña propia
  static async updateReview(req, res) {
    try {
      const { reviewId } = req.params
      const { rating, comment, images } = req.body
      const userId = req.user.id

      const review = await Review.findOne({ _id: reviewId, userId })
      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Reseña no encontrada o no tienes permisos para editarla'
        })
      }

      // Solo se pueden editar reseñas pendientes o rechazadas
      if (review.status === 'approved') {
        return res.status(400).json({
          success: false,
          message: 'No puedes editar una reseña ya aprobada'
        })
      }

      // Actualizar campos
      if (rating !== undefined) review.rating = rating
      if (comment !== undefined) review.comment = comment
      if (images !== undefined) review.images = images
      
      // Resetear estado a pendiente
      review.status = 'pending'
      review.rejectionReason = null

      await review.save()

      return res.status(200).json({
        success: true,
        data: review,
        message: 'Reseña actualizada. Será visible después de ser aprobada.'
      })
    } catch (error) {
      console.error('Error actualizando reseña:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error al actualizar la reseña' 
      })
    }
  }

  // Eliminar reseña propia
  static async deleteReview(req, res) {
    try {
      const { reviewId } = req.params
      const userId = req.user.id

      const review = await Review.findOneAndDelete({ _id: reviewId, userId })
      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Reseña no encontrada o no tienes permisos para eliminarla'
        })
      }

      // Registrar en auditoría
      await Audit.log({
        userId,
        action: 'delete',
        resource: 'review',
        resourceId: reviewId,
        description: 'Reseña eliminada por el usuario',
        previousData: review.toObject(),
        metadata: {
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        }
      })

      return res.status(200).json({
        success: true,
        message: 'Reseña eliminada exitosamente'
      })
    } catch (error) {
      console.error('Error eliminando reseña:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error al eliminar la reseña' 
      })
    }
  }

  // Marcar reseña como útil/no útil
  static async voteReview(req, res) {
    try {
      const { reviewId } = req.params
      const { vote } = req.body // 'yes' o 'no'
      const userId = req.user.id

      if (!['yes', 'no'].includes(vote)) {
        return res.status(400).json({
          success: false,
          message: 'Voto inválido. Debe ser "yes" o "no"'
        })
      }

      const review = await Review.findById(reviewId)
      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Reseña no encontrada'
        })
      }

      // No se puede votar por reseñas propias
      if (review.userId.toString() === userId) {
        return res.status(400).json({
          success: false,
          message: 'No puedes votar por tu propia reseña'
        })
      }

      // Buscar voto existente
      const existingVoteIndex = review.helpfulVotes.findIndex(
        v => v.userId.toString() === userId
      )

      if (existingVoteIndex !== -1) {
        // Actualizar voto existente
        review.helpfulVotes[existingVoteIndex].vote = vote
      } else {
        // Agregar nuevo voto
        review.helpfulVotes.push({ userId, vote })
      }

      // Recalcular contador de útil
      review.helpful = review.helpfulVotes.filter(v => v.vote === 'yes').length

      await review.save()

      return res.status(200).json({
        success: true,
        data: {
          helpful: review.helpful,
          userVote: vote
        },
        message: 'Voto registrado exitosamente'
      })
    } catch (error) {
      console.error('Error votando reseña:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error al votar la reseña' 
      })
    }
  }

  // Obtener reseñas del usuario actual
  static async getUserReviews(req, res) {
    try {
      const userId = req.user.id
      const { page = 1, limit = 10 } = req.query

      const skip = (parseInt(page) - 1) * parseInt(limit)

      const [reviews, total] = await Promise.all([
        Review.find({ userId })
          .populate('placeId', 'name type')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Review.countDocuments({ userId })
      ])

      return res.status(200).json({
        success: true,
        data: reviews.map(review => ({
          id: review._id,
          placeId: review.placeId._id,
          placeName: review.placeId.name,
          placeType: review.placeId.type,
          rating: review.rating,
          comment: review.comment,
          status: review.status,
          rejectionReason: review.rejectionReason,
          helpful: review.helpful,
          images: review.images,
          createdAt: review.createdAt
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      })
    } catch (error) {
      console.error('Error obteniendo reseñas del usuario:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener tus reseñas' 
      })
    }
  }
}

module.exports = ReviewsController
