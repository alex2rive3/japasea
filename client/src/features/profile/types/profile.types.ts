export interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

export interface PreferencesState {
  theme: 'light' | 'dark'
  language: 'es' | 'en'
  notifications: {
    email: boolean
    push: boolean
    places: boolean
    favorites: boolean
  }
}

export interface FavoriteStats {
  totalFavorites: number
  categoryCounts: Record<string, number>
  mostVisitedCategory: string
  lastAddedDate: string
}

export interface ProfileTabsProps {
  value: number
  onChange: (event: React.SyntheticEvent, newValue: number) => void
}
