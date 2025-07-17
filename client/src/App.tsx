import { useState } from 'react'
import { MapComponent } from './components/MapComponent'
import { ChatComponent } from './components/ChatComponent'
import { PlaceCards } from './components/PlaceCards'
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

  const handleLocationClick = (place: Place) => {
    console.log('Clicked on location:', place.key)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Sidebar>
        <Box sx={{ 
          display: 'flex', 
          gap: 3,
          flexDirection: { xs: 'column', md: 'row' },
          height: 'auto',
        }}>
          <Box sx={{ flex: 1 }}>
            <ChatComponent 
              height="calc(100vh - 120px)" 
              onPlacesUpdate={handlePlacesUpdate}
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <MapComponent 
              height="calc(100vh - 120px)"
              places={places}
            />
          </Box>
        </Box>
        
        {places.length > 0 && (
          <PlaceCards 
            places={places}
            onLocationClick={handleLocationClick}
          />
        )}
      </Sidebar>
    </ThemeProvider>
  )
}

export default App
