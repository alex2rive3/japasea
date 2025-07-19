import { createContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { authService } from '../services/authService'
import type { 
  User, 
  LoginCredentials, 
  RegisterData, 
  AuthContextType, 
  UpdateProfileData, 
  ChangePasswordData 
} from '../types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export { AuthContext }

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const token = authService.getAccessToken()
      
      if (token && authService.isAuthenticated()) {
        const userProfile = await authService.getProfile()
        setUser(userProfile)
      }
    } catch (error) {
      console.error('Error inicializando autenticación:', error)
      if (authService.getAccessToken()) {
        await authService.logout()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials): Promise<User> => {
    try {
      setIsLoading(true)
      const loggedUser = await authService.login(credentials)
      setUser(loggedUser)
      return loggedUser
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<User> => {
    try {
      setIsLoading(true)
      const registeredUser = await authService.register(userData)
      setUser(registeredUser)
      return registeredUser
    } catch (error) {
      console.error('Error en registro:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      setUser(null)
    }
  }

  const updateProfile = async (data: UpdateProfileData): Promise<User> => {
    try {
      const updatedUser = await authService.updateProfile(data)
      setUser(updatedUser)
      return updatedUser
    } catch (error) {
      console.error('Error actualizando perfil:', error)
      throw error
    }
  }

  const changePassword = async (data: ChangePasswordData): Promise<void> => {
    try {
      await authService.changePassword(data)
    } catch (error) {
      console.error('Error cambiando contraseña:', error)
      throw error
    }
  }

  const refreshToken = async (): Promise<void> => {
    try {
      await authService.refreshToken()
    } catch (error) {
      console.error('Error renovando token:', error)
      await logout()
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
