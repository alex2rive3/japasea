const API_BASE_URL = 'http://localhost:3001'

export interface Favorite {
  _id: string
  name: string
  description: string
  type: string
  location: {
    type: string
    coordinates: [number, number]
    lat?: number
    lng?: number
  }
  address: string
  images: Array<{
    url: string
    caption?: string
    isPrimary: boolean
  }>
  rating: {
    average: number
    count: number
  }
  status: string
  isFavorite: boolean
  favoritedAt: string
}

export interface FavoriteStats {
  total: number
  byType: Record<string, number>
  recentlyAdded: Array<{
    placeId: string
    addedAt: string
  }>
}

class FavoritesService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      throw new Error('No authentication token found')
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  async getFavorites(): Promise<{ success: boolean; count: number; data: Favorite[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/favorites`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Error al obtener favoritos')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching favorites:', error)
      throw error
    }
  }

  async addFavorite(placeId: string): Promise<{ success: boolean; message: string; data: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/favorites/${placeId}`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al agregar a favoritos')
      }

      return data
    } catch (error) {
      console.error('Error adding favorite:', error)
      throw error
    }
  }

  async removeFavorite(placeId: string): Promise<{ success: boolean; message: string; data: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/favorites/${placeId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Error al eliminar de favoritos')
      }

      return await response.json()
    } catch (error) {
      console.error('Error removing favorite:', error)
      throw error
    }
  }

  async checkFavorite(placeId: string): Promise<{ success: boolean; data: { placeId: string; isFavorite: boolean } }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/favorites/check/${placeId}`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Error al verificar favorito')
      }

      return await response.json()
    } catch (error) {
      console.error('Error checking favorite:', error)
      throw error
    }
  }

  async checkMultipleFavorites(placeIds: string[]): Promise<{ success: boolean; data: Record<string, boolean> }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/favorites/check-multiple`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ placeIds })
      })

      if (!response.ok) {
        throw new Error('Error al verificar favoritos')
      }

      return await response.json()
    } catch (error) {
      console.error('Error checking multiple favorites:', error)
      throw error
    }
  }

  async getFavoriteStats(): Promise<{ success: boolean; data: FavoriteStats }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/favorites/stats`, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Error al obtener estadísticas')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching favorite stats:', error)
      throw error
    }
  }

  async syncFavorites(favorites: string[]): Promise<{ success: boolean; message: string; data: { synced: number; requested: number } }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/favorites/sync`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ favorites })
      })

      if (!response.ok) {
        throw new Error('Error al sincronizar favoritos')
      }

      return await response.json()
    } catch (error) {
      console.error('Error syncing favorites:', error)
      throw error
    }
  }

  // Métodos de utilidad para el almacenamiento local
  async saveToLocalStorage(favorites: Favorite[]): Promise<void> {
    try {
      localStorage.setItem('favorites_cache', JSON.stringify({
        data: favorites,
        timestamp: new Date().toISOString()
      }))
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error)
    }
  }

  getFromLocalStorage(): { data: Favorite[]; timestamp: string } | null {
    try {
      const cached = localStorage.getItem('favorites_cache')
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.error('Error reading favorites from localStorage:', error)
      return null
    }
  }

  clearLocalStorage(): void {
    localStorage.removeItem('favorites_cache')
  }

  // Verificar si el cache es válido (menos de 1 hora)
  isCacheValid(timestamp: string): boolean {
    const cacheTime = new Date(timestamp).getTime()
    const now = new Date().getTime()
    const oneHour = 60 * 60 * 1000
    return (now - cacheTime) < oneHour
  }
}

export const favoritesService = new FavoritesService()