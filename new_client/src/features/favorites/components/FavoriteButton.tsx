import React, { useState } from 'react';
import { 
  IconButton, 
  Tooltip, 
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Favorite as FavoriteIcon, 
  FavoriteBorder as FavoriteBorderIcon 
} from '@mui/icons-material';
import { useFavorites, useFavoriteStatus } from '../hooks/useFavorites';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface FavoriteButtonProps {
  placeId: string;
  placeName?: string;
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
  onToggle?: (isFavorite: boolean) => void;
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  placeId,
  placeName = 'este lugar',
  size = 'medium',
  showTooltip = true,
  onToggle,
  className
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toggleFavorite } = useFavorites();
  const { isFavorite } = useFavoriteStatus(placeId);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar propagación del click
    e.preventDefault();
    
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Debes iniciar sesión para guardar favoritos',
        severity: 'info'
      });
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login', { state: { from: window.location.pathname } });
      }, 2000);
      return;
    }

    setLoading(true);

    try {
      const result = await toggleFavorite(placeId);
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: result.action === 'removed'
            ? `${placeName} eliminado de favoritos`
            : `${placeName} agregado a favoritos`,
          severity: 'success'
        });

        if (onToggle) {
          onToggle(result.action === 'added');
        }
      } else {
        throw new Error('Error al actualizar favoritos');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar favoritos';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const tooltipTitle = !user 
    ? 'Inicia sesión para guardar favoritos'
    : isFavorite 
      ? 'Quitar de favoritos' 
      : 'Agregar a favoritos';

  const button = (
    <IconButton
      onClick={handleToggleFavorite}
      disabled={loading}
      size={size}
      className={className}
      sx={{
        color: isFavorite ? 'error.main' : 'primary.main',
        border: '1px solid',
        borderColor: isFavorite ? 'error.main' : 'primary.main',
        '&:hover': {
          backgroundColor: isFavorite 
            ? 'rgba(211, 47, 47, 0.04)' 
            : 'rgba(25, 118, 210, 0.04)',
          transform: 'scale(1.1)',
        },
        transition: 'all 0.2s ease-in-out',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {loading ? (
        <CircularProgress size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} />
      ) : isFavorite ? (
        <FavoriteIcon />
      ) : (
        <FavoriteBorderIcon />
      )}
    </IconButton>
  );

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
  );
};
