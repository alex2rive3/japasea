export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'admin'
  profilePicture?: string
  isEmailVerified: boolean
  lastLogin?: string
  createdAt: string
  updatedAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    accessToken: string
    refreshToken: string
  }
}

export interface AuthError {
  success: false
  message: string
  errors?: Array<{
    field: string
    message: string
    value?: string
  }>
}

export interface UpdateProfileData {
  name?: string
  phone?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<User>
  register: (userData: RegisterData) => Promise<User>
  logout: () => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<User>
  changePassword: (data: ChangePasswordData) => Promise<void>
  refreshToken: () => Promise<void>
  refreshUser: () => Promise<void>
}

export interface TokenResponse {
  success: boolean
  message: string
  data: {
    accessToken: string
    refreshToken: string
  }
}
