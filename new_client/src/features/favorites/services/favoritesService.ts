import { apiClient } from '../../../shared/api';
import type { 
  Favorite, 
  AddFavoriteRequest, 
  RemoveFavoriteRequest, 
  GetFavoritesRequest,
  FavoritesResponse 
} from '../types';

class FavoritesService {
  private readonly baseUrl = '/api/favorites';

  async getUserFavorites(params: GetFavoritesRequest = {}): Promise<FavoritesResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    const response = await apiClient.get<FavoritesResponse>(url);
    return response.data;
  }

  async addToFavorites(data: AddFavoriteRequest): Promise<Favorite> {
    const response = await apiClient.post<Favorite>(this.baseUrl, data);
    return response.data;
  }

  async removeFromFavorites(data: RemoveFavoriteRequest): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${data.favoriteId}`);
  }

  async checkIsFavorite(placeId: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ isFavorite: boolean }>(`${this.baseUrl}/check/${placeId}`);
      return response.data.isFavorite;
    } catch {
      return false;
    }
  }

  async getFavoriteByPlaceId(placeId: string): Promise<Favorite | null> {
    try {
      const response = await apiClient.get<Favorite>(`${this.baseUrl}/place/${placeId}`);
      return response.data;
    } catch {
      return null;
    }
  }

  async clearAllFavorites(): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/all`);
  }

  async getFavoritesCoun(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(`${this.baseUrl}/count`);
    return response.data.count;
  }

  async exportFavorites(): Promise<Favorite[]> {
    const response = await apiClient.get<Favorite[]>(`${this.baseUrl}/export`);
    return response.data;
  }
}

export const favoritesService = new FavoritesService();
