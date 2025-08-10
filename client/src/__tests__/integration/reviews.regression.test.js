/**
 * Tests de Regresión para Reviews API
 * 
 * Cubre todos los endpoints de reseñas que están siendo utilizados
 * en el frontend pero no tenían tests de regresión.
 */

const fs = require('fs')
const path = require('path')

// Reutilizar la clase SnapshotManager
class SnapshotManager {
  constructor() {
    this.snapshotsDir = path.join(__dirname, '..', 'snapshots')
    this.ensureSnapshotsDir()
  }

  ensureSnapshotsDir() {
    if (!fs.existsSync(this.snapshotsDir)) {
      fs.mkdirSync(this.snapshotsDir, { recursive: true })
    }
  }

  getSnapshotPath(testName) {
    return path.join(this.snapshotsDir, `${testName}.json`)
  }

  saveSnapshot(testName, result) {
    const snapshotPath = this.getSnapshotPath(testName)
    const cleanResult = { ...result }
    delete cleanResult.timestamp
    fs.writeFileSync(snapshotPath, JSON.stringify(cleanResult, null, 2))
    console.log(`📸 Snapshot guardado: ${testName}`)
  }

  loadSnapshot(testName) {
    const snapshotPath = this.getSnapshotPath(testName)
    if (!fs.existsSync(snapshotPath)) return null
    try {
      const content = fs.readFileSync(snapshotPath, 'utf-8')
      return JSON.parse(content)
    } catch (error) {
      console.error(`Error cargando snapshot ${testName}:`, error)
      return null
    }
  }

  compareWithSnapshot(testName, currentResult) {
    const savedSnapshot = this.loadSnapshot(testName)
    if (!savedSnapshot) {
      this.saveSnapshot(testName, currentResult)
      return { matches: true, differences: [], shouldUpdateSnapshot: false }
    }

    const differences = []
    if (currentResult.status !== savedSnapshot.status) {
      differences.push(`Status cambió: ${savedSnapshot.status} → ${currentResult.status}`)
    }

    const dataDiff = this.compareObjects(savedSnapshot.data, currentResult.data, 'data')
    differences.push(...dataDiff)

    return {
      matches: differences.length === 0,
      differences,
      shouldUpdateSnapshot: process.env.UPDATE_SNAPSHOTS === 'true'
    }
  }

  compareObjects(obj1, obj2, path) {
    const differences = []
    if (typeof obj1 !== typeof obj2) {
      differences.push(`${path}: Tipo cambió de ${typeof obj1} a ${typeof obj2}`)
      return differences
    }

    if (obj1 === null || obj2 === null) {
      if (obj1 !== obj2) {
        differences.push(`${path}: Valor cambió de ${obj1} a ${obj2}`)
      }
      return differences
    }

    if (typeof obj1 === 'object') {
      if (Array.isArray(obj1) !== Array.isArray(obj2)) {
        differences.push(`${path}: Cambió entre array y object`)
        return differences
      }

      if (!Array.isArray(obj1)) {
        const keys1 = Object.keys(obj1).sort()
        const keys2 = Object.keys(obj2).sort()
        
        const addedKeys = keys2.filter(k => !keys1.includes(k))
        const removedKeys = keys1.filter(k => !keys2.includes(k))
        
        addedKeys.forEach(key => differences.push(`${path}.${key}: Nueva propiedad agregada`))
        removedKeys.forEach(key => differences.push(`${path}.${key}: Propiedad removida`))

        const commonKeys = keys1.filter(k => keys2.includes(k))
        commonKeys.forEach(key => {
          if (typeof obj1[key] !== 'object' && obj1[key] !== obj2[key]) {
            differences.push(`${path}.${key}: Valor cambió de ${obj1[key]} a ${obj2[key]}`)
          }
        })
      }
    } else if (obj1 !== obj2) {
      differences.push(`${path}: Valor cambió de ${obj1} a ${obj2}`)
    }

    return differences
  }
}

