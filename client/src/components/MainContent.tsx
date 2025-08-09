import { useState } from 'react'
import { MapComponent } from './MapComponent'
import { ChatComponent } from './ChatComponent'
import { Layout } from './Layout'
import type { Place } from '../types/places'

export function MainContent() {
  const [places, setPlaces] = useState<Place[]>([])

  const handlePlacesUpdate = (newPlaces: Place[]) => {
    setPlaces(newPlaces)
  }

  const handleSearch = (query: string) => {
    console.log('Searching for:', query)
  }



  const handleNotificationClick = () => {
    console.log('Notifications clicked')
  }

  return (
          <Layout 
        onSearch={handleSearch}
        onNotificationClick={handleNotificationClick}
      >
      <MapComponent places={places} />
      <ChatComponent onPlacesUpdate={handlePlacesUpdate} />
    </Layout>
  )
}
