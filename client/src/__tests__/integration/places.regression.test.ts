/**
 * Tests de Regresión para Endpoints de Lugares
 * 
 * Verifica que las respuestas de los endpoints de lugares
 * mantengan estructura consistente entre versiones.
 */

import { 
  ApiSnapshotManager, 
  makeApiCallWithFallback, 
  getAuthHeaders,
  setupAuth 
} from '../../test/helpers/apiTestUtils'

describe('Places API Regression Tests', () => {
  let snapshotManager: ApiSnapshotManager

  beforeAll(() => {
    snapshotManager = new ApiSnapshotManager()
  })

  beforeEach(() => {
    localStorage.clear()
  })

  describe('GET /api/v1/places', () => {
    it('DEBE mantener estructura de lista de lugares consistente', async () => {
      // Arrange
      const testName = 'places-list-all'

      // Act
      const result = await makeApiCallWithFallback(
        'places-list',
        '/api/v1/places',
        'GET'
      )

      // Assert - Validar status y estructura básica
      expect(result.status).toBe(200)
      expect(Array.isArray(result.data)).toBe(true)

      // Si hay lugares, validar estructura de cada uno
      if (result.data.length > 0) {
        const place = result.data[0]
        
        // Validar propiedades requeridas
        expect(place).toHaveProperty('_id')
        expect(place).toHaveProperty('name')
        expect(place).toHaveProperty('description')
        expect(place).toHaveProperty('location')
        expect(place).toHaveProperty('address')
        expect(place).toHaveProperty('type')

        // Validar tipos de datos
        expect(typeof place._id).toBe('string')
        expect(typeof place.name).toBe('string')
        expect(typeof place.description).toBe('string')
        expect(typeof place.address).toBe('string')
        expect(typeof place.type).toBe('string')

        // Validar estructura de location
        expect(place.location).toHaveProperty('lat')
        expect(place.location).toHaveProperty('lng')
        expect(typeof place.location.lat).toBe('number')
        expect(typeof place.location.lng).toBe('number')

        // Validar rangos de coordenadas
        expect(place.location.lat).toBeGreaterThanOrEqual(-90)
        expect(place.location.lat).toBeLessThanOrEqual(90)
        expect(place.location.lng).toBeGreaterThanOrEqual(-180)
        expect(place.location.lng).toBeLessThanOrEqual(180)

        // Validar rating si existe
        if (place.rating) {
          expect(place.rating).toHaveProperty('average')
          expect(place.rating).toHaveProperty('count')
          expect(typeof place.rating.average).toBe('number')
          expect(typeof place.rating.count).toBe('number')
          expect(place.rating.average).toBeGreaterThanOrEqual(0)
          expect(place.rating.average).toBeLessThanOrEqual(5)
          expect(place.rating.count).toBeGreaterThanOrEqual(0)
        }

        // Validar imágenes si existen
        if (place.images && Array.isArray(place.images)) {
          place.images.forEach((image: any) => {
            expect(image).toHaveProperty('url')
            expect(typeof image.url).toBe('string')
          })
        }
      }

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de lista de lugares ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })

    it('DEBE mantener estructura con filtro por tipo', async () => {
      // Arrange
      const testName = 'places-list-by-type'
      const placeType = 'historical'

      // Act
      const result = await makeApiCallWithFallback(
        testName,
        `/api/v1/places?type=${placeType}`,
        'GET'
      )

      // Assert
      expect(result.status).toBe(200)
      expect(Array.isArray(result.data)).toBe(true)

      // Validar que todos los lugares tengan el tipo correcto
      result.data.forEach((place: any) => {
        if (place.type) {
          expect(place.type).toBe(placeType)
        }
      })

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de filtro por tipo ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('GET /api/v1/places/search', () => {
    it('DEBE mantener estructura de resultados de búsqueda', async () => {
      // Arrange
      const testName = 'places-search'
      const searchQuery = 'machu'

      // Act
      const result = await makeApiCallWithFallback(
        testName,
        `/api/v1/places/search?q=${encodeURIComponent(searchQuery)}`,
        'GET'
      )

      // Assert
      expect(result.status).toBe(200)
      expect(Array.isArray(result.data)).toBe(true)

      // Validar que los resultados contengan el término de búsqueda
      result.data.forEach((place: any) => {
        const searchTerm = searchQuery.toLowerCase()
        const placeText = (place.name + ' ' + place.description).toLowerCase()
        expect(placeText).toContain(searchTerm)
      })

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de búsqueda ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })

    it('DEBE mantener respuesta consistente para búsqueda sin resultados', async () => {
      // Arrange
      const testName = 'places-search-no-results'
      const searchQuery = 'lugarinexistente12345'

      // Act
      const result = await makeApiCallWithFallback(
        testName,
        `/api/v1/places/search?q=${encodeURIComponent(searchQuery)}`,
        'GET'
      )

      // Assert
      expect(result.status).toBe(200)
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.data).toHaveLength(0)

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de búsqueda sin resultados ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('GET /api/v1/places/random', () => {
    it('DEBE mantener estructura de lugares aleatorios', async () => {
      // Arrange
      const testName = 'places-random'
      const count = 3

      // Act
      const result = await makeApiCallWithFallback(
        testName,
        `/api/v1/places/random?count=${count}`,
        'GET'
      )

      // Assert
      expect(result.status).toBe(200)
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.data.length).toBeLessThanOrEqual(count)

      // Validar estructura de cada lugar aleatorio
      result.data.forEach((place: any) => {
        expect(place).toHaveProperty('_id')
        expect(place).toHaveProperty('name')
        expect(place).toHaveProperty('description')
        expect(place).toHaveProperty('location')
      })

      // Comparar con snapshot (excluyendo el orden específico)
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de lugares aleatorios ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('GET /api/v1/places/:id', () => {
    it('DEBE mantener estructura de lugar específico', async () => {
      // Arrange
      const testName = 'places-by-id'
      const placeId = 'place-1' // ID de prueba

      // Act
      const result = await makeApiCallWithFallback(
        testName,
        `/api/v1/places/${placeId}`,
        'GET'
      )

      // Assert
      if (result.status === 200) {
        // Lugar encontrado
        expect(result.data).toHaveProperty('data')
        const place = result.data.data

        expect(place).toHaveProperty('_id')
        expect(place).toHaveProperty('name')
        expect(place).toHaveProperty('description')
        expect(place).toHaveProperty('location')
        expect(place).toHaveProperty('address')

        // Validar ID del lugar
        expect(place._id).toBe(placeId)
      } else if (result.status === 404) {
        // Lugar no encontrado
        expect(result.data).toHaveProperty('message')
        expect(result.data.message).toContain('no encontrado')
      }

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de lugar por ID ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('POST /api/v1/places/ensure', () => {
    it('DEBE mantener estructura para crear/asegurar lugar', async () => {
      // Arrange
      const testName = 'places-ensure'
      setupAuth()
      
      const placeData = {
        name: 'Nuevo Lugar Test',
        description: 'Descripción del lugar de prueba',
        location: { lat: -12.0464, lng: -77.0428 },
        type: 'restaurant',
        address: 'Lima, Perú'
      }

      // Act
      const result = await makeApiCallWithFallback(
        testName,
        '/api/v1/places/ensure',
        'POST',
        placeData,
        getAuthHeaders()
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('data')

      const createdPlace = result.data.data
      expect(createdPlace).toHaveProperty('_id')
      expect(createdPlace).toHaveProperty('name', placeData.name)
      expect(createdPlace).toHaveProperty('description', placeData.description)
      expect(createdPlace).toHaveProperty('type', placeData.type)

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de creación de lugar ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('POST /api/v1/chat', () => {
    it('DEBE mantener estructura de respuesta de chat', async () => {
      // Arrange
      const testName = 'places-chat'
      setupAuth()
      
      const chatMessage = {
        message: '¿Qué lugares históricos me recomiendas en Perú?',
        context: 'tourism'
      }

      // Act
      const result = await makeApiCallWithFallback(
        testName,
        '/api/v1/chat',
        'POST',
        chatMessage,
        getAuthHeaders()
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('message')
      expect(result.data).toHaveProperty('places')
      expect(result.data).toHaveProperty('timestamp')

      // Validar estructura de respuesta de chat
      expect(typeof result.data.message).toBe('string')
      expect(Array.isArray(result.data.places)).toBe(true)
      expect(typeof result.data.timestamp).toBe('string')

      // Validar formato de timestamp
      expect(new Date(result.data.timestamp).toISOString()).toBe(result.data.timestamp)

      // Si hay plan de viaje, validar estructura
      if (result.data.travelPlan) {
        expect(result.data.travelPlan).toHaveProperty('totalDays')
        expect(result.data.travelPlan).toHaveProperty('days')
        expect(Array.isArray(result.data.travelPlan.days)).toBe(true)
        expect(typeof result.data.travelPlan.totalDays).toBe('number')
      }

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de respuesta de chat ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('GET /api/v1/chat/history', () => {
    it('DEBE mantener estructura de historial de chat', async () => {
      // Arrange
      const testName = 'places-chat-history'
      setupAuth()

      // Act
      const result = await makeApiCallWithFallback(
        testName,
        '/api/v1/chat/history?limit=10',
        'GET',
        undefined,
        getAuthHeaders()
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('status')
      expect(result.data).toHaveProperty('data')
      expect(Array.isArray(result.data.data)).toBe(true)

      // Validar estructura de sesiones de chat
      result.data.data.forEach((session: any) => {
        expect(session).toHaveProperty('_id')
        expect(session).toHaveProperty('sessionId')
        expect(session).toHaveProperty('lastActivity')
        expect(session).toHaveProperty('messages')
        expect(Array.isArray(session.messages)).toBe(true)
      })

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de historial de chat ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })
})
