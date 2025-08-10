/**
 * Tests de Integración para PlacesService
 * 
 * Verifica que las peticiones HTTP para lugares sean correctas,
 * valida estructura de respuestas JSON y manejo de errores.
 */

import { placesService } from '../../services/placesService'
import { server } from '../../test/mocks/server'
import { http, HttpResponse } from 'msw'
import {
  expectPlaceStructure,
  mockPlace,
  setAuthTokens,
  clearAuthTokens,
  unauthorizedResponse,
  notFoundResponse,
  serverErrorResponse
} from '../../test/helpers/testUtils'

const API_BASE_URL = 'http://localhost:3001'

describe('PlacesService Integration Tests', () => {
  beforeEach(() => {
    clearAuthTokens()
  })

  afterEach(() => {
    clearAuthTokens()
  })

  describe('getPlacesByType()', () => {
    it('DEBE obtener todos los lugares con status 200 cuando no se especifica tipo', async () => {
      // Act
      const result = await placesService.getPlacesByType()

      // Assert
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      
      // Verificar estructura de cada lugar
      result.forEach(place => {
        expectPlaceStructure(place)
        expect(place).toHaveProperty('type')
        expect(place).toHaveProperty('rating')
        expect(place).toHaveProperty('images')
        expect(place).toHaveProperty('status')
      })
    })

    it('DEBE filtrar lugares por tipo específico correctamente', async () => {
      // Arrange
      const targetType = 'historical'

      // Act
      const result = await placesService.getPlacesByType(targetType)

      // Assert
      expect(Array.isArray(result)).toBe(true)
      result.forEach(place => {
        expectPlaceStructure(place)
        expect(place.type).toBe(targetType)
      })
    })

    it('DEBE incluir header de autorización cuando el usuario está logueado', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      let requestHeaders: HeadersInit = {}
      
      server.use(
        http.get(`${API_BASE_URL}/api/v1/places`, ({ request }) => {
          requestHeaders = Object.fromEntries(request.headers.entries())
          return HttpResponse.json([mockPlace])
        })
      )

      // Act
      await placesService.getPlacesByType()

      // Assert
      expect(requestHeaders['authorization']).toBe('Bearer mock-user-token')
    })

    it('DEBE retornar array vacío en caso de error de red', async () => {
      // Arrange
      server.use(
        http.get(`${API_BASE_URL}/api/v1/places`, () => {
          return HttpResponse.json(serverErrorResponse, { status: 500 })
        })
      )

      // Act
      const result = await placesService.getPlacesByType()

      // Assert
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })

    it('DEBE validar que cada lugar tenga la estructura JSON correcta', async () => {
      // Act
      const result = await placesService.getPlacesByType()

      // Assert
      expect(result.length).toBeGreaterThan(0)
      result.forEach(place => {
        // Verificar propiedades requeridas
        expect(place).toHaveProperty('_id')
        expect(place).toHaveProperty('name')
        expect(place).toHaveProperty('description')
        expect(place).toHaveProperty('location')
        expect(place).toHaveProperty('address')
        
        // Verificar tipos de datos
        expect(typeof place._id).toBe('string')
        expect(typeof place.name).toBe('string')
        expect(typeof place.description).toBe('string')
        expect(typeof place.address).toBe('string')
        
        // Verificar estructura de location
        expect(place.location).toHaveProperty('lat')
        expect(place.location).toHaveProperty('lng')
        expect(typeof place.location.lat).toBe('number')
        expect(typeof place.location.lng).toBe('number')
        
        // Verificar propiedades opcionales
        if (place.rating) {
          expect(place.rating).toHaveProperty('average')
          expect(place.rating).toHaveProperty('count')
          expect(typeof place.rating.average).toBe('number')
          expect(typeof place.rating.count).toBe('number')
        }
        
        if (place.images) {
          expect(Array.isArray(place.images)).toBe(true)
        }
      })
    })
  })

  describe('searchPlaces()', () => {
    it('DEBE buscar lugares exitosamente con query válida', async () => {
      // Arrange
      const searchQuery = 'Machu'

      // Act
      const result = await placesService.searchPlaces(searchQuery)

      // Assert
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      
      result.forEach(place => {
        expectPlaceStructure(place)
        // El nombre debe contener el término de búsqueda (case insensitive)
        expect(place.name.toLowerCase()).toContain(searchQuery.toLowerCase())
      })
    })

    it('DEBE retornar array vacío para query inexistente', async () => {
      // Arrange
      const searchQuery = 'PlaceNotFound'
      server.use(
        http.get(`${API_BASE_URL}/api/v1/places/search`, () => {
          return HttpResponse.json([])
        })
      )

      // Act
      const result = await placesService.searchPlaces(searchQuery)

      // Assert
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })

    it('DEBE codificar correctamente la query en la URL', async () => {
      // Arrange
      const searchQuery = 'lugar con espacios & símbolos'
      let requestUrl = ''
      
      server.use(
        http.get(`${API_BASE_URL}/api/v1/places/search`, ({ request }) => {
          requestUrl = request.url
          return HttpResponse.json([])
        })
      )

      // Act
      await placesService.searchPlaces(searchQuery)

      // Assert
      expect(requestUrl).toContain(encodeURIComponent(searchQuery))
    })

    it('DEBE manejar errores de red y retornar array vacío', async () => {
      // Arrange
      server.use(
        http.get(`${API_BASE_URL}/api/v1/places/search`, () => {
          return HttpResponse.json(serverErrorResponse, { status: 500 })
        })
      )

      // Act
      const result = await placesService.searchPlaces('test')

      // Assert
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })
  })

  describe('getRandomPlaces()', () => {
    it('DEBE obtener 3 lugares aleatorios por defecto', async () => {
      // Act
      const result = await placesService.getRandomPlaces()

      // Assert
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(3)
      
      result.forEach(place => {
        expectPlaceStructure(place)
      })
    })

    it('DEBE obtener el número específico de lugares solicitados', async () => {
      // Arrange
      const requestedCount = 2

      // Act
      const result = await placesService.getRandomPlaces(requestedCount)

      // Assert
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(requestedCount)
    })

    it('DEBE enviar el parámetro count en la URL correctamente', async () => {
      // Arrange
      const count = 5
      let requestUrl = ''
      
      server.use(
        http.get(`${API_BASE_URL}/api/v1/places/random`, ({ request }) => {
          requestUrl = request.url
          return HttpResponse.json([])
        })
      )

      // Act
      await placesService.getRandomPlaces(count)

      // Assert
      expect(requestUrl).toContain(`count=${count}`)
    })

    it('DEBE manejar errores y retornar array vacío', async () => {
      // Arrange
      server.use(
        http.get(`${API_BASE_URL}/api/v1/places/random`, () => {
          return HttpResponse.json(serverErrorResponse, { status: 500 })
        })
      )

      // Act
      const result = await placesService.getRandomPlaces()

      // Assert
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })
  })

  describe('getPlaceById()', () => {
    it('DEBE obtener lugar específico por ID con status 200', async () => {
      // Arrange
      const placeId = 'place-1'

      // Act
      const result = await placesService.getPlaceById(placeId)

      // Assert
      expect(result).toBeDefined()
      expectPlaceStructure(result)
      expect(result._id).toBe(placeId)
      expect(result.name).toBe('Machu Picchu')
    })

    it('DEBE lanzar error con status 404 para ID inexistente', async () => {
      // Arrange
      const nonExistentId = 'place-999'

      // Act & Assert
      await expect(placesService.getPlaceById(nonExistentId))
        .rejects
        .toThrow('Error al obtener lugar')
    })

    it('DEBE validar estructura JSON completa del lugar', async () => {
      // Arrange
      const placeId = 'place-1'

      // Act
      const result = await placesService.getPlaceById(placeId)

      // Assert
      expect(result).toHaveProperty('_id')
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('description')
      expect(result).toHaveProperty('location')
      expect(result).toHaveProperty('address')
      expect(result).toHaveProperty('type')
      expect(result).toHaveProperty('rating')
      expect(result).toHaveProperty('images')
      expect(result).toHaveProperty('status')
      
      // Verificar estructura anidada
      expect(result.location).toHaveProperty('lat')
      expect(result.location).toHaveProperty('lng')
      expect(result.location).toHaveProperty('address')
      
      expect(result.rating).toHaveProperty('average')
      expect(result.rating).toHaveProperty('count')
      
      expect(Array.isArray(result.images)).toBe(true)
      if (result.images.length > 0) {
        expect(result.images[0]).toHaveProperty('url')
        expect(result.images[0]).toHaveProperty('caption')
      }
    })
  })

  describe('ensurePlace()', () => {
    it('DEBE crear/asegurar lugar exitosamente con datos válidos', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const placeData = {
        name: 'New Place',
        description: 'A new place description',
        location: { lat: -12.0464, lng: -77.0428 },
        type: 'restaurant',
        address: 'Lima, Peru'
      }
      
      server.use(
        http.post(`${API_BASE_URL}/api/v1/places/ensure`, async ({ request }) => {
          const body = await request.json() as any
          return HttpResponse.json({
            success: true,
            data: { ...mockPlace, ...body, _id: 'new-place-id' }
          })
        })
      )

      // Act
      const result = await placesService.ensurePlace(placeData)

      // Assert
      expect(result).toBeDefined()
      expectPlaceStructure(result)
      expect(result.name).toBe(placeData.name)
      expect(result.description).toBe(placeData.description)
    })

    it('DEBE incluir header de autorización cuando hay token', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      let requestHeaders: HeadersInit = {}
      
      server.use(
        http.post(`${API_BASE_URL}/api/v1/places/ensure`, ({ request }) => {
          requestHeaders = Object.fromEntries(request.headers.entries())
          return HttpResponse.json({ success: true, data: mockPlace })
        })
      )

      // Act
      await placesService.ensurePlace({ name: 'Test Place' })

      // Assert
      expect(requestHeaders['authorization']).toBe('Bearer mock-user-token')
      expect(requestHeaders['content-type']).toBe('application/json')
    })

    it('DEBE funcionar sin token de autorización', async () => {
      // Arrange - No establecer token
      const placeData = { name: 'Test Place' }
      
      server.use(
        http.post(`${API_BASE_URL}/api/v1/places/ensure`, ({ request }) => {
          const authHeader = request.headers.get('Authorization')
          expect(authHeader).toBeNull()
          return HttpResponse.json({ success: true, data: mockPlace })
        })
      )

      // Act & Assert
      await expect(placesService.ensurePlace(placeData))
        .resolves
        .toBeDefined()
    })

    it('DEBE manejar errores del servidor correctamente', async () => {
      // Arrange
      server.use(
        http.post(`${API_BASE_URL}/api/v1/places/ensure`, () => {
          return HttpResponse.json(
            { success: false, message: 'Error creating place' },
            { status: 400 }
          )
        })
      )

      // Act & Assert
      await expect(placesService.ensurePlace({ name: 'Test' }))
        .rejects
        .toThrow('Error creating place')
    })
  })

  describe('processChatMessage()', () => {
    it('DEBE procesar mensaje de chat exitosamente y retornar respuesta estructurada', async () => {
      // Arrange
      const message = '¿Qué lugares históricos me recomiendas?'
      const context = 'tourism'
      const sessionId = 'session-123'

      // Act
      const result = await placesService.processChatMessage(message, context, sessionId)

      // Assert
      expect(result).toBeDefined()
      expect(result).toHaveProperty('message')
      expect(result).toHaveProperty('places')
      expect(result).toHaveProperty('timestamp')
      expect(result).toHaveProperty('sessionId')
      
      // Verificar tipos de datos
      expect(typeof result.message).toBe('string')
      expect(Array.isArray(result.places)).toBe(true)
      expect(typeof result.timestamp).toBe('string')
      expect(typeof result.sessionId).toBe('string')
      
      // Verificar estructura de lugares en la respuesta
      if (result.places && result.places.length > 0) {
        result.places.forEach(place => {
          expectPlaceStructure(place)
        })
      }
    })

    it('DEBE incluir header de autorización cuando el usuario está logueado', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      let requestHeaders: HeadersInit = {}
      
      server.use(
        http.post(`${API_BASE_URL}/api/v1/chat`, ({ request }) => {
          requestHeaders = Object.fromEntries(request.headers.entries())
          return HttpResponse.json({
            message: 'Test response',
            places: [],
            timestamp: new Date().toISOString()
          })
        })
      )

      // Act
      await placesService.processChatMessage('test message')

      // Assert
      expect(requestHeaders['authorization']).toBe('Bearer mock-user-token')
      expect(requestHeaders['content-type']).toBe('application/json')
    })

    it('DEBE funcionar sin token de autorización', async () => {
      // Arrange - No establecer token
      let requestHeaders: HeadersInit = {}
      
      server.use(
        http.post(`${API_BASE_URL}/api/v1/chat`, ({ request }) => {
          requestHeaders = Object.fromEntries(request.headers.entries())
          return HttpResponse.json({
            message: 'Test response',
            places: [],
            timestamp: new Date().toISOString()
          })
        })
      )

      // Act
      const result = await placesService.processChatMessage('test message')

      // Assert
      expect(requestHeaders['authorization']).toBeUndefined()
      expect(result).toBeDefined()
    })

    it('DEBE enviar el payload correcto en el cuerpo de la petición', async () => {
      // Arrange
      const message = 'Test message'
      const context = 'travel'
      const sessionId = 'session-456'
      let requestBody: any = {}
      
      server.use(
        http.post(`${API_BASE_URL}/api/v1/chat`, async ({ request }) => {
          requestBody = await request.json()
          return HttpResponse.json({
            message: 'Response',
            places: [],
            timestamp: new Date().toISOString()
          })
        })
      )

      // Act
      await placesService.processChatMessage(message, context, sessionId)

      // Assert
      expect(requestBody).toEqual({
        message,
        context,
        sessionId
      })
    })

    it('DEBE manejar errores de red y retornar respuesta de error amigable', async () => {
      // Arrange
      server.use(
        http.post(`${API_BASE_URL}/api/v1/chat`, () => {
          return HttpResponse.json(serverErrorResponse, { status: 500 })
        })
      )

      // Act
      const result = await placesService.processChatMessage('test message')

      // Assert
      expect(result).toBeDefined()
      expect(result.message).toContain('hubo un error')
      expect(Array.isArray(result.places)).toBe(true)
      expect(result.places.length).toBe(0)
      expect(typeof result.timestamp).toBe('string')
    })
  })

  describe('getChatHistory()', () => {
    it('DEBE obtener historial de chat exitosamente con usuario autenticado', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const limit = 5
      
      server.use(
        http.get(`${API_BASE_URL}/api/v1/chat/history`, () => {
          return HttpResponse.json({
            status: 'success',
            data: [
              {
                _id: 'session-1',
                sessionId: 'session-123',
                lastActivity: '2024-01-15T10:00:00.000Z',
                messages: [
                  {
                    text: 'Hello',
                    sender: 'user',
                    timestamp: '2024-01-15T10:00:00.000Z'
                  }
                ]
              }
            ]
          })
        })
      )

      // Act
      const result = await placesService.getChatHistory(limit)

      // Assert
      expect(result).toBeDefined()
      expect(result.status).toBe('success')
      expect(Array.isArray(result.data)).toBe(true)
      
      if (result.data.length > 0) {
        const session = result.data[0]
        expect(session).toHaveProperty('_id')
        expect(session).toHaveProperty('sessionId')
        expect(session).toHaveProperty('lastActivity')
        expect(session).toHaveProperty('messages')
        expect(Array.isArray(session.messages)).toBe(true)
      }
    })

    it('DEBE fallar sin token de autorización', async () => {
      // Arrange - No establecer token

      // Act
      const result = await placesService.getChatHistory()

      // Assert
      expect(result.status).toBe('error')
      expect(result.data).toEqual([])
    })

    it('DEBE enviar el parámetro limit correctamente', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const limit = 15
      let requestUrl = ''
      
      server.use(
        http.get(`${API_BASE_URL}/api/v1/chat/history`, ({ request }) => {
          requestUrl = request.url
          return HttpResponse.json({ status: 'success', data: [] })
        })
      )

      // Act
      await placesService.getChatHistory(limit)

      // Assert
      expect(requestUrl).toContain(`limit=${limit}`)
    })
  })

  describe('getChatSession()', () => {
    it('DEBE obtener sesión específica exitosamente', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const sessionId = 'session-123'
      
      server.use(
        http.get(`${API_BASE_URL}/api/v1/chat/session/${sessionId}`, () => {
          return HttpResponse.json({
            status: 'success',
            data: {
              _id: 'session-1',
              sessionId: sessionId,
              lastActivity: '2024-01-15T10:00:00.000Z',
              messages: []
            }
          })
        })
      )

      // Act
      const result = await placesService.getChatSession(sessionId)

      // Assert
      expect(result).toBeDefined()
      expect(result.status).toBe('success')
      expect(result.data).toBeDefined()
      expect(result.data?.sessionId).toBe(sessionId)
    })

    it('DEBE fallar sin token de autorización', async () => {
      // Arrange - No establecer token
      const sessionId = 'session-123'

      // Act
      const result = await placesService.getChatSession(sessionId)

      // Assert
      expect(result.status).toBe('error')
      expect(result.data).toBeNull()
    })

    it('DEBE manejar sesión no encontrada correctamente', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const nonExistentSessionId = 'session-999'
      
      server.use(
        http.get(`${API_BASE_URL}/api/v1/chat/session/${nonExistentSessionId}`, () => {
          return HttpResponse.json(
            { status: 'error', message: 'Session not found' },
            { status: 404 }
          )
        })
      )

      // Act
      const result = await placesService.getChatSession(nonExistentSessionId)

      // Assert
      expect(result.status).toBe('error')
      expect(result.data).toBeNull()
    })
  })

  describe('Utilidades de TravelPlan', () => {
    it('isTravelPlan() DEBE identificar correctamente una respuesta con plan de viaje', () => {
      // Arrange
      const travelPlanResponse = {
        message: 'Plan de viaje creado',
        places: [],
        travelPlan: {
          totalDays: 3,
          days: [
            {
              dayNumber: 1,
              title: 'Día 1',
              activities: [
                {
                  time: '09:00',
                  place: mockPlace
                }
              ]
            }
          ]
        },
        timestamp: new Date().toISOString()
      }

      // Act
      const result = placesService.isTravelPlan(travelPlanResponse)

      // Assert
      expect(result).toBe(true)
    })

    it('isTravelPlan() DEBE identificar correctamente una respuesta sin plan de viaje', () => {
      // Arrange
      const simpleResponse = {
        message: 'Simple recommendation',
        places: [mockPlace],
        timestamp: new Date().toISOString()
      }

      // Act
      const result = placesService.isTravelPlan(simpleResponse)

      // Assert
      expect(result).toBe(false)
    })

    it('extractAllPlacesFromTravelPlan() DEBE extraer todos los lugares de un plan de viaje', () => {
      // Arrange
      const travelPlanResponse = {
        message: 'Plan created',
        places: [],
        travelPlan: {
          totalDays: 2,
          days: [
            {
              dayNumber: 1,
              title: 'Día 1',
              activities: [
                { time: '09:00', place: { ...mockPlace, _id: 'place-1' } },
                { time: '14:00', place: { ...mockPlace, _id: 'place-2' } }
              ]
            },
            {
              dayNumber: 2,
              title: 'Día 2',
              activities: [
                { time: '10:00', place: { ...mockPlace, _id: 'place-3' } }
              ]
            }
          ]
        },
        timestamp: new Date().toISOString()
      }

      // Act
      const result = placesService.extractAllPlacesFromTravelPlan(travelPlanResponse)

      // Assert
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(3)
      expect(result[0]._id).toBe('place-1')
      expect(result[1]._id).toBe('place-2')
      expect(result[2]._id).toBe('place-3')
    })

    it('extractAllPlacesFromTravelPlan() DEBE retornar lugares simples si no es plan de viaje', () => {
      // Arrange
      const simpleResponse = {
        message: 'Simple recommendation',
        places: [mockPlace],
        timestamp: new Date().toISOString()
      }

      // Act
      const result = placesService.extractAllPlacesFromTravelPlan(simpleResponse)

      // Assert
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)
      expect(result[0]).toBe(mockPlace)
    })
  })
})
