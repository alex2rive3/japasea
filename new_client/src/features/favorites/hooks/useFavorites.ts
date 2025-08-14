import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import {
  fetchUserFavorites,
  addToFavorites,
  removeFromFavorites,
  checkIsFavorite,
  getFavoriteByPlaceId as getFavoriteByPlaceIdAction,
  clearAllFavorites,
  getFavoritesCount,
  exportFavorites,
  clearFavoritesError,
  resetFavoritesState,
  updateFavoriteOptimistic,
  removeFavoriteOptimistic,
  selectFavorites,
  selectFavoritesLoading,
  selectFavoritesError,
  selectFavoritesTotalCount,
  selectFavoritesState,
  selectIsFavorite,
  selectFavoriteByPlaceId
} from '../store/favoritesSlice';
import type { GetFavoritesRequest, AddFavoriteRequest, RemoveFavoriteRequest, Favorite } from '../types';

export const useFavorites = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
  const favorites = useSelector(selectFavorites);
  const loading = useSelector(selectFavoritesLoading);
  const error = useSelector(selectFavoritesError);
  const totalCount = useSelector(selectFavoritesTotalCount);
  const favoritesState = useSelector(selectFavoritesState);

  // Async actions
  const fetchFavorites = useCallback((params: GetFavoritesRequest = {}) => {
    return dispatch(fetchUserFavorites(params));
  }, [dispatch]);

  const addFavorite = useCallback((data: AddFavoriteRequest) => {
    return dispatch(addToFavorites(data));
  }, [dispatch]);

  const removeFavorite = useCallback((data: RemoveFavoriteRequest) => {
    return dispatch(removeFromFavorites(data));
  }, [dispatch]);

  const checkFavoriteStatus = useCallback((placeId: string) => {
    return dispatch(checkIsFavorite(placeId));
  }, [dispatch]);

  const getFavoriteByPlace = useCallback((placeId: string) => {
    return dispatch(getFavoriteByPlaceIdAction(placeId));
  }, [dispatch]);

  const clearFavorites = useCallback(() => {
    return dispatch(clearAllFavorites());
  }, [dispatch]);

  const getCount = useCallback(() => {
    return dispatch(getFavoritesCount());
  }, [dispatch]);

  const exportUserFavorites = useCallback(() => {
    return dispatch(exportFavorites());
  }, [dispatch]);

  // Sync actions
  const clearError = useCallback(() => {
    dispatch(clearFavoritesError());
  }, [dispatch]);

  const resetState = useCallback(() => {
    dispatch(resetFavoritesState());
  }, [dispatch]);

  const updateOptimistic = useCallback((favorite: Favorite) => {
    dispatch(updateFavoriteOptimistic(favorite));
  }, [dispatch]);

  const removeOptimistic = useCallback((favoriteId: string) => {
    dispatch(removeFavoriteOptimistic(favoriteId));
  }, [dispatch]);

  // Toggle favorite (convenience method)
  const toggleFavorite = useCallback(async (placeId: string) => {
    try {
      const existingFavorite = favorites.find((f: Favorite) => f.placeId === placeId);
      
      if (existingFavorite) {
        await removeFavorite({ favoriteId: existingFavorite.id });
        return { action: 'removed', success: true };
      } else {
        await addFavorite({ placeId });
        return { action: 'added', success: true };
      }
    } catch (error) {
      return { action: 'error', success: false, error };
    }
  }, [favorites, addFavorite, removeFavorite]);

  // Helper function to check if place is favorite
  const isPlaceFavorite = useCallback((placeId: string) => {
    return favorites.some((f: Favorite) => f.placeId === placeId);
  }, [favorites]);

  return {
    // State
    favorites,
    loading,
    error,
    totalCount,
    favoritesState,
    
    // Actions
    fetchFavorites,
    addFavorite,
    removeFavorite,
    checkFavoriteStatus,
    getFavoriteByPlace,
    clearFavorites,
    getCount,
    exportUserFavorites,
    clearError,
    resetState,
    updateOptimistic,
    removeOptimistic,
    toggleFavorite,
    
    // Helpers
    isPlaceFavorite
  };
};

// Hook to get favorite status for a specific place
export const useFavoriteStatus = (placeId: string) => {
  const isFavorite = useSelector((state: RootState) => selectIsFavorite(placeId)(state));
  const favorite = useSelector((state: RootState) => selectFavoriteByPlaceId(placeId)(state));
  
  return {
    isFavorite,
    favorite
  };
};
