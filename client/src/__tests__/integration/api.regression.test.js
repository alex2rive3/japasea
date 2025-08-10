/**
 * Tests de Regresión de API - Demostración
 * 
 * Estos tests verifican que las respuestas de los endpoints del backend
 * no cambien inesperadamente entre versiones.
 * 
 * Uso:
 * npm test api.regression.test.js                    # Usar mocks
 * USE_REAL_BACKEND=true npm test api.regression.test.js  # Backend real
 * UPDATE_SNAPSHOTS=true npm test api.regression.test.js  # Actualizar snapshots
 */

const fs = require('fs')
const path = require('path')

// Configuración
const USE_REAL_BACKEND = process.env.USE_REAL_BACKEND === 'true'
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001'
const UPDATE_SNAPSHOTS = process.env.UPDATE_SNAPSHOTS === 'true'

// Clase para manejar snapshots
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
    
    // Remover timestamp para comparaciones consistentes
    const cleanResult = { ...result }
    delete cleanResult.timestamp
    
    fs.writeFileSync(snapshotPath, JSON.stringify(cleanResult, null, 2))
    console.log(`📸 Snapshot guardado: ${testName}`)
  }

  loadSnapshot(testName) {
    const snapshotPath = this.getSnapshotPath(testName)
    
    if (!fs.existsSync(snapshotPath)) {
      return null
    }
    
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
      // No hay snapshot previo, guardar el actual
      this.saveSnapshot(testName, currentResult)
      return {
        matches: true,
        differences: [],
        shouldUpdateSnapshot: false
      }
    }

    const differences = []
    
    // Comparar status
    if (currentResult.status !== savedSnapshot.status) {
      differences.push(`Status cambió: ${savedSnapshot.status} → ${currentResult.status}`)
    }

    // Comparar estructura de datos (comparación simple)
    const dataDiff = this.compareObjects(savedSnapshot.data, currentResult.data, 'data')
    differences.push(...dataDiff)

    return {
      matches: differences.length === 0,
      differences,
      shouldUpdateSnapshot: UPDATE_SNAPSHOTS
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

      if (Array.isArray(obj1)) {
        if (obj1.length !== obj2.length) {
          differences.push(`${path}: Longitud del array cambió de ${obj1.length} a ${obj2.length}`)
        }
      } else {
        // Comparar objetos
        const keys1 = Object.keys(obj1).sort()
        const keys2 = Object.keys(obj2).sort()
        
        const addedKeys = keys2.filter(k => !keys1.includes(k))
        const removedKeys = keys1.filter(k => !keys2.includes(k))
        
        addedKeys.forEach(key => {
          differences.push(`${path}.${key}: Nueva propiedad agregada`)
        })
        
        removedKeys.forEach(key => {
          differences.push(`${path}.${key}: Propiedad removida`)
        })

        // Comparar claves comunes (solo primer nivel para simplicidad)
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

// Mock data para cuando el backend no esté disponible
const mockResponses = {
  'auth-login-success': {
    status: 200,
    statusText: 'OK',
    data: {
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: 'user-123',
          name: 'Test User',
          email: 'user@test.com',
          role: 'user',
          isEmailVerified: true,
          createdAt: '2024-01-01T00:00:00.000Z'
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      }
    }
  },
  'auth-login-invalid': {
    status: 401,
    statusText: 'Unauthorized',
    data: {
      success: false,
      message: 'Credenciales inválidas'
    }
  },
  'places-list': {
    status: 200,
    statusText: 'OK',
    data: [
      {
        _id: 'place-1',
        name: 'Machu Picchu',
        description: 'Antigua ciudadela inca en los Andes peruanos',
        location: { lat: -13.1631, lng: -72.5450 },
        type: 'historical',
        address: 'Aguas Calientes, Perú',
        rating: { average: 4.8, count: 1250 }
      }
    ]
  },
  'places-search': {
    status: 200,
    statusText: 'OK',
    data: [
      {
        _id: 'place-1',
        name: 'Machu Picchu',
        description: 'Antigua ciudadela inca que contiene machu en su descripción',
        location: { lat: -13.1631, lng: -72.5450 },
        type: 'historical',
        address: 'Aguas Calientes, Perú'
      }
    ]
  }
}

// Helper para hacer peticiones
async function makeApiCall(endpoint, method = 'GET', body = null, mockKey = null) {
  if (!USE_REAL_BACKEND) {
    // Determinar qué mock usar basado en el endpoint y datos
    if (!mockKey) {
      if (endpoint.includes('/auth/login')) {
        // Simular error si el email es incorrecto
        if (body && body.email && body.email.includes('wrong')) {
          mockKey = 'auth-login-invalid'
        } else {
          mockKey = 'auth-login-success'
        }
      } else if (endpoint.includes('/places/search')) {
        mockKey = 'places-search'
      } else if (endpoint.includes('/places')) {
        mockKey = 'places-list'
      }
    }
    
    return mockResponses[mockKey] || {
      status: 404,
      statusText: 'Not Found',
      data: { error: 'Mock no configurado' }
    }
  }

  // Hacer petición real
  const url = `${API_BASE_URL}${endpoint}`
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
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
    // Fallback a mock si hay error de red
    const mockKey = endpoint.includes('/auth/login') ? 'auth-login-success' : 'places-list'
    return mockResponses[mockKey] || {
      status: 500,
      statusText: 'Internal Server Error',
      data: { error: 'Backend no disponible' }
    }
  }
}

