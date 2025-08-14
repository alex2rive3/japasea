export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin' | 'moderator';
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalPlaces: number;
  totalReviews: number;
  totalFavorites: number;
  activeUsers: number;
  pendingReviews: number;
  recentActivity: AdminActivity[];
}

export interface AdminActivity {
  id: string;
  type: 'user_registered' | 'place_created' | 'review_submitted' | 'place_updated' | 'user_banned';
  description: string;
  userId?: string;
  targetId?: string;
  timestamp: string;
}

export interface PlaceManagement {
  id: string;
  name: string;
  description: string;
  type: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'pending' | 'rejected' | 'archived';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  reviewCount: number;
  averageRating: number;
}

export interface UserManagement {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'super_admin' | 'moderator';
  status: 'active' | 'suspended' | 'banned';
  emailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  placesCount: number;
  reviewsCount: number;
  favoritesCount: number;
}

export interface ReviewManagement {
  id: string;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  placeId: string;
  placeName: string;
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminState {
  stats: AdminStats | null;
  users: UserManagement[];
  places: PlaceManagement[];
  reviews: ReviewManagement[];
  activities: AdminActivity[];
  loading: boolean;
  error: string | null;
  selectedUser: UserManagement | null;
  selectedPlace: PlaceManagement | null;
  selectedReview: ReviewManagement | null;
}

export interface GetUsersRequest {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface GetPlacesRequest {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  createdBy?: string;
}

export interface GetReviewsRequest {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  placeId?: string;
  userId?: string;
}

export interface UpdateUserRequest {
  userId: string;
  name?: string;
  role?: string;
  status?: string;
  permissions?: string[];
}

export interface UpdatePlaceRequest {
  placeId: string;
  name?: string;
  description?: string;
  type?: string;
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
  status?: string;
}

export interface UpdateReviewRequest {
  reviewId: string;
  status?: string;
  moderatorNote?: string;
}

export interface CreatePlaceRequest {
  name: string;
  description: string;
  type: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface AdminUsersResponse {
  users: UserManagement[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminPlacesResponse {
  places: PlaceManagement[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminReviewsResponse {
  reviews: ReviewManagement[];
  total: number;
  page: number;
  limit: number;
}
