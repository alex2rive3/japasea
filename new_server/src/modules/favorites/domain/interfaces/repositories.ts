import { Favorite } from '../entities/favorite.entity';

export interface FavoriteRepository {
  create(favoriteData: Partial<Favorite>): Promise<Favorite>;
  findByUserAndPlace(userId: string, placeId: string): Promise<Favorite | null>;
  findByUserId(userId: string): Promise<Favorite[]>;
  findByUserIdWithPlaces(userId: string): Promise<any[]>;
  deleteByUserAndPlace(userId: string, placeId: string): Promise<void>;
  findMultipleByUserAndPlaces(userId: string, placeIds: string[]): Promise<Favorite[]>;
  getUserFavoriteStats(userId: string): Promise<any>;
  countByPlaceId(placeId: string): Promise<number>;
}
