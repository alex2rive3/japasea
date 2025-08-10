import { Box, Drawer } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Home as HomeIcon,
  FavoriteBorder as WishlistIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material'
import { AppNavbar } from './AppNavbar'
import { Sidebar } from './Sidebar'
import { MobileMenu } from './MobileMenu'
import { useLayoutDrawer } from '../../hooks/useLayoutDrawer'
import { useLayoutSearch } from '../../hooks/useLayoutSearch'
import { LayoutUtils } from '../../utils/layoutUtils'
import type { LayoutProps, MenuItem } from '../../types/layout.types'

const drawerWidth = 260

export const AppLayout = ({ 
  children,
  onNotificationClick, 
  onSearch 
}: LayoutProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const {
    mobileOpen,
    desktopOpen,
    toggleMobileDrawer,
    toggleDesktopDrawer
  } = useLayoutDrawer(true)

  const {
    searchQuery,
    handleSearchChange
  } = useLayoutSearch({ onSearch })

  const menuItems: MenuItem[] = [
    { text: 'Inicio', icon: <HomeIcon />, path: '/' },
    { text: 'Favoritos', icon: <WishlistIcon />, path: '/favorites' },
    { text: 'Mi Perfil', icon: <AccountCircleIcon />, path: '/profile' }
  ]

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh' }}>
      {/* Fixed Navbar */}
      <AppNavbar
        onMenuToggle={toggleMobileDrawer}
        onDesktopMenuToggle={toggleDesktopDrawer}
        onSearch={onSearch}
        onNotificationClick={onNotificationClick}
        searchQuery={searchQuery}
        onSearchChange={(value) => handleSearchChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
      />

      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ 
          width: { md: desktopOpen ? drawerWidth : 0 }, 
          flexShrink: { md: 0 },
          transition: 'width 0.3s ease'
        }}
      >
        {/* Mobile Drawer */}
        <MobileMenu
          open={mobileOpen}
          onClose={toggleMobileDrawer}
          menuItems={menuItems}
          onNavigate={handleNavigate}
          currentPath={location.pathname}
        />

        {/* Desktop Drawer */}
        <Drawer
          variant="persistent"
          open={desktopOpen}
          sx={LayoutUtils.createDrawerStyle('desktop', drawerWidth)}
        >
          <Sidebar
            menuItems={menuItems}
            onNavigate={handleNavigate}
            currentPath={location.pathname}
          />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={LayoutUtils.createMainContentStyle(drawerWidth, desktopOpen)}
      >
        {children}
      </Box>
    </Box>
  )
}
