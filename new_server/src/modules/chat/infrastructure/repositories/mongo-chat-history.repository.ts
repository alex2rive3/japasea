import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatHistory, ChatHistoryDocument } from '../../domain/entities/chat-history.entity';
import { ChatHistoryRepository } from '../../domain/interfaces/repositories';

@Injectable()
export class MongoChatHistoryRepository implements ChatHistoryRepository {
  constructor(
    @InjectModel(ChatHistory.name) private chatHistoryModel: Model<ChatHistoryDocument>,
  ) {}

  async findOrCreateSession(userId: string, sessionId: string): Promise<ChatHistory> {
    let history = await this.chatHistoryModel.findOne({ 
      user: userId, 
      sessionId: sessionId 
    });

    if (!history) {
      history = await this.chatHistoryModel.create({
        user: userId,
        sessionId: sessionId,
        messages: [],
        lastActivity: new Date()
      });
    }

    return history;
  }

  async getUserHistory(userId: string, limit: number): Promise<ChatHistory[]> {
    return this.chatHistoryModel
      .find({ user: userId })
      .sort({ lastActivity: -1 })
      .limit(limit)
      .select('sessionId lastActivity messages')
      .lean();
  }

  async findByUserAndSession(userId: string, sessionId: string): Promise<ChatHistory | null> {
    return this.chatHistoryModel.findOne({ 
      user: userId, 
      sessionId: sessionId 
    }).lean();
  }

  async addMessage(chatHistory: ChatHistory, messageData: any): Promise<ChatHistory> {
    return this.chatHistoryModel.findByIdAndUpdate(
      chatHistory._id,
      {
        $push: { messages: messageData },
        $set: { lastActivity: new Date() }
      },
      { new: true }
    );
  }
}
