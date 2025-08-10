import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider
} from '@mui/material'
import {
  Person as PersonIcon,
  Logout as LogoutIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useUserMenu } from '../../hooks/useUserMenu'
import { useAuth } from '../../../hooks/useAuth'
import { LayoutUtils } from '../../utils/layoutUtils'

interface UserMenuProps {
  user?: { name?: string; email?: string } | null
}

export const UserMenu = ({ user }: UserMenuProps) => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { anchorEl, open, handleOpen, handleClose } = useUserMenu()

  const handleViewProfile = async () => {
    navigate('/profile')
    handleClose()
  }

  const handleLogout = async () => {
    try {
      await logout()
      handleClose()
    } catch (error) {
      console.error('Error durante logout:', error)
    }
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
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
          {LayoutUtils.formatUserInitial(user?.name)}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 180,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleViewProfile}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Ver Perfil
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </Menu>
    </>
  )
}
