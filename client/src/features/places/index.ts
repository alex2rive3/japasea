// Main place details modal component
export { PlaceDetailsModal } from './components/PlaceDetailsModal'

// Individual components for custom usage
export { PlaceImageGallery } from './components/PlaceImageGallery'
export { PlaceContactInfo } from './components/PlaceContactInfo'
export { PlaceRatingsSection } from './components/PlaceRatingsSection'
export { PlaceActions } from './components/PlaceActions'

// Hooks
export { usePlaceDetails } from './hooks/usePlaceDetails'
export { usePlaceImages } from './hooks/usePlaceImages'

// Services
export { placeDetailsService } from './services/placeDetailsService'

// Utils
export { 
  PlaceDataUtils,
  PlaceImageUtils,
  PlaceContactUtils,
  PlaceValidationUtils
} from './utils/placeUtils'

// Types and constants
export type {
  PlaceDetailsModalProps,
  PlaceDetailsProps,
  PlaceImageGalleryProps,
  PlaceInfoSectionProps,
  PlaceActionsProps,
  PlaceContactInfoProps,
  PlaceRatingsSectionProps,
  PlaceImage,
  PlaceEnsureRequest,
  DefaultImageMap,
  ImageErrorState
} from './types/place.types'

export { DEFAULT_IMAGES } from './types/place.types'
