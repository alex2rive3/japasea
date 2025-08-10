import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Badge,
  Paper,
} from '@mui/material'
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material'
import { alpha } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

interface NavbarProps {
  onProfileClick?: () => void
  onNotificationClick?: () => void
  onSearch?: (query: string) => void
}

export const Navbar = ({ 
  onProfileClick, 
  onNotificationClick, 
  onSearch 
}: NavbarProps) => {
  const { t } = useTranslation('common')
  const [searchQuery, setSearchQuery] = useState('')

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

  return (
    <AppBar 
      position="fixed" 
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      elevation={0}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Logo/Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: 'primary.main',
              mr: 1.5,
              fontSize: '1rem'
            }}
          >
            S
          </Avatar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            {t('appName')}
          </Typography>
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
              placeholder={t('search.placeholder')}
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
  )
}
