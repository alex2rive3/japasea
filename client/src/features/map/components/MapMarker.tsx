import { Marker, Popup } from 'react-leaflet'
import { MapPopup } from './MapPopup'
import { MapDataUtils } from '../utils/mapUtils'
import type { MapMarkerProps } from '../types/map.types'

export function MapMarker({ place, index }: MapMarkerProps) {
  const uniqueKey = MapDataUtils.generateUniqueKey(place, index)

  return (
    <Marker 
      key={uniqueKey} 
      position={[place.location.lat, place.location.lng]}
    >
      <Popup>
        <MapPopup place={place} />
      </Popup>
    </Marker>
  )
}
