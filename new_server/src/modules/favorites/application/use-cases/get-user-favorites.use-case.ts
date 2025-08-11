import { Injectable, Inject } from '@nestjs/common';
import { GetUserFavoritesUseCase } from '../../domain/interfaces/favorites.use-cases';
import { FavoriteResponseDto } from '../dtos/response.dto';

@Injectable()
export class GetUserFavoritesUseCaseImpl implements GetUserFavoritesUseCase {
  constructor(
    @Inject('FavoriteRepository') private readonly favoriteRepository: any,
  ) {}

  async execute(userId: string): Promise<FavoriteResponseDto[]> {
    const favorites = await this.favoriteRepository.findByUserIdWithPlaces(userId);
    
    return favorites
      .filter(fav => fav.place && fav.place.status === 'active') // Filtrar lugares eliminados/inactivos
      .map(fav => ({
        _id: fav.place._id,
        name: fav.place.name,
        description: fav.place.description,
        type: fav.place.type,
        location: fav.place.location,
        address: fav.place.address,
        images: fav.place.images,
        rating: fav.place.rating,
        status: fav.place.status,
        isFavorite: true,
        favoritedAt: fav.addedAt.toISOString()
      }));
  }
}
