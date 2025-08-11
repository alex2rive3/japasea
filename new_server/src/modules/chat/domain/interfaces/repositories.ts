import { ChatHistory } from '../entities/chat-history.entity';

export interface ChatHistoryRepository {
  findOrCreateSession(userId: string, sessionId: string): Promise<ChatHistory>;
  getUserHistory(userId: string, limit: number): Promise<ChatHistory[]>;
  findByUserAndSession(userId: string, sessionId: string): Promise<ChatHistory | null>;
  addMessage(chatHistory: ChatHistory, messageData: any): Promise<ChatHistory>;
}
