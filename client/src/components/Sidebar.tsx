import React, { useState } from 'react'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Explore as ExploreIcon,
  FavoriteBorder as WishlistIcon,
  CardTravel as TripsIcon,
  Inbox as InboxIcon,
  Add as AddIcon,
} from '@mui/icons-material'

interface SidebarProps {
  children: React.ReactNode
}

const drawerWidth = 260

export const Sidebar = ({ children }: SidebarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
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
      {/* Profile Section */}
      <Box sx={{ 
        p: 3, 
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40,
              bgcolor: 'primary.main'
            }}
            src="/api/placeholder/40/40"
          >
            S
          </Avatar>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            Sophia's Travel
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, py: 1 }}>
        <List sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItem 
              key={item.text} 
              sx={{ 
                cursor: 'pointer',
                borderRadius: 2,
                mb: 0.5,
                mx: 1,
                bgcolor: item.active ? 'primary.light' : 'transparent',
                '&:hover': {
                  bgcolor: item.active ? 'primary.light' : 'action.hover'
                }
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: item.active ? 'primary.main' : 'text.secondary',
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
                  color: item.active ? 'primary.main' : 'text.primary'
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
    <Box sx={{ display: 'flex', width: '100vw' }}>
      {/* Mobile AppBar - only show when drawer is closed */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100vw - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          display: { xs: mobileOpen ? 'none' : 'flex', md: 'none' },
          bgcolor: 'primary.main',
          zIndex: (theme) => theme.zIndex.drawer - 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Sophia's Travel
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Drawer para móvil */}
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
              bgcolor: 'background.default',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Drawer para desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: 'background.default',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100vw - ${drawerWidth}px)` },
          maxWidth: { md: `calc(100vw - ${drawerWidth}px)` },
          mt: { xs: mobileOpen ? 0 : 7, md: 0 }, // Space for mobile AppBar when drawer is closed
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
