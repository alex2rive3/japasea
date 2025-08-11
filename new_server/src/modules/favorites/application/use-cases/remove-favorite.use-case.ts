import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { RemoveFavoriteUseCase } from '../../domain/interfaces/favorites.use-cases';

@Injectable()
export class RemoveFavoriteUseCaseImpl implements RemoveFavoriteUseCase {
  constructor(
    @Inject('FavoriteRepository') private readonly favoriteRepository: any,
  ) {}

  async execute(userId: string, placeId: string): Promise<void> {
    const existingFavorite = await this.favoriteRepository.findByUserAndPlace(userId, placeId);
    if (!existingFavorite) {
      throw new NotFoundException('Favorito no encontrado');
    }

    await this.favoriteRepository.deleteByUserAndPlace(userId, placeId);
  }
}
