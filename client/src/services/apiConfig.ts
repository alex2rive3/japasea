/**
 * Configuración centralizada de la API
 * Maneja URLs base, versiones y headers comunes
 */

// Configuración de ambiente
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1'
const USE_VERSIONED_ENDPOINTS = import.meta.env.VITE_USE_API_VERSIONING !== 'false'

// Tipos de configuración
export interface ApiConfig {
  baseUrl: string
  version: string
  timeout: number
  headers: HeadersInit
}

// Headers por defecto
const getDefaultHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  // Agregar versión de API si está configurada
  if (API_VERSION) {
    headers['API-Version'] = API_VERSION
  }

  // Agregar token de autenticación si existe
  const token = localStorage.getItem('accessToken')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

// Configuración por defecto
export const defaultApiConfig: ApiConfig = {
  baseUrl: API_BASE_URL,
  version: API_VERSION,
  timeout: 30000, // 30 segundos
  headers: getDefaultHeaders()
}

// Clase para manejar las llamadas a la API
export class ApiClient {
  private config: ApiConfig

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...defaultApiConfig, ...config }
  }

  /**
   * Construye la URL completa incluyendo la versión si está habilitada
   */
  private buildUrl(endpoint: string, includeVersion = USE_VERSIONED_ENDPOINTS): string {
    // Quitar slash inicial si existe
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
    
    // Si el endpoint ya incluye la versión, no agregarla
    if (cleanEndpoint.includes('/v1/') || cleanEndpoint.includes('/v2/')) {
      return `${this.config.baseUrl}/${cleanEndpoint}`
    }

    // Construir URL con o sin versión
    if (includeVersion && this.config.version) {
      return `${this.config.baseUrl}/api/${this.config.version}/${cleanEndpoint}`
    }
    
    return `${this.config.baseUrl}/${cleanEndpoint}`
  }

  /**
   * Realiza una petición GET
   */
  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = this.buildUrl(endpoint)
    const response = await this.request<T>(url, {
      ...options,
      method: 'GET'
    })
    return response
  }

  /**
   * Realiza una petición POST
   */
  async post<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    const url = this.buildUrl(endpoint)
    const response = await this.request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
    return response
  }

  /**
   * Realiza una petición PUT
   */
  async put<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    const url = this.buildUrl(endpoint)
    const response = await this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
    return response
  }

  /**
   * Realiza una petición DELETE
   */
  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = this.buildUrl(endpoint)
    const response = await this.request<T>(url, {
      ...options,
      method: 'DELETE'
    })
    return response
  }

  /**
   * Método base para realizar peticiones
   */
  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    // Crear AbortController para timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.config.headers,
          ...options.headers
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const error = await this.handleError(response)
        throw error
      }

      // Parsear respuesta
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }

      // Si no es JSON, devolver la respuesta como texto
      return await response.text() as unknown as T
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('La petición excedió el tiempo límite')
      }
      
      throw error
    }
  }

  /**
   * Maneja los errores de la API
   */
  private async handleError(response: Response): Promise<Error> {
    let errorMessage = `Error ${response.status}: ${response.statusText}`
    
    try {
      const errorData = await response.json()
      if (errorData.message) {
        errorMessage = errorData.message
      } else if (errorData.error) {
        errorMessage = errorData.error
      }
    } catch {
      // Si no se puede parsear el error como JSON, usar el mensaje por defecto
    }

    const error = new Error(errorMessage)
    ;(error as any).status = response.status
    ;(error as any).response = response
    
    return error
  }

  /**
   * Actualiza los headers de autenticación
   */
  updateAuthToken(token: string | null): void {
    if (token) {
      this.config.headers = {
        ...this.config.headers,
        'Authorization': `Bearer ${token}`
      }
    } else {
      const headers = { ...this.config.headers }
      delete headers['Authorization']
      this.config.headers = headers
    }
  }

  /**
   * Obtiene información sobre las versiones de la API
   */
  async getApiVersions(): Promise<any> {
    const response = await fetch(`${this.config.baseUrl}/api/versions`, {
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('No se pudo obtener información de versiones')
    }
    
    return response.json()
  }
}

// Instancia por defecto del cliente API
export const apiClient = new ApiClient()

// Export default para compatibilidad
export default apiClient

// Función helper para actualizar el token en todas las instancias
export const updateGlobalAuthToken = (token: string | null) => {
  apiClient.updateAuthToken(token)
  
  // Actualizar localStorage
  if (token) {
    localStorage.setItem('accessToken', token)
  } else {
    localStorage.removeItem('accessToken')
  }
}

// Endpoints organizados por servicio
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    register: 'api/auth/register',
    login: 'api/auth/login',
    logout: 'api/auth/logout',
    refreshToken: 'api/auth/refresh-token',
    profile: 'api/auth/profile',
    changePassword: 'api/auth/change-password'
  },
  
  // Places endpoints
  places: {
    list: 'places',
    search: 'places/search',
    random: 'places/random',
    nearby: 'places/nearby', // Solo v2
    trending: 'places/trending' // Solo v2
  },
  
  // Favorites endpoints
  favorites: {
    list: 'favorites',
    add: (placeId: string) => `favorites/${placeId}`,
    remove: (placeId: string) => `favorites/${placeId}`,
    check: (placeId: string) => `favorites/check/${placeId}`,
    checkMultiple: 'favorites/check-multiple',
    stats: 'favorites/stats',
    sync: 'favorites/sync'
  },
  
  // Chat endpoints
  chat: {
    process: 'chat',
    history: 'chat/history',
    session: (sessionId: string) => `chat/session/${sessionId}`
  }
}

// Exportar tipos útiles
export type ApiEndpoints = typeof API_ENDPOINTS