import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatController } from './controllers/chat.controller';

import { ChatHistoryRepositoryImpl } from './infrastructure/repositories/chat-history.repository';
import { GoogleAIService } from './infrastructure/services/google-ai.service';

import { ChatHistory, ChatHistorySchema } from './domain/entities/chat-history.entity';
import { ProcessChatUseCaseImpl } from './application/use-cases/process-chat.use-case';
import { GetUserChatHistoryUseCaseImpl } from './application/use-cases/get-user-chat-history.use-case';
import { GetChatSessionUseCaseImpl } from './application/use-cases/get-chat-session.use-case';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatHistory.name, schema: ChatHistorySchema }
    ]),
  ],
  controllers: [ChatController],
  providers: [
    // Services
    {
      provide: 'GoogleAIService',
      useClass: GoogleAIService,
    },
    
    // Repositories
    {
      provide: 'ChatHistoryRepository',
      useClass: ChatHistoryRepositoryImpl,
    },
    {
      provide: 'ProcessChatUseCase',
      useClass: ProcessChatUseCaseImpl,
    },
    {
      provide: 'GetUserChatHistoryUseCase',
      useClass: GetUserChatHistoryUseCaseImpl,
    },
    {
      provide: 'GetChatSessionUseCase',
      useClass: GetChatSessionUseCaseImpl,
    },
  ],
  exports: [
    'GoogleAIService',
    'ChatHistoryRepository',
    'ProcessChatUseCase',
    'GetUserChatHistoryUseCase',
    'GetChatSessionUseCase',
  ],
})
export class ChatModule {}
