// Temporary migration component to maintain compatibility
// This allows dropping-in ChatInterface as a replacement for ChatComponent
import { ChatInterface } from '../features/chat'
import type { Place } from '../types/lugares'

interface ChatComponentProps {
  onPlacesUpdate?: (places: Place[]) => void
}

export const ChatComponentNew = ({ onPlacesUpdate }: ChatComponentProps) => {
  return <ChatInterface onPlacesUpdate={onPlacesUpdate} />
}
