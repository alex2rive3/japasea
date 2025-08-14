import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import {
  fetchPlacesAsync,
  fetchPlaceByIdAsync,
  searchPlacesAsync,
  fetchPlacesByTypeAsync,
  fetchFeaturedPlacesAsync,
  fetchNearbyPlacesAsync,
  createPlaceAsync,
  updatePlaceAsync,
  deletePlaceAsync,
  generateTravelPlanAsync,
  getRecommendationsAsync,
  sendChatMessageAsync,
  setSelectedPlace,
  clearSelectedPlace,
  setFilters,
  updateFilters,
  clearFilters,
  setSearchQuery,
  clearSearchQuery,
  clearSearchResults,
  clearError,
  clearPlaces,
  addPlace,
  removePlace,
  selectAllPlaces,
  selectSelectedPlace,
  selectFeaturedPlaces,
  selectPlaceCategories,
  selectPlaceFilters,
  selectSearchQuery,
  selectSearchResults,
  selectPlacesLoading,
  selectPlacesError,
  selectPlacesPagination,
  selectFilteredPlaces,
} from '../store/placesSlice';
import type {
  Place,
  PlaceSearchParams,
  PlaceFilter,
  PlaceFormData,
  PlaceUpdateData,
} from '../types';

export const usePlaces = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const places = useAppSelector(selectAllPlaces);
  const selectedPlace = useAppSelector(selectSelectedPlace);
  const featuredPlaces = useAppSelector(selectFeaturedPlaces);
  const categories = useAppSelector(selectPlaceCategories);
  const filters = useAppSelector(selectPlaceFilters);
  const searchQuery = useAppSelector(selectSearchQuery);
  const searchResults = useAppSelector(selectSearchResults);
  const loading = useAppSelector(selectPlacesLoading);
  const error = useAppSelector(selectPlacesError);
  const pagination = useAppSelector(selectPlacesPagination);
  const filteredPlaces = useAppSelector(selectFilteredPlaces);

  // Actions
  const fetchPlaces = useCallback(
    (params?: PlaceSearchParams) => {
      return dispatch(fetchPlacesAsync(params));
    },
    [dispatch]
  );

  const fetchPlaceById = useCallback(
    (id: string) => {
      return dispatch(fetchPlaceByIdAsync(id));
    },
    [dispatch]
  );

  const searchPlaces = useCallback(
    (query: string, params?: Omit<PlaceSearchParams, 'query'>) => {
      return dispatch(searchPlacesAsync({ query, params }));
    },
    [dispatch]
  );

  const fetchPlacesByType = useCallback(
    (type: string) => {
      return dispatch(fetchPlacesByTypeAsync(type));
    },
    [dispatch]
  );

  const fetchFeaturedPlaces = useCallback(() => {
    return dispatch(fetchFeaturedPlacesAsync());
  }, [dispatch]);

  const fetchNearbyPlaces = useCallback(
    (lat: number, lng: number, radius?: number) => {
      return dispatch(fetchNearbyPlacesAsync({ lat, lng, radius }));
    },
    [dispatch]
  );

  const createPlace = useCallback(
    (placeData: PlaceFormData) => {
      return dispatch(createPlaceAsync(placeData));
    },
    [dispatch]
  );

  const updatePlace = useCallback(
    (id: string, updates: PlaceUpdateData) => {
      return dispatch(updatePlaceAsync({ id, updates }));
    },
    [dispatch]
  );

  const deletePlace = useCallback(
    (id: string) => {
      return dispatch(deletePlaceAsync(id));
    },
    [dispatch]
  );

  const generateTravelPlan = useCallback(
    (duration: number, interests: string[], budget?: string) => {
      return dispatch(generateTravelPlanAsync({ duration, interests, budget }));
    },
    [dispatch]
  );

  const getRecommendations = useCallback(
    (preferences: { types?: string[]; budget?: string; location?: { lat: number; lng: number } }) => {
      return dispatch(getRecommendationsAsync(preferences));
    },
    [dispatch]
  );

  const sendChatMessage = useCallback(
    (message: string, sessionId?: string) => {
      return dispatch(sendChatMessageAsync({ message, sessionId }));
    },
    [dispatch]
  );

  // State management actions
  const selectPlace = useCallback(
    (place: Place | null) => {
      dispatch(setSelectedPlace(place));
    },
    [dispatch]
  );

  const clearSelection = useCallback(() => {
    dispatch(clearSelectedPlace());
  }, [dispatch]);

  const setPlaceFilters = useCallback(
    (newFilters: PlaceFilter) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const updatePlaceFilters = useCallback(
    (partialFilters: Partial<PlaceFilter>) => {
      dispatch(updateFilters(partialFilters));
    },
    [dispatch]
  );

  const clearPlaceFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const setQuery = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch]
  );

  const clearQuery = useCallback(() => {
    dispatch(clearSearchQuery());
  }, [dispatch]);

  const clearResults = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  const clearPlacesError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearAllPlaces = useCallback(() => {
    dispatch(clearPlaces());
  }, [dispatch]);

  const addNewPlace = useCallback(
    (place: Place) => {
      dispatch(addPlace(place));
    },
    [dispatch]
  );

  const removeExistingPlace = useCallback(
    (id: string) => {
      dispatch(removePlace(id));
    },
    [dispatch]
  );

  // Utility functions
  const getPlacesByType = useCallback(
    (type: string) => {
      return places.filter(place => place.type === type);
    },
    [places]
  );

  const getPlaceById = useCallback(
    (id: string) => {
      return places.find(place => place._id === id || place.id === id);
    },
    [places]
  );

  const hasPlaces = places.length > 0;
  const hasSearchResults = searchResults.length > 0;
  const hasSelectedPlace = selectedPlace !== null;
  const isSearching = searchQuery.length > 0;

  return {
    // State
    places,
    selectedPlace,
    featuredPlaces,
    categories,
    filters,
    searchQuery,
    searchResults,
    loading,
    error,
    pagination,
    filteredPlaces,

    // Computed
    hasPlaces,
    hasSearchResults,
    hasSelectedPlace,
    isSearching,

    // API Actions
    fetchPlaces,
    fetchPlaceById,
    searchPlaces,
    fetchPlacesByType,
    fetchFeaturedPlaces,
    fetchNearbyPlaces,
    createPlace,
    updatePlace,
    deletePlace,
    generateTravelPlan,
    getRecommendations,
    sendChatMessage,

    // State Actions
    selectPlace,
    clearSelection,
    setPlaceFilters,
    updatePlaceFilters,
    clearPlaceFilters,
    setQuery,
    clearQuery,
    clearResults,
    clearPlacesError,
    clearAllPlaces,
    addNewPlace,
    removeExistingPlace,

    // Utilities
    getPlacesByType,
    getPlaceById,
  };
};
