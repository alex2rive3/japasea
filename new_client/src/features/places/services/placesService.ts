import { apiClient } from '@/shared/api';
import type {
  Place,
  PlacesResponse,
  PlaceResponse,
  PlaceSearchParams,
  PlaceFormData,
  PlaceUpdateData,
  TravelPlanResponse,
  ChatResponse,
  SimpleRecommendationResponse,
  AdminPlacesListParams,
  PlaceStats,
} from '../types';

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalPlaces: number;
  limit: number;
}

class PlacesService {
  // Public endpoints
  async getAllPlaces(params?: PlaceSearchParams): Promise<Place[]> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === 'filters' && typeof value === 'object') {
              searchParams.set('filters', JSON.stringify(value));
            } else {
              searchParams.set(key, String(value));
            }
          }
        });
      }

      const response = await apiClient.get<PlacesResponse>(
        `/places${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
      );

      return response.data?.data?.places || [];
    } catch (error) {
      console.error('Error fetching places:', error);
      throw new Error('Error al obtener lugares');
    }
  }

  async getPlaceById(id: string): Promise<Place> {
    try {
      const response = await apiClient.get<PlaceResponse>(`/places/${id}`);
      
      if (!response.data?.data) {
        throw new Error('Lugar no encontrado');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching place by id:', error);
      throw new Error('Error al obtener lugar');
    }
  }

  async searchPlaces(query: string, params?: Omit<PlaceSearchParams, 'query'>): Promise<Place[]> {
    try {
      const searchParams = new URLSearchParams({ query });
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.set(key, String(value));
          }
        });
      }

      const response = await apiClient.get<PlacesResponse>(
        `/places/search?${searchParams.toString()}`
      );

      return response.data?.data?.places || [];
    } catch (error) {
      console.error('Error searching places:', error);
      throw new Error('Error al buscar lugares');
    }
  }

  async getPlacesByType(type: string): Promise<Place[]> {
    try {
      const response = await apiClient.get<PlacesResponse>(`/places/type/${type}`);
      return response.data?.data?.places || [];
    } catch (error) {
      console.error('Error fetching places by type:', error);
      throw new Error('Error al obtener lugares por tipo');
    }
  }

  async getFeaturedPlaces(): Promise<Place[]> {
    try {
      const response = await apiClient.get<PlacesResponse>('/places/featured');
      return response.data?.data?.places || [];
    } catch (error) {
      console.error('Error fetching featured places:', error);
      throw new Error('Error al obtener lugares destacados');
    }
  }

  async getNearbyPlaces(lat: number, lng: number, radius: number = 10): Promise<Place[]> {
    try {
      const response = await apiClient.get<PlacesResponse>(
        `/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
      );
      return response.data?.data?.places || [];
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      throw new Error('Error al obtener lugares cercanos');
    }
  }

  // Travel planning endpoints
  async generateTravelPlan(
    duration: number,
    interests: string[],
    budget?: string
  ): Promise<TravelPlanResponse['data']> {
    try {
      const response = await apiClient.post<TravelPlanResponse>('/places/travel-plan', {
        duration,
        interests,
        budget,
      });
      
      if (!response.data?.data) {
        throw new Error('Error en respuesta del servidor');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error generating travel plan:', error);
      throw new Error('Error al generar plan de viaje');
    }
  }

  async getRecommendations(preferences: {
    types?: string[];
    budget?: string;
    location?: { lat: number; lng: number };
  }): Promise<Place[]> {
    try {
      const response = await apiClient.post<SimpleRecommendationResponse>(
        '/places/recommendations',
        preferences
      );
      return response.data?.data?.places || [];
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw new Error('Error al obtener recomendaciones');
    }
  }

  // Chat and AI endpoints
  async sendChatMessage(message: string, sessionId?: string): Promise<ChatResponse['data']> {
    try {
      const response = await apiClient.post<ChatResponse>('/places/chat', {
        message,
        sessionId,
      });
      
      if (!response.data?.data) {
        throw new Error('Error en respuesta del servidor');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw new Error('Error al enviar mensaje');
    }
  }

  // User-specific endpoints (require authentication)
  async createPlace(placeData: PlaceFormData): Promise<Place> {
    try {
      const response = await apiClient.post<PlaceResponse>('/places', placeData);
      
      if (!response.data?.data) {
        throw new Error('Error en respuesta del servidor');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating place:', error);
      throw new Error('Error al crear lugar');
    }
  }

  async updatePlace(id: string, updates: PlaceUpdateData): Promise<Place> {
    try {
      const response = await apiClient.patch<PlaceResponse>(`/places/${id}`, updates);
      
      if (!response.data?.data) {
        throw new Error('Error en respuesta del servidor');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error updating place:', error);
      throw new Error('Error al actualizar lugar');
    }
  }

  async deletePlace(id: string): Promise<void> {
    try {
      await apiClient.delete(`/places/${id}`);
    } catch (error) {
      console.error('Error deleting place:', error);
      throw new Error('Error al eliminar lugar');
    }
  }

  // Admin endpoints
  async adminListPlaces(params: AdminPlacesListParams = {}): Promise<{
    places: Place[];
    pagination: PaginationData;
  }> {
    try {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });

      const response = await apiClient.get<{
        success: boolean;
        data: {
          places: Place[];
          pagination: PaginationData;
        };
      }>(`/admin/places?${searchParams.toString()}`);

      if (!response.data?.data) {
        throw new Error('Error en respuesta del servidor');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error admin listing places:', error);
      throw new Error('Error al listar lugares (admin)');
    }
  }

  async adminUpdatePlace(id: string, updates: PlaceUpdateData): Promise<Place> {
    try {
      const response = await apiClient.patch<PlaceResponse>(`/admin/places/${id}`, updates);
      
      if (!response.data?.data) {
        throw new Error('Error en respuesta del servidor');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error admin updating place:', error);
      throw new Error('Error al actualizar lugar (admin)');
    }
  }

  async adminDeletePlace(id: string): Promise<void> {
    try {
      await apiClient.delete(`/admin/places/${id}`);
    } catch (error) {
      console.error('Error admin deleting place:', error);
      throw new Error('Error al eliminar lugar (admin)');
    }
  }

  async getPlaceStats(): Promise<PlaceStats> {
    try {
      const response = await apiClient.get<{ success: boolean; data: PlaceStats }>('/admin/places/stats');
      
      if (!response.data?.data) {
        throw new Error('Error en respuesta del servidor');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching place stats:', error);
      throw new Error('Error al obtener estadísticas de lugares');
    }
  }

  // Utility methods
  async ensurePlace(payload: Partial<Place> & { key?: string; name?: string }): Promise<Place> {
    try {
      const response = await apiClient.post<PlaceResponse>('/places/ensure', payload);
      
      if (!response.data?.data) {
        throw new Error('Error en respuesta del servidor');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error ensuring place:', error);
      throw new Error('Error al asegurar lugar');
    }
  }

  async uploadPlaceImage(placeId: string, imageFile: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await apiClient.post<{ success: boolean; data: { url: string } }>(
        `/places/${placeId}/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.data?.data) {
        throw new Error('Error en respuesta del servidor');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error uploading place image:', error);
      throw new Error('Error al subir imagen');
    }
  }

  async removePlaceImage(placeId: string, imageUrl: string): Promise<void> {
    try {
      await apiClient.delete(`/places/${placeId}/images`, {
        data: { imageUrl },
      });
    } catch (error) {
      console.error('Error removing place image:', error);
      throw new Error('Error al eliminar imagen');
    }
  }
}

export const placesService = new PlacesService();