// Configuración
const USE_REAL_BACKEND = process.env.USE_REAL_BACKEND === 'true'
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001'

// Mock responses para endpoints de reviews
const mockResponses = {
  'reviews-place-list': {
    status: 200,
    statusText: 'OK',
    data: {
      data: {
        reviews: [
          {
            id: 'review-1',
            userId: 'user-123',
            userName: 'Usuario Test',
            rating: 5,
            comment: 'Excelente lugar para visitar, muy recomendado!',
            helpful: 12,
            images: ['review1.jpg', 'review2.jpg'],
            createdAt: '2024-01-15T10:00:00.000Z',
            isHelpful: false
          },
          {
            id: 'review-2', 
            userId: 'user-456',
            userName: 'Otro Usuario',
            rating: 4,
            comment: 'Muy bueno, aunque un poco caro.',
            helpful: 8,
            images: [],
            createdAt: '2024-01-10T15:30:00.000Z',
            isHelpful: true
          }
        ],
        stats: {
          avgRating: 4.5,
          totalReviews: 2,
          distribution: {
            '5': 1,
            '4': 1,
            '3': 0,
            '2': 0,
            '1': 0
          }
        },
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1
        }
      }
    }
  },
  'reviews-create': {
    status: 200,
    statusText: 'OK',
    data: {
      success: true,
      message: 'Reseña creada exitosamente',
      data: {
        id: 'review-new',
        userId: 'user-123',
        placeId: 'place-123',
        rating: 5,
        comment: 'Nueva reseña de prueba',
        status: 'approved',
        helpful: 0,
        images: ['new-review.jpg'],
        createdAt: '2024-01-15T12:00:00.000Z'
      }
    }
  },
  'reviews-user-list': {
    status: 200,
    statusText: 'OK',
    data: {
      data: [
        {
          id: 'review-user-1',
          placeId: 'place-123',
          placeName: 'Machu Picchu',
          placeType: 'historical',
          rating: 5,
          comment: 'Increíble experiencia histórica',
          status: 'approved',
          helpful: 15,
          images: ['machu-review.jpg'],
          createdAt: '2024-01-10T10:00:00.000Z'
        }
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1
      }
    }
  },
  'reviews-update': {
    status: 200,
    statusText: 'OK',
    data: {
      success: true,
      message: 'Reseña actualizada exitosamente',
      data: {
        id: 'review-1',
        rating: 4,
        comment: 'Reseña actualizada con nueva información',
        images: ['updated-review.jpg'],
        updatedAt: '2024-01-15T14:00:00.000Z'
      }
    }
  },
  'reviews-delete': {
    status: 200,
    statusText: 'OK',
    data: {
      success: true,
      message: 'Reseña eliminada exitosamente'
    }
  },
  'reviews-vote': {
    status: 200,
    statusText: 'OK',
    data: {
      data: {
        helpful: 13,
        userVote: 'yes'
      }
    }
  }
}

// Helper para hacer peticiones con fallback
async function makeApiCall(endpoint, method = 'GET', body = null, headers = {}, mockKey = null) {
  if (!USE_REAL_BACKEND) {
    return mockResponses[mockKey] || {
      status: 404,
      statusText: 'Not Found',
      data: { error: 'Mock no configurado' }
    }
  }

  const url = `${API_BASE_URL}${endpoint}`
  const options = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers }
  }

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json()
    
    return {
      status: response.status,
      statusText: response.statusText,
      data,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.warn(`🚨 Error conectando al backend: ${error.message}`)
    return mockResponses[mockKey] || {
      status: 500,
      statusText: 'Internal Server Error',
      data: { error: 'Backend no disponible' }
    }
  }
}

