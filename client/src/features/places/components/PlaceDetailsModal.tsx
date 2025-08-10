import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  Box,
  Skeleton
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { ReviewForm } from '../../../components/ReviewForm'
import { PlaceImageGallery } from './PlaceImageGallery'
import { PlaceContactInfo } from './PlaceContactInfo'
import { PlaceRatingsSection } from './PlaceRatingsSection'
import { PlaceActions } from './PlaceActions'
import { usePlaceDetails } from '../hooks/usePlaceDetails'
import { usePlaceImages } from '../hooks/usePlaceImages'
import { PlaceDataUtils } from '../utils/placeUtils'
import type { PlaceDetailsModalProps } from '../types/place.types'

export const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({ 
  open, 
  onClose, 
  place 
}) => {
  const [reviewFormOpen, setReviewFormOpen] = useState(false)

  const { displayPlace, placeId, loading, refreshPlaceData } = usePlaceDetails({
    place,
    open
  })

  const { getGalleryImages } = usePlaceImages(displayPlace)

  if (!place) return null

  const handleReviewSuccess = () => {
    refreshPlaceData()
  }

  const handleOpenReviewForm = () => {
    setReviewFormOpen(true)
  }

  const displayImages = getGalleryImages(4)
  const placeName = displayPlace ? PlaceDataUtils.getDisplayName(displayPlace) : ''

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
              {placeName}
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
          ) : displayPlace && (
            <>
              {/* Image Gallery */}
              <PlaceImageGallery
                images={displayImages}
                placeName={placeName}
                placeType={displayPlace.type || 'default'}
              />

              {/* Place Information */}
              <Box sx={{ p: 3 }}>
                <PlaceContactInfo place={displayPlace} />
                
                <PlaceRatingsSection place={displayPlace} />

                <PlaceActions
                  place={displayPlace}
                  placeId={placeId}
                  onOpenReviewForm={handleOpenReviewForm}
                />
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Form */}
      {placeId && placeId.length > 0 && (
        <ReviewForm
          open={reviewFormOpen}
          onClose={() => setReviewFormOpen(false)}
          placeId={placeId}
          placeName={placeName || 'este lugar'}
          onSuccess={handleReviewSuccess}
        />
      )}
    </>
  )
}

export default PlaceDetailsModal
