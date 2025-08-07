import api from './apiConfig'

interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  helpful: number
  images: string[]
  createdAt: string
  isHelpful?: boolean
}

interface PlaceReviewsResponse {
  reviews: Review[]
  stats: {
    avgRating: number
    totalReviews: number
    distribution: Record<string, number>
  }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface CreateReviewData {
  rating: number
  comment: string
  images?: string[]
}

interface UpdateReviewData {
  rating?: number
  comment?: string
  images?: string[]
}

interface UserReview {
  id: string
  placeId: string
  placeName: string
  placeType: string
  rating: number
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  helpful: number
  images: string[]
  createdAt: string
}

class ReviewsService {
  // Obtener reseñas de un lugar
  async getPlaceReviews(
    placeId: string, 
    params?: {
      page?: number
      limit?: number
      sort?: 'recent' | 'rating-high' | 'rating-low' | 'helpful'
    }
  ): Promise<PlaceReviewsResponse> {
    try {
      const response = await api.get(`/api/v1/reviews/places/${placeId}`, { params })
      return response.data.data
    } catch (error) {
      console.error('Error obteniendo reseñas:', error)
      throw error
    }
  }

  // Crear nueva reseña
  async createReview(placeId: string, data: CreateReviewData): Promise<any> {
    try {
      const response = await api.post(`/api/v1/reviews/places/${placeId}`, data)
      return response.data
    } catch (error) {
      console.error('Error creando reseña:', error)
      throw error
    }
  }

  // Obtener mis reseñas
  async getUserReviews(params?: { page?: number; limit?: number }): Promise<{
    data: UserReview[]
    pagination: any
  }> {
    try {
      const response = await api.get('/api/v1/reviews/user', { params })
      return response.data
    } catch (error) {
      console.error('Error obteniendo reseñas del usuario:', error)
      throw error
    }
  }

  // Actualizar reseña propia
  async updateReview(reviewId: string, data: UpdateReviewData): Promise<any> {
    try {
      const response = await api.put(`/api/v1/reviews/${reviewId}`, data)
      return response.data
    } catch (error) {
      console.error('Error actualizando reseña:', error)
      throw error
    }
  }

  // Eliminar reseña propia
  async deleteReview(reviewId: string): Promise<any> {
    try {
      const response = await api.delete(`/api/v1/reviews/${reviewId}`)
      return response.data
    } catch (error) {
      console.error('Error eliminando reseña:', error)
      throw error
    }
  }

  // Votar si una reseña es útil
  async voteReview(reviewId: string, vote: 'yes' | 'no'): Promise<{
    helpful: number
    userVote: string
  }> {
    try {
      const response = await api.post(`/api/v1/reviews/${reviewId}/vote`, { vote })
      return response.data.data
    } catch (error) {
      console.error('Error votando reseña:', error)
      throw error
    }
  }
}

export const reviewsService = new ReviewsService()
export type { Review, PlaceReviewsResponse, CreateReviewData, UpdateReviewData, UserReview }
