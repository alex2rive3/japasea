import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse } from '../types/common';

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_TIMEOUT = 30000; // 30 seconds

// API configuration interface
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
}

// Default configuration
const defaultConfig: ApiConfig = {
  baseUrl: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// API Client class
class ApiClient {
  private instance: AxiosInstance;

  constructor(config: ApiConfig = defaultConfig) {
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: config.headers,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle common errors
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            const token = this.getAccessToken();
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.instance(originalRequest);
          } catch (refreshError) {
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.instance.post('/auth/refresh-token', {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    this.setTokens(accessToken, newRefreshToken);
  }

  private handleAuthError(): void {
    this.clearTokens();
    // Redirect to login or dispatch logout action
    window.location.href = '/login';
  }

  private formatError(error: AxiosError): ApiResponse {
    if (error.response) {
      // Server responded with error status
      const responseData = error.response.data as { 
        message?: string; 
        errors?: Array<{ field: string; message: string; value?: string }>;
      };
      return {
        success: false,
        message: responseData?.message || 'Error del servidor',
        errors: responseData?.errors,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        message: 'Error de conexión. Verifica tu conexión a internet.',
      };
    } else {
      // Something else happened
      return {
        success: false,
        message: error.message || 'Error inesperado',
      };
    }
  }

  // Authentication methods
  setAuthToken(token: string): void {
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Also store in localStorage for persistence
    localStorage.setItem('accessToken', token);
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearAuth(): void {
    delete this.instance.defaults.headers.common['Authorization'];
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  getStoredToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getStoredRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.formatError(error as AxiosError);
    }
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.formatError(error as AxiosError);
    }
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.formatError(error as AxiosError);
    }
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.formatError(error as AxiosError);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.formatError(error as AxiosError);
    }
  }

  // Update instance configuration
  updateConfig(config: Partial<ApiConfig>): void {
    if (config.baseUrl) {
      this.instance.defaults.baseURL = config.baseUrl;
    }
    if (config.timeout) {
      this.instance.defaults.timeout = config.timeout;
    }
    if (config.headers) {
      this.instance.defaults.headers = { ...this.instance.defaults.headers, ...config.headers };
    }
  }

  // Get raw axios instance for special cases
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export for testing or custom configurations
export { ApiClient };

// Export commonly used types
export type { AxiosRequestConfig, AxiosResponse, AxiosError };
