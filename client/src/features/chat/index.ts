// Main chat interface component
export { ChatInterface } from './components/ChatInterface'

// Chat page component
export { ChatPage } from './pages/ChatPage'

// Individual components for custom usage
export { MessageList } from './components/MessageList'
export { MessageItem } from './components/MessageItem'
export { MessageInput } from './components/MessageInput'
export { TravelPlanDisplay } from './components/TravelPlanDisplay'

// Hooks
export { useChat } from './hooks/useChat'
export { useChatHistory } from './hooks/useChatHistory'
export { useAutoScroll } from './hooks/useAutoScroll'

// Services
export { chatService } from './services/chatService'

// Types
export type {
  Message,
  ChatSession,
  ChatState,
  TravelPlan,
  MessageItemProps,
  MessageListProps,
  MessageInputProps
} from './types/chat.types'
