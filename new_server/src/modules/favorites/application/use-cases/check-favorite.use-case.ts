import { Injectable, Inject } from '@nestjs/common';
import { CheckFavoriteUseCase } from '../../domain/interfaces/favorites.use-cases';
import { CheckFavoriteResponseDto } from '../dtos/response.dto';

@Injectable()
export class CheckFavoriteUseCaseImpl implements CheckFavoriteUseCase {
  constructor(
    @Inject('FavoriteRepository') private readonly favoriteRepository: any,
  ) {}

  async execute(userId: string, placeId: string): Promise<CheckFavoriteResponseDto> {
    const favorite = await this.favoriteRepository.findByUserAndPlace(userId, placeId);
    
    return {
      isFavorite: !!favorite,
      favoritedAt: favorite?.addedAt?.toISOString()
    };
  }
}
