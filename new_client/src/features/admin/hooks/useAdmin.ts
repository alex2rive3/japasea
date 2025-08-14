import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import {
  getDashboardStats,
  getRecentActivity,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  suspendUser,
  unsuspendUser,
  getPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
  approvePlace,
  rejectPlace,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  approveReview,
  rejectReview,
  bulkApproveReviews,
  bulkRejectReviews,
  clearAdminError,
  resetAdminState,
  setSelectedUser,
  setSelectedPlace,
  setSelectedReview,
  selectAdminStats,
  selectAdminUsers,
  selectAdminPlaces,
  selectAdminReviews,
  selectAdminActivities,
  selectAdminLoading,
  selectAdminError,
  selectSelectedUser,
  selectSelectedPlace,
  selectSelectedReview,
  selectAdminState,
  selectPendingReviews,
  selectPendingPlaces
} from '../store/adminSlice';
import type { 
  GetUsersRequest,
  GetPlacesRequest,
  GetReviewsRequest,
  UpdateUserRequest,
  UpdatePlaceRequest,
  UpdateReviewRequest,
  CreatePlaceRequest,
  UserManagement,
  PlaceManagement,
  ReviewManagement
} from '../types';

export const useAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
  const stats = useSelector(selectAdminStats);
  const users = useSelector(selectAdminUsers);
  const places = useSelector(selectAdminPlaces);
  const reviews = useSelector(selectAdminReviews);
  const activities = useSelector(selectAdminActivities);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);
  const selectedUser = useSelector(selectSelectedUser);
  const selectedPlace = useSelector(selectSelectedPlace);
  const selectedReview = useSelector(selectSelectedReview);
  const adminState = useSelector(selectAdminState);
  const pendingReviews = useSelector(selectPendingReviews);
  const pendingPlaces = useSelector(selectPendingPlaces);

  // Load dashboard data on mount
  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getRecentActivity(20));
  }, [dispatch]);

  // Dashboard actions
  const refreshStats = useCallback(() => {
    return dispatch(getDashboardStats());
  }, [dispatch]);

  const refreshActivity = useCallback((limit: number = 20) => {
    return dispatch(getRecentActivity(limit));
  }, [dispatch]);

  // User management actions
  const fetchUsers = useCallback((params: GetUsersRequest = {}) => {
    return dispatch(getUsers(params));
  }, [dispatch]);

  const fetchUser = useCallback((userId: string) => {
    return dispatch(getUser(userId));
  }, [dispatch]);

  const modifyUser = useCallback((data: UpdateUserRequest) => {
    return dispatch(updateUser(data));
  }, [dispatch]);

  const removeUser = useCallback((userId: string) => {
    return dispatch(deleteUser(userId));
  }, [dispatch]);

  const suspendUserAccount = useCallback((userId: string, reason?: string) => {
    return dispatch(suspendUser({ userId, reason }));
  }, [dispatch]);

  const unsuspendUserAccount = useCallback((userId: string) => {
    return dispatch(unsuspendUser(userId));
  }, [dispatch]);

  // Place management actions
  const fetchPlaces = useCallback((params: GetPlacesRequest = {}) => {
    return dispatch(getPlaces(params));
  }, [dispatch]);

  const fetchPlace = useCallback((placeId: string) => {
    return dispatch(getPlace(placeId));
  }, [dispatch]);

  const addPlace = useCallback((data: CreatePlaceRequest) => {
    return dispatch(createPlace(data));
  }, [dispatch]);

  const modifyPlace = useCallback((data: UpdatePlaceRequest) => {
    return dispatch(updatePlace(data));
  }, [dispatch]);

  const removePlace = useCallback((placeId: string) => {
    return dispatch(deletePlace(placeId));
  }, [dispatch]);

  const approvePlaceSubmission = useCallback((placeId: string) => {
    return dispatch(approvePlace(placeId));
  }, [dispatch]);

  const rejectPlaceSubmission = useCallback((placeId: string, reason?: string) => {
    return dispatch(rejectPlace({ placeId, reason }));
  }, [dispatch]);

  // Review management actions
  const fetchReviews = useCallback((params: GetReviewsRequest = {}) => {
    return dispatch(getReviews(params));
  }, [dispatch]);

  const fetchReview = useCallback((reviewId: string) => {
    return dispatch(getReview(reviewId));
  }, [dispatch]);

  const modifyReview = useCallback((data: UpdateReviewRequest) => {
    return dispatch(updateReview(data));
  }, [dispatch]);

  const removeReview = useCallback((reviewId: string) => {
    return dispatch(deleteReview(reviewId));
  }, [dispatch]);

  const approveReviewSubmission = useCallback((reviewId: string) => {
    return dispatch(approveReview(reviewId));
  }, [dispatch]);

  const rejectReviewSubmission = useCallback((reviewId: string, reason?: string) => {
    return dispatch(rejectReview({ reviewId, reason }));
  }, [dispatch]);

  const approveMultipleReviews = useCallback((reviewIds: string[]) => {
    return dispatch(bulkApproveReviews(reviewIds));
  }, [dispatch]);

  const rejectMultipleReviews = useCallback((reviewIds: string[], reason?: string) => {
    return dispatch(bulkRejectReviews({ reviewIds, reason }));
  }, [dispatch]);

  // Selection actions
  const selectUser = useCallback((user: UserManagement | null) => {
    dispatch(setSelectedUser(user));
  }, [dispatch]);

  const selectPlace = useCallback((place: PlaceManagement | null) => {
    dispatch(setSelectedPlace(place));
  }, [dispatch]);

  const selectReview = useCallback((review: ReviewManagement | null) => {
    dispatch(setSelectedReview(review));
  }, [dispatch]);

  // Utility actions
  const clearError = useCallback(() => {
    dispatch(clearAdminError());
  }, [dispatch]);

  const resetState = useCallback(() => {
    dispatch(resetAdminState());
  }, [dispatch]);

  // Convenience methods
  const getPendingItems = useCallback(() => {
    return {
      reviews: pendingReviews,
      places: pendingPlaces,
      total: pendingReviews.length + pendingPlaces.length
    };
  }, [pendingReviews, pendingPlaces]);

  const refreshAllData = useCallback(async () => {
    try {
      await Promise.all([
        dispatch(getDashboardStats()),
        dispatch(getUsers({})),
        dispatch(getPlaces({})),
        dispatch(getReviews({})),
        dispatch(getRecentActivity(20))
      ]);
    } catch (error) {
      console.error('Error refreshing admin data:', error);
    }
  }, [dispatch]);

  return {
    // State
    stats,
    users,
    places,
    reviews,
    activities,
    loading,
    error,
    selectedUser,
    selectedPlace,
    selectedReview,
    adminState,
    pendingReviews,
    pendingPlaces,
    
    // Dashboard actions
    refreshStats,
    refreshActivity,
    
    // User management
    fetchUsers,
    fetchUser,
    modifyUser,
    removeUser,
    suspendUserAccount,
    unsuspendUserAccount,
    
    // Place management
    fetchPlaces,
    fetchPlace,
    addPlace,
    modifyPlace,
    removePlace,
    approvePlaceSubmission,
    rejectPlaceSubmission,
    
    // Review management
    fetchReviews,
    fetchReview,
    modifyReview,
    removeReview,
    approveReviewSubmission,
    rejectReviewSubmission,
    approveMultipleReviews,
    rejectMultipleReviews,
    
    // Selection
    selectUser,
    selectPlace,
    selectReview,
    
    // Utilities
    clearError,
    resetState,
    getPendingItems,
    refreshAllData
  };
};

// Hook to get admin permissions
export const useAdminPermissions = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const hasPermission = useCallback((permission: string) => {
    if (!user || !user.role) return false;
    
    // Super admin has all permissions
    if (user.role === 'super_admin') return true;
    
    // Admin has most permissions
    if (user.role === 'admin') {
      const restrictedPermissions = ['delete_admin', 'modify_super_admin'];
      return !restrictedPermissions.includes(permission);
    }
    
    // Moderator has limited permissions
    if (user.role === 'moderator') {
      const allowedPermissions = [
        'view_dashboard',
        'view_users',
        'view_places',
        'view_reviews',
        'approve_reviews',
        'reject_reviews',
        'approve_places',
        'reject_places'
      ];
      return allowedPermissions.includes(permission);
    }
    
    return false;
  }, [user]);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isModerator = user?.role === 'moderator' || isAdmin;
  const isSuperAdmin = user?.role === 'super_admin';

  return {
    hasPermission,
    isAdmin,
    isModerator,
    isSuperAdmin,
    userRole: user?.role || 'user'
  };
};
