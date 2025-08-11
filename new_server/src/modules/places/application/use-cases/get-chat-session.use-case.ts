import { Injectable } from '@nestjs/common';
import { GetChatSessionUseCase } from '../../domain/interfaces/place-use-cases.interface';

@Injectable()
export class GetChatSessionUseCaseImpl implements GetChatSessionUseCase {
  constructor(
    // TODO: Inyectar ChatHistoryRepository cuando esté migrado
  ) {}

  async execute(userId: string, sessionId: string): Promise<any> {
    // TODO: Implementar cuando tengamos el módulo ChatHistory migrado
    // Por ahora devolvemos null
    console.log(`Getting chat session ${sessionId} for user ${userId}`);
    return null;
  }
}
