import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material'
import {
  Home as HomeIcon,
  FavoriteBorder as WishlistIcon,
  AccountCircle as AccountCircleIcon,
  Add as AddIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { LayoutUtils } from '../../utils/layoutUtils'
import type { SidebarProps, MenuItem } from '../../types/layout.types'

export const Sidebar = ({ menuItems, onNavigate, currentPath }: SidebarProps) => {
  const navigate = useNavigate()
  
  // Default menu items with icons
  const defaultMenuItems: MenuItem[] = [
    { text: 'Inicio', icon: <HomeIcon />, path: '/' },
    { text: 'Favoritos', icon: <WishlistIcon />, path: '/favorites' },
    { text: 'Mi Perfil', icon: <AccountCircleIcon />, path: '/profile' }
  ]

  const items = menuItems.length > 0 ? menuItems : defaultMenuItems

  const handleItemClick = (path: string) => {
    onNavigate(path)
  }

  const handleQuickAction = () => {
    navigate('/favorites')
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, py: 1, mt: { xs: 0, md: 8 } }}>
        <List sx={{ px: 1 }}>
          {items.map((item) => {
            const isActive = LayoutUtils.isActiveMenuItem(currentPath, item.path)
            return (
              <ListItem 
                key={item.text} 
                onClick={() => handleItemClick(item.path)}
                sx={LayoutUtils.createMenuItemStyle(isActive)}
              >
                <ListItemIcon 
                  sx={LayoutUtils.createMenuItemIconStyle(isActive)}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={LayoutUtils.createMenuItemTextStyle(isActive)}
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
          startIcon={<AddIcon />}
          onClick={handleQuickAction}
          sx={{
            borderRadius: 2,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem'
          }}
        >
          Ver Favoritos
        </Button>
      </Box>
    </Box>
  )
}
