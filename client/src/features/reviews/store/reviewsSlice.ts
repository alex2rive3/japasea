import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { reviewsService } from '../services/reviewsService'
import type { RootState } from '../../../app/store'
import type { 
  Review, 
  UserReview,
  CreateReviewData,
  UpdateReviewData,
  ReviewFilter,
  ReviewSearchParams,
  ReviewState
} from '../types'

// Initial state
const initialState: ReviewState = {
  reviews: [],
  userReviews: [],
  selectedReview: null,
  placeReviews: {},
  reviewStats: {},
  isLoading: false,
  isSubmitting: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  }
}

// Async thunks
export const fetchPlaceReviewsAsync = createAsyncThunk(
  'reviews/fetchPlaceReviews',
  async ({ placeId, params }: { placeId: string; params?: ReviewSearchParams }, { rejectWithValue }) => {
    try {
      const response = await reviewsService.getPlaceReviews(placeId, params)
      return { placeId, response }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error fetching place reviews')
    }
  }
)

export const fetchUserReviewsAsync = createAsyncThunk(
  'reviews/fetchUserReviews',
  async (params: ReviewSearchParams = {}, { rejectWithValue }) => {
    try {
      return await reviewsService.getUserReviews(params)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error fetching user reviews')
    }
  }
)

export const createReviewAsync = createAsyncThunk(
  'reviews/createReview',
  async ({ placeId, data }: { placeId: string; data: CreateReviewData }, { rejectWithValue }) => {
    try {
      const review = await reviewsService.createReview(placeId, data)
      return { placeId, review }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error creating review')
    }
  }
)

export const updateReviewAsync = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, data }: { reviewId: string; data: UpdateReviewData }, { rejectWithValue }) => {
    try {
      return await reviewsService.updateReview(reviewId, data)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error updating review')
    }
  }
)

export const deleteReviewAsync = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      await reviewsService.deleteReview(reviewId)
      return reviewId
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error deleting review')
    }
  }
)

export const voteReviewAsync = createAsyncThunk(
  'reviews/voteReview',
  async ({ reviewId, vote }: { reviewId: string; vote: 'yes' | 'no' }, { rejectWithValue }) => {
    try {
      const result = await reviewsService.voteReview(reviewId, vote)
      return { reviewId, ...result }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error voting on review')
    }
  }
)

export const fetchReviewByIdAsync = createAsyncThunk(
  'reviews/fetchReviewById',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      return await reviewsService.getReviewById(reviewId)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error fetching review')
    }
  }
)

export const reportReviewAsync = createAsyncThunk(
  'reviews/reportReview',
  async ({ reviewId, reason }: { reviewId: string; reason: string }, { rejectWithValue }) => {
    try {
      await reviewsService.reportReview(reviewId, reason)
      return reviewId
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error reporting review')
    }
  }
)

