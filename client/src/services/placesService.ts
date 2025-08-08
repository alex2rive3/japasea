import type { Place, ChatResponse } from '../types/places'

const API_BASE_URL = 'http://localhost:3001'

interface ChatHistorySession {
  _id: string
  sessionId: string
  lastActivity: string
  messages: Array<{
    text: string
    sender: 'user' | 'bot'
    timestamp: string
    context?: string
    response?: ChatResponse
  }>
}

export const placesService = {
  async adminListPlaces(params: { page?: number; limit?: number; status?: string; type?: string; q?: string; verified?: boolean; featured?: boolean } = {}) {
    const token = localStorage.getItem('accessToken')
    if (!token) throw new Error('No autenticado')
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) query.set(k, String(v))
    })
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/places?${query.toString()}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Error listando lugares')
    return res.json()
  },

  async getPlaceById(id: string): Promise<Place> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/places/${id}`)
      
      if (!response.ok) {
        throw new Error('Error al obtener lugar')
      }

      const data = await response.json()
      return data.data || data
    } catch (error) {
      console.error('Error fetching place by id:', error)
      throw error
    }
  },

  async adminCreatePlace(payload: any) {
    const token = localStorage.getItem('accessToken')
    if (!token) throw new Error('No autenticado')
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/places`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Error creando lugar')
    return res.json()
  },

  async adminUpdatePlace(id: string, payload: any) {
    const token = localStorage.getItem('accessToken')
    if (!token) throw new Error('No autenticado')
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/places/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Error actualizando lugar')
    return res.json()
  },

  async adminSetStatus(id: string, status: string) {
    const token = localStorage.getItem('accessToken')
    if (!token) throw new Error('No autenticado')
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/places/${id}/status`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    if (!res.ok) throw new Error('Error cambiando estado')
    return res.json()
  },

  async adminVerifyPlace(id: string) {
    const token = localStorage.getItem('accessToken')
    if (!token) throw new Error('No autenticado')
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/places/${id}/verify`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Error verificando lugar')
    return res.json()
  },

  async adminFeaturePlace(id: string, featured: boolean, featuredUntil?: string) {
    const token = localStorage.getItem('accessToken')
    if (!token) throw new Error('No autenticado')
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/places/${id}/feature`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured, featuredUntil })
    })
    if (!res.ok) throw new Error('Error destacando lugar')
    return res.json()
  },
  async getPlacesByType(type?: string): Promise<Place[]> {
    try {
      const token = localStorage.getItem('accessToken')
      const headers: HeadersInit = {}
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`${API_BASE_URL}/api/v1/places${type ? `?type=${encodeURIComponent(type)}` : ''}`, {
        headers
      })
      
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
      const response = await fetch(`${API_BASE_URL}/api/v1/places/search?q=${encodeURIComponent(query)}`)
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
      const response = await fetch(`${API_BASE_URL}/api/v1/places/random?count=${count}`)
      if (!response.ok) {
        throw new Error('Error al obtener lugares aleatorios')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching random places:', error)
      return []
    }
  },

  async processChatMessage(message: string, context?: string, sessionId?: string): Promise<ChatResponse> {
    try {
      const token = localStorage.getItem('accessToken')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message,
          context,
          sessionId
        })
      })

      if (!response.ok) {
        throw new Error('Error al procesar mensaje de chat')
      }

      const data = await response.json()
      
      return {
        message: data.message || data.response,
        places: data.places || [],
        travelPlan: data.travelPlan,
        timestamp: data.timestamp || new Date().toISOString(),
        sessionId: data.sessionId
      }
    } catch (error) {
      console.error('Error processing chat message:', error)
      return {
        message: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        places: [],
        timestamp: new Date().toISOString()
      }
    }
  },

  isTravelPlan(response: ChatResponse): response is ChatResponse & { travelPlan: NonNullable<ChatResponse['travelPlan']> } {
    return response.travelPlan !== undefined
  },

  extractAllPlacesFromTravelPlan(response: ChatResponse): Place[] {
    if (!this.isTravelPlan(response)) {
      return response.places || []
    }

    const allPlaces: Place[] = []
    response.travelPlan.days.forEach(day => {
      day.activities.forEach(activity => {
        allPlaces.push(activity.place)
      })
    })
    
    return allPlaces
  },

  async getChatHistory(limit: number = 10): Promise<{ status: string; data: ChatHistorySession[] }> {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Usuario no autenticado')
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/chat/history?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al obtener el historial del chat')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching chat history:', error)
      return { status: 'error', data: [] }
    }
  },

  async getChatSession(sessionId: string): Promise<{ status: string; data: ChatHistorySession | null }> {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Usuario no autenticado')
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/chat/session/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al obtener la sesión del chat')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching chat session:', error)
      return { status: 'error', data: null }
    }
  }
}
