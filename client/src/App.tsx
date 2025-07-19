import { useState } from 'react'
import { MapComponent } from './components/MapComponent'
import { ChatComponent } from './components/ChatComponent'
import { Layout } from './components/Layout'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { Box } from '@mui/material'
import { theme } from './theme'
import type { Place } from './types/places'

function App() {
  const [places, setPlaces] = useState<Place[]>([])

  const handlePlacesUpdate = (newPlaces: Place[]) => {
    setPlaces(newPlaces)
  }

  const handleSearch = (query: string) => {
    console.log('Searching for:', query)
  }

  const handleProfileClick = () => {
    console.log('Profile clicked')
  }

  const handleNotificationClick = () => {
    console.log('Notifications clicked')
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout
        onSearch={handleSearch}
        onProfileClick={handleProfileClick}
        onNotificationClick={handleNotificationClick}
      >
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexDirection: { xs: 'column', md: 'row' },
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          p: 1
        }}>
          {/* Chat Component - Left Half on desktop, top on mobile */}
          <Box sx={{ 
            flex: 1,
            minWidth: 0,
            minHeight: { xs: 0, md: 'auto' },
            overflow: 'hidden',
            borderRadius: 0,
            boxShadow: 'none',
            bgcolor: '#ffffff'
          }}>
            <ChatComponent 
              onPlacesUpdate={handlePlacesUpdate}
            />
          </Box>
          
          {/* Map Component - Right Half on desktop, bottom on mobile */}
          <Box sx={{ 
            flex: 1,
            minWidth: 0,
            minHeight: { xs: 0, md: 'auto' },
            overflow: 'hidden',
            borderRadius: 0,
            boxShadow: 'none',
            bgcolor: '#ffffff'
          }}>
            <MapComponent 
              places={places}
            />
          </Box>
        </Box>
      </Layout>
    </ThemeProvider>
  )
}

export default App
