import { 
  Controller, 
  Get, 
  Post, 
  Delete,
  Param, 
  Body, 
  UseGuards,
  Inject,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../../shared';

import {
  AddFavoriteDto,
  CheckMultipleFavoritesDto,
  SyncFavoritesDto
} from '../application/dtos/request.dto';

import {
  FavoriteResponseDto,
  FavoriteStatsResponseDto,
  CheckFavoriteResponseDto,
  SyncFavoritesResponseDto
} from '../application/dtos/response.dto';

import {
  GetUserFavoritesUseCase,
  AddFavoriteUseCase,
  RemoveFavoriteUseCase,
  CheckFavoriteUseCase,
  CheckMultipleFavoritesUseCase,
  GetFavoriteStatsUseCase,
  SyncFavoritesUseCase
} from '../domain/interfaces/favorites.use-cases';

@ApiTags('favorites')
@ApiBearerAuth()
@Controller('api/favorites')
export class FavoritesController {
  constructor(
    @Inject('GetUserFavoritesUseCase') private readonly getUserFavoritesUseCase: GetUserFavoritesUseCase,
    @Inject('AddFavoriteUseCase') private readonly addFavoriteUseCase: AddFavoriteUseCase,
    @Inject('RemoveFavoriteUseCase') private readonly removeFavoriteUseCase: RemoveFavoriteUseCase,
    @Inject('CheckFavoriteUseCase') private readonly checkFavoriteUseCase: CheckFavoriteUseCase,
    @Inject('CheckMultipleFavoritesUseCase') private readonly checkMultipleFavoritesUseCase: CheckMultipleFavoritesUseCase,
    @Inject('GetFavoriteStatsUseCase') private readonly getFavoriteStatsUseCase: GetFavoriteStatsUseCase,
    @Inject('SyncFavoritesUseCase') private readonly syncFavoritesUseCase: SyncFavoritesUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los favoritos del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de favoritos obtenida correctamente', type: [FavoriteResponseDto] })
  async getFavorites(
    @CurrentUser() user: any
  ): Promise<{ success: boolean; count: number; data: FavoriteResponseDto[] }> {
    const favorites = await this.getUserFavoritesUseCase.execute(user.id);
    
    return {
      success: true,
      count: favorites.length,
      data: favorites
    };
  }

  @Post(':placeId')
  @ApiOperation({ summary: 'Agregar un lugar a favoritos' })
  @ApiResponse({ status: 201, description: 'Lugar agregado a favoritos correctamente', type: FavoriteResponseDto })
  async addFavorite(
    @CurrentUser() user: any,
    @Param('placeId') placeId: string,
    @Body() addFavoriteDto: AddFavoriteDto,
  ): Promise<{ success: boolean; message: string; data: FavoriteResponseDto }> {
    const favorite = await this.addFavoriteUseCase.execute(user.id, { ...addFavoriteDto, placeId });
    
    return {
      success: true,
      message: 'Lugar agregado a favoritos',
      data: favorite
    };
  }

  @Delete(':placeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover un lugar de favoritos' })
  @ApiResponse({ status: 200, description: 'Lugar removido de favoritos correctamente' })
  async removeFavorite(
    @CurrentUser() user: any,
    @Param('placeId') placeId: string,
  ): Promise<{ success: boolean; message: string }> {
    await this.removeFavoriteUseCase.execute(user.id, placeId);
    
    return {
      success: true,
      message: 'Lugar removido de favoritos'
    };
  }

  @Get('check/:placeId')
  @ApiOperation({ summary: 'Verificar si un lugar está en favoritos' })
  @ApiResponse({ status: 200, description: 'Estado de favorito verificado', type: CheckFavoriteResponseDto })
  async checkFavorite(
    @CurrentUser() user: any,
    @Param('placeId') placeId: string,
  ): Promise<{ success: boolean; data: CheckFavoriteResponseDto }> {
    const result = await this.checkFavoriteUseCase.execute(user.id, placeId);
    
    return {
      success: true,
      data: result
    };
  }

  @Post('check/multiple')
  @ApiOperation({ summary: 'Verificar múltiples lugares en favoritos' })
  @ApiResponse({ status: 200, description: 'Estados de favoritos verificados' })
  async checkMultipleFavorites(
    @CurrentUser() user: any,
    @Body() checkMultipleFavoritesDto: CheckMultipleFavoritesDto,
  ): Promise<{ success: boolean; data: Record<string, boolean> }> {
    const result = await this.checkMultipleFavoritesUseCase.execute(user.id, checkMultipleFavoritesDto);
    
    return {
      success: true,
      data: result
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de favoritos del usuario' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas correctamente', type: FavoriteStatsResponseDto })
  async getFavoriteStats(
    @CurrentUser() user: any
  ): Promise<{ success: boolean; data: FavoriteStatsResponseDto }> {
    const stats = await this.getFavoriteStatsUseCase.execute(user.id);
    
    return {
      success: true,
      data: stats
    };
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sincronizar favoritos (agregar/remover múltiples)' })
  @ApiResponse({ status: 200, description: 'Favoritos sincronizados correctamente', type: SyncFavoritesResponseDto })
  async syncFavorites(
    @CurrentUser() user: any,
    @Body() syncFavoritesDto: SyncFavoritesDto,
  ): Promise<{ success: boolean; data: SyncFavoritesResponseDto }> {
    const result = await this.syncFavoritesUseCase.execute(user.id, syncFavoritesDto);
    
    return {
      success: true,
      data: result
    };
  }
}
