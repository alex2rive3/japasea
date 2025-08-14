import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../../app/store'
import { placesService } from '../services/placesService'
import type {
  Place,
  PlacesState,
  PlaceSearchParams,
  PlaceFilter,
  TravelPlan
} from '../types'

// Initial state
const initialState: PlacesState = {
  places: [],
  filteredPlaces: [],
  selectedPlace: null,
  searchQuery: '',
  activeFilter: {},
  isLoading: false,
  error: null,
  
  // Search and filtering
  searchResults: [],
  isSearching: false,
  searchError: null,
  
  // CRUD operations
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  
  // Travel plans
  travelPlans: [],
  selectedTravelPlan: null,
  isTravelPlanLoading: false,
  travelPlanError: null,
  
  // Admin functionality
  adminPlaces: [],
  isAdminLoading: false,
  adminError: null,
}

// Async thunks
export const fetchPlacesAsync = createAsyncThunk(
  'places/fetchPlaces',
  async (params: PlaceSearchParams | undefined, { rejectWithValue }) => {
    try {
      const places = await placesService.getAllPlaces(params)
      return places
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al obtener lugares')
    }
  }
)

export const fetchPlaceByIdAsync = createAsyncThunk(
  'places/fetchPlaceById',
  async (id: string, { rejectWithValue }) => {
    try {
      const place = await placesService.getPlaceById(id)
      return place
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al obtener lugar')
    }
  }
)

export const searchPlacesAsync = createAsyncThunk(
  'places/searchPlaces',
  async ({ query, params }: { query: string; params?: Omit<PlaceSearchParams, 'query'> }, { rejectWithValue }) => {
    try {
      const places = await placesService.searchPlaces(query, params)
      return { places, query }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al buscar lugares')
    }
  }
)

export const fetchPlacesByTypeAsync = createAsyncThunk(
  'places/fetchPlacesByType',
  async (type: string, { rejectWithValue }) => {
    try {
      const places = await placesService.getPlacesByType(type)
      return places
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al obtener lugares por tipo')
    }
  }
)

export const fetchFeaturedPlacesAsync = createAsyncThunk(
  'places/fetchFeaturedPlaces',
  async (_, { rejectWithValue }) => {
    try {
      const places = await placesService.getFeaturedPlaces()
      return places
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al obtener lugares destacados')
    }
  }
)

export const fetchNearbyPlacesAsync = createAsyncThunk(
  'places/fetchNearbyPlaces',
  async ({ lat, lng, radius }: { lat: number; lng: number; radius?: number }, { rejectWithValue }) => {
    try {
      const places = await placesService.getNearbyPlaces(lat, lng, radius)
      return places
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al obtener lugares cercanos')
    }
  }
)

export const generateTravelPlanAsync = createAsyncThunk(
  'places/generateTravelPlan',
  async ({ duration, interests, budget }: { duration: number; interests: string[]; budget?: string }, { rejectWithValue }) => {
    try {
      const travelPlan = await placesService.generateTravelPlan(duration, interests, budget)
      return travelPlan
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al generar plan de viaje')
    }
  }
)

export const getRecommendationsAsync = createAsyncThunk(
  'places/getRecommendations',
  async (preferences: { types?: string[]; budget?: string; location?: { lat: number; lng: number } }, { rejectWithValue }) => {
    try {
      const places = await placesService.getRecommendations(preferences)
      return places
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al obtener recomendaciones')
    }
  }
)

export const sendChatMessageAsync = createAsyncThunk(
  'places/sendChatMessage',
  async ({ message, sessionId }: { message: string; sessionId?: string }, { rejectWithValue }) => {
    try {
      const response = await placesService.sendChatMessage(message, sessionId)
      return response
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al enviar mensaje')
    }
  }
)

export const createPlaceAsync = createAsyncThunk(
  'places/createPlace',
  async (placeData: Partial<Place>, { rejectWithValue }) => {
    try {
      const place = await placesService.createPlace(placeData)
      return place
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al crear lugar')
    }
  }
)

