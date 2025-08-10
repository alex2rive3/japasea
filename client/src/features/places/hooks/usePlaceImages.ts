import { useState } from 'react'
import { PlaceImageUtils } from '../utils/placeUtils'
import type { Place } from '../../../types/places'
import type { PlaceImage, ImageErrorState } from '../types/place.types'

export function usePlaceImages(place: Place | null) {
  const [imageError, setImageError] = useState<ImageErrorState>({})

  const handleImageError = (imageId: string) => {
    setImageError(prev => ({ ...prev, [imageId]: true }))
  }

  const resetImageErrors = () => {
    setImageError({})
  }

  const getDisplayImages = (): PlaceImage[] => {
    if (!place) return []
    return PlaceImageUtils.processPlaceImages(place)
  }

  const getGalleryImages = (maxImages: number = 4): PlaceImage[] => {
    const images = getDisplayImages()
    return PlaceImageUtils.limitImagesToDisplay(images, maxImages)
  }

  return {
    imageError,
    handleImageError,
    resetImageErrors,
    getDisplayImages,
    getGalleryImages
  }
}
