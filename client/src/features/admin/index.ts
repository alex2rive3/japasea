// Main admin interface component
export { AdminPlacesInterface } from './components/AdminPlacesInterface'

// Admin page component
export { AdminPlacesPage } from './pages/AdminPlacesPage'

// Individual components for custom usage
export { AdminPlacesHeader } from './components/AdminPlacesHeader'
export { AdminPlaceFilters as AdminFiltersComponent } from './components/AdminPlaceFilters'
export { AdminPlacesList } from './components/AdminPlacesList'
export { AdminPlaceCard } from './components/AdminPlaceCard'
export { AdminPlaceForm as AdminFormComponent } from './components/AdminPlaceForm'

// Hooks
export { useAdminPlaces } from './hooks/useAdminPlaces'
export { useAdminPlaceForm } from './hooks/useAdminPlaceForm'

// Services
export { adminPlacesService } from './services/adminPlacesService'

// Types and constants
export type {
  AdminPlace,
  AdminPlaceForm,
  AdminPlaceFilters,
  PlaceType,
  PlaceStatus,
  AdminPlacesListProps,
  AdminPlaceCardProps,
  AdminPlaceFormProps,
  AdminPlaceFiltersProps,
  AdminPlacesHeaderProps
} from './types/admin.types'

export { PLACE_TYPES, STATUSES } from './types/admin.types'
