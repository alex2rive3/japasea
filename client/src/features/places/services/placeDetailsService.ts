import { placesService } from '../../../services/placesService'
import { PlaceDataUtils, PlaceValidationUtils } from '../utils/placeUtils'
import type { Place } from '../../../types/places'

class PlaceDetailsService {
  async fetchPlaceDetails(place: Place): Promise<Place> {
    // If place already has full details, return it
    if (PlaceDataUtils.hasFullDetails(place)) {
      return place
    }

    const candidateId = PlaceDataUtils.extractPlaceId(place)
    
    // Try to get details by ID if we have a valid ObjectId
    if (PlaceDataUtils.isValidObjectId(candidateId)) {
      try {
        return await placesService.getPlaceById(candidateId)
      } catch (error) {
        console.error('Error fetching place by ID:', error)
      }
    }

    // If no valid ID or fetch failed, try to ensure the place
    if (PlaceValidationUtils.validateEnsureRequest(place)) {
      try {
        const ensureRequest = PlaceValidationUtils.createEnsureRequest(place)
        return await placesService.ensurePlace(ensureRequest)
      } catch (error) {
        console.error('Error ensuring place:', error)
      }
    }

    // Fallback to original place data
    return place
  }

  async refreshPlaceData(placeId: string): Promise<Place | null> {
    if (!PlaceDataUtils.isValidObjectId(placeId)) {
      return null
    }

    try {
      return await placesService.getPlaceById(placeId)
    } catch (error) {
      console.error('Error refreshing place data:', error)
      return null
    }
  }
}

export const placeDetailsService = new PlaceDetailsService()
