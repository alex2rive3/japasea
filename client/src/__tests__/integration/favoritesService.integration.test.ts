/**
 * Tests de Integración para FavoritesService
 * 
 * Verifica que las peticiones HTTP para favoritos sean correctas,
 * valida estructura de respuestas JSON y manejo de errores.
 */

import { favoritesService } from '../../services/favoritesService'
import { server } from '../../test/mocks/server'
import { http, HttpResponse } from 'msw'
import {
  setAuthTokens,
  clearAuthTokens,
  unauthorizedResponse,
  serverErrorResponse,
  expectApiResponse
} from '../../test/helpers/testUtils'

const API_BASE_URL = 'http://localhost:3001'

describe('FavoritesService Integration Tests', () => {
  beforeEach(() => {
    clearAuthTokens()
  })

  afterEach(() => {
    clearAuthTokens()
  })

  describe('getFavorites()', () => {
    it('DEBE obtener favoritos exitosamente con status 200 y usuario autenticado', async () => {
      // Arrange
      setAuthTokens('mock-user-token')

      // Act
      const result = await favoritesService.getFavorites()

      // Assert
      expect(result).toBeDefined()
      expectApiResponse(result, ['success', 'count', 'data'])
      expect(result.success).toBe(true)
      expect(typeof result.count).toBe('number')
      expect(Array.isArray(result.data)).toBe(true)
      
      // Verificar estructura de cada favorito
      if (result.data.length > 0) {
        const favorite = result.data[0]
        expect(favorite).toHaveProperty('_id')
        expect(favorite).toHaveProperty('name')
        expect(favorite).toHaveProperty('description')
        expect(favorite).toHaveProperty('type')
        expect(favorite).toHaveProperty('location')
        expect(favorite).toHaveProperty('address')
        expect(favorite).toHaveProperty('images')
        expect(favorite).toHaveProperty('rating')
        expect(favorite).toHaveProperty('status')
        expect(favorite).toHaveProperty('isFavorite')
        expect(favorite).toHaveProperty('favoritedAt')
        
        // Verificar tipos de datos
        expect(typeof favorite._id).toBe('string')
        expect(typeof favorite.name).toBe('string')
        expect(typeof favorite.description).toBe('string')
        expect(typeof favorite.type).toBe('string')
        expect(typeof favorite.address).toBe('string')
        expect(typeof favorite.isFavorite).toBe('boolean')
        expect(typeof favorite.favoritedAt).toBe('string')
        
        // Verificar estructura de location
        expect(favorite.location).toHaveProperty('coordinates')
        expect(Array.isArray(favorite.location.coordinates)).toBe(true)
        expect(favorite.location.coordinates.length).toBe(2)
        expect(typeof favorite.location.coordinates[0]).toBe('number')
        expect(typeof favorite.location.coordinates[1]).toBe('number')
        
        // Verificar estructura de rating
        expect(favorite.rating).toHaveProperty('average')
        expect(favorite.rating).toHaveProperty('count')
        expect(typeof favorite.rating.average).toBe('number')
        expect(typeof favorite.rating.count).toBe('number')
        
        // Verificar estructura de images
        expect(Array.isArray(favorite.images)).toBe(true)
        if (favorite.images.length > 0) {
          expect(favorite.images[0]).toHaveProperty('url')
          expect(favorite.images[0]).toHaveProperty('isPrimary')
          expect(typeof favorite.images[0].url).toBe('string')
          expect(typeof favorite.images[0].isPrimary).toBe('boolean')
        }
      }
    })

    it('DEBE fallar con status 401 sin token de autorización', async () => {
      // Arrange - No establecer token

      // Act & Assert
      await expect(favoritesService.getFavorites())
        .rejects
        .toThrow('No authentication token found')
    })

    it('DEBE incluir header de autorización correcto', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      let requestHeaders: HeadersInit = {}
      
      server.use(
        http.get(`${API_BASE_URL}/api/v1/favorites`, ({ request }) => {
          requestHeaders = Object.fromEntries(request.headers.entries())
          return HttpResponse.json({
            success: true,
            count: 0,
            data: []
          })
        })
      )

      // Act
      await favoritesService.getFavorites()

      // Assert
      expect(requestHeaders['authorization']).toBe('Bearer mock-user-token')
      expect(requestHeaders['content-type']).toBe('application/json')
    })

    it('DEBE manejar respuestas de error del servidor', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      server.use(
        http.get(`${API_BASE_URL}/api/v1/favorites`, () => {
          return HttpResponse.json(
            { success: false, message: 'Error del servidor' },
            { status: 500 }
          )
        })
      )

      // Act & Assert
      await expect(favoritesService.getFavorites())
        .rejects
        .toThrow('Error al obtener favoritos')
    })
  })

  describe('addFavorite()', () => {
    it('DEBE agregar favorito exitosamente con status 200', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const placeId = 'place-123'

      // Act
      const result = await favoritesService.addFavorite(placeId)

      // Assert
      expect(result).toBeDefined()
      expectApiResponse(result, ['success', 'message', 'data'])
      expect(result.success).toBe(true)
      expect(typeof result.message).toBe('string')
      expect(result.data).toHaveProperty('placeId')
      expect(result.data).toHaveProperty('isFavorite')
      expect(result.data.placeId).toBe(placeId)
      expect(result.data.isFavorite).toBe(true)
    })

    it('DEBE enviar petición POST al endpoint correcto', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const placeId = 'place-456'
      let requestMethod = ''
      let requestUrl = ''
      
      server.use(
        http.post(`${API_BASE_URL}/api/v1/favorites/${placeId}`, ({ request }) => {
          requestMethod = request.method
          requestUrl = request.url
          return HttpResponse.json({
            success: true,
            message: 'Added to favorites',
            data: { placeId, isFavorite: true }
          })
        })
      )

      // Act
      await favoritesService.addFavorite(placeId)

      // Assert
      expect(requestMethod).toBe('POST')
      expect(requestUrl).toContain(`/favorites/${placeId}`)
    })

    it('DEBE fallar sin token de autorización', async () => {
      // Arrange - No establecer token
      const placeId = 'place-123'

      // Act & Assert
      await expect(favoritesService.addFavorite(placeId))
        .rejects
        .toThrow('No authentication token found')
    })

    it('DEBE manejar errores específicos del servidor', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const placeId = 'place-123'
      
      server.use(
        http.post(`${API_BASE_URL}/api/v1/favorites/${placeId}`, () => {
          return HttpResponse.json(
            { success: false, message: 'Ya está en favoritos' },
            { status: 409 }
          )
        })
      )

      // Act & Assert
      await expect(favoritesService.addFavorite(placeId))
        .rejects
        .toThrow('Ya está en favoritos')
    })
  })

  describe('removeFavorite()', () => {
    it('DEBE remover favorito exitosamente con status 200', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const placeId = 'place-123'
      
      server.use(
        http.delete(`${API_BASE_URL}/api/v1/favorites/${placeId}`, () => {
          return HttpResponse.json({
            success: true,
            message: 'Lugar removido de favoritos',
            data: { placeId, isFavorite: false }
          })
        })
      )

      // Act
      const result = await favoritesService.removeFavorite(placeId)

      // Assert
      expect(result).toBeDefined()
      expectApiResponse(result, ['success', 'message', 'data'])
      expect(result.success).toBe(true)
      expect(result.data.placeId).toBe(placeId)
      expect(result.data.isFavorite).toBe(false)
    })

    it('DEBE enviar petición DELETE al endpoint correcto', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const placeId = 'place-789'
      let requestMethod = ''
      let requestUrl = ''
      
      server.use(
        http.delete(`${API_BASE_URL}/api/v1/favorites/${placeId}`, ({ request }) => {
          requestMethod = request.method
          requestUrl = request.url
          return HttpResponse.json({
            success: true,
            message: 'Removed',
            data: {}
          })
        })
      )

      // Act
      await favoritesService.removeFavorite(placeId)

      // Assert
      expect(requestMethod).toBe('DELETE')
      expect(requestUrl).toContain(`/favorites/${placeId}`)
    })

    it('DEBE fallar sin token de autorización', async () => {
      // Arrange - No establecer token
      const placeId = 'place-123'

      // Act & Assert
      await expect(favoritesService.removeFavorite(placeId))
        .rejects
        .toThrow('No authentication token found')
    })

    it('DEBE manejar lugar no encontrado en favoritos', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const placeId = 'place-nonexistent'
      
      server.use(
        http.delete(`${API_BASE_URL}/api/v1/favorites/${placeId}`, () => {
          return HttpResponse.json(
            { success: false, message: 'Lugar no está en favoritos' },
            { status: 404 }
          )
        })
      )

      // Act & Assert
      await expect(favoritesService.removeFavorite(placeId))
        .rejects
        .toThrow('Error al eliminar de favoritos')
    })
  })

  describe('checkFavorite()', () => {
    it('DEBE verificar estado de favorito exitosamente', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const placeId = 'place-123'
      
      server.use(
        http.get(`${API_BASE_URL}/api/v1/favorites/check/${placeId}`, () => {
          return HttpResponse.json({
            success: true,
            data: { placeId, isFavorite: true }
          })
        })
      )

      // Act
      const result = await favoritesService.checkFavorite(placeId)

      // Assert
      expect(result).toBeDefined()
      expectApiResponse(result, ['success', 'data'])
      expect(result.success).toBe(true)
      expect(result.data).toHaveProperty('placeId')
      expect(result.data).toHaveProperty('isFavorite')
      expect(result.data.placeId).toBe(placeId)
      expect(typeof result.data.isFavorite).toBe('boolean')
    })

    it('DEBE enviar petición GET al endpoint correcto', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const placeId = 'place-check-test'
      let requestUrl = ''
      
      server.use(
        http.get(`${API_BASE_URL}/api/v1/favorites/check/${placeId}`, ({ request }) => {
          requestUrl = request.url
          return HttpResponse.json({
            success: true,
            data: { placeId, isFavorite: false }
          })
        })
      )

      // Act
      await favoritesService.checkFavorite(placeId)

      // Assert
      expect(requestUrl).toContain(`/favorites/check/${placeId}`)
    })

    it('DEBE fallar sin token de autorización', async () => {
      // Arrange - No establecer token
      const placeId = 'place-123'

      // Act & Assert
      await expect(favoritesService.checkFavorite(placeId))
        .rejects
        .toThrow('No authentication token found')
    })
  })

  describe('checkMultipleFavorites()', () => {
    it('DEBE verificar múltiples favoritos exitosamente', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const placeIds = ['place-1', 'place-2', 'place-3']
      
      server.use(
        http.post(`${API_BASE_URL}/api/v1/favorites/check-multiple`, async ({ request }) => {
          const body = await request.json() as any
          expect(body.placeIds).toEqual(placeIds)
          
          return HttpResponse.json({
            success: true,
            data: {
              'place-1': true,
              'place-2': false,
              'place-3': true
            }
          })
        })
      )

      // Act
      const result = await favoritesService.checkMultipleFavorites(placeIds)

      // Assert
      expect(result).toBeDefined()
      expectApiResponse(result, ['success', 'data'])
      expect(result.success).toBe(true)
      expect(typeof result.data).toBe('object')
      
      // Verificar que cada placeId tiene un valor boolean
      placeIds.forEach(placeId => {
        expect(result.data).toHaveProperty(placeId)
        expect(typeof result.data[placeId]).toBe('boolean')
      })
    })

    it('DEBE enviar el array de placeIds en el cuerpo de la petición', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const placeIds = ['place-a', 'place-b']
      let requestBody: any = {}
      
      server.use(
        http.post(`${API_BASE_URL}/api/v1/favorites/check-multiple`, async ({ request }) => {
          requestBody = await request.json()
          return HttpResponse.json({
            success: true,
            data: {}
          })
        })
      )

      // Act
      await favoritesService.checkMultipleFavorites(placeIds)

      // Assert
      expect(requestBody).toHaveProperty('placeIds')
      expect(requestBody.placeIds).toEqual(placeIds)
    })

    it('DEBE incluir header Content-Type application/json', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      let requestHeaders: HeadersInit = {}
      
      server.use(
        http.post(`${API_BASE_URL}/api/v1/favorites/check-multiple`, ({ request }) => {
          requestHeaders = Object.fromEntries(request.headers.entries())
          return HttpResponse.json({ success: true, data: {} })
        })
      )

      // Act
      await favoritesService.checkMultipleFavorites(['place-1'])

      // Assert
      expect(requestHeaders['content-type']).toBe('application/json')
      expect(requestHeaders['authorization']).toBe('Bearer mock-user-token')
    })

    it('DEBE fallar sin token de autorización', async () => {
      // Arrange - No establecer token
      const placeIds = ['place-1', 'place-2']

      // Act & Assert
      await expect(favoritesService.checkMultipleFavorites(placeIds))
        .rejects
        .toThrow('No authentication token found')
    })
  })

  describe('getFavoriteStats()', () => {
    it('DEBE obtener estadísticas de favoritos exitosamente', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      
      server.use(
        http.get(`${API_BASE_URL}/api/v1/favorites/stats`, () => {
          return HttpResponse.json({
            success: true,
            data: {
              total: 15,
              byType: {
                'restaurant': 5,
                'historical': 4,
                'beach': 3,
                'natural': 3
              },
              recentlyAdded: [
                {
                  placeId: 'place-1',
                  addedAt: '2024-01-15T10:00:00.000Z'
                }
              ]
            }
          })
        })
      )

      // Act
      const result = await favoritesService.getFavoriteStats()

      // Assert
      expect(result).toBeDefined()
      expectApiResponse(result, ['success', 'data'])
      expect(result.success).toBe(true)
      
      const stats = result.data
      expect(stats).toHaveProperty('total')
      expect(stats).toHaveProperty('byType')
      expect(stats).toHaveProperty('recentlyAdded')
      
      // Verificar tipos de datos
      expect(typeof stats.total).toBe('number')
      expect(typeof stats.byType).toBe('object')
      expect(Array.isArray(stats.recentlyAdded)).toBe(true)
      
      // Verificar estructura de byType
      Object.values(stats.byType).forEach(count => {
        expect(typeof count).toBe('number')
      })
      
      // Verificar estructura de recentlyAdded
      if (stats.recentlyAdded.length > 0) {
        const recent = stats.recentlyAdded[0]
        expect(recent).toHaveProperty('placeId')
        expect(recent).toHaveProperty('addedAt')
        expect(typeof recent.placeId).toBe('string')
        expect(typeof recent.addedAt).toBe('string')
      }
    })

    it('DEBE fallar sin token de autorización', async () => {
      // Arrange - No establecer token

      // Act & Assert
      await expect(favoritesService.getFavoriteStats())
        .rejects
        .toThrow('No authentication token found')
    })

    it('DEBE manejar respuesta de error del servidor', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      server.use(
        http.get(`${API_BASE_URL}/api/v1/favorites/stats`, () => {
          return HttpResponse.json(serverErrorResponse, { status: 500 })
        })
      )

      // Act & Assert
      await expect(favoritesService.getFavoriteStats())
        .rejects
        .toThrow('Error al obtener estadísticas')
    })
  })

  describe('syncFavorites()', () => {
    it('DEBE sincronizar favoritos exitosamente', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const favorites = ['place-1', 'place-2', 'place-3']
      
      server.use(
        http.post(`${API_BASE_URL}/api/v1/favorites/sync`, async ({ request }) => {
          const body = await request.json() as any
          expect(body.favorites).toEqual(favorites)
          
          return HttpResponse.json({
            success: true,
            message: 'Favoritos sincronizados exitosamente',
            data: {
              synced: 3,
              requested: 3
            }
          })
        })
      )

      // Act
      const result = await favoritesService.syncFavorites(favorites)

      // Assert
      expect(result).toBeDefined()
      expectApiResponse(result, ['success', 'message', 'data'])
      expect(result.success).toBe(true)
      expect(typeof result.message).toBe('string')
      
      expect(result.data).toHaveProperty('synced')
      expect(result.data).toHaveProperty('requested')
      expect(typeof result.data.synced).toBe('number')
      expect(typeof result.data.requested).toBe('number')
      expect(result.data.requested).toBe(favorites.length)
    })

    it('DEBE enviar el array de favoritos en el cuerpo de la petición', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const favorites = ['fav-1', 'fav-2']
      let requestBody: any = {}
      
      server.use(
        http.post(`${API_BASE_URL}/api/v1/favorites/sync`, async ({ request }) => {
          requestBody = await request.json()
          return HttpResponse.json({
            success: true,
            message: 'Synced',
            data: { synced: 2, requested: 2 }
          })
        })
      )

      // Act
      await favoritesService.syncFavorites(favorites)

      // Assert
      expect(requestBody).toHaveProperty('favorites')
      expect(requestBody.favorites).toEqual(favorites)
    })

    it('DEBE fallar sin token de autorización', async () => {
      // Arrange - No establecer token
      const favorites = ['place-1']

      // Act & Assert
      await expect(favoritesService.syncFavorites(favorites))
        .rejects
        .toThrow('No authentication token found')
    })
  })

  describe('Utilidades de localStorage', () => {
    it('saveToLocalStorage() DEBE guardar favoritos en localStorage', async () => {
      // Arrange
      const favorites = [
        {
          _id: 'place-1',
          name: 'Test Place',
          description: 'Test Description',
          type: 'restaurant',
          location: { type: 'Point', coordinates: [-77, -12], lat: -12, lng: -77 },
          address: 'Test Address',
          images: [],
          rating: { average: 4.5, count: 10 },
          status: 'active',
          isFavorite: true,
          favoritedAt: '2024-01-15T10:00:00.000Z'
        }
      ]

      // Act
      await favoritesService.saveToLocalStorage(favorites)

      // Assert
      const saved = localStorage.getItem('favorites_cache')
      expect(saved).toBeDefined()
      
      const parsed = JSON.parse(saved!)
      expect(parsed).toHaveProperty('data')
      expect(parsed).toHaveProperty('timestamp')
      expect(parsed.data).toEqual(favorites)
      expect(typeof parsed.timestamp).toBe('string')
    })

    it('getFromLocalStorage() DEBE obtener favoritos del localStorage', () => {
      // Arrange
      const testData = {
        data: [{ _id: 'test-place', name: 'Test' }],
        timestamp: '2024-01-15T10:00:00.000Z'
      }
      localStorage.setItem('favorites_cache', JSON.stringify(testData))

      // Act
      const result = favoritesService.getFromLocalStorage()

      // Assert
      expect(result).toEqual(testData)
    })

    it('getFromLocalStorage() DEBE retornar null si no hay datos', () => {
      // Arrange - Asegurar que no hay datos

      // Act
      const result = favoritesService.getFromLocalStorage()

      // Assert
      expect(result).toBeNull()
    })

    it('clearLocalStorage() DEBE limpiar el cache de favoritos', () => {
      // Arrange
      localStorage.setItem('favorites_cache', 'test-data')

      // Act
      favoritesService.clearLocalStorage()

      // Assert
      const cached = localStorage.getItem('favorites_cache')
      expect(cached).toBeNull()
    })

    it('isCacheValid() DEBE validar correctamente un timestamp reciente', () => {
      // Arrange
      const recentTimestamp = new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutos atrás

      // Act
      const result = favoritesService.isCacheValid(recentTimestamp)

      // Assert
      expect(result).toBe(true)
    })

    it('isCacheValid() DEBE invalidar un timestamp antiguo', () => {
      // Arrange
      const oldTimestamp = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 horas atrás

      // Act
      const result = favoritesService.isCacheValid(oldTimestamp)

      // Assert
      expect(result).toBe(false)
    })
  })
})
