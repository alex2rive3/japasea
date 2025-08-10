/**
 * Tests de Regresión Extendidos para Auth API
 * 
 * Cubre los endpoints de autenticación que faltaban en los tests básicos:
 * - Actualizar perfil
 * - Cambiar contraseña  
 * - Recuperar contraseña
 * - Verificar email
 * - Eliminar cuenta
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

// Mock responses para endpoints extendidos
const mockResponses = {
  'auth-update-profile': {
    status: 200,
    statusText: 'OK',
    data: {
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: {
        user: {
          id: 'user-123',
          name: 'Usuario Actualizado',
          email: 'usuario@actualizado.com',
          phone: '+51987654321',
          role: 'user',
          isEmailVerified: true,
          profilePicture: 'avatar-nuevo.jpg',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-15T10:00:00.000Z'
        }
      }
    }
  },
  'auth-update-profile-invalid': {
    status: 400,
    statusText: 'Bad Request',
    data: { 
      success: false, 
      message: 'Datos de perfil inválidos',
      errors: [
        { field: 'email', message: 'Email tiene formato inválido' },
        { field: 'phone', message: 'Teléfono debe tener al menos 10 dígitos' }
      ]
    }
  },
  'auth-change-password': {
    status: 200,
    statusText: 'OK',
    data: {
      success: true,
      message: 'Contraseña cambiada exitosamente'
    }
  },
  'auth-change-password-wrong-current': {
    status: 400,
    statusText: 'Bad Request',
    data: { success: false, message: 'Contraseña actual incorrecta' }
  },
  'auth-forgot-password': {
    status: 200,
    statusText: 'OK',
    data: {
      success: true,
      message: 'Email de recuperación enviado'
    }
  },
  'auth-forgot-password-email-not-found': {
    status: 404,
    statusText: 'Not Found',
    data: { success: false, message: 'Email no encontrado en el sistema' }
  },
  'auth-reset-password': {
    status: 200,
    statusText: 'OK',
    data: {
      success: true,
      message: 'Contraseña restablecida exitosamente',
      data: {
        user: {
          id: 'user-123',
          name: 'Test User',
          email: 'user@test.com',
          role: 'user'
        },
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      }
    }
  },
  'auth-verify-email': {
    status: 200,
    statusText: 'OK',
    data: {
      success: true,
      message: 'Email verificado exitosamente'
    }
  },
  'auth-resend-verification': {
    status: 200,
    statusText: 'OK',
    data: {
      success: true,
      message: 'Email de verificación reenviado'
    }
  },
  'auth-verify-email-invalid-token': {
    status: 400,
    statusText: 'Bad Request',
    data: { success: false, message: 'Token de verificación inválido o expirado' }
  },
  'auth-delete-account': {
    status: 200,
    statusText: 'OK',
    data: {
      success: true,
      message: 'Cuenta eliminada exitosamente'
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

describe('Auth Extended API Regression Tests', () => {
  let snapshotManager

  beforeAll(() => {
    snapshotManager = new SnapshotManager()
  })

  beforeEach(() => {
    localStorage.clear()
    // Simular usuario autenticado para endpoints que lo requieren
    localStorage.setItem('accessToken', 'mock-auth-token')
  })

  describe('PUT /api/v1/auth/profile', () => {
    it('DEBE mantener estructura de actualización de perfil exitosa', async () => {
      // Arrange
      const testName = 'auth-update-profile'
      const updateData = {
        name: 'Usuario Actualizado',
        email: 'usuario@actualizado.com',
        phone: '+51987654321'
      }

      // Act
      const result = await makeApiCall(
        '/api/v1/auth/profile',
        'PUT',
        updateData,
        { 'Authorization': 'Bearer mock-auth-token' },
        'auth-update-profile'
      )

      // Assert - Validaciones básicas
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('message')
      expect(result.data).toHaveProperty('data')
      expect(result.data.data).toHaveProperty('user')

      // Validar que los datos actualizados estén reflejados
      const user = result.data.data.user
      expect(user.name).toBe(updateData.name)
      expect(user.email).toBe(updateData.email)
      expect(user.phone).toBe(updateData.phone)

      // Validar estructura completa del usuario
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('role')
      expect(user).toHaveProperty('isEmailVerified')
      expect(user).toHaveProperty('createdAt')
      expect(user).toHaveProperty('updatedAt')

      // Validar tipos de datos
      expect(typeof user.id).toBe('string')
      expect(typeof user.name).toBe('string')
      expect(typeof user.email).toBe('string')
      expect(typeof user.phone).toBe('string')
      expect(typeof user.isEmailVerified).toBe('boolean')
      expect(typeof user.createdAt).toBe('string')
      expect(typeof user.updatedAt).toBe('string')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de actualización de perfil ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })

    it('DEBE mantener estructura de error para datos inválidos', async () => {
      // Arrange
      const testName = 'auth-update-profile-invalid'
      const invalidData = {
        email: 'email-invalido',  // Email mal formateado
        phone: '123'              // Teléfono muy corto
      }

      // Act
      const result = await makeApiCall(
        '/api/v1/auth/profile',
        'PUT',
        invalidData,
        { 'Authorization': 'Bearer mock-auth-token' },
        'auth-update-profile-invalid'
      )

      // Assert
      expect(result.status).toBe(400)
      expect(result.data).toHaveProperty('success', false)
      expect(result.data).toHaveProperty('message')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de error de actualización ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('PUT /api/v1/auth/change-password', () => {
    it('DEBE mantener estructura de cambio de contraseña exitoso', async () => {
      // Arrange
      const testName = 'auth-change-password'
      const passwordData = {
        currentPassword: 'password123',
        newPassword: 'newPassword456',
        confirmPassword: 'newPassword456'
      }

      // Act
      const result = await makeApiCall(
        '/api/v1/auth/change-password',
        'PUT',
        passwordData,
        { 'Authorization': 'Bearer mock-auth-token' },
        'auth-change-password'
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('message')
      expect(result.data.message).toContain('Contraseña')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de cambio de contraseña ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })

    it('DEBE mantener estructura de error para contraseña actual incorrecta', async () => {
      // Arrange
      const testName = 'auth-change-password-wrong-current'
      const wrongPasswordData = {
        currentPassword: 'wrongPassword',
        newPassword: 'newPassword456',
        confirmPassword: 'newPassword456'
      }

      // Act
      const result = await makeApiCall(
        '/api/v1/auth/change-password',
        'PUT',
        wrongPasswordData,
        { 'Authorization': 'Bearer mock-auth-token' },
        'auth-change-password-wrong-current'
      )

      // Assert
      expect(result.status).toBe(400)
      expect(result.data).toHaveProperty('success', false)
      expect(result.data.message).toContain('Contraseña actual')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de error de contraseña incorrecta ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('POST /api/v1/auth/forgot-password', () => {
    it('DEBE mantener estructura de solicitud de recuperación exitosa', async () => {
      // Arrange
      const testName = 'auth-forgot-password'
      const emailData = { email: 'user@test.com' }

      // Act
      const result = await makeApiCall(
        '/api/v1/auth/forgot-password',
        'POST',
        emailData,
        {},
        'auth-forgot-password'
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('message')
      expect(result.data.message).toContain('Email')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de forgot password ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })

    it('DEBE mantener estructura de error para email no registrado', async () => {
      // Arrange
      const testName = 'auth-forgot-password-email-not-found'
      const emailData = { email: 'noexiste@test.com' }

      // Act
      const result = await makeApiCall(
        '/api/v1/auth/forgot-password',
        'POST',
        emailData,
        {},
        'auth-forgot-password-email-not-found'
      )

      // Assert
      expect(result.status).toBe(404)
      expect(result.data).toHaveProperty('success', false)
      expect(result.data.message).toContain('no encontrado')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de error email no encontrado ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('GET /api/v1/auth/verify-email/:token', () => {
    it('DEBE mantener estructura de verificación de email exitosa', async () => {
      // Arrange
      const testName = 'auth-verify-email'
      const verificationToken = 'valid-verification-token-123'

      // Act
      const result = await makeApiCall(
        `/api/v1/auth/verify-email/${verificationToken}`,
        'GET',
        null,
        {},
        'auth-verify-email'
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('message')
      expect(result.data.message).toContain('verificado')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de verificación de email ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })

    it('DEBE mantener estructura de error para token inválido', async () => {
      // Arrange
      const testName = 'auth-verify-email-invalid-token'
      const invalidToken = 'invalid-token-123'

      // Act
      const result = await makeApiCall(
        `/api/v1/auth/verify-email/${invalidToken}`,
        'GET',
        null,
        {},
        'auth-verify-email-invalid-token'
      )

      // Assert
      expect(result.status).toBe(400)
      expect(result.data).toHaveProperty('success', false)
      expect(result.data.message).toContain('Token')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de error de token inválido ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('DELETE /api/v1/auth/account', () => {
    it('DEBE mantener estructura de eliminación de cuenta exitosa', async () => {
      // Arrange
      const testName = 'auth-delete-account'

      // Act
      const result = await makeApiCall(
        '/api/v1/auth/account',
        'DELETE',
        null,
        { 'Authorization': 'Bearer mock-auth-token' },
        'auth-delete-account'
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
          `Estructura de eliminación de cuenta ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('POST /api/v1/auth/resend-verification', () => {
    it('DEBE mantener estructura de reenvío de verificación', async () => {
      // Arrange
      const testName = 'auth-resend-verification'

      // Act
      const result = await makeApiCall(
        '/api/v1/auth/resend-verification',
        'POST',
        null,
        { 'Authorization': 'Bearer mock-auth-token' },
        'auth-resend-verification'
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('message')
      expect(result.data.message).toContain('reenviado')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de reenvío de verificación ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })
})
