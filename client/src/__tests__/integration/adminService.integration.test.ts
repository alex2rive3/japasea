/**
 * Tests de Integración para AdminService
 * 
 * Verifica que las peticiones HTTP para administración sean correctas,
 * valida estructura de respuestas JSON y manejo de errores.
 */

import { adminService } from '../../services/adminService'
import { server } from '../../test/mocks/server'
import { http, HttpResponse } from 'msw'
import {
  setAuthTokens,
  clearAuthTokens,
  mockAdminUser,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  serverErrorResponse,
  expectApiResponse
} from '../../test/helpers/testUtils'

const API_BASE_URL = 'http://localhost:3001'

// Mock para el módulo apiConfig
jest.mock('../../services/apiConfig', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  }
}))

import api from '../../services/apiConfig'
const mockApi = api as jest.Mocked<typeof api>

describe('AdminService Integration Tests', () => {
  beforeEach(() => {
    clearAuthTokens()
    jest.clearAllMocks()
  })

  afterEach(() => {
    clearAuthTokens()
  })

  describe('getAdminStats()', () => {
    it('DEBE obtener estadísticas de admin exitosamente con status 200', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const mockResponse = {
        data: {
          success: true,
          data: {
            totalUsers: 1250,
            activeUsers: 890,
            totalPlaces: 45,
            pendingPlaces: 3,
            totalReviews: 567,
            recentActivity: [
              {
                id: 'activity-1',
                userId: 'user-123',
                userName: 'Test User',
                action: 'create',
                resource: 'place',
                timestamp: '2024-01-15T10:00:00.000Z',
                details: { placeId: 'place-123' }
              }
            ]
          }
        }
      }
      
      mockApi.get.mockResolvedValue(mockResponse)

      // Act
      const result = await adminService.getAdminStats()

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/api/v1/admin/stats')
      
      expect(result).toBeDefined()
      expectApiResponse(result, ['success', 'data'])
      expect(result.success).toBe(true)
      
      const stats = result.data
      expect(stats).toHaveProperty('totalUsers')
      expect(stats).toHaveProperty('activeUsers')
      expect(stats).toHaveProperty('totalPlaces')
      expect(stats).toHaveProperty('pendingPlaces')
      expect(stats).toHaveProperty('totalReviews')
      expect(stats).toHaveProperty('recentActivity')
      
      // Verificar tipos de datos
      expect(typeof stats.totalUsers).toBe('number')
      expect(typeof stats.activeUsers).toBe('number')
      expect(typeof stats.totalPlaces).toBe('number')
      expect(typeof stats.pendingPlaces).toBe('number')
      expect(typeof stats.totalReviews).toBe('number')
      expect(Array.isArray(stats.recentActivity)).toBe(true)
      
      // Verificar estructura de actividad reciente
      if (stats.recentActivity.length > 0) {
        const activity = stats.recentActivity[0]
        expect(activity).toHaveProperty('id')
        expect(activity).toHaveProperty('userId')
        expect(activity).toHaveProperty('userName')
        expect(activity).toHaveProperty('action')
        expect(activity).toHaveProperty('resource')
        expect(activity).toHaveProperty('timestamp')
        
        expect(typeof activity.id).toBe('string')
        expect(typeof activity.userId).toBe('string')
        expect(typeof activity.userName).toBe('string')
        expect(typeof activity.action).toBe('string')
        expect(typeof activity.resource).toBe('string')
        expect(typeof activity.timestamp).toBe('string')
      }
    })

    it('DEBE fallar con status 403 para usuarios no admin', async () => {
      // Arrange
      setAuthTokens('mock-user-token') // Token de usuario normal
      mockApi.get.mockRejectedValue({
        response: { status: 403, data: forbiddenResponse }
      })

      // Act & Assert
      await expect(adminService.getAdminStats())
        .rejects
        .toBeDefined()
    })

    it('DEBE fallar con status 401 sin token', async () => {
      // Arrange - No establecer token
      mockApi.get.mockRejectedValue({
        response: { status: 401, data: unauthorizedResponse }
      })

      // Act & Assert
      await expect(adminService.getAdminStats())
        .rejects
        .toBeDefined()
    })
  })

  describe('getPlaceStats()', () => {
    it('DEBE obtener estadísticas de lugares exitosamente', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const mockResponse = {
        data: {
          totalPlaces: 45,
          placesByType: {
            restaurant: 15,
            historical: 12,
            beach: 8,
            natural: 10
          },
          placesByStatus: {
            active: 40,
            pending: 3,
            rejected: 2
          },
          averageRating: 4.3,
          monthlyGrowth: 15
        }
      }
      
      mockApi.get.mockResolvedValue(mockResponse)

      // Act
      const result = await adminService.getPlaceStats()

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/api/v1/admin/stats/places')
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('totalPlaces')
      expect(result).toHaveProperty('placesByType')
      expect(result).toHaveProperty('placesByStatus')
      expect(result).toHaveProperty('averageRating')
      
      expect(typeof result.totalPlaces).toBe('number')
      expect(typeof result.placesByType).toBe('object')
      expect(typeof result.placesByStatus).toBe('object')
      expect(typeof result.averageRating).toBe('number')
    })

    it('DEBE enviar parámetros de rango de tiempo correctamente', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const timeRange = {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31')
      }
      
      mockApi.get.mockResolvedValue({ data: {} })

      // Act
      await adminService.getPlaceStats(timeRange)

      // Assert
      const expectedUrl = `/api/v1/admin/stats/places?startDate=${timeRange.start.toISOString()}&endDate=${timeRange.end.toISOString()}`
      expect(mockApi.get).toHaveBeenCalledWith(expectedUrl)
    })
  })

  describe('getUsers()', () => {
    it('DEBE obtener lista de usuarios exitosamente con paginación', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const mockResponse = {
        data: {
          data: [
            {
              id: 'user-1',
              name: 'John Doe',
              email: 'john@test.com',
              phone: '+1234567890',
              role: 'user',
              status: 'active',
              emailVerified: true,
              createdAt: '2024-01-01T00:00:00.000Z',
              lastLogin: '2024-01-15T10:00:00.000Z'
            }
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1
          }
        }
      }
      
      mockApi.get.mockResolvedValue(mockResponse)

      // Act
      const result = await adminService.getUsers()

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/api/v1/admin/users')
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('pagination')
      expect(Array.isArray(result.data)).toBe(true)
      
      if (result.data.length > 0) {
        const user = result.data[0]
        expect(user).toHaveProperty('id')
        expect(user).toHaveProperty('name')
        expect(user).toHaveProperty('email')
        expect(user).toHaveProperty('role')
        expect(user).toHaveProperty('status')
        expect(user).toHaveProperty('emailVerified')
        expect(user).toHaveProperty('createdAt')
        
        // Verificar tipos
        expect(typeof user.id).toBe('string')
        expect(typeof user.name).toBe('string')
        expect(typeof user.email).toBe('string')
        expect(['user', 'admin']).toContain(user.role)
        expect(['active', 'suspended', 'deleted']).toContain(user.status)
        expect(typeof user.emailVerified).toBe('boolean')
        expect(typeof user.createdAt).toBe('string')
      }
    })

    it('DEBE enviar parámetros de filtrado correctamente', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const params = {
        page: 2,
        limit: 20,
        search: 'john',
        role: 'admin',
        status: 'active'
      }
      
      mockApi.get.mockResolvedValue({ data: { data: [], pagination: {} } })

      // Act
      await adminService.getUsers(params)

      // Assert
      const expectedUrl = '/api/v1/admin/users?page=2&limit=20&search=john&role=admin&status=active'
      expect(mockApi.get).toHaveBeenCalledWith(expectedUrl)
    })

    it('DEBE omitir parámetros vacíos en la query string', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const params = {
        page: 1,
        search: '', // Vacío
        role: 'user',
        status: undefined // Undefined
      }
      
      mockApi.get.mockResolvedValue({ data: { data: [], pagination: {} } })

      // Act
      await adminService.getUsers(params)

      // Assert
      const expectedUrl = '/api/v1/admin/users?page=1&role=user'
      expect(mockApi.get).toHaveBeenCalledWith(expectedUrl)
    })
  })

  describe('updateUserRole()', () => {
    it('DEBE actualizar rol de usuario exitosamente', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const userId = 'user-123'
      const newRole = 'admin' as const
      
      const mockResponse = {
        data: {
          success: true,
          message: 'Rol actualizado exitosamente',
          data: { id: userId, role: newRole }
        }
      }
      
      mockApi.patch.mockResolvedValue(mockResponse)

      // Act
      const result = await adminService.updateUserRole(userId, newRole)

      // Assert
      expect(mockApi.patch).toHaveBeenCalledWith(
        `/api/v1/admin/users/${userId}/role`,
        { role: newRole }
      )
      
      expect(result).toBeDefined()
      expect(result.success).toBe(true)
      expect(result.data.role).toBe(newRole)
    })

    it('DEBE validar roles válidos', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const userId = 'user-123'
      const invalidRole = 'superuser' as any
      
      mockApi.patch.mockRejectedValue({
        response: { status: 400, data: { message: 'Rol inválido' } }
      })

      // Act & Assert
      await expect(adminService.updateUserRole(userId, invalidRole))
        .rejects
        .toBeDefined()
    })
  })

  describe('suspendUser()', () => {
    it('DEBE suspender usuario exitosamente con razón', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const userId = 'user-123'
      const reason = 'Violación de términos de servicio'
      
      const mockResponse = {
        data: {
          success: true,
          message: 'Usuario suspendido',
          data: { id: userId, status: 'suspended', suspensionReason: reason }
        }
      }
      
      mockApi.patch.mockResolvedValue(mockResponse)

      // Act
      const result = await adminService.suspendUser(userId, reason)

      // Assert
      expect(mockApi.patch).toHaveBeenCalledWith(
        `/api/v1/admin/users/${userId}/suspend`,
        { reason }
      )
      
      expect(result).toBeDefined()
      expect(result.success).toBe(true)
    })

    it('DEBE suspender usuario sin razón específica', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const userId = 'user-123'
      
      mockApi.patch.mockResolvedValue({
        data: { success: true, data: { id: userId, status: 'suspended' } }
      })

      // Act
      await adminService.suspendUser(userId)

      // Assert
      expect(mockApi.patch).toHaveBeenCalledWith(
        `/api/v1/admin/users/${userId}/suspend`,
        { reason: undefined }
      )
    })
  })

  describe('getReviews()', () => {
    it('DEBE obtener reseñas para moderación exitosamente', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const mockResponse = {
        data: [
          {
            id: 'review-1',
            placeId: 'place-123',
            placeName: 'Test Place',
            userId: 'user-123',
            userName: 'Test User',
            rating: 5,
            comment: 'Great place!',
            status: 'pending',
            createdAt: '2024-01-15T10:00:00.000Z',
            reportCount: 0
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1
        }
      }
      
      mockApi.get.mockResolvedValue(mockResponse)

      // Act
      const result = await adminService.getReviews()

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/api/v1/admin/reviews')
      
      expect(result).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
      expect(result).toHaveProperty('pagination')
      
      if (result.data.length > 0) {
        const review = result.data[0]
        expect(review).toHaveProperty('id')
        expect(review).toHaveProperty('placeId')
        expect(review).toHaveProperty('placeName')
        expect(review).toHaveProperty('userId')
        expect(review).toHaveProperty('userName')
        expect(review).toHaveProperty('rating')
        expect(review).toHaveProperty('comment')
        expect(review).toHaveProperty('status')
        expect(review).toHaveProperty('createdAt')
        
        expect(['pending', 'approved', 'rejected']).toContain(review.status)
        expect(review.rating).toBeGreaterThanOrEqual(1)
        expect(review.rating).toBeLessThanOrEqual(5)
      }
    })

    it('DEBE filtrar reseñas por estado', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const params = { status: 'pending' as const }
      
      mockApi.get.mockResolvedValue({ data: [], pagination: {} })

      // Act
      await adminService.getReviews(params)

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/api/v1/admin/reviews?status=pending')
    })
  })

  describe('approveReview()', () => {
    it('DEBE aprobar reseña exitosamente', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const reviewId = 'review-123'
      
      const mockResponse = {
        data: {
          success: true,
          message: 'Reseña aprobada',
          data: { id: reviewId, status: 'approved' }
        }
      }
      
      mockApi.patch.mockResolvedValue(mockResponse)

      // Act
      const result = await adminService.approveReview(reviewId)

      // Assert
      expect(mockApi.patch).toHaveBeenCalledWith(`/api/v1/admin/reviews/${reviewId}/approve`)
      expect(result.success).toBe(true)
      expect(result.data.status).toBe('approved')
    })
  })

  describe('rejectReview()', () => {
    it('DEBE rechazar reseña con razón exitosamente', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const reviewId = 'review-123'
      const reason = 'Contenido inapropiado'
      
      const mockResponse = {
        data: {
          success: true,
          message: 'Reseña rechazada',
          data: { id: reviewId, status: 'rejected', rejectionReason: reason }
        }
      }
      
      mockApi.patch.mockResolvedValue(mockResponse)

      // Act
      const result = await adminService.rejectReview(reviewId, reason)

      // Assert
      expect(mockApi.patch).toHaveBeenCalledWith(
        `/api/v1/admin/reviews/${reviewId}/reject`,
        { reason }
      )
      
      expect(result.success).toBe(true)
      expect(result.data.status).toBe('rejected')
    })
  })

  describe('getActivityLogs()', () => {
    it('DEBE obtener logs de auditoría exitosamente', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const mockResponse = {
        data: [
          {
            id: 'log-1',
            userId: 'user-123',
            userName: 'Test User',
            action: 'CREATE',
            resource: 'place',
            timestamp: '2024-01-15T10:00:00.000Z',
            details: {
              placeId: 'place-123',
              placeName: 'New Place'
            },
            ipAddress: '192.168.1.1',
            userAgent: 'Mozilla/5.0...'
          }
        ],
        pagination: {
          page: 1,
          limit: 50,
          total: 1,
          totalPages: 1
        }
      }
      
      mockApi.get.mockResolvedValue(mockResponse)

      // Act
      const result = await adminService.getActivityLogs()

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/api/v1/admin/audit/logs')
      
      expect(result).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
      
      if (result.data.length > 0) {
        const log = result.data[0]
        expect(log).toHaveProperty('id')
        expect(log).toHaveProperty('userId')
        expect(log).toHaveProperty('userName')
        expect(log).toHaveProperty('action')
        expect(log).toHaveProperty('resource')
        expect(log).toHaveProperty('timestamp')
        
        expect(typeof log.id).toBe('string')
        expect(typeof log.userId).toBe('string')
        expect(typeof log.userName).toBe('string')
        expect(typeof log.action).toBe('string')
        expect(typeof log.resource).toBe('string')
        expect(typeof log.timestamp).toBe('string')
      }
    })

    it('DEBE filtrar logs por parámetros correctamente', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const params = {
        userId: 'user-123',
        action: 'CREATE',
        resource: 'place',
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-01-31T23:59:59.999Z'
      }
      
      mockApi.get.mockResolvedValue({ data: [], pagination: {} })

      // Act
      await adminService.getActivityLogs(params)

      // Assert
      const expectedUrl = '/api/v1/admin/audit/logs?userId=user-123&action=CREATE&resource=place&startDate=2024-01-01T00%3A00%3A00.000Z&endDate=2024-01-31T23%3A59%3A59.999Z'
      expect(mockApi.get).toHaveBeenCalledWith(expectedUrl)
    })
  })

  describe('getSystemSettings()', () => {
    it('DEBE obtener configuración del sistema exitosamente', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const mockResponse = {
        data: {
          siteName: 'Japasea',
          maintenanceMode: false,
          registrationEnabled: true,
          emailVerificationRequired: true,
          maxUploadSize: '10MB',
          supportedLanguages: ['es', 'en', 'pt'],
          featuredPlacesLimit: 6,
          ratingSystem: {
            enabled: true,
            maxRating: 5,
            allowGuestRatings: false
          }
        }
      }
      
      mockApi.get.mockResolvedValue(mockResponse)

      // Act
      const result = await adminService.getSystemSettings()

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/api/v1/admin/settings')
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('siteName')
      expect(result).toHaveProperty('maintenanceMode')
      expect(result).toHaveProperty('registrationEnabled')
      expect(result).toHaveProperty('emailVerificationRequired')
      expect(result).toHaveProperty('supportedLanguages')
      
      expect(typeof result.siteName).toBe('string')
      expect(typeof result.maintenanceMode).toBe('boolean')
      expect(typeof result.registrationEnabled).toBe('boolean')
      expect(Array.isArray(result.supportedLanguages)).toBe(true)
    })
  })

  describe('updateSystemSettings()', () => {
    it('DEBE actualizar configuración del sistema exitosamente', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const settings = {
        siteName: 'Japasea Updated',
        maintenanceMode: true,
        registrationEnabled: false
      }
      
      const mockResponse = {
        data: {
          success: true,
          message: 'Configuración actualizada',
          data: settings
        }
      }
      
      mockApi.put.mockResolvedValue(mockResponse)

      // Act
      const result = await adminService.updateSystemSettings(settings)

      // Assert
      expect(mockApi.put).toHaveBeenCalledWith('/api/v1/admin/settings', settings)
      expect(result.success).toBe(true)
      expect(result.data).toEqual(settings)
    })
  })

  describe('sendBulkNotification()', () => {
    it('DEBE enviar notificación masiva exitosamente', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const notificationParams = {
        title: 'Maintenance Notice',
        message: 'The system will be under maintenance tonight',
        targetUsers: 'all' as const,
        type: 'info' as const
      }
      
      const mockResponse = {
        data: {
          success: true,
          message: 'Notificación enviada a 1250 usuarios',
          data: {
            sent: 1250,
            failed: 0,
            notificationId: 'notif-123'
          }
        }
      }
      
      mockApi.post.mockResolvedValue(mockResponse)

      // Act
      const result = await adminService.sendBulkNotification(notificationParams)

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith(
        '/api/v1/admin/notifications/bulk',
        notificationParams
      )
      
      expect(result).toBeDefined()
      expect(result.success).toBe(true)
      expect(result.data).toHaveProperty('sent')
      expect(result.data).toHaveProperty('failed')
      expect(typeof result.data.sent).toBe('number')
      expect(typeof result.data.failed).toBe('number')
    })

    it('DEBE enviar notificación a usuarios específicos', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const specificUsers = ['user-1', 'user-2', 'user-3']
      const notificationParams = {
        title: 'Personal Message',
        message: 'This is a message for specific users',
        targetUsers: specificUsers,
        type: 'promotion' as const
      }
      
      mockApi.post.mockResolvedValue({
        data: { success: true, data: { sent: 3, failed: 0 } }
      })

      // Act
      await adminService.sendBulkNotification(notificationParams)

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith(
        '/api/v1/admin/notifications/bulk',
        notificationParams
      )
    })

    it('DEBE validar tipos de notificación válidos', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      const invalidType = 'urgent' as any
      const notificationParams = {
        title: 'Test',
        message: 'Test message',
        targetUsers: 'all' as const,
        type: invalidType
      }
      
      mockApi.post.mockRejectedValue({
        response: { status: 400, data: { message: 'Tipo de notificación inválido' } }
      })

      // Act & Assert
      await expect(adminService.sendBulkNotification(notificationParams))
        .rejects
        .toBeDefined()
    })
  })

  describe('Validaciones de autorización', () => {
    it('DEBE fallar todas las operaciones sin token de admin', async () => {
      // Arrange
      setAuthTokens('mock-user-token') // Token de usuario normal
      
      const operations = [
        () => adminService.getAdminStats(),
        () => adminService.getUsers(),
        () => adminService.updateUserRole('user-1', 'admin'),
        () => adminService.getReviews(),
        () => adminService.approveReview('review-1'),
        () => adminService.getSystemSettings(),
        () => adminService.updateSystemSettings({}),
      ]
      
      // Mock de error 403 para todas las peticiones
      mockApi.get.mockRejectedValue({ response: { status: 403, data: forbiddenResponse } })
      mockApi.patch.mockRejectedValue({ response: { status: 403, data: forbiddenResponse } })
      mockApi.put.mockRejectedValue({ response: { status: 403, data: forbiddenResponse } })

      // Act & Assert
      for (const operation of operations) {
        await expect(operation()).rejects.toBeDefined()
      }
    })

    it('DEBE requerir autenticación para todas las operaciones', async () => {
      // Arrange - No establecer token
      
      const operations = [
        () => adminService.getAdminStats(),
        () => adminService.getUsers(),
        () => adminService.getReviews(),
      ]
      
      mockApi.get.mockRejectedValue({ response: { status: 401, data: unauthorizedResponse } })

      // Act & Assert
      for (const operation of operations) {
        await expect(operation()).rejects.toBeDefined()
      }
    })
  })

  describe('Manejo de errores del servidor', () => {
    it('DEBE manejar errores 500 correctamente en todas las operaciones', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      
      const operations = [
        () => adminService.getAdminStats(),
        () => adminService.getUsers(),
        () => adminService.updateUserRole('user-1', 'admin'),
        () => adminService.getSystemSettings(),
      ]
      
      mockApi.get.mockRejectedValue({ response: { status: 500, data: serverErrorResponse } })
      mockApi.patch.mockRejectedValue({ response: { status: 500, data: serverErrorResponse } })

      // Act & Assert
      for (const operation of operations) {
        await expect(operation()).rejects.toBeDefined()
      }
    })

    it('DEBE manejar recursos no encontrados (404)', async () => {
      // Arrange
      setAuthTokens('mock-admin-token')
      
      mockApi.get.mockRejectedValue({ response: { status: 404, data: notFoundResponse } })
      mockApi.patch.mockRejectedValue({ response: { status: 404, data: notFoundResponse } })

      // Act & Assert
      await expect(adminService.getUserById('user-nonexistent')).rejects.toBeDefined()
      await expect(adminService.updateUserRole('user-nonexistent', 'admin')).rejects.toBeDefined()
    })
  })
})
