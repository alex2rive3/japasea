import { Injectable, Inject } from '@nestjs/common';
import { GetUserChatHistoryUseCase } from '../../domain/interfaces/chat.use-cases';
import { GetChatHistoryDto } from '../dtos/request.dto';
import { ChatHistoryResponseDto, ChatMessageResponseDto } from '../dtos/response.dto';

@Injectable()
export class GetUserChatHistoryUseCaseImpl implements GetUserChatHistoryUseCase {
  constructor(
    @Inject('ChatHistoryRepository') private readonly chatHistoryRepository: any,
  ) {}

  async execute(userId: string, data: GetChatHistoryDto): Promise<ChatHistoryResponseDto[]> {
    const limit = data.limit || 10;
    const histories = await this.chatHistoryRepository.getUserHistory(userId, limit);
    
    return histories.map(history => ({
      sessionId: history.sessionId,
      lastActivity: history.lastActivity.toISOString(),
      messages: history.messages.map((msg: any): ChatMessageResponseDto => ({
        text: msg.text,
        sender: msg.sender,
        timestamp: msg.timestamp.toISOString(),
        context: msg.context,
        response: msg.response
      }))
    }));
  }
}
