import { apiClient } from '../../../shared/api';
import type { 
  ChatMessage,
  ChatSession,
  SendMessageRequest,
  CreateSessionRequest,
  UpdateSessionRequest,
  DeleteSessionRequest,
  GetMessagesRequest,
  GetSessionsRequest
} from '../types';

// Interfaces for the new server API
interface ProcessChatRequest {
  message: string;
  sessionId?: string;
  context?: string;
}

interface ProcessChatResponse {
  success: boolean;
  message: string;
  sessionId: string;
  response: {
    message: string;
    places?: any[];
    travelPlan?: any;
  };
  timestamp: string;
}

interface ChatHistoryResponse {
  success: boolean;
  data: Array<{
    sessionId: string;
    lastActivity: string;
    messages: Array<{
      text: string;
      sender: 'user' | 'bot';
      timestamp: string;
      context?: string;
      response?: {
        message?: string;
        places?: any[];
        travelPlan?: any;
      };
    }>;
  }>;
}

class ChatService {
  private readonly baseUrl = '/api/v1/chat';

  async sendMessage(data: SendMessageRequest): Promise<{ message: ChatMessage; sessionId: string }> {
    const request: ProcessChatRequest = {
      message: data.content,
      sessionId: data.sessionId
    };

    const response = await apiClient.post<ProcessChatResponse>(`${this.baseUrl}/process`, request);
    
    // Transform server response to match client expectations
    const assistantMessage: ChatMessage = {
      id: `${Date.now()}-assistant`,
      content: response.data.response.message,
      role: 'assistant',
      timestamp: response.data.timestamp,
      status: 'sent'
    };

    return {
      message: assistantMessage,
      sessionId: response.data.sessionId
    };
  }

  async getMessages(params: GetMessagesRequest): Promise<{ messages: ChatMessage[]; total: number; page: number; limit: number }> {
    // For now, return empty messages as this endpoint doesn't exist in new server
    // This can be implemented later when the server supports session message history
    return {
      messages: [],
      total: 0,
      page: params.page || 1,
      limit: params.limit || 20
    };
  }

  async createSession(data: CreateSessionRequest = {}): Promise<ChatSession> {
    // Create a local session ID for now since the server doesn't have dedicated session creation
    const session: ChatSession = {
      id: `session-${Date.now()}`,
      title: data.title || 'Nueva conversación',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
      lastMessage: ''
    };
    
    return session;
  }

  async getSessions(params: GetSessionsRequest = {}): Promise<{ sessions: ChatSession[]; total: number; page: number; limit: number }> {
    try {
      // Try to get chat history from server
      const response = await apiClient.get<ChatHistoryResponse>(`${this.baseUrl}/history?limit=${params.limit || 10}`);
      
      if (response.data.success) {
        const sessions: ChatSession[] = response.data.data.map(item => ({
          id: item.sessionId,
          title: 'Conversación',
          createdAt: item.lastActivity,
          updatedAt: item.lastActivity,
          messageCount: item.messages.length,
          lastMessage: item.messages[item.messages.length - 1]?.text || ''
        }));
        
        return {
          sessions,
          total: sessions.length,
          page: params.page || 1,
          limit: params.limit || 10
        };
      }
    } catch (error) {
      console.log('No authenticated user or no history available');
    }
    
    // Return empty sessions if not authenticated or no history
    return {
      sessions: [],
      total: 0,
      page: params.page || 1,
      limit: params.limit || 10
    };
  }

  async getSession(sessionId: string): Promise<ChatSession> {
    // For now, return a basic session structure
    return {
      id: sessionId,
      title: 'Conversación',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
      lastMessage: ''
    };
  }

  async updateSession(data: UpdateSessionRequest): Promise<ChatSession> {
    // For now, return the updated session without server call
    return {
      id: data.sessionId,
      title: data.title || 'Conversación',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
      lastMessage: ''
    };
  }

  async deleteSession(data: DeleteSessionRequest): Promise<void> {
    // For now, just log the deletion (server doesn't have this endpoint yet)
    console.log(`Deleting session: ${data.sessionId}`);
  }

  async clearSession(sessionId: string): Promise<void> {
    // For now, just log the clearing (server doesn't have this endpoint yet)
    console.log(`Clearing session: ${sessionId}`);
  }

  async exportSession(sessionId: string): Promise<ChatMessage[]> {
    // For now, return empty array
    return [];
  }

  async getSessionStats(sessionId: string): Promise<{ messageCount: number; firstMessage: string; lastMessage: string }> {
    return {
      messageCount: 0,
      firstMessage: '',
      lastMessage: ''
    };
  }
}

export const chatService = new ChatService();
