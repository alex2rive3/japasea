// Main map interface component
export { MapInterface } from './components/MapInterface'

// Map page component
export { MapPage } from './pages/MapPage'

// Individual components for custom usage
export { MapHeader } from './components/MapHeader'
export { InteractiveMapContainer } from './components/InteractiveMapContainer'
export { MapMarker } from './components/MapMarker'
export { MapPopup } from './components/MapPopup'

// Hooks
export { useMapInstance } from './hooks/useMapInstance'
export { useMapData } from './hooks/useMapData'

// Utils
export { 
  MapIconUtils, 
  MapDataUtils, 
  MapCenterUtils 
} from './utils/mapUtils'

// Types and constants
export type {
  MapComponentProps,
  MapContainerProps,
  MapMarkerProps,
  MapPopupProps,
  MapHeaderProps,
  MapConfig,
  PlaceTypeColor,
  LeafletIconConfig,
  MapUtilsConfig
} from './types/map.types'

export { 
  MAP_CONFIG, 
  LEAFLET_ICONS, 
  MAP_UTILS_CONFIG 
} from './types/map.types'
