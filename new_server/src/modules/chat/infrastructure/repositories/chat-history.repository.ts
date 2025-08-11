import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatHistory } from '../../domain/entities/chat-history.entity';
import { ChatHistoryRepository } from '../../domain/interfaces/chat-history.repository';


@Injectable()
export class ChatHistoryRepositoryImpl implements ChatHistoryRepository {
  constructor(
    @InjectModel(ChatHistory.name) private chatHistoryModel: Model<ChatHistory>,
  ) {}
  create(data: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async save(chatHistory: ChatHistory): Promise<ChatHistory> {
    const createdChatHistory = new this.chatHistoryModel(chatHistory);
    return createdChatHistory.save();
  }

  async findBySessionId(sessionId: string): Promise<ChatHistory | null> {
    return this.chatHistoryModel.findOne({ sessionId }).exec();
  }

  async findByUserId(userId: string, limit?: number): Promise<ChatHistory[]> {
    const query = this.chatHistoryModel.find({ userId });
    
    if (limit) {
      query.limit(limit);
    }
    
    return query.sort({ createdAt: -1 }).exec();
  }

  async update(sessionId: string, chatHistory: Partial<ChatHistory>): Promise<ChatHistory | null> {
    return this.chatHistoryModel
      .findOneAndUpdate(
        { sessionId },
        { 
          ...chatHistory,
          updatedAt: new Date()
        },
        { new: true }
      )
      .exec();
  }

  async delete(sessionId: string): Promise<boolean> {
    const result = await this.chatHistoryModel.deleteOne({ sessionId }).exec();
    return result.deletedCount > 0;
  }

  async deleteByUserId(userId: string): Promise<number> {
    const result = await this.chatHistoryModel.deleteMany({ userId }).exec();
    return result.deletedCount;
  }

  async findUserSessions(userId: string, limit?: number, offset?: number): Promise<ChatHistory[]> {
    const query = this.chatHistoryModel.find({ userId });
    
    if (offset) {
      query.skip(offset);
    }
    
    if (limit) {
      query.limit(limit);
    }
    
    return query.sort({ lastActivity: -1 }).exec();
  }

  async updateLastActivity(sessionId: string): Promise<void> {
    await this.chatHistoryModel
      .updateOne(
        { sessionId },
        { lastActivity: new Date() }
      )
      .exec();
  }
}
