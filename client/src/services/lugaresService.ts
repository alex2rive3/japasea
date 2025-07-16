import type { Lugar } from '../types/lugares'

const API_BASE_URL = 'http://localhost:3001'

export const lugaresService = {
  async getLugaresPorTipo(tipo?: string): Promise<Lugar[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/lugares${tipo ? `?tipo=${encodeURIComponent(tipo)}` : ''}`)
      if (!response.ok) {
        throw new Error('Error al obtener lugares')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching lugares:', error)
      return []
    }
  },

  async buscarLugares(query: string): Promise<Lugar[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/lugares/buscar?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error('Error al buscar lugares')
      }
      return await response.json()
    } catch (error) {
      console.error('Error searching lugares:', error)
      return []
    }
  },

  async getLugaresAleatorios(cantidad: number = 3): Promise<Lugar[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/lugares/aleatorios?cantidad=${cantidad}`)
      if (!response.ok) {
        throw new Error('Error al obtener lugares aleatorios')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching random lugares:', error)
      return []
    }
  }
}
