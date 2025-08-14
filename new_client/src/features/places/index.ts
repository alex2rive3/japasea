// Places feature barrel exports

// Types
export type * from './types';

// Store
export { placesSlice } from './store/placesSlice';
export {
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
} from './store/placesSlice';

// Hooks
export { usePlaces } from './hooks/usePlaces';

// Services (internal use only)
export { placesService } from './services/placesService';
