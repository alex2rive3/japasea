import { useState, useEffect } from 'react'
import { placeDetailsService } from '../services/placeDetailsService'
import { PlaceDataUtils } from '../utils/placeUtils'
import type { Place } from '../../../types/places'

interface UsePlaceDetailsOptions {
  place: Place | null
  open: boolean
}

export function usePlaceDetails({ place, open }: UsePlaceDetailsOptions) {
  const [fullPlaceData, setFullPlaceData] = useState<Place | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPlaceDetails = async () => {
    if (!place || !open) return

    setLoading(true)
    setError(null)

    try {
      const details = await placeDetailsService.fetchPlaceDetails(place)
      setFullPlaceData(details)
    } catch (err) {
      console.error('Error fetching place details:', err)
      setError('Error al cargar los detalles del lugar')
      setFullPlaceData(place) // Fallback to original data
    } finally {
      setLoading(false)
    }
  }

  const refreshPlaceData = async () => {
    const displayPlace = fullPlaceData || place
    if (!displayPlace) return

    const placeId = PlaceDataUtils.extractPlaceId(displayPlace)
    if (!placeId) return

    try {
      const refreshedData = await placeDetailsService.refreshPlaceData(placeId)
      if (refreshedData) {
        setFullPlaceData(refreshedData)
      }
    } catch (err) {
      console.error('Error refreshing place data:', err)
    }
  }

  useEffect(() => {
    fetchPlaceDetails()
  }, [place, open])

  const displayPlace = fullPlaceData || place
  const placeId = displayPlace ? PlaceDataUtils.extractPlaceId(displayPlace) : ''

  return {
    displayPlace,
    placeId,
    loading,
    error,
    refreshPlaceData
  }
}
