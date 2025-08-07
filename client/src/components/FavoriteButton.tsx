import React, { useState } from 'react'
import { 
  IconButton, 
  Tooltip, 
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material'
import { 
  Favorite as FavoriteIcon, 
  FavoriteBorder as FavoriteBorderIcon 
} from '@mui/icons-material'
import { useFavorites } from '../hooks/useFavorites'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

interface FavoriteButtonProps {
  placeId: string
  placeName?: string
  size?: 'small' | 'medium' | 'large'
  showTooltip?: boolean
  onToggle?: (isFavorite: boolean) => void
  className?: string
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  placeId,
  placeName = 'este lugar',
  size = 'medium',
  showTooltip = true,
  onToggle,
  className
}) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error' | 'info'
  }>({
    open: false,
    message: '',
    severity: 'success'
  })

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation() // Evitar propagación del click
    
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Debes iniciar sesión para guardar favoritos',
        severity: 'info'
      })
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login', { state: { from: window.location.pathname } })
      }, 2000)
      return
    }

    setLoading(true)
    const wasInFavorites = isFavorite(placeId)

    try {
      await toggleFavorite(placeId)
      
      setSnackbar({
        open: true,
        message: wasInFavorites 
          ? `${placeName} eliminado de favoritos`
          : `${placeName} agregado a favoritos`,
        severity: 'success'
      })

      if (onToggle) {
        onToggle(!wasInFavorites)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar favoritos'
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const isInFavorites = isFavorite(placeId)
  const tooltipTitle = !user 
    ? 'Inicia sesión para guardar favoritos'
    : isInFavorites 
      ? 'Quitar de favoritos' 
      : 'Agregar a favoritos'

  const button = (
    <IconButton
      onClick={handleToggleFavorite}
      disabled={loading}
      size={size}
      className={className}
      sx={{
        color: isInFavorites ? 'error.main' : 'action.active',
        '&:hover': {
          backgroundColor: isInFavorites 
            ? 'error.light' 
            : 'action.hover',
          transform: 'scale(1.1)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {loading ? (
        <CircularProgress size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} />
      ) : isInFavorites ? (
        <FavoriteIcon />
      ) : (
        <FavoriteBorderIcon />
      )}
    </IconButton>
  )

  return (
    <>
      {showTooltip ? (
        <Tooltip title={tooltipTitle} arrow>
          {button}
        </Tooltip>
      ) : button}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}