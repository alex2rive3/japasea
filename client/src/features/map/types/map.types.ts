import type { Place } from '../../../types/places'

export interface MapComponentProps {
  center?: [number, number]
  zoom?: number
  places?: Place[]
}

export interface MapContainerProps {
  center: [number, number]
  zoom: number
  places: Place[]
  onMapReady?: (map: L.Map) => void
}

export interface MapMarkerProps {
  place: Place
  index: number
}

export interface MapPopupProps {
  place: Place
}

export interface MapHeaderProps {
  title?: string
  subtitle?: string
}

export interface MapConfig {
  defaultCenter: [number, number]
  defaultZoom: number
  maxZoom: number
  minZoom: number
}

export type PlaceTypeColor = 
  | "primary" 
  | "secondary" 
  | "success" 
  | "warning" 
  | "info"

export interface LeafletIconConfig {
  iconRetinaUrl: string
  iconUrl: string
  shadowUrl: string
}

export interface MapUtilsConfig {
  phoneRegex: RegExp
  typeColorMap: Record<string, PlaceTypeColor>
}

export const MAP_CONFIG: MapConfig = {
  defaultCenter: [-27.3328, -55.8664], // Encarnación center
  defaultZoom: 15,
  maxZoom: 18,
  minZoom: 10
}

export const LEAFLET_ICONS: LeafletIconConfig = {
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
}

export const MAP_UTILS_CONFIG: MapUtilsConfig = {
  phoneRegex: /(\d{4}\s?\d{3}\s?\d{3})/g,
  typeColorMap: {
    'alojamiento': 'primary',
    'desayunos y meriendas': 'secondary',
    'comida': 'warning',
    'turístico': 'success',
    'compras': 'info'
  }
}