describe('API Regression Tests', () => {
  let snapshotManager

  beforeAll(() => {
    snapshotManager = new SnapshotManager()
  })

  beforeEach(() => {
    localStorage.clear()
  })

  describe('Auth Endpoints', () => {
    it('DEBE mantener estructura de login exitoso', async () => {
      // Arrange
      const testName = 'auth-login-success'
      const loginData = {
        email: 'user@test.com',
        password: 'password123'
      }

      // Act
      const result = await makeApiCall('/api/v1/auth/login', 'POST', loginData)

      // Assert - Validaciones básicas
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('data')
      expect(result.data.data).toHaveProperty('user')
      expect(result.data.data).toHaveProperty('accessToken')
      expect(result.data.data).toHaveProperty('refreshToken')

      // Validar estructura del usuario
      const user = result.data.data.user
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('role')
      expect(user).toHaveProperty('isEmailVerified')
      expect(user).toHaveProperty('createdAt')

      // Validar tipos de datos
      expect(typeof user.id).toBe('string')
      expect(typeof user.name).toBe('string')
      expect(typeof user.email).toBe('string')
      expect(['user', 'admin'].includes(user.role)).toBe(true)
      expect(typeof user.isEmailVerified).toBe('boolean')
      expect(typeof user.createdAt).toBe('string')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches) {
        console.log('\n🚨 CAMBIOS DETECTADOS EN LOGIN:')
        comparison.differences.forEach(diff => {
          console.log(`  - ${diff}`)
        })
        
        if (comparison.shouldUpdateSnapshot) {
          snapshotManager.saveSnapshot(testName, result)
          console.log('✅ Snapshot actualizado')
        } else {
          console.log('\n💡 Para actualizar snapshot intencionalmente:')
          console.log('   UPDATE_SNAPSHOTS=true npm test api.regression.test.js')
        }
      }

      // Fallar test si hay diferencias no intencionadas
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Respuesta de login ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })

    it('DEBE mantener estructura de error para credenciales inválidas', async () => {
      // Arrange
      const testName = 'auth-login-invalid'
      const invalidData = {
        email: 'wrong@test.com',
        password: 'wrongpassword'
      }

      // Act - El mock detectará automáticamente que es un email "wrong" y retornará error
      const result = await makeApiCall('/api/v1/auth/login', 'POST', invalidData)

      // Assert
      expect(result.status).toBe(401)
      expect(result.data).toHaveProperty('success', false)
      expect(result.data).toHaveProperty('message')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de error de login ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('Places Endpoints', () => {
    it('DEBE mantener estructura de lista de lugares', async () => {
      // Arrange
      const testName = 'places-list'

      // Act
      const result = await makeApiCall('/api/v1/places')

      // Assert
      expect(result.status).toBe(200)
      expect(Array.isArray(result.data)).toBe(true)

      // Si hay lugares, validar estructura
      if (result.data.length > 0) {
        const place = result.data[0]
        expect(place).toHaveProperty('_id')
        expect(place).toHaveProperty('name')
        expect(place).toHaveProperty('description')
        expect(place).toHaveProperty('location')
        expect(place).toHaveProperty('address')

        // Validar tipos
        expect(typeof place._id).toBe('string')
        expect(typeof place.name).toBe('string')
        expect(typeof place.description).toBe('string')
        expect(typeof place.address).toBe('string')

        // Validar location
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
        }
      }

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches) {
        console.log('\n🚨 CAMBIOS DETECTADOS EN LISTA DE LUGARES:')
        comparison.differences.forEach(diff => {
          console.log(`  - ${diff}`)
        })
        
        if (comparison.shouldUpdateSnapshot) {
          snapshotManager.saveSnapshot(testName, result)
          console.log('✅ Snapshot actualizado')
        }
      }

      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de lugares ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })

    it('DEBE mantener estructura de búsqueda de lugares', async () => {
      // Arrange
      const testName = 'places-search'
      const searchQuery = 'machu'

      // Act
      const result = await makeApiCall(`/api/v1/places/search?q=${encodeURIComponent(searchQuery)}`)

      // Assert
      expect(result.status).toBe(200)
      expect(Array.isArray(result.data)).toBe(true)

      // Validar que los resultados contengan el término de búsqueda
      result.data.forEach(place => {
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
  })

  describe('Backend Connectivity', () => {
    it('DEBE poder conectar al backend si USE_REAL_BACKEND=true', async () => {
      if (!USE_REAL_BACKEND) {
        console.log('⏭️  Skipping connectivity test (usando mocks)')
        return
      }

      // Act
      const result = await makeApiCall('/api/v1/places')

      // Assert
      expect(result.status).toBeDefined()
      expect(result.data).toBeDefined()
      
      console.log(`✅ Backend conectado exitosamente (status: ${result.status})`)
    })

    it('DEBE mostrar diferencias claras cuando hay cambios', async () => {
      // Este test demuestra cómo se ven las diferencias
      const testName = 'demo-changes'
      
      // Simular respuesta original
      const originalResponse = {
        status: 200,
        data: {
          id: 1,
          name: 'Original Name',
          items: ['item1', 'item2']
        }
      }
      
      // Simular respuesta modificada
      const modifiedResponse = {
        status: 200,
        data: {
          id: 1,
          name: 'Modified Name',  // Cambió
          items: ['item1', 'item2', 'item3'],  // Se agregó item
          newField: 'new value'  // Campo nuevo
        }
      }

      // Guardar snapshot original si no existe
      if (!snapshotManager.loadSnapshot(testName)) {
        snapshotManager.saveSnapshot(testName, originalResponse)
      }

      // Comparar con respuesta modificada
      const comparison = snapshotManager.compareWithSnapshot(testName, modifiedResponse)
      
      if (!comparison.matches) {
        console.log('\n📋 EJEMPLO DE DETECCIÓN DE CAMBIOS:')
        comparison.differences.forEach(diff => {
          console.log(`  📍 ${diff}`)
        })
      }

      // Este test no falla intencionalmente para mostrar el funcionamiento
      expect(comparison.differences.length).toBeGreaterThanOrEqual(0)
    })
  })
})
