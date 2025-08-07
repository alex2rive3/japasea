import api from './apiConfig'

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalPlaces: number
  pendingPlaces: number
  totalReviews: number
  recentActivity: ActivityLog[]
}

interface ActivityLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  timestamp: string
  details?: any
}

interface UserManagement {
  id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'admin'
  status: 'active' | 'suspended' | 'deleted'
  emailVerified: boolean
  createdAt: string
  lastLogin?: string
}

class AdminService {

  // === ESTADÍSTICAS ===
  async getAdminStats(): Promise<AdminStats> {
    try {
      const response = await api.get('/api/v1/admin/stats')
      return response.data.data
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      throw error
    }
  }

  async getPlaceStats(timeRange?: { start: Date; end: Date }) {
    try {
      const params = timeRange ? {
        startDate: timeRange.start.toISOString(),
        endDate: timeRange.end.toISOString()
      } : {}
      const response = await api.get('/api/v1/admin/stats/places', { params })
      return response.data.data
    } catch (error) {
      console.error('Error obteniendo estadísticas de lugares:', error)
      throw error
    }
  }

  // === GESTIÓN DE USUARIOS ===
  async getUsers(params?: { 
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string 
  }) {
    try {
      const response = await api.get('/api/v1/admin/users', { params })
      return response.data
    } catch (error) {
      console.error('Error obteniendo usuarios:', error)
      throw error
    }
  }

  async getUserById(userId: string): Promise<UserManagement> {
    try {
      const response = await api.get(`/api/v1/admin/users/${userId}`)
      return response.data.data
    } catch (error) {
      console.error('Error obteniendo usuario:', error)
      throw error
    }
  }

  async updateUserRole(userId: string, role: 'user' | 'admin') {
    try {
      const response = await api.patch(`/api/v1/admin/users/${userId}/role`, { role })
      return response.data
    } catch (error) {
      console.error('Error actualizando rol de usuario:', error)
      throw error
    }
  }

  async suspendUser(userId: string, reason?: string) {
    try {
      const response = await api.patch(`/api/v1/admin/users/${userId}/suspend`, { reason })
      return response.data
    } catch (error) {
      console.error('Error suspendiendo usuario:', error)
      throw error
    }
  }

  async activateUser(userId: string) {
    try {
      const response = await api.patch(`/api/v1/admin/users/${userId}/activate`)
      return response.data
    } catch (error) {
      console.error('Error activando usuario:', error)
      throw error
    }
  }

  async deleteUser(userId: string) {
    try {
      const response = await api.delete(`/api/v1/admin/users/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error eliminando usuario:', error)
      throw error
    }
  }

  // === GESTIÓN DE REVIEWS ===
  async getReviews(params?: {
    page?: number
    limit?: number
    placeId?: string
    userId?: string
    status?: 'pending' | 'approved' | 'rejected'
  }) {
    try {
      const response = await api.get('/api/v1/admin/reviews', { params })
      return response.data
    } catch (error) {
      console.error('Error obteniendo reviews:', error)
      throw error
    }
  }

  async approveReview(reviewId: string) {
    try {
      const response = await api.patch(`/api/v1/admin/reviews/${reviewId}/approve`)
      return response.data
    } catch (error) {
      console.error('Error aprobando review:', error)
      throw error
    }
  }

  async rejectReview(reviewId: string, reason?: string) {
    try {
      const response = await api.patch(`/api/v1/admin/reviews/${reviewId}/reject`, { reason })
      return response.data
    } catch (error) {
      console.error('Error rechazando review:', error)
      throw error
    }
  }

  async deleteReview(reviewId: string) {
    try {
      const response = await api.delete(`/api/v1/admin/reviews/${reviewId}`)
      return response.data
    } catch (error) {
      console.error('Error eliminando review:', error)
      throw error
    }
  }

  // === AUDITORÍA ===
  async getActivityLogs(params?: {
    page?: number
    limit?: number
    userId?: string
    action?: string
    resource?: string
    startDate?: string
    endDate?: string
  }) {
    try {
      const response = await api.get('/api/v1/admin/audit/logs', { params })
      return response.data
    } catch (error) {
      console.error('Error obteniendo logs de auditoría:', error)
      throw error
    }
  }

  async exportActivityLogs(format: 'csv' | 'json', filters?: any) {
    try {
      const response = await api.post('/api/v1/admin/audit/export', {
        format,
        filters
      }, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Error exportando logs:', error)
      throw error
    }
  }

  // === CONFIGURACIÓN ===
  async getSystemSettings() {
    try {
      const response = await api.get('/api/v1/admin/settings')
      return response.data.data
    } catch (error) {
      console.error('Error obteniendo configuración:', error)
      throw error
    }
  }

  async updateSystemSettings(settings: any) {
    try {
      const response = await api.put('/api/v1/admin/settings', settings)
      return response.data
    } catch (error) {
      console.error('Error actualizando configuración:', error)
      throw error
    }
  }

  // === NOTIFICACIONES MASIVAS ===
  async sendBulkNotification(params: {
    title: string
    message: string
    targetUsers?: 'all' | 'active' | string[] // todos, activos o lista de IDs
    type: 'info' | 'warning' | 'promotion'
  }) {
    try {
      const response = await api.post('/api/v1/admin/notifications/bulk', params)
      return response.data
    } catch (error) {
      console.error('Error enviando notificación masiva:', error)
      throw error
    }
  }
}

export const adminService = new AdminService()
