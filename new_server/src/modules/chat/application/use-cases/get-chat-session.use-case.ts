import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { GetChatSessionUseCase } from '../../domain/interfaces/chat.use-cases';
import { GetChatSessionDto } from '../dtos/request.dto';
import { ChatSessionResponseDto, ChatMessageResponseDto } from '../dtos/response.dto';

@Injectable()
export class GetChatSessionUseCaseImpl implements GetChatSessionUseCase {
  constructor(
    @Inject('ChatHistoryRepository') private readonly chatHistoryRepository: any,
  ) {}

  async execute(userId: string, data: GetChatSessionDto): Promise<ChatSessionResponseDto> {
    const session = await this.chatHistoryRepository.findByUserAndSession(userId, data.sessionId);
    
    if (!session) {
      throw new NotFoundException('Sesión de chat no encontrada');
    }
    
    return {
      success: true,
      sessionId: session.sessionId,
      lastActivity: session.lastActivity.toISOString(),
      messages: session.messages.map((msg: any): ChatMessageResponseDto => ({
        text: msg.text,
        sender: msg.sender,
        timestamp: msg.timestamp.toISOString(),
        context: msg.context,
        response: msg.response
      }))
    };
  }
}
