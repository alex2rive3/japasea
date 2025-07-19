import React, { useState } from 'react'
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
  Explore as ExploreIcon,
  FavoriteBorder as WishlistIcon,
  CardTravel as TripsIcon,
  Inbox as InboxIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material'
import { alpha } from '@mui/material/styles'

interface LayoutProps {
  children: React.ReactNode
  onProfileClick?: () => void
  onNotificationClick?: () => void
  onSearch?: (query: string) => void
}

const drawerWidth = 260

export const Layout = ({ 
  children,
  onProfileClick, 
  onNotificationClick, 
  onSearch 
}: LayoutProps) => {
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

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  const menuItems = [
    { text: 'Inicio', icon: <HomeIcon />, href: '#', active: true },
    { text: 'Explorar', icon: <ExploreIcon />, href: '#', active: false },
    { text: 'Favoritos', icon: <WishlistIcon />, href: '#', active: false },
    { text: 'Viajes', icon: <TripsIcon />, href: '#', active: false },
    { text: 'Mensajes', icon: <InboxIcon />, href: '#', active: false },
  ]

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, py: 1, mt:{ xs: 0, md: 8 } }}>
        <List sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItem 
              key={item.text} 
              sx={{ 
                cursor: 'pointer',
                borderRadius: 2,
                mb: 0.5,
                mx: 1,
                bgcolor: item.active ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                '&:hover': {
                  bgcolor: item.active ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: item.active ? '#1976d2' : 'rgba(0, 0, 0, 0.6)',
                  minWidth: 40
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: item.active ? 600 : 400,
                  color: item.active ? '#1976d2' : 'rgba(0, 0, 0, 0.87)'
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Create Plan Button */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 2,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem'
          }}
        >
          Crear Plan
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

          {/* Right Section - Notifications and Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
            <IconButton
              onClick={onProfileClick}
              sx={{ p: 0.5, ml: 1 }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  bgcolor: 'primary.main',
                  '&:hover': {
                    boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                  },
                }}
                src="/api/placeholder/36/36"
              >
                S
              </Avatar>
            </IconButton>
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
