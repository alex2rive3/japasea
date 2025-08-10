export interface AdminPlace {
  id?: string
  _id?: string
  key: string
  name: string
  description: string
  type: PlaceType
  address: string
  location?: {
    lat: number
    lng: number
    coordinates?: number[]
  }
  lat?: number
  lng?: number
  status: PlaceStatus
  metadata?: {
    verified?: boolean
    featured?: boolean
  }
}

export interface AdminPlaceForm {
  id?: string
  key: string
  name: string
  description: string
  type: string
  address: string
  lat: number
  lng: number
  status?: string
}

export type PlaceType = 
  | 'Alojamiento' 
  | 'Gastronomía' 
  | 'Turístico' 
  | 'Compras' 
  | 'Entretenimiento' 
  | 'Desayunos y meriendas' 
  | 'Comida'

export type PlaceStatus = 'active' | 'inactive' | 'pending' | 'seasonal'

export interface AdminPlaceFilters {
  q?: string
  type?: string
  status?: string
}

export interface AdminPlacesListProps {
  items: AdminPlace[]
  onEdit: (place: AdminPlace) => void
  onVerify: (id: string) => void
  onFeature: (id: string, featured: boolean) => void
  onStatus: (id: string, status: string) => void
}

export interface AdminPlaceCardProps {
  place: AdminPlace
  onEdit: (place: AdminPlace) => void
  onVerify: (id: string) => void
  onFeature: (id: string, featured: boolean) => void
  onStatus: (id: string, status: string) => void
}

export interface AdminPlaceFormProps {
  open: boolean
  form: AdminPlaceForm
  onClose: () => void
  onSubmit: () => void
  onFormChange: (form: AdminPlaceForm) => void
}

export interface AdminPlaceFiltersProps {
  filters: AdminPlaceFilters
  onFiltersChange: (filters: AdminPlaceFilters) => void
}

export interface AdminPlacesHeaderProps {
  onNavigateHome: () => void
  onCreateNew: () => void
}

export const PLACE_TYPES: PlaceType[] = [
  'Alojamiento', 
  'Gastronomía', 
  'Turístico', 
  'Compras', 
  'Entretenimiento', 
  'Desayunos y meriendas', 
  'Comida'
]

export const STATUSES: PlaceStatus[] = ['active', 'inactive', 'pending', 'seasonal']
