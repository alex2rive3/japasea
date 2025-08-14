import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import { placesService } from '../services/placesService';
import type {
  Place,
  PlacesState,
  PlaceSearchParams,
  PlaceFilter,
  PlaceFormData,
  PlaceUpdateData,
} from '../types';

// Initial state
const initialState: PlacesState = {
  places: [],
  selectedPlace: null,
  featuredPlaces: [],
  categories: [
    { id: 'alojamiento', name: 'Alojamiento', color: '#2196F3' },
    { id: 'gastronomia', name: 'Gastronomía', color: '#FF9800' },
    { id: 'entretenimiento', name: 'Entretenimiento', color: '#4CAF50' },
    { id: 'comercios', name: 'Comercios', color: '#9C27B0' },
    { id: 'servicios', name: 'Servicios', color: '#607D8B' },
    { id: 'desayunos', name: 'Desayunos y meriendas', color: '#E91E63' },
  ],
  filters: {},
  searchQuery: '',
  searchResults: [],
  pagination: null,
  loading: false,
  error: null,
  lastFetch: null,
};

// Async thunks
export const fetchPlacesAsync = createAsyncThunk(
  'places/fetchPlaces',
  async (params: PlaceSearchParams | undefined, { rejectWithValue }) => {
    try {
      const places = await placesService.getAllPlaces(params);
      return { places, timestamp: Date.now() };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al obtener lugares');
    }
  }
);

export const fetchPlaceByIdAsync = createAsyncThunk(
  'places/fetchPlaceById',
  async (id: string, { rejectWithValue }) => {
    try {
      const place = await placesService.getPlaceById(id);
      return place;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al obtener lugar');
    }
  }
);

export const searchPlacesAsync = createAsyncThunk(
  'places/searchPlaces',
  async ({ query, params }: { query: string; params?: Omit<PlaceSearchParams, 'query'> }, { rejectWithValue }) => {
    try {
      const places = await placesService.searchPlaces(query, params);
      return { places, query };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al buscar lugares');
    }
  }
);

export const fetchPlacesByTypeAsync = createAsyncThunk(
  'places/fetchPlacesByType',
  async (type: string, { rejectWithValue }) => {
    try {
      const places = await placesService.getPlacesByType(type);
      return places;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al obtener lugares por tipo');
    }
  }
);

export const fetchFeaturedPlacesAsync = createAsyncThunk(
  'places/fetchFeaturedPlaces',
  async (_, { rejectWithValue }) => {
    try {
      const places = await placesService.getFeaturedPlaces();
      return places;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al obtener lugares destacados');
    }
  }
);

export const fetchNearbyPlacesAsync = createAsyncThunk(
  'places/fetchNearbyPlaces',
  async ({ lat, lng, radius }: { lat: number; lng: number; radius?: number }, { rejectWithValue }) => {
    try {
      const places = await placesService.getNearbyPlaces(lat, lng, radius);
      return places;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al obtener lugares cercanos');
    }
  }
);

export const createPlaceAsync = createAsyncThunk(
  'places/createPlace',
  async (placeData: PlaceFormData, { rejectWithValue }) => {
    try {
      const place = await placesService.createPlace(placeData);
      return place;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al crear lugar');
    }
  }
);

export const updatePlaceAsync = createAsyncThunk(
  'places/updatePlace',
  async ({ id, updates }: { id: string; updates: PlaceUpdateData }, { rejectWithValue }) => {
    try {
      const place = await placesService.updatePlace(id, updates);
      return place;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al actualizar lugar');
    }
  }
);

