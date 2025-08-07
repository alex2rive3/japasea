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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  TextField,
  Alert,
  CircularProgress,
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
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material'
import { alpha } from '@mui/material/styles'
import { useAuth } from '../hooks/useAuth'
import type { UpdateProfileData } from '../types/auth'

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
  const navigate = useNavigate()
  const location = useLocation()
  const { user, updateProfile, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(true) // Desktop sidebar state
  const [searchQuery, setSearchQuery] = useState('')
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [profileData, setProfileData] = useState<UpdateProfileData>({
    name: user?.name || '',
    phone: user?.phone || ''
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

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

  const handleProfileModalOpen = () => {
    setProfileModalOpen(true)
    setProfileData({
      name: user?.name || '',
      phone: user?.phone || ''
    })
    setMessage('')
    setError('')
  }

  const handleProfileModalClose = () => {
    setProfileModalOpen(false)
  }

  const handleProfileChange = (field: keyof UpdateProfileData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
    if (message || error) {
      setMessage('')
      setError('')
    }
  }

  const handleUpdateProfile = async () => {
    if (!profileData.name?.trim()) {
      setError('El nombre es requerido')
      return
    }

    try {
      setIsUpdating(true)
      setError('')
      await updateProfile(profileData)
      setMessage('Perfil actualizado exitosamente')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error actualizando perfil'
      setError(errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setProfileModalOpen(false)
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
    { text: 'Inicio', icon: <HomeIcon />, path: '/' },
    { text: 'Explorar', icon: <ExploreIcon />, path: '/explore' },
    { text: 'Favoritos', icon: <WishlistIcon />, path: '/favorites' },
    { text: 'Viajes', icon: <TripsIcon />, path: '/trips' },
    { text: 'Mensajes', icon: <InboxIcon />, path: '/messages' },
    { text: 'Mi Perfil', icon: <AccountCircleIcon />, path: '/profile' },
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
              onClick={() => navigate('/profile')}
              sx={{ p: 0.5, ml: 1 }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  bgcolor: 'primary.main',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                  },
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
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
      
      {/* Profile Modal */}
      <Dialog 
        open={profileModalOpen} 
        onClose={handleProfileModalClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: 'primary.main',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Typography variant="h6">Mi Perfil</Typography>
              <Chip
                label={user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                color={user?.role === 'admin' ? 'secondary' : 'primary'}
                size="small"
              />
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {(message || error) && (
            <Alert 
              severity={message ? 'success' : 'error'} 
              sx={{ mb: 2 }}
              onClose={() => {
                setMessage('')
                setError('')
              }}
            >
              {message || error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              fullWidth
              label="Nombre completo"
              value={profileData.name}
              onChange={handleProfileChange('name')}
              disabled={isUpdating}
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />

            <TextField
              fullWidth
              label="Email"
              value={user?.email}
              disabled
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              helperText="El email no se puede cambiar"
            />

            <TextField
              fullWidth
              label="Teléfono (opcional)"
              value={profileData.phone}
              onChange={handleProfileChange('phone')}
              disabled={isUpdating}
              placeholder="+595 987 654 321"
              InputProps={{
                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />

            {user?.createdAt && (
              <Typography variant="body2" color="text.secondary">
                Miembro desde: {new Date(user.createdAt).toLocaleDateString('es-ES')}
              </Typography>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={handleLogout}
            color="error"
            startIcon={<LockIcon />}
          >
            Cerrar Sesión
          </Button>
          <Button 
            onClick={handleProfileModalClose}
            startIcon={<CloseIcon />}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdateProfile}
            variant="contained"
            disabled={isUpdating}
            startIcon={isUpdating ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {isUpdating ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
