import fs from 'fs'
import path from 'path'

// Configuración para decidir si usar backend real o mocks
export const USE_REAL_BACKEND = process.env.USE_REAL_BACKEND === 'true'
export const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001'

// Tipos para las respuestas de API
export interface ApiTestResult {
  status: number
  statusText: string
  headers: Record<string, string>
  data: any
  timestamp: string
  endpoint: string
  method: string
}

// Clase para manejar snapshots de API
export class ApiSnapshotManager {
  private snapshotsDir: string

  constructor() {
    this.snapshotsDir = path.join(process.cwd(), 'src', '__tests__', 'snapshots')
    this.ensureSnapshotsDir()
  }

  private ensureSnapshotsDir() {
    if (!fs.existsSync(this.snapshotsDir)) {
      fs.mkdirSync(this.snapshotsDir, { recursive: true })
    }
  }

  private getSnapshotPath(testName: string): string {
    return path.join(this.snapshotsDir, `${testName}.json`)
  }

  saveSnapshot(testName: string, result: ApiTestResult): void {
    const snapshotPath = this.getSnapshotPath(testName)
    
    // Remover timestamp para comparaciones consistentes
    const cleanResult = { ...result }
    delete cleanResult.timestamp
    
    fs.writeFileSync(snapshotPath, JSON.stringify(cleanResult, null, 2))
    console.log(`📸 Snapshot guardado: ${testName}`)
  }

  loadSnapshot(testName: string): ApiTestResult | null {
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

  compareWithSnapshot(testName: string, currentResult: ApiTestResult): {
    matches: boolean
    differences: string[]
    shouldUpdateSnapshot: boolean
  } {
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

    const differences: string[] = []
    
    // Comparar status
    if (currentResult.status !== savedSnapshot.status) {
      differences.push(`Status cambió: ${savedSnapshot.status} → ${currentResult.status}`)
    }

    // Comparar estructura de datos
    const dataDiff = this.deepCompare(savedSnapshot.data, currentResult.data, 'data')
    differences.push(...dataDiff)

    // Comparar headers importantes (excluyendo los que cambian constantemente)
    const importantHeaders = ['content-type', 'authorization']
    for (const header of importantHeaders) {
      if (savedSnapshot.headers[header] !== currentResult.headers[header]) {
        differences.push(`Header ${header} cambió: ${savedSnapshot.headers[header]} → ${currentResult.headers[header]}`)
      }
    }

    return {
      matches: differences.length === 0,
      differences,
      shouldUpdateSnapshot: process.env.UPDATE_SNAPSHOTS === 'true'
    }
  }

  private deepCompare(obj1: any, obj2: any, path: string): string[] {
    const differences: string[] = []

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
        
        const minLength = Math.min(obj1.length, obj2.length)
        for (let i = 0; i < minLength; i++) {
          differences.push(...this.deepCompare(obj1[i], obj2[i], `${path}[${i}]`))
        }
      } else {
        // Comparar objetos
        const keys1 = Object.keys(obj1).sort()
        const keys2 = Object.keys(obj2).sort()
        
        // Verificar claves añadidas/removidas
        const addedKeys = keys2.filter(k => !keys1.includes(k))
        const removedKeys = keys1.filter(k => !keys2.includes(k))
        
        addedKeys.forEach(key => {
          differences.push(`${path}.${key}: Nueva propiedad agregada`)
        })
        
        removedKeys.forEach(key => {
          differences.push(`${path}.${key}: Propiedad removida`)
        })

        // Comparar claves comunes
        const commonKeys = keys1.filter(k => keys2.includes(k))
        commonKeys.forEach(key => {
          differences.push(...this.deepCompare(obj1[key], obj2[key], `${path}.${key}`))
        })
      }
    } else if (obj1 !== obj2) {
      differences.push(`${path}: Valor cambió de ${obj1} a ${obj2}`)
    }

    return differences
  }
}

// Helper para hacer peticiones HTTP reales
export async function makeRealApiCall(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  body?: any,
  headers: Record<string, string> = {}
): Promise<ApiTestResult> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  if (body && method !== 'GET') {
    requestOptions.body = JSON.stringify(body)
  }

  const response = await fetch(url, requestOptions)
  
  // Convertir headers a objeto plano
  const responseHeaders: Record<string, string> = {}
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value
  })

  let data: any
  try {
    data = await response.json()
  } catch {
    data = await response.text()
  }

  return {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
    data,
    timestamp: new Date().toISOString(),
    endpoint,
    method
  }
}

// Mock data para cuando el backend no esté disponible
export const mockResponses: Record<string, ApiTestResult> = {
  'auth-login': {
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
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
    },
    timestamp: '2024-01-15T10:00:00.000Z',
    endpoint: '/api/v1/auth/login',
    method: 'POST'
  },
  'places-list': {
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
    data: [
      {
        _id: 'place-1',
        name: 'Machu Picchu',
        description: 'Antigua ciudadela inca en los Andes peruanos',
        location: { lat: -13.1631, lng: -72.5450, address: 'Aguas Calientes, Perú' },
        type: 'historical',
        address: 'Aguas Calientes, Perú',
        rating: { average: 4.8, count: 1250 },
        images: [{ url: 'machu-picchu.jpg', caption: 'Vista panorámica' }],
        status: 'active'
      }
    ],
    timestamp: '2024-01-15T10:00:00.000Z',
    endpoint: '/api/v1/places',
    method: 'GET'
  },
  'favorites-list': {
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
    data: {
      success: true,
      count: 1,
      data: [
        {
          _id: 'place-1',
          name: 'Machu Picchu',
          description: 'Antigua ciudadela inca',
          type: 'historical',
          location: { 
            type: 'Point', 
            coordinates: [-72.5450, -13.1631], 
            lat: -13.1631, 
            lng: -72.5450 
          },
          address: 'Aguas Calientes, Perú',
          images: [{ url: 'machu-picchu.jpg', isPrimary: true }],
          rating: { average: 4.8, count: 1250 },
          status: 'active',
          isFavorite: true,
          favoritedAt: '2024-01-15T10:00:00.000Z'
        }
      ]
    },
    timestamp: '2024-01-15T10:00:00.000Z',
    endpoint: '/api/v1/favorites',
    method: 'GET'
  }
}

// Helper para hacer petición con fallback a mock
export async function makeApiCallWithFallback(
  testName: string,
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  body?: any,
  headers: Record<string, string> = {}
): Promise<ApiTestResult> {
  if (USE_REAL_BACKEND) {
    try {
      return await makeRealApiCall(endpoint, method, body, headers)
    } catch (error) {
      console.warn(`🚨 Backend no disponible para ${testName}, usando mock`)
      return mockResponses[testName] || {
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        data: { error: 'Backend no disponible y no hay mock configurado' },
        timestamp: new Date().toISOString(),
        endpoint,
        method
      }
    }
  } else {
    return mockResponses[testName] || {
      status: 404,
      statusText: 'Not Found',
      headers: {},
      data: { error: 'Mock no configurado para este test' },
      timestamp: new Date().toISOString(),
      endpoint,
      method
    }
  }
}

// Helper para obtener tokens de autenticación
export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('accessToken') || 'mock-token-for-testing'
  return {
    'Authorization': `Bearer ${token}`
  }
}

// Helper para configurar autenticación en tests
export function setupAuth() {
  localStorage.setItem('accessToken', 'mock-token-for-testing')
  localStorage.setItem('refreshToken', 'mock-refresh-for-testing')
}
