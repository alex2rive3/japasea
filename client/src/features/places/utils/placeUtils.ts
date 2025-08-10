import { DEFAULT_IMAGES } from '../types/place.types'
import type { Place } from '../../../types/places'
import type { PlaceImage } from '../types/place.types'

export class PlaceDataUtils {
  static extractPlaceId(place: any): string {
    const rawId = place._id || place.id || ''
    return typeof rawId === 'string' && /^[a-fA-F0-9]{24}$/.test(rawId) ? rawId : ''
  }

  static isValidObjectId(id: string): boolean {
    return typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id)
  }

  static hasFullDetails(place: Place): boolean {
    return !!(place.images && place.openingHours)
  }

  static getDisplayName(place: Place): string {
    return place.name || place.key || 'Lugar sin nombre'
  }
}

export class PlaceImageUtils {
  static getDefaultImageForType(type: string = 'default'): string {
    return DEFAULT_IMAGES[type.toLowerCase()] || DEFAULT_IMAGES.default
  }

  static processPlaceImages(place: Place): PlaceImage[] {
    if (place.images && place.images.length > 0) {
      return place.images
    }
    
    return [{
      url: this.getDefaultImageForType(place.type),
      caption: PlaceDataUtils.getDisplayName(place)
    }]
  }

  static limitImagesToDisplay(images: PlaceImage[], maxImages: number = 4): PlaceImage[] {
    return images.slice(0, maxImages)
  }
}

export class PlaceContactUtils {
  static cleanPhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '')
  }

  static generateWhatsAppUrl(phone: string, placeName: string): string {
    const cleanPhone = this.cleanPhoneNumber(phone)
    const message = `Hola! Vi su negocio ${placeName} en Japasea y me gustaría más información.`
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
  }

  static generateShareData(place: Place) {
    return {
      title: PlaceDataUtils.getDisplayName(place),
      text: `Mira este lugar: ${PlaceDataUtils.getDisplayName(place)}`,
      url: window.location.href
    }
  }

  static canShareNatively(): boolean {
    return 'share' in navigator
  }
}

export class PlaceValidationUtils {
  static validateEnsureRequest(place: Place): boolean {
    return !!(
      (place.key || place.name) &&
      place.description &&
      place.location &&
      place.location.lat &&
      place.location.lng
    )
  }

  static createEnsureRequest(place: Place) {
    return {
      key: place.key || place.name,
      name: place.name || place.key,
      description: place.description,
      type: place.type,
      address: place.address,
      location: place.location
    }
  }
}
