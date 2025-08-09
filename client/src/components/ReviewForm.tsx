import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material'
import { Star } from '@mui/icons-material'
import { reviewsService } from '../services/reviewsService'
import { useAuth } from '../hooks/useAuth'

interface ReviewFormProps {
  open: boolean
  onClose: () => void
  placeId: string
  placeName: string
  onSuccess?: () => void
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  open,
  onClose,
  placeId,
  placeName,
  onSuccess
}) => {
  const { user } = useAuth()
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hover, setHover] = useState(-1)

  const handleSubmit = async () => {
    if (!rating) {
      setError('Por favor selecciona una calificación')
      return
    }

    if (!comment.trim()) {
      setError('Por favor escribe un comentario')
      return
    }

    if (comment.trim().length < 10) {
      setError('El comentario debe tener al menos 10 caracteres')
      return
    }

    if (!user) {
      setError('Debes iniciar sesión para dejar una reseña')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await reviewsService.createReview(placeId, {
        rating,
        comment: comment.trim()
      })

      // Limpiar formulario
      setRating(null)
      setComment('')
      
      // Cerrar diálogo y notificar éxito
      onClose()
      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Error al enviar la reseña. Por favor intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setRating(null)
      setComment('')
      setError(null)
      onClose()
    }
  }

  const labels: { [index: string]: string } = {
    1: 'Muy malo',
    2: 'Malo',
    3: 'Regular',
    4: 'Bueno',
    5: 'Excelente',
  }

  const getLabelText = (value: number) => {
    return `${value} Estrella${value !== 1 ? 's' : ''}, ${labels[value]}`
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div">
          Escribe una reseña
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {placeName}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Box>
            <Typography component="legend" gutterBottom>
              ¿Cómo calificarías tu experiencia?
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Rating
                name="rating"
                value={rating}
                onChange={(_, newValue) => {
                  setRating(newValue)
                  setError(null)
                }}
                onChangeActive={(_, newHover) => {
                  setHover(newHover)
                }}
                getLabelText={getLabelText}
                size="large"
                emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
              {rating !== null && (
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {labels[hover !== -1 ? hover : rating]}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <TextField
            label="Tu comentario"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value)
              setError(null)
            }}
            variant="outlined"
            fullWidth
            placeholder="Cuéntanos sobre tu experiencia..."
            helperText={`${comment.length}/1000 caracteres (mínimo 10)`}
            inputProps={{ maxLength: 1000 }}
            disabled={loading}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          color="inherit"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !rating || !comment.trim() || comment.trim().length < 10}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Enviando...' : 'Enviar reseña'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
