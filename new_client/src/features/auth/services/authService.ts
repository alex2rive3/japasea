import { apiClient } from '@/shared/api/client';
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User, 
  UpdateProfileData,
  ChangePasswordData,
  TokenResponse
} from '../types';

const AUTH_ENDPOINTS = {
  REGISTER: '/api/v1/auth/register',
  LOGIN: '/api/v1/auth/login',
  LOGOUT: '/api/v1/auth/logout',
  PROFILE: '/api/v1/auth/profile',
  UPDATE_PROFILE: '/api/v1/auth/profile',
  CHANGE_PASSWORD: '/api/v1/auth/change-password',
  REFRESH_TOKEN: '/api/v1/auth/refresh-token',
  DELETE_ACCOUNT: '/api/v1/auth/account',
  FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
  RESET_PASSWORD: '/api/v1/auth/reset-password',
  VERIFY_EMAIL: '/api/v1/auth/verify-email',
  RESEND_VERIFICATION: '/api/v1/auth/resend-verification'
} as const;

class AuthService {
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      AUTH_ENDPOINTS.REGISTER,
      userData
    );
    
    if (!response.data) {
      throw new Error('No se recibió respuesta del servidor');
    }
    
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    );
    
    if (!response.data) {
      throw new Error('No se recibió respuesta del servidor');
    }
    
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear tokens in API client
      apiClient.clearAuth();
    }
  }

  async getProfile(): Promise<{ data: { user: User } }> {
    const response = await apiClient.get<{ data: { user: User } }>(
      AUTH_ENDPOINTS.PROFILE
    );
    
    if (!response.data) {
      throw new Error('No se recibió respuesta del servidor');
    }
    
    return response.data;
  }

  async updateProfile(data: UpdateProfileData): Promise<{ data: { user: User } }> {
    const response = await apiClient.put<{ data: { user: User } }>(
      AUTH_ENDPOINTS.UPDATE_PROFILE,
      data
    );
    
    if (!response.data) {
      throw new Error('No se recibió respuesta del servidor');
    }
    
    return response.data;
  }

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await apiClient.put<{ message: string }>(
      AUTH_ENDPOINTS.CHANGE_PASSWORD,
      data
    );
    
    if (!response.data) {
      throw new Error('No se recibió respuesta del servidor');
    }
    
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>(
      AUTH_ENDPOINTS.REFRESH_TOKEN,
      { refreshToken }
    );
    
    if (!response.data) {
      throw new Error('No se recibió respuesta del servidor');
    }
    
    return response.data;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      AUTH_ENDPOINTS.FORGOT_PASSWORD,
      { email }
    );
    
    if (!response.data) {
      throw new Error('No se recibió respuesta del servidor');
    }
    
    return response.data;
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      { token, newPassword }
    );
    
    if (!response.data) {
      throw new Error('No se recibió respuesta del servidor');
    }
    
    return response.data;
  }

  async verifyEmail(token: string): Promise<{ data: { user: User } }> {
    const response = await apiClient.post<{ data: { user: User } }>(
      AUTH_ENDPOINTS.VERIFY_EMAIL,
      { token }
    );
    
    if (!response.data) {
      throw new Error('No se recibió respuesta del servidor');
    }
    
    return response.data;
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      AUTH_ENDPOINTS.RESEND_VERIFICATION,
      { email }
    );
    
    if (!response.data) {
      throw new Error('No se recibió respuesta del servidor');
    }
    
    return response.data;
  }

  async deleteAccount(): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(
      AUTH_ENDPOINTS.DELETE_ACCOUNT
    );
    
    if (!response.data) {
      throw new Error('No se recibió respuesta del servidor');
    }
    
    return response.data;
  }
}

export const authService = new AuthService();
