import { 
  Controller, 
  Get, 
  Post,
  Param, 
  Body, 
  Query,
  UseGuards,
  Inject
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Public, CurrentUser } from '../../../shared';

import {
  ProcessChatDto,
  GetChatHistoryDto,
  GetChatSessionDto
} from '../application/dtos/request.dto';

import {
  ProcessChatResponseDto,
  ChatHistoryResponseDto,
  ChatSessionResponseDto
} from '../application/dtos/response.dto';

import {
  ProcessChatUseCase,
  GetUserChatHistoryUseCase,
  GetChatSessionUseCase
} from '../domain/interfaces/chat.use-cases';

@ApiTags('chat')
@ApiBearerAuth()
@Controller('api/chat')
export class ChatController {
  constructor(
    @Inject('ProcessChatUseCase') private readonly processChatUseCase: ProcessChatUseCase,
    @Inject('GetUserChatHistoryUseCase') private readonly getUserChatHistoryUseCase: GetUserChatHistoryUseCase,
    @Inject('GetChatSessionUseCase') private readonly getChatSessionUseCase: GetChatSessionUseCase,
  ) {}

  @Post('process')
  @Public()
  @ApiOperation({ summary: 'Procesar mensaje de chat con AI' })
  @ApiResponse({ status: 200, description: 'Mensaje procesado correctamente', type: ProcessChatResponseDto })
  async processChat(
    @Body() processChatDto: ProcessChatDto,
  ): Promise<ProcessChatResponseDto> {
    const userId = 'anonymous'; // Chat público para usuarios no autenticados
    return this.processChatUseCase.execute(userId, processChatDto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Obtener historial de chat del usuario' })
  @ApiResponse({ status: 200, description: 'Historial obtenido correctamente', type: [ChatHistoryResponseDto] })
  async getChatHistory(
    @CurrentUser() user: any,
    @Query() getChatHistoryDto: GetChatHistoryDto,
  ): Promise<{ success: boolean; data: ChatHistoryResponseDto[] }> {
    const history = await this.getUserChatHistoryUseCase.execute(user.id, getChatHistoryDto);
    
    return {
      success: true,
      data: history
    };
  }

  @Get('session/:sessionId')
  @ApiOperation({ summary: 'Obtener sesión específica de chat' })
  @ApiResponse({ status: 200, description: 'Sesión obtenida correctamente', type: ChatSessionResponseDto })
  async getChatSession(
    @CurrentUser() user: any,
    @Param('sessionId') sessionId: string,
  ): Promise<ChatSessionResponseDto> {
    return this.getChatSessionUseCase.execute(user.id, { sessionId });
  }
}
