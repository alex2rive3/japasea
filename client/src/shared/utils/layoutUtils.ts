import type { MenuItem, LayoutConfig } from '../types/layout.types'

export class LayoutUtils {
  static isActiveMenuItem(currentPath: string, itemPath: string): boolean {
    if (itemPath === '/') {
      return currentPath === '/'
    }
    return currentPath.startsWith(itemPath)
  }

  static getActiveMenuItemIndex(currentPath: string, menuItems: MenuItem[]): number {
    return menuItems.findIndex(item => this.isActiveMenuItem(currentPath, item.path))
  }

  static filterEnabledMenuItems(menuItems: MenuItem[]): MenuItem[] {
    return menuItems.filter(item => !item.disabled)
  }

  static getMenuItemsWithBadges(menuItems: MenuItem[]): MenuItem[] {
    return menuItems.filter(item => item.badge && item.badge > 0)
  }

  static calculateDrawerWidth(
    isDesktop: boolean, 
    isOpen: boolean, 
    config: LayoutConfig
  ): number {
    if (!isDesktop) return 0
    return isOpen ? config.drawerWidth : 0
  }

  static calculateMainContentWidth(
    isDesktop: boolean, 
    drawerOpen: boolean, 
    config: LayoutConfig
  ): string {
    if (!isDesktop) return '100vw'
    return drawerOpen ? `calc(100vw - ${config.drawerWidth}px)` : '100vw'
  }

  static formatUserInitial(userName?: string): string {
    if (!userName) return 'U'
    return userName.charAt(0).toUpperCase()
  }

  static validateSearchQuery(query: string): boolean {
    return query.trim().length > 0
  }

  static sanitizeSearchQuery(query: string): string {
    return query.trim().replace(/\s+/g, ' ')
  }

  static getResponsiveBreakpoints() {
    return {
      mobile: { xs: 'block', md: 'none' },
      desktop: { xs: 'none', md: 'block' },
      mobileHidden: { xs: 'none', md: 'block' },
      desktopHidden: { xs: 'block', md: 'none' }
    }
  }

  static createMenuItemStyle(isActive: boolean) {
    return {
      cursor: 'pointer',
      borderRadius: 2,
      mb: 0.5,
      mx: 1,
      bgcolor: isActive ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
      '&:hover': {
        bgcolor: isActive ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
      }
    }
  }

  static createMenuItemIconStyle(isActive: boolean) {
    return {
      color: isActive ? '#1976d2' : 'rgba(0, 0, 0, 0.6)',
      minWidth: 40
    }
  }

  static createMenuItemTextStyle(isActive: boolean) {
    return {
      fontSize: '0.95rem',
      fontWeight: isActive ? 600 : 400,
      color: isActive ? '#1976d2' : 'rgba(0, 0, 0, 0.87)'
    }
  }

  static createAppBarStyle() {
    return {
      bgcolor: 'background.paper',
      color: 'text.primary',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderBottom: '1px solid',
      borderColor: 'divider',
      width: '100vw'
    }
  }

  static createSearchBarStyle() {
    return {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      maxWidth: 600,
      borderRadius: 3,
      bgcolor: 'rgba(245, 245, 245, 0.8)',
      border: '1px solid',
      borderColor: 'rgba(224, 224, 224, 0.5)',
      px: 2,
      py: 0.5,
      '&:hover': {
        bgcolor: '#f5f5f5',
        borderColor: 'primary.main',
      },
      '&:focus-within': {
        bgcolor: 'background.paper',
        borderColor: 'primary.main',
        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.15)',
      }
    }
  }

  static createDrawerStyle(variant: 'mobile' | 'desktop', width: number) {
    const baseStyle = {
      '& .MuiDrawer-paper': {
        boxSizing: 'border-box',
        width,
        bgcolor: '#ffffff',
        borderRight: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.12)',
      }
    }

    if (variant === 'mobile') {
      return {
        ...baseStyle,
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          ...baseStyle['& .MuiDrawer-paper'],
          zIndex: 1200,
        }
      }
    }

    return {
      ...baseStyle,
      display: { xs: 'none', md: 'block' },
      '& .MuiDrawer-paper': {
        ...baseStyle['& .MuiDrawer-paper'],
        borderTop: 'none',
        transition: 'transform 0.3s ease'
      }
    }
  }

  static createMainContentStyle(
    drawerWidth: number, 
    desktopDrawerOpen: boolean
  ) {
    return {
      flexGrow: 1,
      width: { 
        xs: '100vw',
        md: desktopDrawerOpen ? `calc(100vw - ${drawerWidth}px)` : '100vw'
      },
      maxWidth: { 
        xs: '100vw',
        md: desktopDrawerOpen ? `calc(100vw - ${drawerWidth}px)` : '100vw'
      },
      pt: 8,
      overflow: 'hidden',
      transition: 'width 0.3s ease, max-width 0.3s ease'
    }
  }
}
