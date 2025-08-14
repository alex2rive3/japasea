// Places domain types
export interface Place {
  _id?: string;
  id?: string;
  key?: string;
  name?: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  type?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: {
    average: number;
    count: number;
  };
  images?: Array<{ 
    url: string; 
    caption?: string; 
  }>;
  openingHours?: {
    [day: string]: {
      open: string;
      close: string;
      closed?: boolean;
    };
  };
  features?: string[];
  tags?: string[];
  status?: string;
  city?: string;
  priceRange?: number;
  verified?: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlaceCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface PlaceFilter {
  type?: string;
  priceRange?: number[];
  rating?: number;
  features?: string[];
  verified?: boolean;
  featured?: boolean;
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
}

export interface PlaceSearchParams {
  query?: string;
  type?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'rating' | 'distance' | 'created';
  sortOrder?: 'asc' | 'desc';
  filters?: PlaceFilter;
}

export interface PlacesResponse {
  success: boolean;
  message: string;
  data: {
    places: Place[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalPlaces: number;
      limit: number;
    };
  };
}

export interface PlaceResponse {
  success: boolean;
  message: string;
  data: Place;
}

// Travel plan types
export interface TravelActivity {
  time: string;
  category?: string;
  place: Place;
  duration?: number;
  notes?: string;
}

export interface TravelDay {
  dayNumber: number;
  title: string;
  activities: TravelActivity[];
  summary?: string;
}

export interface TravelPlan {
  id?: string;
  totalDays: number;
  days: TravelDay[];
  title?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TravelPlanResponse {
  success: boolean;
  message: string;
  data: {
    travelPlan: TravelPlan;
  };
  timestamp: string;
}

// Chat and recommendations
export interface ChatResponse {
  success: boolean;
  message?: string;
  response?: string;
  data?: {
    places?: Place[];
    travelPlan?: TravelPlan;
    recommendations?: Place[];
  };
  timestamp: string;
  sessionId?: string;
}

export interface SimpleRecommendationResponse {
  success: boolean;
  message: string;
  data: {
    places: Place[];
  };
  timestamp: string;
}

// Redux state types
export interface PlacesState {
  places: Place[];
  selectedPlace: Place | null;
  featuredPlaces: Place[];
  categories: PlaceCategory[];
  filters: PlaceFilter;
  searchQuery: string;
  searchResults: Place[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPlaces: number;
    limit: number;
  } | null;
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

// Map related types
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapPosition {
  lat: number;
  lng: number;
  zoom?: number;
}

export interface MapState {
  center: MapPosition;
  zoom: number;
  bounds: MapBounds | null;
  selectedPlaceId: string | null;
  showAllPlaces: boolean;
  clustersEnabled: boolean;
}

// Form types
export interface PlaceFormData {
  name: string;
  description: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  email?: string;
  website?: string;
  features?: string[];
  tags?: string[];
  images?: File[];
}

export interface PlaceUpdateData {
  name?: string;
  description?: string;
  type?: string;
  address?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  features?: string[];
  tags?: string[];
  status?: string;
  verified?: boolean;
  featured?: boolean;
}

// Admin types
export interface AdminPlacesListParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  q?: string;
  verified?: boolean;
  featured?: boolean;
}

export interface PlaceStats {
  totalPlaces: number;
  verifiedPlaces: number;
  featuredPlaces: number;
  placesByType: Record<string, number>;
  recentPlaces: Place[];
}
