import { Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import { MainContent } from './MainContent'

export function HomeRedirect() {
  const { user, isLoading } = useAuth()

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

  // Si es admin, redirigir a panel de administración
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  // Si es usuario regular, mostrar el contenido principal
  return <MainContent />
}
