import type { Place } from '../types/places'

const API_BASE_URL = 'http://localhost:3001'

export const placesService = {
  async getPlacesByType(type?: string): Promise<Place[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/places${type ? `?type=${encodeURIComponent(type)}` : ''}`)
      if (!response.ok) {
        throw new Error('Error al obtener lugares')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching places:', error)
      return []
    }
  },

  async searchPlaces(query: string): Promise<Place[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/places/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error('Error al buscar lugares')
      }
      return await response.json()
    } catch (error) {
      console.error('Error searching places:', error)
      return []
    }
  },

  async getRandomPlaces(count: number = 3): Promise<Place[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/places/random?count=${count}`)
      if (!response.ok) {
        throw new Error('Error al obtener lugares aleatorios')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching random places:', error)
      return []
    }
  },

  async processChatMessage(message: string, context?: string): Promise<{response: string, places: Place[], useGoogleMaps?: boolean}> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context
        })
      })

      if (!response.ok) {
        throw new Error('Error al procesar mensaje de chat')
      }

      const data = await response.json()
      return {
        response: data.response,
        places: data.places || [],
        useGoogleMaps: data.useGoogleMaps || false
      }
    } catch (error) {
      console.error('Error processing chat message:', error)
      return {
        response: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        places: [],
        useGoogleMaps: false
      }
    }
  }
}
