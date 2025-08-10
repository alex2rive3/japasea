import type { Place } from '../../../types/lugares'

// Define TravelPlan interface locally since it's not exported
export interface TravelPlan {
  id: string
  title: string
  description: string
  places: Place[]
  duration: string
  budget?: string
  recommendations?: string[]
}

export interface Message {
  id: string
  text: string
  type: 'user' | 'bot'
  timestamp: Date
  user: string
  sessionId?: string
}

export interface ChatSession {
  id: string
  messages: Message[]
  lastActivity: Date
  userId?: string
}

export interface ChatState {
  messages: Message[]
  sessionId: string
  botTyping: boolean
  inputValue: string
}

export interface MessageItemProps {
  message: Message
}

export interface MessageListProps {
  messages: Message[]
  loading?: boolean
  containerRef?: React.RefObject<HTMLDivElement | null>
}

export interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
  placeholder?: string
}

export interface ChatComponentProps {
  onPlacesUpdate?: (places: Place[]) => void
}

export interface TypingIndicatorProps {
  show: boolean
}
