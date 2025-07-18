import { useState } from 'react'
import { MapComponent } from './components/MapComponent'
import { ChatComponent } from './components/ChatComponent'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
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
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
        <Navbar 
          onSearch={handleSearch}
          onProfileClick={handleProfileClick}
          onNotificationClick={handleNotificationClick}
        />
        <Box sx={{ display: 'flex', flex: 1, pt: 8, width: '100vw' }}>
          <Sidebar>
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              flexDirection: { xs: 'column', md: 'row' },
              height: 'calc(100vh - 64px)',
              width: '100%',
              overflow: 'hidden',
              p: 1
            }}>
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
          </Sidebar>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
