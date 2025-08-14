import { apiClient } from '../../../services/apiConfig'
import type {
  Place,
  PlaceSearchParams,
  TravelPlan,
  ChatResponse
} from '../types'

class PlacesService {
  // Public endpoints
  async getAllPlaces(params?: PlaceSearchParams): Promise<Place[]> {
    try {
      const searchParams = new URLSearchParams()
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.set(key, String(value))
          }
        })
      }

      const response = await apiClient.get<{ places: Place[] }>(
        `/places${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
      )

      return response.places || []
    } catch (error) {
      console.error('Error fetching places:', error)
      throw new Error('Error al obtener lugares')
    }
  }

  async getPlaceById(id: string): Promise<Place> {
    try {
      const response = await apiClient.get<Place>(`/places/${id}`)
      
      if (!response) {
        throw new Error('Lugar no encontrado')
      }
      
      return response
    } catch (error) {
      console.error('Error fetching place by id:', error)
      throw new Error('Error al obtener lugar')
    }
  }

  async searchPlaces(query: string, params?: Omit<PlaceSearchParams, 'query'>): Promise<Place[]> {
    try {
      const searchParams = new URLSearchParams({ query })
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.set(key, String(value))
          }
        })
      }

      const response = await apiClient.get<{ places: Place[] }>(
        `/places/search?${searchParams.toString()}`
      )

      return response.places || []
    } catch (error) {
      console.error('Error searching places:', error)
      throw new Error('Error al buscar lugares')
    }
  }

  async getPlacesByType(type: string): Promise<Place[]> {
    try {
      const response = await apiClient.get<{ places: Place[] }>(`/places/type/${type}`)
      return response.places || []
    } catch (error) {
      console.error('Error fetching places by type:', error)
      throw new Error('Error al obtener lugares por tipo')
    }
  }

  async getFeaturedPlaces(): Promise<Place[]> {
    try {
      const response = await apiClient.get<{ places: Place[] }>('/places/featured')
      return response.places || []
    } catch (error) {
      console.error('Error fetching featured places:', error)
      throw new Error('Error al obtener lugares destacados')
    }
  }

  async getNearbyPlaces(lat: number, lng: number, radius: number = 10): Promise<Place[]> {
    try {
      const response = await apiClient.get<{ places: Place[] }>(
        `/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
      )
      return response.places || []
    } catch (error) {
      console.error('Error fetching nearby places:', error)
      throw new Error('Error al obtener lugares cercanos')
    }
  }

  // Travel planning endpoints
  async generateTravelPlan(
    duration: number,
    interests: string[],
    budget?: string
  ): Promise<TravelPlan> {
    try {
      const response = await apiClient.post<TravelPlan>('/places/travel-plan', {
        duration,
        interests,
        budget,
      })
      
      if (!response) {
        throw new Error('Error en respuesta del servidor')
      }
      
      return response
    } catch (error) {
      console.error('Error generating travel plan:', error)
      throw new Error('Error al generar plan de viaje')
    }
  }

  async getRecommendations(preferences: {
    types?: string[]
    budget?: string
    location?: { lat: number; lng: number }
  }): Promise<Place[]> {
    try {
      const response = await apiClient.post<{ places: Place[] }>('/places/recommendations', preferences)
      return response.places || []
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      throw new Error('Error al obtener recomendaciones')
    }
  }

  // Chat and AI endpoints
  async sendChatMessage(message: string, sessionId?: string): Promise<ChatResponse> {
    try {
      const response = await apiClient.post<ChatResponse>('/places/chat', {
        message,
        sessionId,
      })
      
      if (!response) {
        throw new Error('Error en respuesta del servidor')
      }
      
      return response
    } catch (error) {
      console.error('Error sending chat message:', error)
      throw new Error('Error al enviar mensaje')
    }
  }

  // User-specific endpoints (require authentication)
  async createPlace(placeData: Partial<Place>): Promise<Place> {
    try {
      const response = await apiClient.post<Place>('/places', placeData)
      
      if (!response) {
        throw new Error('Error en respuesta del servidor')
      }
      
      return response
    } catch (error) {
      console.error('Error creating place:', error)
      throw new Error('Error al crear lugar')
    }
  }

  async updatePlace(id: string, updates: Partial<Place>): Promise<Place> {
    try {
      const response = await apiClient.patch<Place>(`/places/${id}`, updates)
      
      if (!response) {
        throw new Error('Error en respuesta del servidor')
      }
      
      return response
    } catch (error) {
      console.error('Error updating place:', error)
      throw new Error('Error al actualizar lugar')
    }
  }

  async deletePlace(id: string): Promise<void> {
    try {
      await apiClient.delete(`/places/${id}`)
    } catch (error) {
      console.error('Error deleting place:', error)
      throw new Error('Error al eliminar lugar')
    }
  }

  // Admin endpoints
  async adminListPlaces(params: PlaceSearchParams = {}): Promise<{
    places: Place[]
    pagination: {
      currentPage: number
      totalPages: number
      totalPlaces: number
      limit: number
    }
  }> {
    try {
      const searchParams = new URLSearchParams()
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value))
        }
      })

      const response = await apiClient.get<{
        places: Place[]
        pagination: {
          currentPage: number
          totalPages: number
          totalPlaces: number
          limit: number
        }
      }>(`/admin/places?${searchParams.toString()}`)

      if (!response) {
        throw new Error('Error en respuesta del servidor')
      }

      return response
    } catch (error) {
      console.error('Error admin listing places:', error)
      throw new Error('Error al listar lugares (admin)')
    }
  }

  async adminUpdatePlace(id: string, updates: Partial<Place>): Promise<Place> {
    try {
      const response = await apiClient.patch<Place>(`/admin/places/${id}`, updates)
      
      if (!response) {
        throw new Error('Error en respuesta del servidor')
      }
      
      return response
    } catch (error) {
      console.error('Error admin updating place:', error)
      throw new Error('Error al actualizar lugar (admin)')
    }
  }

  async adminDeletePlace(id: string): Promise<void> {
    try {
      await apiClient.delete(`/admin/places/${id}`)
    } catch (error) {
      console.error('Error admin deleting place:', error)
      throw new Error('Error al eliminar lugar (admin)')
    }
  }

  // Utility methods
  async ensurePlace(payload: Partial<Place>): Promise<Place> {
    try {
      const response = await apiClient.post<Place>('/places/ensure', payload)
      
      if (!response) {
        throw new Error('Error en respuesta del servidor')
      }
      
      return response
    } catch (error) {
      console.error('Error ensuring place:', error)
      throw new Error('Error al asegurar lugar')
    }
  }
}

export const placesService = new PlacesService()
