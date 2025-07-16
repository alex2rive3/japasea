import { useState } from 'react'
import { MapComponent } from './components/MapComponent'
import { ChatComponent } from './components/ChatComponent'
import { LugaresCards } from './components/LugaresCards'
import { Sidebar } from './components/Sidebar'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { Box } from '@mui/material'
import { theme } from './theme'
import type { Lugar } from './types/lugares'

function App() {
  const [lugares, setLugares] = useState<Lugar[]>([])

  const handleLugaresUpdate = (newLugares: Lugar[]) => {
    setLugares(newLugares)
  }

  const handleLocationClick = (lugar: Lugar) => {
    // Opcional: hacer scroll al mapa o alguna acción específica
    console.log('Clicked on location:', lugar.key)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Sidebar>
        {/* Layout principal */}
        <Box sx={{ 
          display: 'flex', 
          gap: 3,
          flexDirection: { xs: 'column', md: 'row' },
          height: 'auto',
        }}>
          {/* Chat Component */}
          <Box sx={{ flex: 1 }}>
            <ChatComponent 
              height="calc(100vh - 120px)" 
              onLugaresUpdate={handleLugaresUpdate}
            />
          </Box>
          
          {/* Map Component */}
          <Box sx={{ flex: 1 }}>
            <MapComponent 
              height="calc(100vh - 120px)"
              lugares={lugares}
            />
          </Box>
        </Box>
        
        {/* Lugares Cards - Mostrar solo si hay lugares */}
        {lugares.length > 0 && (
          <LugaresCards 
            lugares={lugares}
            onLocationClick={handleLocationClick}
          />
        )}
      </Sidebar>
    </ThemeProvider>
  )
}

export default App
