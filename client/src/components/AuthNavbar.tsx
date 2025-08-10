import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Button,
  InputBase
} from '@mui/material'
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material'
import { alpha } from '@mui/material/styles'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

interface AuthNavbarProps {
  onSearch?: (query: string) => void
}

export function AuthNavbar({ onSearch }: AuthNavbarProps) {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleProfileClick = () => {
    navigate('/profile')
    handleMenuClose()
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Error durante logout:', error)
    }
    handleMenuClose()
  }

  const handleLoginClick = () => {
    navigate('/login')
  }

  const handleRegisterClick = () => {
    navigate('/register')
  }

  return (
    <AppBar 
      position="fixed" 
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderBottom: '1px solid',
        borderBottomColor: 'divider'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
        {/* Logo y título */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            Japasea
          </Typography>
        </Box>

        {/* Barra de búsqueda */}
        <Box 
          component="form" 
          onSubmit={handleSearchSubmit}
          sx={{ 
            flexGrow: 1, 
            mx: 3, 
            maxWidth: 500,
            display: { xs: 'none', md: 'block' }
          }}
        >
          <Box
            sx={{
              position: 'relative',
              borderRadius: 3,
              backgroundColor: alpha('#000', 0.05),
              '&:hover': {
                backgroundColor: alpha('#000', 0.08),
              },
              width: '100%',
            }}
          >
            <Box
              sx={{
                padding: '0 16px',
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </Box>
            <InputBase
              placeholder="Buscar lugares, restaurantes..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                color: 'inherit',
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: '12px 16px 12px 48px',
                  transition: 'width 0.3s',
                },
              }}
            />
          </Box>
        </Box>

        {/* Acciones del usuario */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Búsqueda móvil */}
          <IconButton
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <SearchIcon />
          </IconButton>

          {isAuthenticated && user ? (
            <>
              {/* Selector de idioma */}
              <LanguageSwitcher />
              
              {/* Notificaciones */}
              <IconButton>
                <Badge badgeContent={2} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Menú de usuario */}
              <IconButton onClick={handleMenuOpen}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem'
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                sx={{
                  mt: 1,
                  '& .MuiPaper-root': {
                    minWidth: 200,
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {user.email}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    {user.role === 'admin' ? (
                      <AdminIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                    ) : (
                      <PersonIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                    )}
                    <Typography variant="caption" color="primary.main">
                      {user.role === 'admin' ? t('userRoles.admin') : t('userRoles.user')}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider />
                
                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{t('userMenu.viewProfile')}</ListItemText>
                </MenuItem>
                
                {user.role === 'admin' && (
                  <MenuItem onClick={() => { navigate('/admin/places'); handleMenuClose(); }}>
                    <ListItemIcon>
                      <AdminIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('userMenu.adminPanel')}</ListItemText>
                  </MenuItem>
                )}
                
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{t('userMenu.settings')}</ListItemText>
                </MenuItem>
                
                <Divider />
                
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText>{t('navigation.logout')}</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            /* Botones para usuarios no autenticados */
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleLoginClick}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                {t('navigation.login')}
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleRegisterClick}
              >
                {t('navigation.register')}
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
