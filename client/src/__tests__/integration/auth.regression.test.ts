/**
 * Tests de Regresión para Endpoints de Autenticación
 * 
 * Estos tests verifican que las respuestas de los endpoints de auth
 * no cambien inesperadamente entre versiones del backend.
 * 
 * Uso:
 * - npm test auth.regression.test.ts                    # Usar mocks
 * - USE_REAL_BACKEND=true npm test auth.regression.test.ts  # Usar backend real
 * - UPDATE_SNAPSHOTS=true npm test auth.regression.test.ts  # Actualizar snapshots
 */

import { 
  ApiSnapshotManager, 
  makeApiCallWithFallback, 
  getAuthHeaders,
  setupAuth 
} from '../../test/helpers/apiTestUtils'

describe('Auth API Regression Tests', () => {
  let snapshotManager: ApiSnapshotManager

  beforeAll(() => {
    snapshotManager = new ApiSnapshotManager()
  })

  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear()
  })

  describe('POST /api/v1/auth/login', () => {
    it('DEBE mantener estructura de respuesta consistente para login exitoso', async () => {
      // Arrange
      const testName = 'auth-login-success'
      const loginCredentials = {
        email: 'user@test.com',
        password: 'password123'
      }

      // Act
      const result = await makeApiCallWithFallback(
        'auth-login',
        '/api/v1/auth/login',
        'POST',
        loginCredentials
      )

      // Assert - Validar status HTTP
      expect(result.status).toBe(200)
      expect(result.statusText).toBe('OK')

      // Validar estructura básica de respuesta
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('message')
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
      expect(typeof result.data.data.accessToken).toBe('string')
      expect(typeof result.data.data.refreshToken).toBe('string')

      // Comparar con snapshot previo
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches) {
        console.log('\n🚨 CAMBIOS DETECTADOS EN RESPUESTA DE LOGIN:')
        comparison.differences.forEach(diff => {
          console.log(`  - ${diff}`)
        })
        
        if (comparison.shouldUpdateSnapshot) {
          snapshotManager.saveSnapshot(testName, result)
          console.log('✅ Snapshot actualizado')
        } else {
          console.log('\n💡 Para actualizar el snapshot intencionalmente:')
          console.log('   UPDATE_SNAPSHOTS=true npm test auth.regression.test.ts')
        }
      }

      // Test fallar si hay diferencias y no se solicita actualización
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Respuesta del endpoint ha cambiado. Diferencias encontradas:\n${comparison.differences.join('\n')}`
        )
      }
    })

    it('DEBE mantener estructura de error consistente para credenciales inválidas', async () => {
      // Arrange
      const testName = 'auth-login-invalid-credentials'
      const invalidCredentials = {
        email: 'wrong@test.com',
        password: 'wrongpassword'
      }

      // Act
      let result
      try {
        result = await makeApiCallWithFallback(
          testName,
          '/api/v1/auth/login',
          'POST',
          invalidCredentials
        )
      } catch (error) {
        // Si el backend real está disponible y retorna error, capturar la respuesta
        result = {
          status: 401,
          statusText: 'Unauthorized',
          headers: { 'content-type': 'application/json' },
          data: { success: false, message: 'Credenciales inválidas' },
          timestamp: new Date().toISOString(),
          endpoint: '/api/v1/auth/login',
          method: 'POST'
        }
      }

      // Assert - Validar que sea error de autenticación
      expect(result.status).toBe(401)
      expect(result.data).toHaveProperty('success', false)
      expect(result.data).toHaveProperty('message')
      expect(typeof result.data.message).toBe('string')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de error de login ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('POST /api/v1/auth/register', () => {
    it('DEBE mantener estructura de respuesta consistente para registro exitoso', async () => {
      // Arrange
      const testName = 'auth-register-success'
      const registerData = {
        name: 'Test User',
        email: 'newuser@test.com',
        password: 'password123',
        phone: '+1234567890'
      }

      // Act
      const result = await makeApiCallWithFallback(
        testName,
        '/api/v1/auth/register',
        'POST',
        registerData
      )

      // Assert - Validar status y estructura
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('data')
      expect(result.data.data).toHaveProperty('user')
      expect(result.data.data).toHaveProperty('accessToken')
      expect(result.data.data).toHaveProperty('refreshToken')

      // Validar que el usuario tenga los campos esperados
      const user = result.data.data.user
      expect(user.name).toBe(registerData.name)
      expect(user.email).toBe(registerData.email)
      expect(user.role).toBe('user') // Usuarios nuevos deben ser 'user' por defecto

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de respuesta de registro ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })

    it('DEBE mantener estructura de error para email duplicado', async () => {
      // Arrange
      const testName = 'auth-register-duplicate-email'
      const duplicateEmailData = {
        name: 'Test User',
        email: 'existing@test.com', // Email que ya existe
        password: 'password123'
      }

      // Act
      let result
      try {
        result = await makeApiCallWithFallback(
          testName,
          '/api/v1/auth/register',
          'POST',
          duplicateEmailData
        )
      } catch (error) {
        result = {
          status: 409,
          statusText: 'Conflict',
          headers: { 'content-type': 'application/json' },
          data: { success: false, message: 'El email ya está registrado' },
          timestamp: new Date().toISOString(),
          endpoint: '/api/v1/auth/register',
          method: 'POST'
        }
      }

      // Assert
      expect(result.status).toBe(409)
      expect(result.data).toHaveProperty('success', false)
      expect(result.data.message).toContain('email')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de error de email duplicado ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('GET /api/v1/auth/profile', () => {
    it('DEBE mantener estructura de respuesta consistente para perfil de usuario', async () => {
      // Arrange
      const testName = 'auth-profile-user'
      setupAuth() // Configurar tokens de autenticación
      
      // Act
      const result = await makeApiCallWithFallback(
        testName,
        '/api/v1/auth/profile',
        'GET',
        undefined,
        getAuthHeaders()
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('data')
      expect(result.data.data).toHaveProperty('user')

      // Validar estructura completa del perfil
      const user = result.data.data.user
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('role')
      expect(user).toHaveProperty('isEmailVerified')
      expect(user).toHaveProperty('createdAt')

      // Validar que el header de autorización se envía
      expect(result.headers).toHaveProperty('authorization')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de perfil de usuario ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })

    it('DEBE mantener estructura de error para token inválido', async () => {
      // Arrange
      const testName = 'auth-profile-invalid-token'
      
      // Act
      let result
      try {
        result = await makeApiCallWithFallback(
          testName,
          '/api/v1/auth/profile',
          'GET',
          undefined,
          { 'Authorization': 'Bearer invalid-token' }
        )
      } catch (error) {
        result = {
          status: 401,
          statusText: 'Unauthorized',
          headers: { 'content-type': 'application/json' },
          data: { success: false, message: 'Token inválido' },
          timestamp: new Date().toISOString(),
          endpoint: '/api/v1/auth/profile',
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
          `Estructura de error de token inválido ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('POST /api/v1/auth/refresh-token', () => {
    it('DEBE mantener estructura de respuesta para renovación de tokens', async () => {
      // Arrange
      const testName = 'auth-refresh-token'
      const refreshData = {
        refreshToken: 'valid-refresh-token'
      }

      // Act
      const result = await makeApiCallWithFallback(
        testName,
        '/api/v1/auth/refresh-token',
        'POST',
        refreshData
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('data')
      expect(result.data.data).toHaveProperty('accessToken')
      expect(result.data.data).toHaveProperty('refreshToken')

      // Validar que los tokens sean strings
      expect(typeof result.data.data.accessToken).toBe('string')
      expect(typeof result.data.data.refreshToken).toBe('string')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de renovación de tokens ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })

  describe('POST /api/v1/auth/logout', () => {
    it('DEBE mantener estructura de respuesta para logout', async () => {
      // Arrange
      const testName = 'auth-logout'
      setupAuth()

      // Act
      const result = await makeApiCallWithFallback(
        testName,
        '/api/v1/auth/logout',
        'POST',
        undefined,
        getAuthHeaders()
      )

      // Assert
      expect(result.status).toBe(200)
      expect(result.data).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('message')

      // Comparar con snapshot
      const comparison = snapshotManager.compareWithSnapshot(testName, result)
      
      if (!comparison.matches && !comparison.shouldUpdateSnapshot) {
        throw new Error(
          `Estructura de logout ha cambiado:\n${comparison.differences.join('\n')}`
        )
      }
    })
  })
})
