import type { ReactNode } from 'react'

export interface LayoutProps {
  children: ReactNode
  onNotificationClick?: () => void
  onSearch?: (query: string) => void
}

export interface MenuItem {
  text: string
  icon: ReactNode
  path: string
  disabled?: boolean
  badge?: number
}

export interface DrawerProps {
  open: boolean
  onClose: () => void
  menuItems: MenuItem[]
  variant?: 'temporary' | 'persistent'
  anchor?: 'left' | 'right' | 'top' | 'bottom'
}

export interface AppBarProps {
  onMenuToggle: () => void
  onDesktopMenuToggle: () => void
  onSearch?: (query: string) => void
  onNotificationClick?: () => void
  searchQuery: string
  onSearchChange: (value: string) => void
  showMobileMenuButton?: boolean
  showDesktopMenuButton?: boolean
}

export interface UserMenuProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  onViewProfile: () => void
  onLogout: () => void
}

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (event: React.FormEvent) => void
  placeholder?: string
  maxWidth?: number
}

export interface SidebarProps {
  menuItems: MenuItem[]
  onNavigate: (path: string) => void
  currentPath: string
}

export interface MobileMenuProps {
  open: boolean
  onClose: () => void
  menuItems: MenuItem[]
  onNavigate: (path: string) => void
  currentPath: string
}

export interface LayoutConfig {
  drawerWidth: number
  breakpoints: {
    mobile: string
    desktop: string
  }
  zIndex: {
    appBar: number
    drawer: number
  }
}

// Default layout configuration
export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  drawerWidth: 260,
  breakpoints: {
    mobile: 'md',
    desktop: 'md'
  },
  zIndex: {
    appBar: 1300,
    drawer: 1200
  }
}

// Default menu items
export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { text: 'Inicio', icon: null, path: '/' },
  { text: 'Favoritos', icon: null, path: '/favorites' },
  { text: 'Mi Perfil', icon: null, path: '/profile' }
]
