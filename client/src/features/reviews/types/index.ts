export interface Review {
  id: string
  userId: string
  userName: string
  placeId: string
  rating: number
  comment: string
  helpful: number
  images: string[]
  createdAt: string
  updatedAt?: string
  isHelpful?: boolean
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
}

export interface UserReview extends Review {
  placeName: string
  placeType: string
}

export interface PlaceReviewsResponse {
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

export interface CreateReviewData {
  placeId: string
  rating: number
  comment: string
  images?: string[]
}

export interface UpdateReviewData {
  rating?: number
  comment?: string
  images?: string[]
}

export interface ReviewFilter {
  rating?: number
  sortBy?: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful'
  status?: 'pending' | 'approved' | 'rejected'
}

export interface ReviewSearchParams {
  page?: number
  limit?: number
  sortBy?: string
  rating?: number
  userId?: string
  placeId?: string
}

export interface ReviewStats {
  avgRating: number
  totalReviews: number
  distribution: Record<string, number>
}

export interface ReviewState {
  reviews: Review[]
  userReviews: UserReview[]
  selectedReview: Review | null
  placeReviews: Record<string, Review[]>
  reviewStats: Record<string, ReviewStats>
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  filters: ReviewFilter
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
