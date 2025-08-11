import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Patch, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Request,
  HttpStatus,
  BadRequestException,
  Inject
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Public, Roles, CurrentUser, UserRole } from '../../../shared';

// Tokens
import {
  CREATE_PLACE_USE_CASE,
  FIND_ALL_PLACES_USE_CASE,
  FIND_PLACE_BY_ID_USE_CASE,
  SEARCH_PLACES_USE_CASE,
  GET_RANDOM_PLACES_USE_CASE,
  ENSURE_PLACE_USE_CASE,
  UPDATE_PLACE_USE_CASE,
  SOFT_DELETE_PLACE_USE_CASE,
  PROCESS_CHAT_USE_CASE,
  GET_CHAT_HISTORY_USE_CASE,
  GET_CHAT_SESSION_USE_CASE
} from '../tokens';

// Use Cases interfaces
import { CreatePlaceUseCase } from '../domain/interfaces/place-use-cases.interface';
import { FindAllPlacesUseCase } from '../domain/interfaces/place-use-cases.interface';
import { FindPlaceByIdUseCase } from '../domain/interfaces/place-use-cases.interface';
import { SearchPlacesUseCase } from '../domain/interfaces/place-use-cases.interface';
import { GetRandomPlacesUseCase } from '../domain/interfaces/place-use-cases.interface';
import { EnsurePlaceUseCase } from '../domain/interfaces/place-use-cases.interface';
import { UpdatePlaceUseCase } from '../domain/interfaces/place-use-cases.interface';
import { SoftDeletePlaceUseCase } from '../domain/interfaces/place-use-cases.interface';
import { ProcessChatUseCase } from '../domain/interfaces/place-use-cases.interface';
import { GetChatHistoryUseCase } from '../domain/interfaces/place-use-cases.interface';
import { GetChatSessionUseCase } from '../domain/interfaces/place-use-cases.interface';

// DTOs
import { CreatePlaceRequestDto } from '../application/dtos/request/create-place.request.dto';
import { UpdatePlaceRequestDto } from '../application/dtos/request/update-place.request.dto';
import { SoftDeletePlaceRequestDto } from '../application/dtos/request/soft-delete-place.request.dto';
import { ProcessChatRequestDto } from '../application/dtos/request/process-chat.request.dto';
import { PlaceResponseDto } from '../application/dtos/response/place-response.dto';

@ApiTags('Places')
@Controller('places')
export class PlacesController {
  constructor(
    @Inject(CREATE_PLACE_USE_CASE) private readonly createPlaceUseCase: CreatePlaceUseCase,
    @Inject(FIND_ALL_PLACES_USE_CASE) private readonly findAllPlacesUseCase: FindAllPlacesUseCase,
    @Inject(FIND_PLACE_BY_ID_USE_CASE) private readonly findPlaceByIdUseCase: FindPlaceByIdUseCase,
    @Inject(SEARCH_PLACES_USE_CASE) private readonly searchPlacesUseCase: SearchPlacesUseCase,
    @Inject(GET_RANDOM_PLACES_USE_CASE) private readonly getRandomPlacesUseCase: GetRandomPlacesUseCase,
    @Inject(ENSURE_PLACE_USE_CASE) private readonly ensurePlaceUseCase: EnsurePlaceUseCase,
    @Inject(UPDATE_PLACE_USE_CASE) private readonly updatePlaceUseCase: UpdatePlaceUseCase,
    @Inject(SOFT_DELETE_PLACE_USE_CASE) private readonly softDeletePlaceUseCase: SoftDeletePlaceUseCase,
    @Inject(PROCESS_CHAT_USE_CASE) private readonly processChatUseCase: ProcessChatUseCase,
    @Inject(GET_CHAT_HISTORY_USE_CASE) private readonly getChatHistoryUseCase: GetChatHistoryUseCase,
    @Inject(GET_CHAT_SESSION_USE_CASE) private readonly getChatSessionUseCase: GetChatSessionUseCase,
  ) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all places' })
  @ApiResponse({ status: 200, description: 'Success', type: [PlaceResponseDto] })
  async getPlaces(@Query('type') type?: string): Promise<PlaceResponseDto[]> {
    return this.findAllPlacesUseCase.execute(type);
  }

