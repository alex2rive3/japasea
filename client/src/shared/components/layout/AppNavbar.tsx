import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Badge
} from '@mui/material'
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material'
import { SearchBar } from './SearchBar'
import { UserMenu } from './UserMenu'
import { LayoutUtils } from '../../utils/layoutUtils'
import { useAuth } from '../../../hooks/useAuth'
import type { AppBarProps } from '../../types/layout.types'

export const AppNavbar = ({
  onMenuToggle,
  onDesktopMenuToggle,
  onSearch,
  onNotificationClick,
  searchQuery,
  onSearchChange,
  showMobileMenuButton = true,
  showDesktopMenuButton = true
}: AppBarProps) => {
  const { user } = useAuth()

  return (
    <AppBar 
      position="fixed" 
      sx={{
        ...LayoutUtils.createAppBarStyle(),
        zIndex: (theme) => theme.zIndex.drawer + 2
      }}
      elevation={0}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Mobile Menu Button */}
        {showMobileMenuButton && (
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={onMenuToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' } 
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Desktop Menu Button */}
        {showDesktopMenuButton && (
          <IconButton
            color="inherit"
            aria-label="toggle desktop drawer"
            edge="start"
            onClick={onDesktopMenuToggle}
            sx={{ 
              mr: 2, 
              display: { xs: 'none', md: 'block' } 
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo/Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
          <Box
            component="img"
            src="/src/assets/logo.png"
            alt="Japasea Logo"
            sx={{
              width: 40,
              height: 40,
            }}
          />
        </Box>

        {/* Search Bar */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flex: 1,
          mx: { xs: 2, sm: 4 }
        }}>
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            onSubmit={(event: React.FormEvent) => {
              event.preventDefault()
              if (onSearch) {
                onSearch(searchQuery)
              }
            }}
            placeholder="Planifica tu próxima aventura"
            maxWidth={600}
          />
        </Box>

        {/* Right Section - Notifications and Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <IconButton
            onClick={onNotificationClick}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <Badge badgeContent={3} color="error" variant="dot">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile Avatar */}
          <UserMenu user={user} />
        </Box>
      </Toolbar>
    </AppBar>
  )
}
