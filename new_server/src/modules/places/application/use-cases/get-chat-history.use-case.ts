import { Injectable } from '@nestjs/common';
import { GetChatHistoryUseCase } from '../../domain/interfaces/place-use-cases.interface';

@Injectable()
export class GetChatHistoryUseCaseImpl implements GetChatHistoryUseCase {
  constructor(
    // TODO: Inyectar ChatHistoryRepository cuando esté migrado
  ) {}

  async execute(userId: string, limit: number = 10): Promise<any[]> {
    // TODO: Implementar cuando tengamos el módulo ChatHistory migrado
    // Por ahora devolvemos un array vacío
    console.log(`Getting chat history for user ${userId} with limit ${limit}`);
    return [];
  }
}
