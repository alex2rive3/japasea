import { IsString, IsOptional, IsArray } from 'class-validator';

export class AddFavoriteDto {
  @IsString()
  placeId: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CheckMultipleFavoritesDto {
  @IsArray()
  @IsString({ each: true })
  placeIds: string[];
}

export class SyncFavoritesDto {
  @IsArray()
  favorites: Array<{
    placeId: string;
    action: 'add' | 'remove';
    addedAt?: string;
  }>;
}
