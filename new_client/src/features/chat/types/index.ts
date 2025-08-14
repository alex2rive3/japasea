export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  status: 'sending' | 'sent' | 'error';
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  sessions: ChatSession[];
  currentSessionId: string | null;
  loading: boolean;
  error: string | null;
  isTyping: boolean;
}

export interface SendMessageRequest {
  content: string;
  sessionId?: string;
}

export interface CreateSessionRequest {
  title?: string;
}

export interface UpdateSessionRequest {
  sessionId: string;
  title?: string;
}

export interface DeleteSessionRequest {
  sessionId: string;
}

export interface GetMessagesRequest {
  sessionId: string;
  page?: number;
  limit?: number;
}

export interface GetSessionsRequest {
  page?: number;
  limit?: number;
}

export interface ChatResponse {
  message: ChatMessage;
  sessionId: string;
}

export interface SessionsResponse {
  sessions: ChatSession[];
  total: number;
  page: number;
  limit: number;
}

export interface MessagesResponse {
  messages: ChatMessage[];
  total: number;
  page: number;
  limit: number;
}