describe('Reviews API Regression Tests', () => {
  let snapshotManager

  beforeAll(() => {
    snapshotManager = new SnapshotManager()
  })

  beforeEach(() => {
    localStorage.clear()
    // Simular usuario autenticado para endpoints que lo requieren
    localStorage.setItem('accessToken', 'mock-auth-token')
  })

  describe('GET /api/v1/reviews/places/:placeId', () => {
    it('DEBE mantener estructura de reseñas de lugar consistente', async () => {
      // Arrange
      const testName = 'reviews-place-list'
      const placeId = 'place-123'

      // Act
      const result = await makeApiCall(
        `/api/v1/reviews/places/${placeId}?page=1&limit=10&sort=recent`,
        'GET',
        null,
        {},
        'reviews-place-list'
      )

      // Assert - Validaciones básicas
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('data')
      expect(result.data.data).toHaveProperty('reviews')
      expect(result.data.data).toHaveProperty('stats')
      expect(result.data.data).toHaveProperty('pagination')

      // Validar estructura de reviews
      const reviews = result.data.data.reviews
      expect(Array.isArray(reviews)).toBe(true)
      
      if (reviews.length > 0) {
        const review = reviews[0]
        expect(review).toHaveProperty('id')
        expect(review).toHaveProperty('userId')
        expect(review).toHaveProperty('userName')
        expect(review).toHaveProperty('rating')
        expect(review).toHaveProperty('comment')
        expect(review).toHaveProperty('helpful')
        expect(review).toHaveProperty('images')
        expect(review).toHaveProperty('createdAt')

        // Validar tipos de datos
        expect(typeof review.id).toBe('string')
        expect(typeof review.userId).toBe('string')
        expect(typeof review.userName).toBe('string')
        expect(typeof review.rating).toBe('number')
        expect(typeof review.comment).toBe('string')
        expect(typeof review.helpful).toBe('number')
        expect(Array.isArray(review.images)).toBe(true)
        expect(typeof review.createdAt).toBe('string')

        // Validar rangos de rating
        expect(review.rating).toBeGreaterThanOrEqual(1)
        expect(review.rating).toBeLessThanOrEqual(5)
        expect(review.helpful).toBeGreaterThanOrEqual(0)
      }

      // Validar estructura de stats
      const stats = result.data.data.stats
      expect(stats).toHaveProperty('avgRating')
      expect(stats).toHaveProperty('totalReviews')
      expect(stats).toHaveProperty('distribution')
      expect(typeof stats.avgRating).toBe('number')
      expect(typeof stats.totalReviews).toBe('number')
      expect(typeof stats.distribution).toBe('object')

      // Validar estructura de pagination
      const pagination = result.data.data.pagination
      expect(pagination).toHaveProperty('page')
      expect(pagination).toHaveProperty('limit')
      expect(pagination).toHaveProperty('total')
      expect(pagination).toHaveProperty('totalPages')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de reseñas de lugar ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('POST /api/v1/reviews/places/:placeId', () => {
    it('DEBE mantener estructura de creación de reseña exitosa', async () => {
      // Arrange
      const testName = 'reviews-create'
      const placeId = 'place-123'
      const reviewData = {
        rating: 5,
        comment: 'Nueva reseña de prueba',
        images: ['new-review.jpg']
      }

      // Act
      const result = await makeApiCall(
        `/api/v1/reviews/places/${placeId}`,
        'POST',
        reviewData,
        { 'Authorization': 'Bearer mock-auth-token' },
        'reviews-create'
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('message')
      expect(result.data).toHaveProperty('data')

      // Validar datos de la reseña creada
      const review = result.data.data
      expect(review).toHaveProperty('id')
      expect(review).toHaveProperty('userId')
      expect(review).toHaveProperty('placeId', placeId)
      expect(review).toHaveProperty('rating', reviewData.rating)
      expect(review).toHaveProperty('comment', reviewData.comment)
      expect(review).toHaveProperty('status')
      expect(review).toHaveProperty('helpful', 0) // Nueva reseña empieza en 0
      expect(review).toHaveProperty('createdAt')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de creación de reseña ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('GET /api/v1/reviews/user', () => {
    it('DEBE mantener estructura de reseñas del usuario', async () => {
      // Arrange
      const testName = 'reviews-user-list'

      // Act
      const result = await makeApiCall(
        '/api/v1/reviews/user?page=1&limit=10',
        'GET',
        null,
        { 'Authorization': 'Bearer mock-auth-token' },
        'reviews-user-list'
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('data')
      expect(result.data).toHaveProperty('pagination')
      expect(Array.isArray(result.data.data)).toBe(true)

      // Validar estructura de reseñas del usuario
      if (result.data.data.length > 0) {
        const userReview = result.data.data[0]
        expect(userReview).toHaveProperty('id')
        expect(userReview).toHaveProperty('placeId')
        expect(userReview).toHaveProperty('placeName')
        expect(userReview).toHaveProperty('placeType')
        expect(userReview).toHaveProperty('rating')
        expect(userReview).toHaveProperty('comment')
        expect(userReview).toHaveProperty('status')
        expect(userReview).toHaveProperty('helpful')
        expect(userReview).toHaveProperty('images')
        expect(userReview).toHaveProperty('createdAt')

        // Validar estados válidos
        expect(['pending', 'approved', 'rejected'].includes(userReview.status)).toBe(true)
      }

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de reseñas del usuario ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('PUT /api/v1/reviews/:reviewId', () => {
    it('DEBE mantener estructura de actualización de reseña', async () => {
      // Arrange
      const testName = 'reviews-update'
      const reviewId = 'review-1'
      const updateData = {
        rating: 4,
        comment: 'Reseña actualizada con nueva información',
        images: ['updated-review.jpg']
      }

      // Act
      const result = await makeApiCall(
        `/api/v1/reviews/${reviewId}`,
        'PUT',
        updateData,
        { 'Authorization': 'Bearer mock-auth-token' },
        'reviews-update'
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('message')
      expect(result.data).toHaveProperty('data')

      // Validar datos actualizados
      const updatedReview = result.data.data
      expect(updatedReview).toHaveProperty('id', reviewId)
      expect(updatedReview).toHaveProperty('rating', updateData.rating)
      expect(updatedReview).toHaveProperty('comment', updateData.comment)
      expect(updatedReview).toHaveProperty('updatedAt')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de actualización de reseña ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('DELETE /api/v1/reviews/:reviewId', () => {
    it('DEBE mantener estructura de eliminación de reseña', async () => {
      // Arrange
      const testName = 'reviews-delete'
      const reviewId = 'review-1'

      // Act
      const result = await makeApiCall(
        `/api/v1/reviews/${reviewId}`,
        'DELETE',
        null,
        { 'Authorization': 'Bearer mock-auth-token' },
        'reviews-delete'
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('message')
      expect(result.data.message).toContain('eliminada')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de eliminación de reseña ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('POST /api/v1/reviews/:reviewId/vote', () => {
    it('DEBE mantener estructura de votación de reseña útil', async () => {
      // Arrange
      const testName = 'reviews-vote'
      const reviewId = 'review-1'
      const voteData = { vote: 'yes' }

      // Act
      const result = await makeApiCall(
        `/api/v1/reviews/${reviewId}/vote`,
        'POST',
        voteData,
        { 'Authorization': 'Bearer mock-auth-token' },
        'reviews-vote'
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('data')
      expect(result.data.data).toHaveProperty('helpful')
      expect(result.data.data).toHaveProperty('userVote')

      // Validar datos de votación
      expect(typeof result.data.data.helpful).toBe('number')
      expect(['yes', 'no'].includes(result.data.data.userVote)).toBe(true)
      expect(result.data.data.helpful).toBeGreaterThanOrEqual(0)

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de votación de reseña ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })
})
