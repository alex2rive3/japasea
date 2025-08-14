export interface Favorite {
  id: string;
  userId: string;
  placeId: string;
  place?: {
    id: string;
    name: string;
    description: string;
    location: {
      lat: number;
      lng: number;
    };
    type: string;
    address: string;
    imageUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FavoritesState {
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
  totalCount: number;
}

export interface AddFavoriteRequest {
  placeId: string;
}

export interface RemoveFavoriteRequest {
  favoriteId: string;
}

export interface GetFavoritesRequest {
  page?: number;
  limit?: number;
}

export interface FavoritesResponse {
  favorites: Favorite[];
  total: number;
  page: number;
  limit: number;
}
