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
import { useAuth } from '../../../hooks/useAuth'
import { useReviews } from '../hooks/useReviews'
import type { CreateReviewData } from '../types'

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
  const { createReview, isSubmitting, error } = useReviews()
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [hover, setHover] = useState(-1)

  const handleSubmit = async () => {
    setLocalError(null)

    if (!rating) {
      setLocalError('Por favor selecciona una calificación')
      return
    }

    if (!comment.trim()) {
      setLocalError('Por favor escribe un comentario')
      return
    }

    if (comment.trim().length < 10) {
      setLocalError('El comentario debe tener al menos 10 caracteres')
      return
    }

    if (!user) {
      setLocalError('Debes iniciar sesión para dejar una reseña')
      return
    }

    try {
      const reviewData: CreateReviewData = {
        placeId,
        rating,
        comment: comment.trim()
      }

      await createReview(placeId, reviewData)

      // Clear form
      setRating(null)
      setComment('')
      setLocalError(null)
      
      // Close dialog and notify success
      onClose()
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      console.error('Error creating review:', err)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(null)
      setComment('')
      setLocalError(null)
      onClose()
    }
  }

  const displayError = localError || error

  const labels: { [index: string]: string } = {
    1: 'Muy malo',
    2: 'Malo',
    3: 'Regular',
    4: 'Bueno',
    5: 'Excelente',
  }

  function getLabelText(value: number) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`
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
          maxHeight: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div">
          Reseña para {placeName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comparte tu experiencia con otros viajeros
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          {displayError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {displayError}
            </Alert>
          )}

          <Box>
            <Typography component="legend" sx={{ mb: 1, fontWeight: 500 }}>
              Calificación *
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating
                name="review-rating"
                value={rating}
                precision={1}
                getLabelText={getLabelText}
                onChange={(_, newValue) => {
                  setRating(newValue)
                }}
                onChangeActive={(_, newHover) => {
                  setHover(newHover)
                }}
                emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                size="large"
              />
              {rating !== null && (
                <Typography sx={{ ml: 2, color: 'text.secondary' }}>
                  {labels[hover !== -1 ? hover : rating]}
                </Typography>
              )}
            </Box>
          </Box>

          <TextField
            label="Comentario"
            placeholder="Describe tu experiencia en este lugar..."
            multiline
            rows={4}
            fullWidth
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            helperText={`${comment.length} caracteres (mínimo 10)`}
            error={comment.length > 0 && comment.length < 10}
            disabled={isSubmitting}
            inputProps={{
              maxLength: 500
            }}
          />

          {!user && (
            <Alert severity="info">
              Debes <strong>iniciar sesión</strong> para dejar una reseña
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleClose}
          disabled={isSubmitting}
          color="inherit"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!user || isSubmitting || !rating || comment.trim().length < 10}
          variant="contained"
          startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar reseña'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
