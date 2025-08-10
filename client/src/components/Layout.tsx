import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  Badge,
  Paper,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  FavoriteBorder as WishlistIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material'
import { alpha } from '@mui/material/styles'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

interface LayoutProps {
  children: React.ReactNode
  onNotificationClick?: () => void
  onSearch?: (query: string) => void
}

const drawerWidth = 260

export const Layout = ({ 
  children,
  onNotificationClick, 
  onSearch 
}: LayoutProps) => {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(true) // Desktop sidebar state
  const [searchQuery, setSearchQuery] = useState('')

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleDesktopDrawerToggle = () => {
    setDesktopOpen(!desktopOpen)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchQuery(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error durante logout:', error)
    }
  }

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  const menuItems = [
    { text: t('navigation.home'), icon: <HomeIcon />, path: '/' },
    { text: t('navigation.favorites'), icon: <WishlistIcon />, path: '/favorites' },
    { text: t('navigation.myProfile'), icon: <AccountCircleIcon />, path: '/profile' },
  ]

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, py: 1, mt:{ xs: 0, md: 8 } }}>
        <List sx={{ px: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
            <ListItem 
              key={item.text} 
              onClick={() => navigate(item.path)}
              sx={{ 
                cursor: 'pointer',
                borderRadius: 2,
                mb: 0.5,
                mx: 1,
                bgcolor: isActive ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                '&:hover': {
                  bgcolor: isActive ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: isActive ? '#1976d2' : 'rgba(0, 0, 0, 0.6)',
                  minWidth: 40
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#1976d2' : 'rgba(0, 0, 0, 0.87)'
                }}
              />
            </ListItem>
            )
          })}
        </List>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            bgcolor: 'error.main',
            '&:hover': {
              bgcolor: 'error.dark'
            }
          }}
        >
          {t('navigation.logout')}
        </Button>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh' }}>
      {/* Fixed Navbar */}
      <AppBar 
        position="fixed" 
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: (theme) => theme.zIndex.drawer + 2, // Higher z-index than drawer
          width: '100vw'
        }}
        elevation={0}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' } 
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop Menu Button */}
          <IconButton
            color="inherit"
            aria-label="toggle desktop drawer"
            edge="start"
            onClick={handleDesktopDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { xs: 'none', md: 'block' } 
            }}
          >
            <MenuIcon />
          </IconButton>

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
            <Paper
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: 600,
                borderRadius: 3,
                bgcolor: alpha('#f5f5f5', 0.8),
                border: '1px solid',
                borderColor: alpha('#e0e0e0', 0.5),
                px: 2,
                py: 0.5,
                '&:hover': {
                  bgcolor: alpha('#f5f5f5', 1),
                  borderColor: 'primary.main',
                },
                '&:focus-within': {
                  bgcolor: 'background.paper',
                  borderColor: 'primary.main',
                  boxShadow: `0 0 0 2px ${alpha('#1976d2', 0.15)}`,
                },
              }}
              elevation={0}
            >
              <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              <input
                type="text"
                placeholder="Planifica tu próxima aventura"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  width: '100%',
                  fontSize: '0.95rem',
                  color: 'inherit',
                }}
              />
            </Paper>
          </Box>

          {/* Right Section - Language, Notifications and Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Notifications */}
            <IconButton
              onClick={onNotificationClick}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: alpha('#000', 0.04),
                },
              }}
            >
              <Badge badgeContent={3} color="error" variant="dot">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Profile Avatar */}
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36,
                bgcolor: 'primary.main',
                fontSize: '1rem',
                fontWeight: 'bold',
                ml: 1
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

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
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#ffffff',
              borderRight: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.12)',
              zIndex: (theme) => theme.zIndex.drawer,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="persistent"
          open={desktopOpen}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#ffffff',
              borderRight: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.12)',
              borderTop: 'none', // Remove top border to avoid intersection with navbar
              transition: 'transform 0.3s ease'
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { 
            xs: '100vw',
            md: desktopOpen ? `calc(100vw - ${drawerWidth}px)` : '100vw'
          },
          maxWidth: { 
            xs: '100vw',
            md: desktopOpen ? `calc(100vw - ${drawerWidth}px)` : '100vw'
          },
          pt: 8, // Space for navbar
          overflow: 'hidden',
          transition: 'width 0.3s ease, max-width 0.3s ease'
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
