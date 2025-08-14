import { apiClient } from '../../../services/apiConfig'
import type { 
  Review, 
  PlaceReviewsResponse, 
  CreateReviewData, 
  UpdateReviewData, 
  UserReview,
  ReviewSearchParams 
} from '../types'

class ReviewsService {
  async getPlaceReviews(
    placeId: string, 
    params?: {
      page?: number
      limit?: number
      sort?: 'recent' | 'rating-high' | 'rating-low' | 'helpful'
    }
  ): Promise<PlaceReviewsResponse> {
    try {
      const searchParams = new URLSearchParams()
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.set(key, String(value))
          }
        })
      }

      const response = await apiClient.get<{ data: PlaceReviewsResponse }>(
        `/reviews/places/${placeId}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
      )
      return response.data
    } catch (error) {
      console.error('Error getting place reviews:', error)
      throw error
    }
  }

  async createReview(placeId: string, data: CreateReviewData): Promise<Review> {
    try {
      const response = await apiClient.post<{ data: Review }>(`/reviews/places/${placeId}`, data)
      return response.data
    } catch (error) {
      console.error('Error creating review:', error)
      throw error
    }
  }

  async getUserReviews(params?: ReviewSearchParams): Promise<{
    data: UserReview[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    try {
      const searchParams = new URLSearchParams()
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.set(key, String(value))
          }
        })
      }

      const response = await apiClient.get<{
        data: UserReview[]
        pagination: {
          page: number
          limit: number
          total: number
          totalPages: number
        }
      }>(`/reviews/user${searchParams.toString() ? `?${searchParams.toString()}` : ''}`)
      return response
    } catch (error) {
      console.error('Error getting user reviews:', error)
      throw error
    }
  }

  async updateReview(reviewId: string, data: UpdateReviewData): Promise<Review> {
    try {
      const response = await apiClient.put<{ data: Review }>(`/reviews/${reviewId}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating review:', error)
      throw error
    }
  }

  async deleteReview(reviewId: string): Promise<void> {
    try {
      await apiClient.delete(`/reviews/${reviewId}`)
    } catch (error) {
      console.error('Error deleting review:', error)
      throw error
    }
  }

  async voteReview(reviewId: string, vote: 'yes' | 'no'): Promise<{
    helpful: number
    userVote: string
  }> {
    try {
      const response = await apiClient.post<{ data: { helpful: number; userVote: string } }>(
        `/reviews/${reviewId}/vote`, 
        { vote }
      )
      return response.data
    } catch (error) {
      console.error('Error voting on review:', error)
      throw error
    }
  }

  async getReviewById(reviewId: string): Promise<Review> {
    try {
      const response = await apiClient.get<{ data: Review }>(`/reviews/${reviewId}`)
      return response.data
    } catch (error) {
      console.error('Error getting review by id:', error)
      throw error
    }
  }

  async reportReview(reviewId: string, reason: string): Promise<void> {
    try {
      await apiClient.post(`/reviews/${reviewId}/report`, { reason })
    } catch (error) {
      console.error('Error reporting review:', error)
      throw error
    }
  }
}

export const reviewsService = new ReviewsService()
