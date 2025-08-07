import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Avatar, Button, Stack } from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Place as PlaceIcon,
  BarChart as BarChartIcon,
  Logout as LogoutIcon,
  People as PeopleIcon,
  RateReview as ReviewIcon,
  History as HistoryIcon,
  Settings as SettingsIcon

} from '@mui/icons-material'
import { useAuth } from '../../hooks/useAuth'
import AdminNotifications from './AdminNotifications'

interface AdminLayoutProps {
  children: React.ReactNode
}

const drawerWidth = 260

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Lugares', icon: <PlaceIcon />, path: '/admin/places' },
    { text: 'Usuarios', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Reseñas', icon: <ReviewIcon />, path: '/admin/reviews' },
    { text: 'Estadísticas', icon: <BarChartIcon />, path: '/admin/stats' },
    { text: 'Auditoría', icon: <HistoryIcon />, path: '/admin/audit' },
    { text: 'Configuración', icon: <SettingsIcon />, path: '/admin/settings' },
  ]

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>{user?.name?.charAt(0).toUpperCase() || 'A'}</Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight={700}>Admin</Typography>
          <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
        </Box>
      </Box>
      <Divider />

      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <ListItem 
              key={item.text} 
              onClick={() => navigate(item.path)} 
              sx={{ 
                cursor: 'pointer', 
                borderRadius: 1, 
                mx: 1, 
                my: 0.25, 
                bgcolor: isActive ? 'rgba(25,118,210,0.08)' : 'transparent',
                '&:hover': { bgcolor: isActive ? 'rgba(25,118,210,0.12)' : 'rgba(0,0,0,0.04)' }
              }}
            >
              <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }}
              />
            </ListItem>
          )
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button 
          variant="outlined" 
          fullWidth 
          startIcon={<LogoutIcon />} 
          onClick={async () => { await logout(); navigate('/login') }}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <AppBar 
        position="fixed" 
        sx={{ bgcolor: 'background.paper', color: 'text.primary', boxShadow: 1 }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            sx={{ fontWeight: 800, color: 'primary.main', cursor: 'pointer', flexGrow: 1 }}
            onClick={() => navigate('/admin')}
          >
            Japasea Admin
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <AdminNotifications />
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Drawer móvil */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>

        {/* Drawer desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 2, pt: 10 }}>
        {children}
      </Box>
    </Box>
  )
}


