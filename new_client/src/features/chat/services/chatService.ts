import { apiClient } from '../../../shared/api';
import type { 
  ChatMessage,
  ChatSession,
  SendMessageRequest,
  CreateSessionRequest,
  UpdateSessionRequest,
  DeleteSessionRequest,
  GetMessagesRequest,
  GetSessionsRequest,
  ChatResponse,
  SessionsResponse,
  MessagesResponse
} from '../types';

class ChatService {
  private readonly baseUrl = '/api/chat';

  async sendMessage(data: SendMessageRequest): Promise<ChatResponse> {
    const response = await apiClient.post<ChatResponse>(`${this.baseUrl}/message`, data);
    return response.data;
  }

  async getMessages(params: GetMessagesRequest): Promise<MessagesResponse> {
    const { sessionId, ...otherParams } = params;
    const searchParams = new URLSearchParams();
    
    if (otherParams.page) searchParams.append('page', otherParams.page.toString());
    if (otherParams.limit) searchParams.append('limit', otherParams.limit.toString());

    const queryString = searchParams.toString();
    const url = queryString 
      ? `${this.baseUrl}/sessions/${sessionId}/messages?${queryString}` 
      : `${this.baseUrl}/sessions/${sessionId}/messages`;
    
    const response = await apiClient.get<MessagesResponse>(url);
    return response.data;
  }

  async createSession(data: CreateSessionRequest = {}): Promise<ChatSession> {
    const response = await apiClient.post<ChatSession>(`${this.baseUrl}/sessions`, data);
    return response.data;
  }

  async getSessions(params: GetSessionsRequest = {}): Promise<SessionsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const url = queryString ? `${this.baseUrl}/sessions?${queryString}` : `${this.baseUrl}/sessions`;
    
    const response = await apiClient.get<SessionsResponse>(url);
    return response.data;
  }

  async getSession(sessionId: string): Promise<ChatSession> {
    const response = await apiClient.get<ChatSession>(`${this.baseUrl}/sessions/${sessionId}`);
    return response.data;
  }

  async updateSession(data: UpdateSessionRequest): Promise<ChatSession> {
    const { sessionId, ...updateData } = data;
    const response = await apiClient.put<ChatSession>(`${this.baseUrl}/sessions/${sessionId}`, updateData);
    return response.data;
  }

  async deleteSession(data: DeleteSessionRequest): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/sessions/${data.sessionId}`);
  }

  async clearSession(sessionId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/sessions/${sessionId}/messages`);
  }

  async exportSession(sessionId: string): Promise<ChatMessage[]> {
    const response = await apiClient.get<ChatMessage[]>(`${this.baseUrl}/sessions/${sessionId}/export`);
    return response.data;
  }

  async getSessionStats(sessionId: string): Promise<{ messageCount: number; firstMessage: string; lastMessage: string }> {
    const response = await apiClient.get<{ messageCount: number; firstMessage: string; lastMessage: string }>(`${this.baseUrl}/sessions/${sessionId}/stats`);
    return response.data;
  }
}

export const chatService = new ChatService();
