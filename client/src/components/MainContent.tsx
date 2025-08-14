import { Layout } from './Layout'
import { MapComponent } from '../features/places/components/MapComponent'
import { ChatComponent } from './ChatComponent'

export function MainContent() {
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
      <MapComponent />
      <ChatComponent />
    </Layout>
  )
}