export const updatePlaceAsync = createAsyncThunk(
  'places/updatePlace',
  async ({ id, updates }: { id: string; updates: Partial<Place> }, { rejectWithValue }) => {
    try {
      const place = await placesService.updatePlace(id, updates)
      return place
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al actualizar lugar')
    }
  }
)

export const deletePlaceAsync = createAsyncThunk(
  'places/deletePlace',
  async (id: string, { rejectWithValue }) => {
    try {
      await placesService.deletePlace(id)
      return id
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al eliminar lugar')
    }
  }
)

export const adminListPlacesAsync = createAsyncThunk(
  'places/adminListPlaces',
  async (params: PlaceSearchParams = {}, { rejectWithValue }) => {
    try {
      const result = await placesService.adminListPlaces(params)
      return result
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al listar lugares (admin)')
    }
  }
)

// Slice
export const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    setSelectedPlace: (state, action: PayloadAction<Place | null>) => {
      state.selectedPlace = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setActiveFilter: (state, action: PayloadAction<PlaceFilter>) => {
      state.activeFilter = action.payload
      // Apply filter to places
      state.filteredPlaces = state.places.filter(place => {
        if (action.payload.type && place.type !== action.payload.type) return false
        if (action.payload.category && place.category !== action.payload.category) return false
        if (action.payload.hasPhone && !place.phone) return false
        if (action.payload.hasWebsite && !place.website) return false
        if (action.payload.minRating && (!place.rating || place.rating < action.payload.minRating)) return false
        if (action.payload.features && action.payload.features.length > 0) {
          if (!place.features || !action.payload.features.some(feature => place.features?.includes(feature))) return false
        }
        return true
      })
    },
    clearFilter: (state) => {
      state.activeFilter = {}
      state.filteredPlaces = state.places
    },
    clearSearchResults: (state) => {
      state.searchResults = []
      state.searchQuery = ''
      state.searchError = null
    },
    clearError: (state) => {
      state.error = null
      state.searchError = null
      state.travelPlanError = null
      state.adminError = null
    },
    setSelectedTravelPlan: (state, action: PayloadAction<TravelPlan | null>) => {
      state.selectedTravelPlan = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch places
      .addCase(fetchPlacesAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPlacesAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.places = action.payload
        state.filteredPlaces = action.payload
      })
      .addCase(fetchPlacesAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Fetch place by ID
      .addCase(fetchPlaceByIdAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPlaceByIdAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedPlace = action.payload
      })
      .addCase(fetchPlaceByIdAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Search places
      .addCase(searchPlacesAsync.pending, (state) => {
        state.isSearching = true
        state.searchError = null
      })
      .addCase(searchPlacesAsync.fulfilled, (state, action) => {
        state.isSearching = false
        state.searchResults = action.payload.places
        state.searchQuery = action.payload.query
      })
      .addCase(searchPlacesAsync.rejected, (state, action) => {
        state.isSearching = false
        state.searchError = action.payload as string
      })
      
      // Fetch places by type
      .addCase(fetchPlacesByTypeAsync.fulfilled, (state, action) => {
        state.filteredPlaces = action.payload
      })
      
      // Fetch featured places
      .addCase(fetchFeaturedPlacesAsync.fulfilled, (state, action) => {
        state.places = action.payload
        state.filteredPlaces = action.payload
      })
      
      // Fetch nearby places
      .addCase(fetchNearbyPlacesAsync.fulfilled, (state, action) => {
        state.places = action.payload
        state.filteredPlaces = action.payload
      })
      
      // Generate travel plan
      .addCase(generateTravelPlanAsync.pending, (state) => {
        state.isTravelPlanLoading = true
        state.travelPlanError = null
      })
      .addCase(generateTravelPlanAsync.fulfilled, (state, action) => {
        state.isTravelPlanLoading = false
        state.travelPlans.push(action.payload)
        state.selectedTravelPlan = action.payload
      })
      .addCase(generateTravelPlanAsync.rejected, (state, action) => {
        state.isTravelPlanLoading = false
        state.travelPlanError = action.payload as string
      })
      
      // Get recommendations
      .addCase(getRecommendationsAsync.fulfilled, (state, action) => {
        state.places = action.payload
        state.filteredPlaces = action.payload
      })
      
      // Create place
      .addCase(createPlaceAsync.pending, (state) => {
        state.isCreating = true
      })
      .addCase(createPlaceAsync.fulfilled, (state, action) => {
        state.isCreating = false
        state.places.push(action.payload)
        state.filteredPlaces.push(action.payload)
      })
      .addCase(createPlaceAsync.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.payload as string
      })
      
      // Update place
      .addCase(updatePlaceAsync.pending, (state) => {
        state.isUpdating = true
      })
      .addCase(updatePlaceAsync.fulfilled, (state, action) => {
        state.isUpdating = false
        const index = state.places.findIndex(place => place.key === action.payload.key)
        if (index !== -1) {
          state.places[index] = action.payload
          state.filteredPlaces[index] = action.payload
        }
        if (state.selectedPlace?.key === action.payload.key) {
          state.selectedPlace = action.payload
        }
      })
      .addCase(updatePlaceAsync.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload as string
      })
      
      // Delete place
      .addCase(deletePlaceAsync.pending, (state) => {
        state.isDeleting = true
      })
      .addCase(deletePlaceAsync.fulfilled, (state, action) => {
        state.isDeleting = false
        state.places = state.places.filter(place => place.key !== action.payload)
        state.filteredPlaces = state.filteredPlaces.filter(place => place.key !== action.payload)
        if (state.selectedPlace?.key === action.payload) {
          state.selectedPlace = null
        }
      })
      .addCase(deletePlaceAsync.rejected, (state, action) => {
        state.isDeleting = false
        state.error = action.payload as string
      })
      
      // Admin list places
      .addCase(adminListPlacesAsync.pending, (state) => {
        state.isAdminLoading = true
        state.adminError = null
      })
      .addCase(adminListPlacesAsync.fulfilled, (state, action) => {
        state.isAdminLoading = false
        state.adminPlaces = action.payload.places
      })
      .addCase(adminListPlacesAsync.rejected, (state, action) => {
        state.isAdminLoading = false
        state.adminError = action.payload as string
      })
  },
})

