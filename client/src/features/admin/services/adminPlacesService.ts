import { placesService } from '../../../services/placesService'
import type { AdminPlace, AdminPlaceForm } from '../types/admin.types'

export interface AdminPlacesListOptions {
  page: number
  limit: number
  q?: string
  type?: string
  status?: string
}

class AdminPlacesService {
  async listPlaces(options: AdminPlacesListOptions) {
    return placesService.adminListPlaces(options)
  }

  async createPlace(placeData: AdminPlaceForm) {
    return placesService.adminCreatePlace(placeData)
  }

  async updatePlace(id: string, placeData: AdminPlaceForm) {
    return placesService.adminUpdatePlace(id, placeData)
  }

  async verifyPlace(id: string) {
    return placesService.adminVerifyPlace(id)
  }

  async featurePlace(id: string, featured: boolean) {
    return placesService.adminFeaturePlace(id, featured)
  }

  async setPlaceStatus(id: string, status: string) {
    return placesService.adminSetStatus(id, status)
  }

  getPlaceId(place: AdminPlace): string {
    return place.id ?? place._id ?? ''
  }

  mapPlaceToForm(place: AdminPlace): AdminPlaceForm {
    return {
      id: this.getPlaceId(place),
      key: place.key,
      name: place.name,
      description: place.description,
      type: place.type,
      address: place.address,
      lat: place.location?.lat ?? place.location?.coordinates?.[1] ?? place.lat ?? 0,
      lng: place.location?.lng ?? place.location?.coordinates?.[0] ?? place.lng ?? 0
    }
  }

  createEmptyForm(): AdminPlaceForm {
    return {
      key: '',
      name: '',
      description: '',
      type: '',
      address: '',
      lat: 0,
      lng: 0
    }
  }
}

export const adminPlacesService = new AdminPlacesService()
