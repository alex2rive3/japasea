import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
  fetchPlaceReviewsAsync,
  fetchUserReviewsAsync,
  createReviewAsync,
  updateReviewAsync,
  deleteReviewAsync,
  voteReviewAsync,
  fetchReviewByIdAsync,
  reportReviewAsync,
  setSelectedReview,
  setFilters,
  clearFilters,
  clearError,
  clearReviews,
  setPagination,
  selectReviews,
  selectUserReviews,
  selectSelectedReview,
  selectPlaceReviews,
  selectReviewStats,
  selectIsLoading,
  selectIsSubmitting,
  selectError,
  selectFilters,
  selectPagination
} from '../store/reviewsSlice'
import type { Review, CreateReviewData, UpdateReviewData, ReviewFilter, ReviewSearchParams } from '../types'

export const useReviews = () => {
  const dispatch = useAppDispatch()

  // Selectors
  const reviews = useAppSelector(selectReviews)
  const userReviews = useAppSelector(selectUserReviews)
  const selectedReview = useAppSelector(selectSelectedReview)
  const isLoading = useAppSelector(selectIsLoading)
  const isSubmitting = useAppSelector(selectIsSubmitting)
  const error = useAppSelector(selectError)
  const filters = useAppSelector(selectFilters)
  const pagination = useAppSelector(selectPagination)

  // Actions
  const fetchPlaceReviews = (placeId: string, params?: ReviewSearchParams) => 
    dispatch(fetchPlaceReviewsAsync({ placeId, params }))
  
  const fetchUserReviews = (params: ReviewSearchParams = {}) => 
    dispatch(fetchUserReviewsAsync(params))
  
  const createReview = (placeId: string, data: CreateReviewData) => 
    dispatch(createReviewAsync({ placeId, data }))
  
  const updateReview = (reviewId: string, data: UpdateReviewData) => 
    dispatch(updateReviewAsync({ reviewId, data }))
  
  const deleteReview = (reviewId: string) => 
    dispatch(deleteReviewAsync(reviewId))
  
  const voteReview = (reviewId: string, vote: 'yes' | 'no') => 
    dispatch(voteReviewAsync({ reviewId, vote }))
  
  const fetchReviewById = (reviewId: string) => 
    dispatch(fetchReviewByIdAsync(reviewId))
  
  const reportReview = (reviewId: string, reason: string) => 
    dispatch(reportReviewAsync({ reviewId, reason }))

  // Local actions
  const selectReview = (review: Review | null) => dispatch(setSelectedReview(review))
  const setReviewFilters = (filters: ReviewFilter) => dispatch(setFilters(filters))
  const clearReviewFilters = () => dispatch(clearFilters())
  const clearReviewError = () => dispatch(clearError())
  const clearAllReviews = () => dispatch(clearReviews())
  const setReviewPagination = (paginationData: { page?: number; limit?: number; total?: number; totalPages?: number }) => 
    dispatch(setPagination(paginationData))

  return {
    // State
    reviews,
    userReviews,
    selectedReview,
    isLoading,
    isSubmitting,
    error,
    filters,
    pagination,

    // Selector functions for components to use
    selectPlaceReviews,
    selectReviewStats,

    // Actions
    fetchPlaceReviews,
    fetchUserReviews,
    createReview,
    updateReview,
    deleteReview,
    voteReview,
    fetchReviewById,
    reportReview,

    // Local actions
    selectReview,
    setReviewFilters,
    clearReviewFilters,
    clearReviewError,
    clearAllReviews,
    setReviewPagination,
  }
}