  @Get('search')
  @Public()
  @ApiOperation({ summary: 'Search places' })
  @ApiResponse({ status: 200, description: 'Success', type: [PlaceResponseDto] })
  async searchPlaces(@Query('q') query: string): Promise<PlaceResponseDto[]> {
    if (!query) {
      throw new BadRequestException('El parámetro de consulta "q" es requerido');
    }
    return this.searchPlacesUseCase.execute(query);
  }

  @Get('random')
  @Public()
  @ApiOperation({ summary: 'Get random places' })
  @ApiResponse({ status: 200, description: 'Success', type: [PlaceResponseDto] })
  async getRandomPlaces(@Query('count') count?: string): Promise<PlaceResponseDto[]> {
    const numPlaces = count ? parseInt(count) : 3;
    return this.getRandomPlacesUseCase.execute(numPlaces);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get place by ID' })
  @ApiResponse({ status: 200, description: 'Success', type: PlaceResponseDto })
  @ApiResponse({ status: 404, description: 'Place not found' })
  async getPlaceById(@Param('id') id: string): Promise<{ success: boolean; data: PlaceResponseDto }> {
    const place = await this.findPlaceByIdUseCase.execute(id);
    return { success: true, data: place };
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new place' })
  @ApiResponse({ status: 201, description: 'Place created successfully', type: PlaceResponseDto })
  @ApiResponse({ status: 409, description: 'Place already exists' })
  async createPlace(@Body() createPlaceDto: CreatePlaceRequestDto): Promise<PlaceResponseDto> {
    return this.createPlaceUseCase.execute(createPlaceDto);
  }

  @Post('ensure')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Ensure place exists or create minimal place' })
  @ApiResponse({ status: 200, description: 'Place found or created', type: PlaceResponseDto })
  @ApiResponse({ status: 201, description: 'Place created', type: PlaceResponseDto })
  async ensurePlace(@Body() placeData: any): Promise<{ success: boolean; data: PlaceResponseDto }> {
    const place = await this.ensurePlaceUseCase.execute(placeData);
    return { success: true, data: place };
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update place' })
  @ApiResponse({ status: 200, description: 'Place updated successfully', type: PlaceResponseDto })
  @ApiResponse({ status: 404, description: 'Place not found' })
  async updatePlace(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceRequestDto
  ): Promise<PlaceResponseDto> {
    return this.updatePlaceUseCase.execute(id, updatePlaceDto);
  }

  @Patch(':id/soft-delete')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Soft delete place' })
  @ApiResponse({ status: 200, description: 'Place soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'Place not found' })
  async softDeletePlace(
    @Param('id') id: string,
    @Body() softDeleteDto: SoftDeletePlaceRequestDto
  ): Promise<{ success: boolean; message: string }> {
    return this.softDeletePlaceUseCase.execute(id, softDeleteDto);
  }

  @Post('chat')
  @Public()
  @ApiOperation({ summary: 'Process chat message for place recommendations' })
  @ApiResponse({ status: 200, description: 'Chat processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async processChat(
    @Body() body: ProcessChatRequestDto,
    @Request() req?: any
  ): Promise<any> {
    const { message, context, sessionId } = body;
    const userId = req?.user?._id;
    
    return this.processChatUseCase.execute(message, context, sessionId, userId);
  }

  @Get('chat/history')
  @ApiOperation({ summary: 'Get user chat history' })
  @ApiResponse({ status: 200, description: 'Chat history retrieved successfully' })
  @ApiResponse({ status: 401, description: 'User not authenticated' })
  @ApiBearerAuth()
  async getChatHistory(
    @CurrentUser() user: any,
    @Query('limit') limit?: string
  ): Promise<{ status: string; data: any[] }> {
    const limitNum = limit ? parseInt(limit) : 10;
    const history = await this.getChatHistoryUseCase.execute(user._id, limitNum);
    
    return {
      status: 'success',
      data: history
    };
  }

  @Get('chat/session/:sessionId')
  @ApiOperation({ summary: 'Get specific chat session' })
  @ApiResponse({ status: 200, description: 'Chat session retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Chat session not found' })
  @ApiResponse({ status: 401, description: 'User not authenticated' })
  @ApiBearerAuth()
  async getChatSession(
    @CurrentUser() user: any,
    @Param('sessionId') sessionId: string
  ): Promise<{ status: string; data: any }> {
    const session = await this.getChatSessionUseCase.execute(user._id, sessionId);
    
    if (!session) {
      throw new BadRequestException('Sesión de chat no encontrada');
    }

    return {
      status: 'success',
      data: session
    };
  }
}
