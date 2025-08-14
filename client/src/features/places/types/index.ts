export interface Place {
  key: string
  description: string
  location: {
    lat: number
    lng: number
  }
  type: string
  address: string
  phone?: string
  website?: string
  rating?: number
  features?: string[]
  images?: string[]
  category?: string
}

export interface PlaceFilter {
  type?: string
  category?: string
  hasPhone?: boolean
  hasWebsite?: boolean
  minRating?: number
  features?: string[]
}

export interface PlaceSearchParams {
  query?: string
  type?: string
  category?: string
  limit?: number
  offset?: number
}

export interface TravelPlanActivity {
  id: string
  place: Place
  startTime: string
  endTime: string
  notes?: string
  transportMethod?: string
  estimatedCost?: number
}

export interface TravelPlan {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  activities: TravelPlanActivity[]
  totalEstimatedCost?: number
  notes?: string
  isPublic?: boolean
  createdAt: string
  updatedAt: string
}

export interface ChatResponse {
  message: string
  places?: Place[]
  suggestions?: string[]
}

export interface PlacesState {
  places: Place[]
  filteredPlaces: Place[]
  selectedPlace: Place | null
  searchQuery: string
  activeFilter: PlaceFilter
  isLoading: boolean
  error: string | null
  
  // Search and filtering
  searchResults: Place[]
  isSearching: boolean
  searchError: string | null
  
  // CRUD operations
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  
  // Travel plans
  travelPlans: TravelPlan[]
  selectedTravelPlan: TravelPlan | null
  isTravelPlanLoading: boolean
  travelPlanError: string | null
  
  // Admin functionality
  adminPlaces: Place[]
  isAdminLoading: boolean
  adminError: string | null
}
