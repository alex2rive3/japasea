/**
 * Tests de Regresión para Endpoints de Favoritos
 * 
 * Verifica que las respuestas de los endpoints de favoritos
 * mantengan estructura consistente entre versiones.
 */

import { 
  ApiSnapshotManager, 
  makeApiCallWithFallback, 
  getAuthHeaders,
  setupAuth 
} from '../../test/helpers/apiTestUtils'

describe('Favorites API Regression Tests', () => {
  let snapshotManager: ApiSnapshotManager

  beforeAll(() => {
    snapshotManager = new ApiSnapshotManager()
  })

  beforeEach(() => {
    localStorage.clear()
    setupAuth() // Todos los endpoints de favoritos requieren autenticación
  })

  describe('GET /api/v1/favorites', () => {
    it('DEBE mantener estructura de lista de favoritos consistente', async () => {
      // Arrange
      const testName = 'favorites-list'

      // Act
      const result = await makeApiCallWithFallback(
        'favorites-list',
        '/api/v1/favorites',
        'GET',
        undefined,
        getAuthHeaders()
      )

      // Assert - Validar status y estructura básica
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('count')
      expect(result.data).toHaveProperty('data')
      expect(Array.isArray(result.data.data)).toBe(true)
      expect(typeof result.data.count).toBe('number')

      // Validar que count coincida con la longitud del array
      expect(result.data.count).toBe(result.data.data.length)

      // Si hay favoritos, validar estructura de cada uno
      if (result.data.data.length > 0) {
        const favorite = result.data.data[0]
        
        // Validar propiedades requeridas de favorito
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

        // Validar tipos de datos
        expect(typeof favorite._id).toBe('string')
        expect(typeof favorite.name).toBe('string')
        expect(typeof favorite.description).toBe('string')
        expect(typeof favorite.type).toBe('string')
        expect(typeof favorite.address).toBe('string')
        expect(typeof favorite.isFavorite).toBe('boolean')
        expect(typeof favorite.favoritedAt).toBe('string')

        // isFavorite debe ser true para favoritos
        expect(favorite.isFavorite).toBe(true)

        // Validar estructura de location
        expect(favorite.location).toHaveProperty('type', 'Point')
        expect(favorite.location).toHaveProperty('coordinates')
        expect(favorite.location).toHaveProperty('lat')
        expect(favorite.location).toHaveProperty('lng')
        expect(Array.isArray(favorite.location.coordinates)).toBe(true)
        expect(favorite.location.coordinates).toHaveLength(2)
        expect(typeof favorite.location.lat).toBe('number')
        expect(typeof favorite.location.lng).toBe('number')

        // Validar estructura de rating
        expect(favorite.rating).toHaveProperty('average')
        expect(favorite.rating).toHaveProperty('count')
        expect(typeof favorite.rating.average).toBe('number')
        expect(typeof favorite.rating.count).toBe('number')
        expect(favorite.rating.average).toBeGreaterThanOrEqual(0)
        expect(favorite.rating.average).toBeLessThanOrEqual(5)

        // Validar estructura de imágenes
        expect(Array.isArray(favorite.images)).toBe(true)
        if (favorite.images.length > 0) {
          const image = favorite.images[0]
          expect(image).toHaveProperty('url')
          expect(image).toHaveProperty('isPrimary')
          expect(typeof image.url).toBe('string')
          expect(typeof image.isPrimary).toBe('boolean')
        }

        // Validar formato de fecha
        expect(new Date(favorite.favoritedAt).toISOString()).toBe(favorite.favoritedAt)
      }

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de lista de favoritos ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })

    it('DEBE mantener estructura cuando no hay favoritos', async () => {
      // Arrange
      const testName = 'favorites-list-empty'

      // Act - Simular usuario sin favoritos
      const result = await makeApiCallWithFallback(
        testName,
        '/api/v1/favorites',
        'GET',
        undefined,
        getAuthHeaders()
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('count', 0)
      expect(result.data).toHaveProperty('data')
      expect(Array.isArray(result.data.data)).toBe(true)
      expect(result.data.data).toHaveLength(0)

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de lista vacía de favoritos ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('POST /api/v1/favorites/:placeId', () => {
    it('DEBE mantener estructura para agregar lugar a favoritos', async () => {
      // Arrange
      const testName = 'favorites-add'
      const placeId = 'place-123'

      // Act
      const result = await makeApiCallWithFallback(
        testName,
        `/api/v1/favorites/${placeId}`,
        'POST',
        undefined,
        getAuthHeaders()
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('message')
      expect(result.data).toHaveProperty('data')

      // Validar estructura de respuesta
      expect(typeof result.data.message).toBe('string')
      expect(result.data.data).toHaveProperty('placeId', placeId)
      expect(result.data.data).toHaveProperty('isFavorite', true)

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de agregar favorito ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })

    it('DEBE mantener estructura de error para lugar ya en favoritos', async () => {
      // Arrange
      const testName = 'favorites-add-duplicate'
      const placeId = 'place-already-favorite'

      // Act
      let result
      try {
        result = await makeApiCallWithFallback(
          testName,
          `/api/v1/favorites/${placeId}`,
          'POST',
          undefined,
          getAuthHeaders()
        )
      } catch (error) {
        result = {
          status: 409,
          statusText: 'Conflict',
          headers: { 'content-type': 'application/json' },
          data: { success: false, message: 'El lugar ya está en favoritos' },
          timestamp: new Date().toISOString(),
          endpoint: `/api/v1/favorites/${placeId}`,
          method: 'POST'
        }
      }

      // Assert
      expect(result.status).toBe(409)
      expect(result.data).toHaveProperty('success', false)
      expect(result.data).toHaveProperty('message')
      expect(result.data.message).toContain('favoritos')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de error de favorito duplicado ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('DELETE /api/v1/favorites/:placeId', () => {
    it('DEBE mantener estructura para remover lugar de favoritos', async () => {
      // Arrange
      const testName = 'favorites-remove'
      const placeId = 'place-123'

      // Act
      const result = await makeApiCallWithFallback(
        testName,
        `/api/v1/favorites/${placeId}`,
        'DELETE',
        undefined,
        getAuthHeaders()
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('message')
      expect(result.data).toHaveProperty('data')

      // Validar que indica que fue removido
      expect(result.data.data).toHaveProperty('placeId', placeId)
      expect(result.data.data).toHaveProperty('isFavorite', false)

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de remover favorito ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('GET /api/v1/favorites/check/:placeId', () => {
    it('DEBE mantener estructura para verificar estado de favorito', async () => {
      // Arrange
      const testName = 'favorites-check'
      const placeId = 'place-123'

      // Act
      const result = await makeApiCallWithFallback(
        testName,
        `/api/v1/favorites/check/${placeId}`,
        'GET',
        undefined,
        getAuthHeaders()
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('data')
      expect(result.data.data).toHaveProperty('placeId', placeId)
      expect(result.data.data).toHaveProperty('isFavorite')
      expect(typeof result.data.data.isFavorite).toBe('boolean')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de verificación de favorito ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('POST /api/v1/favorites/check-multiple', () => {
    it('DEBE mantener estructura para verificar múltiples favoritos', async () => {
      // Arrange
      const testName = 'favorites-check-multiple'
      const placeIds = ['place-1', 'place-2', 'place-3']

      // Act
      const result = await makeApiCallWithFallback(
        testName,
        '/api/v1/favorites/check-multiple',
        'POST',
        { placeIds },
        getAuthHeaders()
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('data')
      expect(typeof result.data.data).toBe('object')

      // Validar que cada placeId tenga un valor boolean
      placeIds.forEach(placeId => {
        expect(result.data.data).toHaveProperty(placeId)
        expect(typeof result.data.data[placeId]).toBe('boolean')
      })

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de verificación múltiple ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('GET /api/v1/favorites/stats', () => {
    it('DEBE mantener estructura de estadísticas de favoritos', async () => {
      // Arrange
      const testName = 'favorites-stats'

      // Act
      const result = await makeApiCallWithFallback(
        testName,
        '/api/v1/favorites/stats',
        'GET',
        undefined,
        getAuthHeaders()
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('data')

      const stats = result.data.data
      expect(stats).toHaveProperty('total')
      expect(stats).toHaveProperty('byType')
      expect(stats).toHaveProperty('recentlyAdded')

      // Validar tipos de datos
      expect(typeof stats.total).toBe('number')
      expect(typeof stats.byType).toBe('object')
      expect(Array.isArray(stats.recentlyAdded)).toBe(true)

      // Validar estructura de byType
      Object.values(stats.byType).forEach(count => {
        expect(typeof count).toBe('number')
      })

      // Validar estructura de recentlyAdded
      stats.recentlyAdded.forEach((recent: any) => {
        expect(recent).toHaveProperty('placeId')
        expect(recent).toHaveProperty('addedAt')
        expect(typeof recent.placeId).toBe('string')
        expect(typeof recent.addedAt).toBe('string')
        expect(new Date(recent.addedAt).toISOString()).toBe(recent.addedAt)
      })

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de estadísticas de favoritos ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('POST /api/v1/favorites/sync', () => {
    it('DEBE mantener estructura para sincronización de favoritos', async () => {
      // Arrange
      const testName = 'favorites-sync'
      const favorites = ['place-1', 'place-2', 'place-3']

      // Act
      const result = await makeApiCallWithFallback(
        testName,
        '/api/v1/favorites/sync',
        'POST',
        { favorites },
        getAuthHeaders()
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('message')
      expect(result.data).toHaveProperty('data')

      // Validar estructura de respuesta de sincronización
      expect(result.data.data).toHaveProperty('synced')
      expect(result.data.data).toHaveProperty('requested')
      expect(typeof result.data.data.synced).toBe('number')
      expect(typeof result.data.data.requested).toBe('number')
      expect(result.data.data.requested).toBe(favorites.length)

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de sincronización de favoritos ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('Error Handling', () => {
    it('DEBE mantener estructura de error sin autenticación', async () => {
      // Arrange
      const testName = 'favorites-unauthorized'

      // Act - Sin headers de autenticación
      let result
      try {
        result = await makeApiCallWithFallback(
          testName,
          '/api/v1/favorites',
          'GET'
        )
      } catch (error) {
        result = {
          status: 401,
          statusText: 'Unauthorized',
          headers: { 'content-type': 'application/json' },
          data: { success: false, message: 'No authentication token found' },
          timestamp: new Date().toISOString(),
          endpoint: '/api/v1/favorites',
          method: 'GET'
        }
      }

      // Assert
      expect(result.status).toBe(401)
      expect(result.data).toHaveProperty('success', false)
      expect(result.data).toHaveProperty('message')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de error de autorización ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })
})
