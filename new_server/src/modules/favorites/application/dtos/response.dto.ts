export class FavoriteResponseDto {
  _id: string;
  name: string;
  description: string;
  type: string;
  location: {
    coordinates: number[];
  };
  address: string;
  images?: string[];
  rating?: number;
  status: string;
  isFavorite: boolean;
  favoritedAt: string;
}

export class FavoriteStatsResponseDto {
  totalFavorites: number;
  favoritesByType: Array<{
    _id: string;
    count: number;
  }>;
  recentFavorites: Array<{
    _id: string;
    name: string;
    type: string;
    addedAt: string;
  }>;
  topFavorites: Array<{
    _id: string;
    name: string;
    favoriteCount: number;
  }>;
}

export class CheckFavoriteResponseDto {
  isFavorite: boolean;
  favoritedAt?: string;
}

export class SyncFavoritesResponseDto {
  success: boolean;
  processed: number;
  added: number;
  removed: number;
  errors: Array<{
    placeId: string;
    error: string;
  }>;
}
