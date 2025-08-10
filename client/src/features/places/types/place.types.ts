import type { Place } from '../../../types/places'

export interface PlaceDetailsModalProps {
  open: boolean
  onClose: () => void
  place: Place | null
}

export interface PlaceDetailsProps {
  place: Place
  loading?: boolean
  onReviewSuccess?: () => void
}

export interface PlaceImageGalleryProps {
  images: PlaceImage[]
  placeName: string
  placeType: string
}

export interface PlaceInfoSectionProps {
  place: Place
}

export interface PlaceActionsProps {
  place: Place
  placeId: string
  onOpenReviewForm: () => void
}

export interface PlaceContactInfoProps {
  place: Place
}

export interface PlaceRatingsSectionProps {
  place: Place
}

export interface PlaceImage {
  url: string
  caption?: string
}

export interface PlaceEnsureRequest {
  key?: string
  name?: string
  description: string
  type?: string
  address?: string
  location: {
    lat: number
    lng: number
  }
}

export interface DefaultImageMap {
  [key: string]: string
}

export const DEFAULT_IMAGES: DefaultImageMap = {
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  cafe: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
  bar: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
  shopping: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
  tourism: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
  entertainment: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  default: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80'
}

export interface ImageErrorState {
  [key: string]: boolean
}
