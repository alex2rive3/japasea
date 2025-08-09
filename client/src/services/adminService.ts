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
      const response = await api.get<any>('/api/v1/admin/stats')
      // El cliente API ya devuelve el cuerpo JSON. La API del servidor responde { success, data }
      return response.data
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      throw error
    }
  }

  async getPlaceStats(timeRange?: { start: Date; end: Date }) {
    try {
      const query = new URLSearchParams(
        timeRange
          ? {
              startDate: timeRange.start.toISOString(),
              endDate: timeRange.end.toISOString()
            }
          : {}
      ).toString()
      const response = await api.get<any>(`/api/v1/admin/stats/places${query ? `?${query}` : ''}`)
      return (response as any)?.data ?? response
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
      const query = new URLSearchParams(
        Object.entries(params || {}).reduce((acc, [k, v]) => {
          if (v !== undefined && v !== null && String(v).length > 0) acc[k] = String(v)
          return acc
        }, {} as Record<string, string>)
      ).toString()
      const response = await api.get<any>(`/api/v1/admin/users${query ? `?${query}` : ''}`)
      return (response as any)?.data ?? response
    } catch (error) {
      console.error('Error obteniendo usuarios:', error)
      throw error
    }
  }

  async getUserById(userId: string): Promise<UserManagement> {
    try {
      const response = await api.get<any>(`/api/v1/admin/users/${userId}`)
      return (response as any)?.data ?? response
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
      const response = await api.delete<any>(`/api/v1/admin/users/${userId}`)
      return (response as any)?.data ?? response
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
      const query = new URLSearchParams(
        Object.entries(params || {}).reduce((acc, [k, v]) => {
          if (v !== undefined && v !== null && String(v).length > 0) acc[k] = String(v)
          return acc
        }, {} as Record<string, string>)
      ).toString()
      const response = await api.get<any>(`/api/v1/admin/reviews${query ? `?${query}` : ''}`)
      return (response as any)?.data ?? response
    } catch (error) {
      console.error('Error obteniendo reviews:', error)
      throw error
    }
  }

  async approveReview(reviewId: string) {
    try {
      const response = await api.patch<any>(`/api/v1/admin/reviews/${reviewId}/approve`)
      return (response as any)?.data ?? response
    } catch (error) {
      console.error('Error aprobando review:', error)
      throw error
    }
  }

  async rejectReview(reviewId: string, reason?: string) {
    try {
      const response = await api.patch<any>(`/api/v1/admin/reviews/${reviewId}/reject`, { reason })
      return (response as any)?.data ?? response
    } catch (error) {
      console.error('Error rechazando review:', error)
      throw error
    }
  }

  async deleteReview(reviewId: string) {
    try {
      const response = await api.delete<any>(`/api/v1/admin/reviews/${reviewId}`)
      return (response as any)?.data ?? response
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
      const query = new URLSearchParams(
        Object.entries(params || {}).reduce((acc, [k, v]) => {
          if (v !== undefined && v !== null && String(v).length > 0) acc[k] = String(v)
          return acc
        }, {} as Record<string, string>)
      ).toString()
      const response = await api.get<any>(`/api/v1/admin/audit/logs${query ? `?${query}` : ''}`)
      return (response as any)?.data ?? response
    } catch (error) {
      console.error('Error obteniendo logs de auditoría:', error)
      throw error
    }
  }

  async exportActivityLogs(format: 'csv' | 'json', filters?: any) {
    try {
      const response = await api.post<any>('/api/v1/admin/audit/export', { format, filters })
      return response
    } catch (error) {
      console.error('Error exportando logs:', error)
      throw error
    }
  }

  // === CONFIGURACIÓN ===
  async getSystemSettings() {
    try {
      const response = await api.get<any>('/api/v1/admin/settings')
      return (response as any)?.data ?? response
    } catch (error) {
      console.error('Error obteniendo configuración:', error)
      throw error
    }
  }

  async updateSystemSettings(settings: any) {
    try {
      const response = await api.put<any>('/api/v1/admin/settings', settings)
      return (response as any)?.data ?? response
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
      const response = await api.post<any>('/api/v1/admin/notifications/bulk', params)
      return (response as any)?.data ?? response
    } catch (error) {
      console.error('Error enviando notificación masiva:', error)
      throw error
    }
  }
}

export const adminService = new AdminService()
