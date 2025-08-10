// Temporary migration component to maintain compatibility
// This allows dropping-in MapInterface as a replacement for MapComponent
import { MapInterface } from '../features/map'
import type { Place } from '../types/places'

interface MapComponentProps {
  center?: [number, number]
  zoom?: number
  places?: Place[]
}

export const MapComponentNew = ({ 
  center, 
  zoom, 
  places 
}: MapComponentProps) => {
  return <MapInterface center={center} zoom={zoom} places={places} />
}
