import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  FavoriteBorder as WishlistIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Place as PlaceIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

interface LayoutProps {
  children: React.ReactNode;
  onNotificationClick?: () => void;
}

const drawerWidth = 260;

export const Layout = ({ 
  children,
  onNotificationClick
}: LayoutProps) => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktopOpen = true;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    { text: 'Inicio', icon: <HomeIcon />, path: '/' },
    { text: 'Lugares', icon: <PlaceIcon />, path: '/places' },
    { text: 'Favoritos', icon: <WishlistIcon />, path: '/favorites' },
  ];

  // Add admin item if user is admin
  if (user?.role === 'admin') {
    menuItems.push({ text: 'Admin', icon: <AdminIcon />, path: '/admin' });
  }

  const drawer = (
    <Box>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Avatar sx={{ mr: 2 }}>J</Avatar>
          <Box>Japasea</Box>
        </Box>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              cursor: 'pointer',
              backgroundColor: location.pathname === item.path ? alpha('#1976d2', 0.12) : 'transparent',
              '&:hover': {
                backgroundColor: alpha('#1976d2', 0.08),
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${desktopOpen ? drawerWidth : 0}px)` },
          ml: { sm: `${desktopOpen ? drawerWidth : 0}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <LanguageSwitcher />

          {user && (
            <>
              <IconButton color="inherit" onClick={onNotificationClick}>
                <Badge badgeContent={0} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <IconButton color="inherit" onClick={() => navigate('/profile')}>
                <AccountCircleIcon />
              </IconButton>

              <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                {t('logout')}
              </Button>
            </>
          )}

          {!user && (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                {t('login')}
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                {t('register')}
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="persistent"
          open={desktopOpen}
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${desktopOpen ? drawerWidth : 0}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
