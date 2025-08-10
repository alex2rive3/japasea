/**
 * Tests de Integración para AuthService
 * 
 * Verifica que las peticiones HTTP al backend sean correctas,
 * valida estructura de respuestas JSON y manejo de errores.
 */

import { authService } from '../../services/authService'
import { server } from '../../test/mocks/server'
import { http, HttpResponse } from 'msw'
import {
  expectUserStructure,
  mockAuthUser,
  mockAdminUser,
  createValidRegisterData,
  createValidLoginData,
  setAuthTokens,
  clearAuthTokens,
  unauthorizedResponse,
  serverErrorResponse
} from '../../test/helpers/testUtils'

const API_BASE_URL = 'http://localhost:3001'

describe('AuthService Integration Tests', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    clearAuthTokens()
  })

  afterEach(() => {
    // Limpiar localStorage después de cada test
    clearAuthTokens()
  })

  describe('register()', () => {
    it('DEBE registrar un usuario exitosamente con status 200', async () => {
      // Arrange
      const registerData = createValidRegisterData()

      // Act
      const result = await authService.register(registerData)

      // Assert
      expect(result).toBeDefined()
      expectUserStructure(result)
      expect(result.name).toBe(registerData.name)
      expect(result.email).toBe(registerData.email)
      expect(result.role).toBe('user')
      
      // Verificar que los tokens se guardaron
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      expect(accessToken).toBe('mock-access-token')
      expect(refreshToken).toBe('mock-refresh-token')
    })

    it('DEBE fallar con status 400 cuando faltan datos requeridos', async () => {
      // Arrange
      const invalidData = { name: 'Test', email: '', password: '' }

      // Act & Assert
      await expect(authService.register(invalidData as any))
        .rejects
        .toThrow('Datos requeridos faltantes')
    })

    it('DEBE fallar con status 409 cuando el email ya existe', async () => {
      // Arrange
      const existingUserData = {
        ...createValidRegisterData(),
        email: 'existing@test.com'
      }

      // Act & Assert
      await expect(authService.register(existingUserData))
        .rejects
        .toThrow('El email ya está registrado')
    })

    it('DEBE manejar errores 500 del servidor correctamente', async () => {
      // Arrange
      server.use(
        http.post(`${API_BASE_URL}/api/v1/auth/register`, () => {
          return HttpResponse.json(serverErrorResponse, { status: 500 })
        })
      )

      // Act & Assert
      await expect(authService.register(createValidRegisterData()))
        .rejects
        .toThrow()
    })
  })

  describe('login()', () => {
    it('DEBE hacer login exitosamente con credenciales de usuario válidas', async () => {
      // Arrange
      const credentials = createValidLoginData()

      // Act
      const result = await authService.login(credentials)

      // Assert
      expect(result).toBeDefined()
      expectUserStructure(result)
      expect(result.email).toBe(credentials.email)
      expect(result.role).toBe('user')
      
      // Verificar que los tokens se guardaron
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      expect(accessToken).toBe('mock-user-token')
      expect(refreshToken).toBe('mock-user-refresh')
    })

    it('DEBE hacer login exitosamente con credenciales de admin válidas', async () => {
      // Arrange
      const adminCredentials = { email: 'admin@test.com', password: 'password' }

      // Act
      const result = await authService.login(adminCredentials)

      // Assert
      expect(result).toBeDefined()
      expectUserStructure(result)
      expect(result.email).toBe(adminCredentials.email)
      expect(result.role).toBe('admin')
      
      // Verificar tokens de admin
      const accessToken = localStorage.getItem('accessToken')
      expect(accessToken).toBe('mock-admin-token')
    })

    it('DEBE fallar con status 401 para credenciales inválidas', async () => {
      // Arrange
      const invalidCredentials = { email: 'wrong@test.com', password: 'wrongpass' }

      // Act & Assert
      await expect(authService.login(invalidCredentials))
        .rejects
        .toThrow('Credenciales inválidas')
    })

    it('DEBE validar que la respuesta tenga la estructura JSON correcta', async () => {
      // Arrange
      const credentials = createValidLoginData()

      // Act
      const result = await authService.login(credentials)

      // Assert - Verificar estructura específica de respuesta de login
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('email')
      expect(result).toHaveProperty('role')
      expect(result).toHaveProperty('isEmailVerified')
      expect(result).toHaveProperty('createdAt')
      
      // Verificar tipos de datos
      expect(typeof result.id).toBe('string')
      expect(typeof result.name).toBe('string')
      expect(typeof result.email).toBe('string')
      expect(['user', 'admin']).toContain(result.role)
      expect(typeof result.isEmailVerified).toBe('boolean')
      expect(typeof result.createdAt).toBe('string')
    })
  })

  describe('getProfile()', () => {
    it('DEBE obtener perfil exitosamente con token válido', async () => {
      // Arrange
      setAuthTokens('mock-user-token')

      // Act
      const result = await authService.getProfile()

      // Assert
      expect(result).toBeDefined()
      expectUserStructure(result)
      expect(result.id).toBe('user-123')
      expect(result.email).toBe('user@test.com')
    })

    it('DEBE obtener perfil de admin con token de admin', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')

      // Act
      const result = await authService.getProfile()

      // Assert
      expect(result).toBeDefined()
      expectUserStructure(result)
      expect(result.id).toBe('admin-123')
      expect(result.role).toBe('admin')
    })

    it('DEBE fallar con status 401 sin token de autorización', async () => {
      // Arrange - No establecer token

      // Act & Assert
      await expect(authService.getProfile())
        .rejects
        .toThrow('Token de autorización requerido')
    })

    it('DEBE fallar con status 401 con token inválido', async () => {
      // Arrange
      setAuthTokens('invalid-token')

      // Act & Assert
      await expect(authService.getProfile())
        .rejects
        .toThrow('Token inválido')
    })
  })

  describe('updateProfile()', () => {
    it('DEBE actualizar perfil exitosamente con datos válidos', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const updateData = { name: 'Updated Name', phone: '+9876543210' }
      
      server.use(
        http.put(`${API_BASE_URL}/api/v1/auth/profile`, async ({ request }) => {
          const body = await request.json() as any
          return HttpResponse.json({
            success: true,
            message: 'Perfil actualizado',
            data: {
              user: { ...mockAuthUser, ...body }
            }
          })
        })
      )

      // Act
      const result = await authService.updateProfile(updateData)

      // Assert
      expect(result).toBeDefined()
      expectUserStructure(result)
      expect(result.name).toBe(updateData.name)
      expect(result.phone).toBe(updateData.phone)
    })

    it('DEBE fallar sin token de autorización', async () => {
      // Arrange
      const updateData = { name: 'Updated Name' }

      // Act & Assert
      await expect(authService.updateProfile(updateData))
        .rejects
        .toThrow()
    })
  })

  describe('changePassword()', () => {
    it('DEBE cambiar contraseña exitosamente con datos válidos', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const passwordData = { currentPassword: 'oldpass', newPassword: 'newpass123' }
      
      server.use(
        http.put(`${API_BASE_URL}/api/v1/auth/change-password`, () => {
          return HttpResponse.json({
            success: true,
            message: 'Contraseña actualizada'
          })
        })
      )

      // Act & Assert
      await expect(authService.changePassword(passwordData))
        .resolves
        .not.toThrow()
    })

    it('DEBE fallar con contraseña actual incorrecta', async () => {
      // Arrange
      setAuthTokens('mock-user-token')
      const passwordData = { currentPassword: 'wrongpass', newPassword: 'newpass123' }
      
      server.use(
        http.put(`${API_BASE_URL}/api/v1/auth/change-password`, () => {
          return HttpResponse.json(
            { success: false, message: 'Contraseña actual incorrecta' },
            { status: 400 }
          )
        })
      )

      // Act & Assert
      await expect(authService.changePassword(passwordData))
        .rejects
        .toThrow('Contraseña actual incorrecta')
    })
  })

  describe('logout()', () => {
    it('DEBE hacer logout exitosamente y limpiar tokens', async () => {
      // Arrange
      setAuthTokens('mock-user-token', 'mock-user-refresh')

      // Act
      await authService.logout()

      // Assert
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      expect(accessToken).toBeNull()
      expect(refreshToken).toBeNull()
    })

    it('DEBE limpiar tokens incluso si la petición al servidor falla', async () => {
      // Arrange
      setAuthTokens('mock-user-token', 'mock-user-refresh')
      server.use(
        http.post(`${API_BASE_URL}/api/v1/auth/logout`, () => {
          return HttpResponse.json(serverErrorResponse, { status: 500 })
        })
      )

      // Act
      await authService.logout()

      // Assert - Los tokens deben limpiarse incluso con error del servidor
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      expect(accessToken).toBeNull()
      expect(refreshToken).toBeNull()
    })
  })

  describe('forgotPassword()', () => {
    it('DEBE enviar email de recuperación exitosamente', async () => {
      // Arrange
      const email = 'user@test.com'
      server.use(
        http.post(`${API_BASE_URL}/api/v1/auth/forgot-password`, () => {
          return HttpResponse.json({
            success: true,
            message: 'Email de recuperación enviado'
          })
        })
      )

      // Act
      const result = await authService.forgotPassword(email)

      // Assert
      expect(result).toBeDefined()
      expect(result.success).toBe(true)
      expect(result.message).toBe('Email de recuperación enviado')
    })

    it('DEBE fallar con email no registrado', async () => {
      // Arrange
      const email = 'notfound@test.com'
      server.use(
        http.post(`${API_BASE_URL}/api/v1/auth/forgot-password`, () => {
          return HttpResponse.json(
            { success: false, message: 'Email no encontrado' },
            { status: 404 }
          )
        })
      )

      // Act & Assert
      await expect(authService.forgotPassword(email))
        .rejects
        .toThrow('Email no encontrado')
    })
  })

  describe('verifyEmail()', () => {
    it('DEBE verificar email exitosamente con token válido', async () => {
      // Arrange
      const token = 'valid-verification-token'
      server.use(
        http.get(`${API_BASE_URL}/api/v1/auth/verify-email/${token}`, () => {
          return HttpResponse.json({
            success: true,
            message: 'Email verificado exitosamente'
          })
        })
      )

      // Act
      const result = await authService.verifyEmail(token)

      // Assert
      expect(result).toBeDefined()
      expect(result.success).toBe(true)
      expect(result.message).toBe('Email verificado exitosamente')
    })

    it('DEBE fallar con token de verificación inválido', async () => {
      // Arrange
      const token = 'invalid-token'
      server.use(
        http.get(`${API_BASE_URL}/api/v1/auth/verify-email/${token}`, () => {
          return HttpResponse.json(
            { success: false, message: 'Token de verificación inválido' },
            { status: 400 }
          )
        })
      )

      // Act & Assert
      await expect(authService.verifyEmail(token))
        .rejects
        .toThrow('Token de verificación inválido')
    })
  })

  describe('refreshToken()', () => {
    it('DEBE actualizar tokens exitosamente', async () => {
      // Arrange
      setAuthTokens('old-access-token', 'valid-refresh-token')
      server.use(
        http.post(`${API_BASE_URL}/api/v1/auth/refresh-token`, () => {
          return HttpResponse.json({
            success: true,
            message: 'Tokens actualizados',
            data: {
              accessToken: 'new-access-token',
              refreshToken: 'new-refresh-token'
            }
          })
        })
      )

      // Act
      await authService.refreshToken()

      // Assert
      const newAccessToken = localStorage.getItem('accessToken')
      const newRefreshToken = localStorage.getItem('refreshToken')
      expect(newAccessToken).toBe('new-access-token')
      expect(newRefreshToken).toBe('new-refresh-token')
    })

    it('DEBE limpiar tokens cuando refresh token es inválido', async () => {
      // Arrange
      setAuthTokens('old-access-token', 'invalid-refresh-token')
      server.use(
        http.post(`${API_BASE_URL}/api/v1/auth/refresh-token`, () => {
          return HttpResponse.json(
            { success: false, message: 'Refresh token inválido' },
            { status: 401 }
          )
        })
      )

      // Act & Assert
      await expect(authService.refreshToken())
        .rejects
        .toThrow()
      
      // Verificar que los tokens se limpiaron
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      expect(accessToken).toBeNull()
      expect(refreshToken).toBeNull()
    })
  })

  describe('Utilidades de Authentication', () => {
    it('isAuthenticated() DEBE retornar true con token válido', () => {
      // Arrange
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.Lf8v9s7HJI8CRLBqjSh1kZt9J8Fwr9VjK2k8XcOoS2M'
      setAuthTokens(validToken)

      // Act
      const result = authService.isAuthenticated()

      // Assert
      expect(result).toBe(true)
    })

    it('isAuthenticated() DEBE retornar false sin token', () => {
      // Arrange - No establecer token

      // Act
      const result = authService.isAuthenticated()

      // Assert
      expect(result).toBe(false)
    })

    it('getAccessToken() DEBE retornar el token almacenado', () => {
      // Arrange
      const token = 'test-access-token'
      setAuthTokens(token)

      // Act
      const result = authService.getAccessToken()

      // Assert
      expect(result).toBe(token)
    })

    it('getRefreshToken() DEBE retornar el refresh token almacenado', () => {
      // Arrange
      const refreshToken = 'test-refresh-token'
      setAuthTokens('access-token', refreshToken)

      // Act
      const result = authService.getRefreshToken()

      // Assert
      expect(result).toBe(refreshToken)
    })
  })
})