export const deletePlaceAsync = createAsyncThunk(
  'places/deletePlace',
  async (id: string, { rejectWithValue }) => {
    try {
      await placesService.deletePlace(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al eliminar lugar');
    }
  }
);

export const generateTravelPlanAsync = createAsyncThunk(
  'places/generateTravelPlan',
  async ({ duration, interests, budget }: { duration: number; interests: string[]; budget?: string }, { rejectWithValue }) => {
    try {
      const response = await placesService.generateTravelPlan(duration, interests, budget);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al generar plan de viaje');
    }
  }
);

export const getRecommendationsAsync = createAsyncThunk(
  'places/getRecommendations',
  async (preferences: { types?: string[]; budget?: string; location?: { lat: number; lng: number } }, { rejectWithValue }) => {
    try {
      const places = await placesService.getRecommendations(preferences);
      return places;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al obtener recomendaciones');
    }
  }
);

export const sendChatMessageAsync = createAsyncThunk(
  'places/sendChatMessage',
  async ({ message, sessionId }: { message: string; sessionId?: string }, { rejectWithValue }) => {
    try {
      const response = await placesService.sendChatMessage(message, sessionId);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al enviar mensaje');
    }
  }
);

// Places slice
export const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    // Synchronous actions
    setSelectedPlace: (state, action: PayloadAction<Place | null>) => {
      state.selectedPlace = action.payload;
    },
    clearSelectedPlace: (state) => {
      state.selectedPlace = null;
    },
    setFilters: (state, action: PayloadAction<PlaceFilter>) => {
      state.filters = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<PlaceFilter>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    clearPlaces: (state) => {
      state.places = [];
      state.searchResults = [];
      state.selectedPlace = null;
      state.lastFetch = null;
    },
    addPlace: (state, action: PayloadAction<Place>) => {
      const existingIndex = state.places.findIndex(place => place._id === action.payload._id);
      if (existingIndex >= 0) {
        state.places[existingIndex] = action.payload;
      } else {
        state.places.push(action.payload);
      }
    },
    removePlace: (state, action: PayloadAction<string>) => {
      state.places = state.places.filter(place => place._id !== action.payload);
      state.featuredPlaces = state.featuredPlaces.filter(place => place._id !== action.payload);
      if (state.selectedPlace?._id === action.payload) {
        state.selectedPlace = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch places
      .addCase(fetchPlacesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlacesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.places = action.payload.places;
        state.lastFetch = action.payload.timestamp;
      })
      .addCase(fetchPlacesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch place by ID
      .addCase(fetchPlaceByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaceByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPlace = action.payload;
        
        // Update in places array if exists
        const existingIndex = state.places.findIndex(place => place._id === action.payload._id);
        if (existingIndex >= 0) {
          state.places[existingIndex] = action.payload;
        }
      })
      .addCase(fetchPlaceByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Search places
      .addCase(searchPlacesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPlacesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.places;
        state.searchQuery = action.payload.query;
      })
      .addCase(searchPlacesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch places by type
      .addCase(fetchPlacesByTypeAsync.fulfilled, (state, action) => {
        state.places = action.payload;
      })
      
      // Fetch featured places
      .addCase(fetchFeaturedPlacesAsync.fulfilled, (state, action) => {
        state.featuredPlaces = action.payload;
      })
      
      // Fetch nearby places
      .addCase(fetchNearbyPlacesAsync.fulfilled, (state, action) => {
        state.places = action.payload;
      })
      
      // Create place
      .addCase(createPlaceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlaceAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.places.push(action.payload);
      })
      .addCase(createPlaceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update place
      .addCase(updatePlaceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlaceAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.places.findIndex(place => place._id === action.payload._id);
        if (index >= 0) {
          state.places[index] = action.payload;
        }
        if (state.selectedPlace?._id === action.payload._id) {
          state.selectedPlace = action.payload;
        }
      })
      .addCase(updatePlaceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete place
      .addCase(deletePlaceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlaceAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.places = state.places.filter(place => place._id !== action.payload);
        if (state.selectedPlace?._id === action.payload) {
          state.selectedPlace = null;
        }
      })
      .addCase(deletePlaceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get recommendations
      .addCase(getRecommendationsAsync.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      });
  },
});

// Export actions
export const {
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
} = placesSlice.actions;

// Selectors
export const selectPlaces = (state: RootState) => state.places as PlacesState;
export const selectAllPlaces = (state: RootState) => (state.places as PlacesState).places;
export const selectSelectedPlace = (state: RootState) => (state.places as PlacesState).selectedPlace;
export const selectFeaturedPlaces = (state: RootState) => (state.places as PlacesState).featuredPlaces;
export const selectPlaceCategories = (state: RootState) => (state.places as PlacesState).categories;
export const selectPlaceFilters = (state: RootState) => (state.places as PlacesState).filters;
export const selectSearchQuery = (state: RootState) => (state.places as PlacesState).searchQuery;
export const selectSearchResults = (state: RootState) => (state.places as PlacesState).searchResults;
export const selectPlacesLoading = (state: RootState) => (state.places as PlacesState).loading;
export const selectPlacesError = (state: RootState) => (state.places as PlacesState).error;
export const selectPlacesPagination = (state: RootState) => (state.places as PlacesState).pagination;

// Complex selectors
export const selectPlacesByType = (type: string) => (state: RootState) =>
  (state.places as PlacesState).places.filter((place: Place) => place.type === type);

export const selectPlaceById = (id: string) => (state: RootState) =>
  (state.places as PlacesState).places.find((place: Place) => place._id === id || place.id === id);

export const selectFilteredPlaces = (state: RootState) => {
  const { places, filters } = state.places as PlacesState;
  
  if (!filters || Object.keys(filters).length === 0) {
    return places;
  }
  
  return places.filter((place: Place) => {
    // Type filter
    if (filters.type && place.type !== filters.type) {
      return false;
    }
    
    // Price range filter
    if (filters.priceRange && place.priceRange) {
      const [min, max] = filters.priceRange;
      if (place.priceRange < min || place.priceRange > max) {
        return false;
      }
    }
    
    // Rating filter
    if (filters.rating && place.rating) {
      if (place.rating.average < filters.rating) {
        return false;
      }
    }
    
    // Features filter
    if (filters.features && filters.features.length > 0) {
      if (!place.features || !filters.features.some((feature: string) => place.features!.includes(feature))) {
        return false;
      }
    }
    
    // Verified filter
    if (filters.verified !== undefined && place.verified !== filters.verified) {
      return false;
    }
    
    // Featured filter
    if (filters.featured !== undefined && place.featured !== filters.featured) {
      return false;
    }
    
    return true;
  });
};

export default placesSlice.reducer;
