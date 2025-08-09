import axios, { type AxiosResponse } from 'axios'
import { updateGlobalAuthToken } from './apiConfig'
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User, 
  UpdateProfileData,
  ChangePasswordData,
  TokenResponse
} from '../types/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
const AUTH_ENDPOINTS = {
  REGISTER: '/api/v1/auth/register',
  LOGIN: '/api/v1/auth/login',
  LOGOUT: '/api/v1/auth/logout',
  PROFILE: '/api/v1/auth/profile',
  UPDATE_PROFILE: '/api/v1/auth/profile',
  CHANGE_PASSWORD: '/api/v1/auth/change-password',
  REFRESH_TOKEN: '/api/v1/auth/refresh-token',
  DELETE_ACCOUNT: '/api/v1/auth/account'
}

class AuthService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  constructor() {
    this.setupInterceptors()
    // Si hay un token guardado, configurarlo en el apiClient global
    const token = localStorage.getItem('accessToken')
    if (token) {
      updateGlobalAuthToken(token)
    }
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          
          try {
            await this.refreshToken()
            const newToken = localStorage.getItem('accessToken')
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return this.api(originalRequest)
            }
          } catch (refreshError) {
            this.clearTokens()
            window.location.href = '/login'
            return Promise.reject(refreshError)
          }
        }
        
        return Promise.reject(error)
      }
    )
  }

  async register(userData: RegisterData): Promise<User> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post(
        AUTH_ENDPOINTS.REGISTER,
        userData
      )
      
      if (response.data.success) {
        this.setTokens(response.data.data.accessToken, response.data.data.refreshToken)
        return response.data.data.user
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      this.handleError(error, 'Error en registro')
      throw error
    }
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post(
        AUTH_ENDPOINTS.LOGIN,
        credentials
      )
      
      if (response.data.success) {
        this.setTokens(response.data.data.accessToken, response.data.data.refreshToken)
        return response.data.data.user
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      this.handleError(error, 'Error en inicio de sesión')
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post(AUTH_ENDPOINTS.LOGOUT)
    } catch (error) {
      console.error('Error durante logout:', error)
    } finally {
      this.clearTokens()
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await this.api.get(AUTH_ENDPOINTS.PROFILE)
      
      if (response.data.success) {
        return response.data.data.user
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      this.handleError(error, 'Error obteniendo perfil')
      throw error
    }
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    try {
      const response = await this.api.put(AUTH_ENDPOINTS.UPDATE_PROFILE, data)
      
      if (response.data.success) {
        return response.data.data.user
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      this.handleError(error, 'Error actualizando perfil')
      throw error
    }
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      const response = await this.api.put(AUTH_ENDPOINTS.CHANGE_PASSWORD, data)
      
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
    } catch (error) {
      this.handleError(error, 'Error cambiando contraseña')
      throw error
    }
  }

  async refreshToken(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      
      if (!refreshToken) {
        throw new Error('No hay refresh token disponible')
      }

      const response: AxiosResponse<TokenResponse> = await axios.post(
        `${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`,
        { refreshToken }
      )
      
      if (response.data.success) {
        this.setTokens(response.data.data.accessToken, response.data.data.refreshToken)
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      this.clearTokens()
      throw error
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      const response = await this.api.delete(AUTH_ENDPOINTS.DELETE_ACCOUNT)
      
      if (response.data.success) {
        this.clearTokens()
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      this.handleError(error, 'Error eliminando cuenta')
      throw error
    }
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    // Actualizar el token en el apiClient global
    updateGlobalAuthToken(accessToken)
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    // Limpiar el token del apiClient global
    updateGlobalAuthToken(null)
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken')
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch {
      return true
    }
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken()
    return token !== null && !this.isTokenExpired(token)
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar email de recuperación')
      }

      return data
    } catch (error) {
      this.handleError(error, 'Error al solicitar recuperación de contraseña')
      throw error
    }
  }

  async resetPassword(token: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al restablecer contraseña')
      }

      return data
    } catch (error) {
      this.handleError(error, 'Error al restablecer contraseña')
      throw error
    }
  }

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-email/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al verificar email')
      }

      return data
    } catch (error) {
      this.handleError(error, 'Error al verificar email')
      throw error
    }
  }

  async resendVerificationEmail(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.api.post('/api/v1/auth/resend-verification')
      
      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      return response.data
    } catch (error) {
      this.handleError(error, 'Error al reenviar email de verificación')
      throw error
    }
  }

  private handleError(error: unknown, fallbackMessage: string): void {
    console.error(fallbackMessage, error)
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } }
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message)
      }
    }
    
    if (error && typeof error === 'object' && 'message' in error) {
      const errorWithMessage = error as { message: string }
      throw new Error(errorWithMessage.message)
    }
    
    throw new Error(fallbackMessage)
  }
}

export const authService = new AuthService()
