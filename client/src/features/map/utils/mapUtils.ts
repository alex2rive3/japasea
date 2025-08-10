import L from 'leaflet'
import { LEAFLET_ICONS, MAP_UTILS_CONFIG } from '../types/map.types'
import type { PlaceTypeColor } from '../types/map.types'

export class MapIconUtils {
  static initializeLeafletIcons() {
    const iconPrototype = L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown }
    delete iconPrototype._getIconUrl
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: LEAFLET_ICONS.iconRetinaUrl,
      iconUrl: LEAFLET_ICONS.iconUrl,
      shadowUrl: LEAFLET_ICONS.shadowUrl,
    })
  }
}

export class MapDataUtils {
  static extractPhoneFromDescription(description: string): string | null {
    const match = description.match(MAP_UTILS_CONFIG.phoneRegex)
    return match ? match[0] : null
  }

  static getTypeColor(type: string | undefined): PlaceTypeColor {
    if (!type) return 'primary'
    
    const normalizedType = type.toLowerCase()
    return MAP_UTILS_CONFIG.typeColorMap[normalizedType] || 'primary'
  }

  static cleanDescriptionText(description: string): string {
    return description.replace(/Teléfono:.*/, '').trim()
  }

  static generateUniqueKey(place: any, index: number): string {
    return place.id || place._id || `${place.key}-${index}`
  }
}

export class MapCenterUtils {
  static calculateCenter(places: any[], defaultCenter: [number, number]): [number, number] {
    if (places.length === 0) return defaultCenter
    
    // Use first place as center, or calculate centroid for multiple places
    if (places.length === 1) {
      return [places[0].location.lat, places[0].location.lng]
    }

    // Calculate centroid for multiple places
    const latSum = places.reduce((sum, place) => sum + place.location.lat, 0)
    const lngSum = places.reduce((sum, place) => sum + place.location.lng, 0)
    
    return [latSum / places.length, lngSum / places.length]
  }
}

// Initialize icons when module loads
MapIconUtils.initializeLeafletIcons()
