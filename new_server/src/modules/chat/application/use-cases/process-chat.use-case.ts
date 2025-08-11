import { Injectable, Inject } from '@nestjs/common';
import { ProcessChatUseCase } from '../../domain/interfaces/chat.use-cases';
import { ProcessChatDto } from '../dtos/request.dto';
import { ProcessChatResponseDto } from '../dtos/response.dto';

@Injectable()
export class ProcessChatUseCaseImpl implements ProcessChatUseCase {
  constructor(
    @Inject('ChatHistoryRepository') private readonly chatHistoryRepository: any,
    @Inject('GoogleAIService') private readonly googleAIService: any,
  ) {}

  async execute(userId: string, data: ProcessChatDto): Promise<ProcessChatResponseDto> {
    const sessionId = data.sessionId || `session-${Date.now()}`;
    
    try {
      // Obtener o crear sesión de chat
      const chatHistory = await this.chatHistoryRepository.findOrCreateSession(userId, sessionId);
      
      // Agregar mensaje del usuario
      const userMessage = {
        text: data.message,
        sender: 'user' as const,
        timestamp: new Date(),
        context: data.context
      };
      
      await this.chatHistoryRepository.addMessage(chatHistory, userMessage);
      
      // Procesar mensaje con Google AI
      const aiResponse = await this.googleAIService.processMessage(data.message, data.context);
      
      // Agregar respuesta del bot
      const botMessage = {
        text: aiResponse.message,
        sender: 'bot' as const,
        timestamp: new Date(),
        response: {
          message: aiResponse.message,
          places: aiResponse.places,
          travelPlan: aiResponse.travelPlan
        }
      };
      
      await this.chatHistoryRepository.addMessage(chatHistory, botMessage);
      
      return {
        success: true,
        message: aiResponse.message,
        sessionId,
        response: {
          message: aiResponse.message,
          places: aiResponse.places,
          travelPlan: aiResponse.travelPlan
        },
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Error processing chat:', error);
      throw error;
    }
  }
}
