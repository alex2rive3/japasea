import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  console.log('ProtectedRoute - isLoading:', isLoading) // Debug
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated) // Debug
  console.log('ProtectedRoute - user:', user) // Debug
  console.log('ProtectedRoute - requireAdmin:', requireAdmin) // Debug
  console.log('ProtectedRoute - location:', location.pathname) // Debug

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress size={40} />
      </Box>
    )
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute - No autenticado, redirigiendo a login') // Debug
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Si el usuario está autenticado y hay una ruta preferida pendiente, redirigir
  const preferredPath = sessionStorage.getItem('preferredPathAfterLogin')
  if (preferredPath && location.pathname !== preferredPath) {
    console.log('ProtectedRoute - Aplicando preferredPathAfterLogin:', preferredPath)
    sessionStorage.removeItem('preferredPathAfterLogin')
    return <Navigate to={preferredPath} replace />
  }

  if (requireAdmin && user?.role !== 'admin') {
    console.log('ProtectedRoute - Requiere admin pero usuario no es admin') // Debug
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

interface PublicOnlyRouteProps {
  children: ReactNode
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()

  console.log('PublicOnlyRoute - isAuthenticated:', isAuthenticated) // Debug
  console.log('PublicOnlyRoute - user:', user) // Debug

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress size={40} />
      </Box>
    )
  }

  if (isAuthenticated) {
    // Si es admin, redirigir a panel de admin
    if (user?.role === 'admin') {
      console.log('PublicOnlyRoute - Usuario admin autenticado, redirigiendo a /admin/places') // Debug
      return <Navigate to="/admin/places" replace />
    }
    console.log('PublicOnlyRoute - Usuario autenticado, redirigiendo a /') // Debug
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