export const {
  setSelectedPlace,
  setSearchQuery,
  setActiveFilter,
  clearFilter,
  clearSearchResults,
  clearError,
  setSelectedTravelPlan,
} = placesSlice.actions

// Selectors
export const selectPlaces = (state: RootState) => state.places.places
export const selectFilteredPlaces = (state: RootState) => state.places.filteredPlaces
export const selectSelectedPlace = (state: RootState) => state.places.selectedPlace
export const selectSearchQuery = (state: RootState) => state.places.searchQuery
export const selectActiveFilter = (state: RootState) => state.places.activeFilter
export const selectIsLoading = (state: RootState) => state.places.isLoading
export const selectError = (state: RootState) => state.places.error
export const selectSearchResults = (state: RootState) => state.places.searchResults
export const selectIsSearching = (state: RootState) => state.places.isSearching
export const selectSearchError = (state: RootState) => state.places.searchError
export const selectTravelPlans = (state: RootState) => state.places.travelPlans
export const selectSelectedTravelPlan = (state: RootState) => state.places.selectedTravelPlan
export const selectIsTravelPlanLoading = (state: RootState) => state.places.isTravelPlanLoading
export const selectTravelPlanError = (state: RootState) => state.places.travelPlanError
export const selectAdminPlaces = (state: RootState) => state.places.adminPlaces
export const selectIsAdminLoading = (state: RootState) => state.places.isAdminLoading
export const selectAdminError = (state: RootState) => state.places.adminError

export const placesReducer = placesSlice.reducer
