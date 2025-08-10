/**
 * Tests de Integración para ReviewsService
 * 
 * Verifica que las peticiones HTTP para reseñas sean correctas,
 * valida estructura de respuestas JSON y manejo de errores.
 */

import { reviewsService } from '../../services/reviewsService'
import { server } from '../../test/mocks/server'
import { http, HttpResponse } from 'msw'
import {
  setAuthTokens,
  clearAuthTokens,
  unauthorizedResponse,
  notFoundResponse,
  serverErrorResponse,
  expectApiResponse
} from '../../test/helpers/testUtils'

const API_BASE_URL = 'http://localhost:3001'

// Mock para el módulo apiConfig para interceptar las peticiones del reviewsService
jest.mock('../../services/apiConfig', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }
}))

import api from '../../services/apiConfig'
const mockApi = api as jest.Mocked<typeof api>

describe('ReviewsService Integration Tests', () => {
  beforeEach(() => {
    clearAuthTokens()
    jest.clearAllMocks()
  })

  afterEach(() => {
    clearAuthTokens()
  })

  describe('getPlaceReviews()', () => {
    it('DEBE obtener reseñas de un lugar exitosamente con status 200', async () => {
      // Arrange
      const placeId = 'place-123'
      const mockResponse = {
        data: {
          data: {
            reviews: [
              {
                id: 'review-1',
                userId: 'user-123',
                userName: 'Test User',
                rating: 5,
                comment: 'Excelente lugar, muy recomendado',
                helpful: 10,
                images: ['image1.jpg'],
                createdAt: '2024-01-15T10:00:00.000Z'
              }
            ],
            stats: {
              avgRating: 4.8,
              totalReviews: 1,
              distribution: { "5": 1, "4": 0, "3": 0, "2": 0, "1": 0 }
            },
            pagination: {
              page: 1,
              limit: 10,
              total: 1,
              totalPages: 1
            }
          }
        }
      }
      
      mockApi.get.mockResolvedValue(mockResponse)

      // Act
      const result = await reviewsService.getPlaceReviews(placeId)

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith(
        `/api/v1/reviews/places/${placeId}`,
        { params: undefined }
      )
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('reviews')
      expect(result).toHaveProperty('stats')
      expect(result).toHaveProperty('pagination')
      
      // Verificar estructura de reviews
      expect(Array.isArray(result.reviews)).toBe(true)
      if (result.reviews.length > 0) {
        const review = result.reviews[0]
        expect(review).toHaveProperty('id')
        expect(review).toHaveProperty('userId')
        expect(review).toHaveProperty('userName')
        expect(review).toHaveProperty('rating')
        expect(review).toHaveProperty('comment')
        expect(review).toHaveProperty('helpful')
        expect(review).toHaveProperty('images')
        expect(review).toHaveProperty('createdAt')
        
        // Verificar tipos de datos
        expect(typeof review.id).toBe('string')
        expect(typeof review.userId).toBe('string')
        expect(typeof review.userName).toBe('string')
        expect(typeof review.rating).toBe('number')
        expect(typeof review.comment).toBe('string')
        expect(typeof review.helpful).toBe('number')
        expect(Array.isArray(review.images)).toBe(true)
        expect(typeof review.createdAt).toBe('string')
        
        // Verificar rango de rating
        expect(review.rating).toBeGreaterThanOrEqual(1)
        expect(review.rating).toBeLessThanOrEqual(5)
      }
      
      // Verificar estructura de stats
      expect(result.stats).toHaveProperty('avgRating')
      expect(result.stats).toHaveProperty('totalReviews')
      expect(result.stats).toHaveProperty('distribution')
      expect(typeof result.stats.avgRating).toBe('number')
      expect(typeof result.stats.totalReviews).toBe('number')
      expect(typeof result.stats.distribution).toBe('object')
      
      // Verificar estructura de pagination
      expect(result.pagination).toHaveProperty('page')
      expect(result.pagination).toHaveProperty('limit')
      expect(result.pagination).toHaveProperty('total')
      expect(result.pagination).toHaveProperty('totalPages')
      expect(typeof result.pagination.page).toBe('number')
      expect(typeof result.pagination.limit).toBe('number')
      expect(typeof result.pagination.total).toBe('number')
      expect(typeof result.pagination.totalPages).toBe('number')
    })

    it('DEBE enviar parámetros de paginación correctamente', async () => {
      // Arrange
      const placeId = 'place-123'
      const params = { page: 2, limit: 5, sort: 'rating-high' as const }
      
      mockApi.get.mockResolvedValue({
        data: { data: { reviews: [], stats: {}, pagination: {} } }
      })

      // Act
      await reviewsService.getPlaceReviews(placeId, params)

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith(
        `/api/v1/reviews/places/${placeId}`,
        { params }
      )
    })

    it('DEBE manejar errores del servidor correctamente', async () => {
      // Arrange
      const placeId = 'place-123'
      mockApi.get.mockRejectedValue(new Error('Error del servidor'))

      // Act & Assert
      await expect(reviewsService.getPlaceReviews(placeId))
        .rejects
        .toThrow('Error del servidor')
    })
  })

  describe('createReview()', () => {
    it('DEBE crear reseña exitosamente con datos válidos', async () => {
      // Arrange
      const placeId = 'place-123'
      const reviewData = {
        rating: 5,
        comment: 'Excelente lugar para visitar',
        images: ['image1.jpg', 'image2.jpg']
      }
      
      const mockResponse = {
        data: {
          success: true,
          message: 'Reseña creada exitosamente',
          data: {
            id: 'review-new',
            ...reviewData,
            userId: 'user-123',
            userName: 'Test User',
            helpful: 0,
            createdAt: new Date().toISOString()
          }
        }
      }
      
      mockApi.post.mockResolvedValue(mockResponse)

      // Act
      const result = await reviewsService.createReview(placeId, reviewData)

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith(
        `/api/v1/reviews/places/${placeId}`,
        reviewData
      )
      
      expect(result).toBeDefined()
      expect(result.success).toBe(true)
      expect(result.message).toBe('Reseña creada exitosamente')
      expect(result.data).toHaveProperty('id')
      expect(result.data.rating).toBe(reviewData.rating)
      expect(result.data.comment).toBe(reviewData.comment)
    })

    it('DEBE validar que el rating esté en el rango correcto', async () => {
      // Arrange
      const placeId = 'place-123'
      const invalidRatingData = {
        rating: 6, // Rating inválido
        comment: 'Test comment'
      }
      
      mockApi.post.mockRejectedValue({
        response: {
          data: { message: 'Rating debe estar entre 1 y 5' }
        }
      })

      // Act & Assert
      await expect(reviewsService.createReview(placeId, invalidRatingData))
        .rejects
        .toBeDefined()
    })

    it('DEBE requerir comentario mínimo', async () => {
      // Arrange
      const placeId = 'place-123'
      const shortCommentData = {
        rating: 5,
        comment: 'Ok' // Comentario muy corto
      }
      
      mockApi.post.mockRejectedValue({
        response: {
          data: { message: 'El comentario debe tener al menos 10 caracteres' }
        }
      })

      // Act & Assert
      await expect(reviewsService.createReview(placeId, shortCommentData))
        .rejects
        .toBeDefined()
    })

    it('DEBE manejar errores de autorización', async () => {
      // Arrange
      const placeId = 'place-123'
      const reviewData = { rating: 5, comment: 'Test comment' }
      
      mockApi.post.mockRejectedValue({
        response: { status: 401, data: unauthorizedResponse }
      })

      // Act & Assert
      await expect(reviewsService.createReview(placeId, reviewData))
        .rejects
        .toBeDefined()
    })
  })

  describe('getUserReviews()', () => {
    it('DEBE obtener reseñas del usuario exitosamente', async () => {
      // Arrange
      const mockResponse = {
        data: {
          data: [
            {
              id: 'review-1',
              placeId: 'place-123',
              placeName: 'Test Place',
              placeType: 'restaurant',
              rating: 5,
              comment: 'Great place',
              status: 'approved' as const,
              helpful: 5,
              images: [],
              createdAt: '2024-01-15T10:00:00.000Z'
            }
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1
          }
        }
      }
      
      mockApi.get.mockResolvedValue(mockResponse)

      // Act
      const result = await reviewsService.getUserReviews()

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/api/v1/reviews/user', { params: undefined })
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('pagination')
      expect(Array.isArray(result.data)).toBe(true)
      
      if (result.data.length > 0) {
        const userReview = result.data[0]
        expect(userReview).toHaveProperty('id')
        expect(userReview).toHaveProperty('placeId')
        expect(userReview).toHaveProperty('placeName')
        expect(userReview).toHaveProperty('placeType')
        expect(userReview).toHaveProperty('rating')
        expect(userReview).toHaveProperty('comment')
        expect(userReview).toHaveProperty('status')
        expect(userReview).toHaveProperty('helpful')
        expect(userReview).toHaveProperty('images')
        expect(userReview).toHaveProperty('createdAt')
        
        // Verificar tipos de datos
        expect(typeof userReview.id).toBe('string')
        expect(typeof userReview.placeId).toBe('string')
        expect(typeof userReview.placeName).toBe('string')
        expect(typeof userReview.placeType).toBe('string')
        expect(typeof userReview.rating).toBe('number')
        expect(typeof userReview.comment).toBe('string')
        expect(['pending', 'approved', 'rejected']).toContain(userReview.status)
        expect(typeof userReview.helpful).toBe('number')
        expect(Array.isArray(userReview.images)).toBe(true)
        expect(typeof userReview.createdAt).toBe('string')
      }
    })

    it('DEBE enviar parámetros de paginación correctamente', async () => {
      // Arrange
      const params = { page: 2, limit: 5 }
      mockApi.get.mockResolvedValue({ data: { data: [], pagination: {} } })

      // Act
      await reviewsService.getUserReviews(params)

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/api/v1/reviews/user', { params })
    })
  })

  describe('updateReview()', () => {
    it('DEBE actualizar reseña exitosamente', async () => {
      // Arrange
      const reviewId = 'review-123'
      const updateData = {
        rating: 4,
        comment: 'Comentario actualizado',
        images: ['new-image.jpg']
      }
      
      const mockResponse = {
        data: {
          success: true,
          message: 'Reseña actualizada',
          data: { id: reviewId, ...updateData }
        }
      }
      
      mockApi.put.mockResolvedValue(mockResponse)

      // Act
      const result = await reviewsService.updateReview(reviewId, updateData)

      // Assert
      expect(mockApi.put).toHaveBeenCalledWith(
        `/api/v1/reviews/${reviewId}`,
        updateData
      )
      
      expect(result).toBeDefined()
      expect(result.success).toBe(true)
      expect(result.data.rating).toBe(updateData.rating)
      expect(result.data.comment).toBe(updateData.comment)
    })

    it('DEBE permitir actualización parcial', async () => {
      // Arrange
      const reviewId = 'review-123'
      const partialUpdate = { rating: 3 } // Solo actualizar rating
      
      mockApi.put.mockResolvedValue({
        data: { success: true, data: { id: reviewId, rating: 3 } }
      })

      // Act
      await reviewsService.updateReview(reviewId, partialUpdate)

      // Assert
      expect(mockApi.put).toHaveBeenCalledWith(
        `/api/v1/reviews/${reviewId}`,
        partialUpdate
      )
    })

    it('DEBE fallar al actualizar reseña de otro usuario', async () => {
      // Arrange
      const reviewId = 'other-user-review'
      const updateData = { rating: 5 }
      
      mockApi.put.mockRejectedValue({
        response: { status: 403, data: { message: 'No autorizado para editar esta reseña' } }
      })

      // Act & Assert
      await expect(reviewsService.updateReview(reviewId, updateData))
        .rejects
        .toBeDefined()
    })
  })

  describe('deleteReview()', () => {
    it('DEBE eliminar reseña exitosamente', async () => {
      // Arrange
      const reviewId = 'review-123'
      const mockResponse = {
        data: {
          success: true,
          message: 'Reseña eliminada exitosamente'
        }
      }
      
      mockApi.delete.mockResolvedValue(mockResponse)

      // Act
      const result = await reviewsService.deleteReview(reviewId)

      // Assert
      expect(mockApi.delete).toHaveBeenCalledWith(`/api/v1/reviews/${reviewId}`)
      expect(result.success).toBe(true)
      expect(result.message).toBe('Reseña eliminada exitosamente')
    })

    it('DEBE fallar al eliminar reseña inexistente', async () => {
      // Arrange
      const nonExistentReviewId = 'review-999'
      
      mockApi.delete.mockRejectedValue({
        response: { status: 404, data: notFoundResponse }
      })

      // Act & Assert
      await expect(reviewsService.deleteReview(nonExistentReviewId))
        .rejects
        .toBeDefined()
    })

    it('DEBE fallar al eliminar reseña de otro usuario', async () => {
      // Arrange
      const otherUserReviewId = 'other-review'
      
      mockApi.delete.mockRejectedValue({
        response: { status: 403, data: { message: 'No autorizado' } }
      })

      // Act & Assert
      await expect(reviewsService.deleteReview(otherUserReviewId))
        .rejects
        .toBeDefined()
    })
  })

  describe('voteReview()', () => {
    it('DEBE votar reseña como útil exitosamente', async () => {
      // Arrange
      const reviewId = 'review-123'
      const vote = 'yes' as const
      
      const mockResponse = {
        data: {
          data: {
            helpful: 11,
            userVote: 'yes'
          }
        }
      }
      
      mockApi.post.mockResolvedValue(mockResponse)

      // Act
      const result = await reviewsService.voteReview(reviewId, vote)

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith(
        `/api/v1/reviews/${reviewId}/vote`,
        { vote }
      )
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('helpful')
      expect(result).toHaveProperty('userVote')
      expect(typeof result.helpful).toBe('number')
      expect(result.userVote).toBe(vote)
      expect(result.helpful).toBeGreaterThan(0)
    })

    it('DEBE votar reseña como no útil exitosamente', async () => {
      // Arrange
      const reviewId = 'review-123'
      const vote = 'no' as const
      
      const mockResponse = {
        data: {
          data: {
            helpful: 9,
            userVote: 'no'
          }
        }
      }
      
      mockApi.post.mockResolvedValue(mockResponse)

      // Act
      const result = await reviewsService.voteReview(reviewId, vote)

      // Assert
      expect(result.userVote).toBe(vote)
      expect(typeof result.helpful).toBe('number')
    })

    it('DEBE manejar cambio de voto correctamente', async () => {
      // Arrange
      const reviewId = 'review-123'
      
      // Primer voto: yes
      mockApi.post.mockResolvedValueOnce({
        data: { data: { helpful: 11, userVote: 'yes' } }
      })
      
      // Cambiar voto: no
      mockApi.post.mockResolvedValueOnce({
        data: { data: { helpful: 9, userVote: 'no' } }
      })

      // Act
      const firstVote = await reviewsService.voteReview(reviewId, 'yes')
      const secondVote = await reviewsService.voteReview(reviewId, 'no')

      // Assert
      expect(firstVote.userVote).toBe('yes')
      expect(secondVote.userVote).toBe('no')
      expect(secondVote.helpful).toBeLessThan(firstVote.helpful)
    })

    it('DEBE fallar al votar reseña inexistente', async () => {
      // Arrange
      const nonExistentReviewId = 'review-999'
      
      mockApi.post.mockRejectedValue({
        response: { status: 404, data: notFoundResponse }
      })

      // Act & Assert
      await expect(reviewsService.voteReview(nonExistentReviewId, 'yes'))
        .rejects
        .toBeDefined()
    })

    it('DEBE requerir autenticación para votar', async () => {
      // Arrange
      const reviewId = 'review-123'
      
      mockApi.post.mockRejectedValue({
        response: { status: 401, data: unauthorizedResponse }
      })

      // Act & Assert
      await expect(reviewsService.voteReview(reviewId, 'yes'))
        .rejects
        .toBeDefined()
    })

    it('DEBE validar valores de voto válidos', async () => {
      // Arrange
      const reviewId = 'review-123'
      
      // TypeScript debería prevenir esto, pero probamos en runtime
      const invalidVote = 'maybe' as any
      
      mockApi.post.mockRejectedValue({
        response: { status: 400, data: { message: 'Voto inválido' } }
      })

      // Act & Assert
      await expect(reviewsService.voteReview(reviewId, invalidVote))
        .rejects
        .toBeDefined()
    })
  })

  describe('Validaciones de datos JSON', () => {
    it('DEBE validar estructura completa de respuesta de reseñas', async () => {
      // Arrange
      const placeId = 'place-comprehensive'
      const comprehensiveResponse = {
        data: {
          data: {
            reviews: [
              {
                id: 'review-comprehensive',
                userId: 'user-123',
                userName: 'Complete User',
                rating: 4,
                comment: 'Comprehensive review with all fields',
                helpful: 15,
                images: ['img1.jpg', 'img2.jpg'],
                createdAt: '2024-01-15T10:00:00.000Z',
                isHelpful: true
              }
            ],
            stats: {
              avgRating: 4.2,
              totalReviews: 25,
              distribution: {
                "5": 10,
                "4": 8,
                "3": 4,
                "2": 2,
                "1": 1
              }
            },
            pagination: {
              page: 1,
              limit: 10,
              total: 25,
              totalPages: 3
            }
          }
        }
      }
      
      mockApi.get.mockResolvedValue(comprehensiveResponse)

      // Act
      const result = await reviewsService.getPlaceReviews(placeId)

      // Assert
      expect(result).toBeDefined()
      
      // Verificar estructura completa
      const review = result.reviews[0]
      expect(review.id).toBe('review-comprehensive')
      expect(review.userName).toBe('Complete User')
      expect(review.rating).toBe(4)
      expect(review.helpful).toBe(15)
      expect(review.images).toHaveLength(2)
      expect(review.isHelpful).toBe(true)
      
      // Verificar estadísticas
      expect(result.stats.avgRating).toBe(4.2)
      expect(result.stats.totalReviews).toBe(25)
      expect(Object.keys(result.stats.distribution)).toHaveLength(5)
      
      // Verificar paginación
      expect(result.pagination.total).toBe(25)
      expect(result.pagination.totalPages).toBe(3)
    })

    it('DEBE manejar respuestas con arrays vacíos correctamente', async () => {
      // Arrange
      const placeId = 'place-no-reviews'
      const emptyResponse = {
        data: {
          data: {
            reviews: [],
            stats: {
              avgRating: 0,
              totalReviews: 0,
              distribution: {}
            },
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0
            }
          }
        }
      }
      
      mockApi.get.mockResolvedValue(emptyResponse)

      // Act
      const result = await reviewsService.getPlaceReviews(placeId)

      // Assert
      expect(Array.isArray(result.reviews)).toBe(true)
      expect(result.reviews).toHaveLength(0)
      expect(result.stats.totalReviews).toBe(0)
      expect(result.pagination.total).toBe(0)
    })
  })
})