// Slice
export const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setSelectedReview: (state, action: PayloadAction<Review | null>) => {
      state.selectedReview = action.payload
    },
    setFilters: (state, action: PayloadAction<ReviewFilter>) => {
      state.filters = action.payload
    },
    clearFilters: (state) => {
      state.filters = {}
    },
    clearError: (state) => {
      state.error = null
    },
    clearReviews: (state) => {
      state.reviews = []
      state.placeReviews = {}
    },
    setPagination: (state, action: PayloadAction<Partial<ReviewState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch place reviews
      .addCase(fetchPlaceReviewsAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPlaceReviewsAsync.fulfilled, (state, action) => {
        state.isLoading = false
        const { placeId, response } = action.payload
        state.placeReviews[placeId] = response.reviews
        state.reviewStats[placeId] = response.stats
        state.pagination = response.pagination
      })
      .addCase(fetchPlaceReviewsAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Fetch user reviews
      .addCase(fetchUserReviewsAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserReviewsAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.userReviews = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchUserReviewsAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Create review
      .addCase(createReviewAsync.pending, (state) => {
        state.isSubmitting = true
        state.error = null
      })
      .addCase(createReviewAsync.fulfilled, (state, action) => {
        state.isSubmitting = false
        const { placeId, review } = action.payload
        if (state.placeReviews[placeId]) {
          state.placeReviews[placeId].unshift(review)
        }
        state.userReviews.unshift(review as UserReview)
      })
      .addCase(createReviewAsync.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.payload as string
      })

      // Update review
      .addCase(updateReviewAsync.pending, (state) => {
        state.isSubmitting = true
        state.error = null
      })
      .addCase(updateReviewAsync.fulfilled, (state, action) => {
        state.isSubmitting = false
        const updatedReview = action.payload
        
        // Update in user reviews
        const userReviewIndex = state.userReviews.findIndex(r => r.id === updatedReview.id)
        if (userReviewIndex !== -1) {
          state.userReviews[userReviewIndex] = { ...state.userReviews[userReviewIndex], ...updatedReview }
        }

        // Update in place reviews
        Object.keys(state.placeReviews).forEach(placeId => {
          const reviewIndex = state.placeReviews[placeId].findIndex(r => r.id === updatedReview.id)
          if (reviewIndex !== -1) {
            state.placeReviews[placeId][reviewIndex] = updatedReview
          }
        })

        // Update selected review if it matches
        if (state.selectedReview?.id === updatedReview.id) {
          state.selectedReview = updatedReview
        }
      })
      .addCase(updateReviewAsync.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.payload as string
      })

      // Delete review
      .addCase(deleteReviewAsync.pending, (state) => {
        state.isSubmitting = true
        state.error = null
      })
      .addCase(deleteReviewAsync.fulfilled, (state, action) => {
        state.isSubmitting = false
        const reviewId = action.payload

        // Remove from user reviews
        state.userReviews = state.userReviews.filter(r => r.id !== reviewId)

        // Remove from place reviews
        Object.keys(state.placeReviews).forEach(placeId => {
          state.placeReviews[placeId] = state.placeReviews[placeId].filter(r => r.id !== reviewId)
        })

        // Clear selected review if it matches
        if (state.selectedReview?.id === reviewId) {
          state.selectedReview = null
        }
      })
      .addCase(deleteReviewAsync.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.payload as string
      })

      // Vote review
      .addCase(voteReviewAsync.fulfilled, (state, action) => {
        const { reviewId, helpful } = action.payload
        
        // Update in place reviews
        Object.keys(state.placeReviews).forEach(placeId => {
          const reviewIndex = state.placeReviews[placeId].findIndex(r => r.id === reviewId)
          if (reviewIndex !== -1) {
            state.placeReviews[placeId][reviewIndex].helpful = helpful
          }
        })

        // Update selected review if it matches
        if (state.selectedReview?.id === reviewId) {
          state.selectedReview.helpful = helpful
        }
      })

      // Fetch review by ID
      .addCase(fetchReviewByIdAsync.fulfilled, (state, action) => {
        state.selectedReview = action.payload
      })
  }
})

// Export actions
export const {
  setSelectedReview,
  setFilters,
  clearFilters,
  clearError,
  clearReviews,
  setPagination
} = reviewsSlice.actions

// Selectors
export const selectReviews = (state: RootState) => state.reviews.reviews
export const selectUserReviews = (state: RootState) => state.reviews.userReviews
export const selectSelectedReview = (state: RootState) => state.reviews.selectedReview
export const selectPlaceReviews = (placeId: string) => (state: RootState) => 
  state.reviews.placeReviews[placeId] || []
export const selectReviewStats = (placeId: string) => (state: RootState) => 
  state.reviews.reviewStats[placeId]
export const selectIsLoading = (state: RootState) => state.reviews.isLoading
export const selectIsSubmitting = (state: RootState) => state.reviews.isSubmitting
export const selectError = (state: RootState) => state.reviews.error
export const selectFilters = (state: RootState) => state.reviews.filters
export const selectPagination = (state: RootState) => state.reviews.pagination

export default reviewsSlice.reducer
