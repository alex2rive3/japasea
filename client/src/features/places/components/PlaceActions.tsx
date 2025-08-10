import {
  Stack,
  Button,
  IconButton
} from '@mui/material'
import {
  WhatsApp,
  Share,
  FavoriteBorder,
  RateReview
} from '@mui/icons-material'
import { FavoriteButton } from '../../../components/FavoriteButton'
import { PlaceContactUtils, PlaceDataUtils } from '../utils/placeUtils'
import type { PlaceActionsProps } from '../types/place.types'

export function PlaceActions({ 
  place, 
  placeId, 
  onOpenReviewForm 
}: PlaceActionsProps) {
  const handleWhatsApp = () => {
    if (place.phone) {
      const url = PlaceContactUtils.generateWhatsAppUrl(
        place.phone, 
        PlaceDataUtils.getDisplayName(place)
      )
      window.open(url, '_blank')
    }
  }

  const handleShare = () => {
    if (PlaceContactUtils.canShareNatively()) {
      const shareData = PlaceContactUtils.generateShareData(place)
      navigator.share(shareData)
    }
  }

  const hasValidId = placeId && placeId.length > 0

  return (
    <Stack direction="row" spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
      <Button
        variant="contained"
        startIcon={<WhatsApp />}
        onClick={handleWhatsApp}
        disabled={!place.phone}
        sx={{ flex: 1 }}
      >
        WhatsApp
      </Button>
      
      {hasValidId ? (
        <FavoriteButton 
          placeId={placeId}
          placeName={PlaceDataUtils.getDisplayName(place)}
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
      
      {hasValidId && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<RateReview />}
          onClick={onOpenReviewForm}
          size="medium"
        >
          Escribir Reseña
        </Button>
      )}
    </Stack>
  )
}
