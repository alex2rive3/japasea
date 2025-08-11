import { 
  ProcessChatDto, 
  GetChatHistoryDto, 
  GetChatSessionDto 
} from '../../application/dtos/request.dto';

import {
  ProcessChatResponseDto,
  ChatHistoryResponseDto,
  ChatSessionResponseDto
} from '../../application/dtos/response.dto';

export interface ProcessChatUseCase {
  execute(userId: string, data: ProcessChatDto): Promise<ProcessChatResponseDto>;
}

export interface GetUserChatHistoryUseCase {
  execute(userId: string, data: GetChatHistoryDto): Promise<ChatHistoryResponseDto[]>;
}

export interface GetChatSessionUseCase {
  execute(userId: string, data: GetChatSessionDto): Promise<ChatSessionResponseDto>;
}
