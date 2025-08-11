import { 
  AddFavoriteDto, 
  CheckMultipleFavoritesDto, 
  SyncFavoritesDto 
} from '../../application/dtos/request.dto';

import {
  FavoriteResponseDto,
  FavoriteStatsResponseDto,
  CheckFavoriteResponseDto,
  SyncFavoritesResponseDto
} from '../../application/dtos/response.dto';

export interface GetUserFavoritesUseCase {
  execute(userId: string): Promise<FavoriteResponseDto[]>;
}

export interface AddFavoriteUseCase {
  execute(userId: string, data: AddFavoriteDto): Promise<FavoriteResponseDto>;
}

export interface RemoveFavoriteUseCase {
  execute(userId: string, placeId: string): Promise<void>;
}

export interface CheckFavoriteUseCase {
  execute(userId: string, placeId: string): Promise<CheckFavoriteResponseDto>;
}

export interface CheckMultipleFavoritesUseCase {
  execute(userId: string, data: CheckMultipleFavoritesDto): Promise<Record<string, boolean>>;
}

export interface GetFavoriteStatsUseCase {
  execute(userId: string): Promise<FavoriteStatsResponseDto>;
}

export interface SyncFavoritesUseCase {
  execute(userId: string, data: SyncFavoritesDto): Promise<SyncFavoritesResponseDto>;
}
