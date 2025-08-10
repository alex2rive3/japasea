import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Chip,
  Stack,
  Button,
  Divider,
  Grid,
  Rating,
  Card,
  CardMedia,
  Skeleton
} from '@mui/material'
import {
  Close,
  LocationOn,
  Phone,
  Email,
  Language,
  Schedule,
  WhatsApp,
  Share,
  FavoriteBorder,
  RateReview
} from '@mui/icons-material'
import { placesService } from '../services/placesService'
import type { Place } from '../types/places'
import { FavoriteButton } from './FavoriteButton'
import { ReviewForm } from './ReviewForm'
import { useTranslation } from 'react-i18next'

interface PlaceDetailsModalProps {
  open: boolean
  onClose: () => void
  place: Place | null
}

const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({ open, onClose, place }) => {
  const { t } = useTranslation('home')
  const [fullPlaceData, setFullPlaceData] = useState<Place | null>(null)
  const [loading, setLoading] = useState(false)
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({})
  const [reviewFormOpen, setReviewFormOpen] = useState(false)

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      if (place && open) {
        setLoading(true)
        try {
          // Si el lugar ya tiene todos los datos, úsalo directamente
          if (place.images && place.openingHours) {
            setFullPlaceData(place)
          } else {
            // Si no, intenta obtener más detalles o asegurar el lugar para obtener un ID
            const candidateId = (place as any)._id || (place as any).id || ''
            const isValidObjectId = typeof candidateId === 'string' && /^[a-fA-F0-9]{24}$/.test(candidateId)
            if (isValidObjectId) {
              const details = await placesService.getPlaceById(candidateId)
              setFullPlaceData(details)
            } else {
              // Asegurar lugar mínimo en backend para obtener un _id válido
              const ensured = await placesService.ensurePlace({
                key: place.key || place.name,
                name: place.name || place.key,
                description: place.description,
                type: place.type,
                address: place.address,
                location: place.location
              })
              setFullPlaceData(ensured)
            }
          }
        } catch (error) {
          console.error('Error fetching place details:', error)
          // En caso de error, usa los datos que ya tenemos
          setFullPlaceData(place)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchPlaceDetails()
  }, [place, open])

  if (!place) return null

  const displayPlace = fullPlaceData || place
  // Priorizar _id sobre id para MongoDB
  const rawId = (displayPlace as any)._id || (displayPlace as any).id || ''
  const placeId = typeof rawId === 'string' && /^[a-fA-F0-9]{24}$/.test(rawId) ? rawId : ''

  const handleWhatsApp = () => {
    if (displayPlace.phone) {
      const cleanPhone = displayPlace.phone.replace(/\D/g, '')
      const message = t('places.whatsappMessage', { name: displayPlace.name })
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: displayPlace.name,
        text: t('places.shareMessage', { name: displayPlace.name }),
        url: window.location.href
      })
    }
  }

  const handleImageError = (imageId: string) => {
    setImageError(prev => ({ ...prev, [imageId]: true }))
  }

  const handleReviewSuccess = () => {
    // Recargar los datos del lugar para actualizar las reseñas
    if (place) {
      const candidateId = (place as any)._id || (place as any).id || ''
      const isValidObjectId = typeof candidateId === 'string' && /^[a-fA-F0-9]{24}$/.test(candidateId)
      if (isValidObjectId) {
        placesService.getPlaceById(candidateId).then(details => {
          setFullPlaceData(details)
        }).catch(console.error)
      }
    }
  }

  // Imágenes por defecto según el tipo de lugar
  const getDefaultImage = (type: string) => {
    const defaultImages: { [key: string]: string } = {
      restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      cafe: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
      bar: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
      shopping: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
      tourism: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
      entertainment: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      default: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80'
    }
    return defaultImages[type?.toLowerCase()] || defaultImages.default
  }

  const displayImages = displayPlace.images && displayPlace.images.length > 0
    ? displayPlace.images
    : [{ url: getDefaultImage(displayPlace.type || 'default'), caption: displayPlace.name }]

  return (
    <>
      <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '85vh',
          maxWidth: { xs: '90vw', sm: 600 }
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" component="div" fontWeight={600}>
            {displayPlace.name}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ p: 3 }}>
            <Skeleton variant="rectangular" height={300} sx={{ mb: 2 }} />
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
          </Box>
        ) : (
          <>
            {/* Galería de imágenes */}
            <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
              <Grid container spacing={0.5} sx={{ height: '100%' }}>
                {displayImages.slice(0, 4).map((image, index) => (
                  <Grid size={displayImages.length === 1 ? 12 : 6} key={index} sx={{ height: displayImages.length === 1 ? '100%' : '50%' }}>
                    <Card sx={{ height: '100%', borderRadius: 0 }}>
                      <CardMedia
                        component="img"
                        height="100%"
                        image={imageError[`img-${index}`] ? getDefaultImage(displayPlace.type || 'default') : image.url} 
                        alt={image.caption || displayPlace.name}
                        onError={() => handleImageError(`img-${index}`)}
                        sx={{
                          objectFit: 'cover',
                          cursor: 'pointer',
                          transition: 'transform 0.3s',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
              {displayImages.length > 4 && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body2">
                    {t('places.morePhotos', { count: displayImages.length - 4 })}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Información del lugar */}
            <Box sx={{ p: 3 }}>
              {/* Tipo y rating */}
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Chip 
                  label={displayPlace.type} 
                  color="primary" 
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
                {displayPlace.rating && (
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Rating 
                      value={displayPlace.rating.average} 
                      readOnly 
                      size="small" 
                      precision={0.5}
                    />
                    <Typography variant="body2" color="text.secondary">
                      ({displayPlace.rating.count} {t('places.reviews')})
                    </Typography>
                  </Stack>
                )}
              </Stack>

              {/* Descripción */}
              <Typography variant="body1" paragraph>
                {displayPlace.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Información de contacto */}
              <Stack spacing={2}>
                {displayPlace.address && (
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <LocationOn color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {displayPlace.address}
                    </Typography>
                  </Stack>
                )}

                {displayPlace.phone && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Phone color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {displayPlace.phone}
                    </Typography>
                  </Stack>
                )}

                {displayPlace.email && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Email color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {displayPlace.email}
                    </Typography>
                  </Stack>
                )}

                {displayPlace.website && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Language color="action" fontSize="small" />
                    <Typography 
                      variant="body2" 
                      color="primary"
                      component="a"
                      href={displayPlace.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textDecoration: 'none' }}
                    >
                      {displayPlace.website}
                    </Typography>
                  </Stack>
                )}
              </Stack>

              {/* Horarios */}
              {displayPlace.openingHours && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <Schedule color="action" fontSize="small" />
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        {t('places.schedules')}
                      </Typography>
                      <Stack spacing={0.5}>
                        {Object.entries(displayPlace.openingHours).map(([day, hours]) => (
                          <Typography key={day} variant="caption" color="text.secondary">
                            <strong style={{ textTransform: 'capitalize' }}>{day}:</strong> {typeof hours === 'object' && hours !== null && 'open' in hours && 'close' in hours ? `${hours.open} - ${hours.close}` : String(hours)}
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </>
              )}

              {/* Features */}
              {displayPlace.features && displayPlace.features.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    {t('places.features')}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {displayPlace.features.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        size="small"
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                </>
              )}

              {/* Acciones */}
              <Stack direction="row" spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<WhatsApp />}
                  onClick={handleWhatsApp}
                  disabled={!displayPlace.phone}
                  sx={{ flex: 1 }}
                >
                  WhatsApp
                </Button>
                {placeId && placeId.length > 0 ? (
                  <FavoriteButton 
                    placeId={placeId}
                    placeName={displayPlace.name}
                    showTooltip={false}
                    size="medium"
                  />
                ) : (
                  <IconButton
                    color="primary"
                    disabled
                    size="medium"
                    sx={{ 
                      border: '1px solid',
                      borderColor: 'primary.main',
                      opacity: 0.5
                    }}
                  >
                    <FavoriteBorder />
                  </IconButton>
                )}
                <IconButton
                  onClick={handleShare}
                  color="primary"
                  size="medium"
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'primary.main'
                  }}
                >
                  <Share />
                </IconButton>
                {placeId && placeId.length > 0 && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<RateReview />}
                    onClick={() => setReviewFormOpen(true)}
                    size="medium"
                  >
                    {t('places.writeReview')}
                  </Button>
                )}
              </Stack>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>

      {/* Formulario de reseña */}
      {placeId && placeId.length > 0 && (
        <ReviewForm
          open={reviewFormOpen}
          onClose={() => setReviewFormOpen(false)}
          placeId={placeId}
          placeName={displayPlace.name || t('places.thisPlace')}
          onSuccess={handleReviewSuccess}
        />
      )}
    </>
  )
}

export default PlaceDetailsModal
