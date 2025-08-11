import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { AddFavoriteUseCase } from '../../domain/interfaces/favorites.use-cases';
import { AddFavoriteDto } from '../dtos/request.dto';
import { FavoriteResponseDto } from '../dtos/response.dto';

@Injectable()
export class AddFavoriteUseCaseImpl implements AddFavoriteUseCase {
  constructor(
    @Inject('FavoriteRepository') private readonly favoriteRepository: any,
    @Inject('PlaceRepository') private readonly placeRepository: any,
  ) {}

  async execute(userId: string, data: AddFavoriteDto): Promise<FavoriteResponseDto> {
    // Verificar que el lugar existe y está activo
    const place = await this.placeRepository.findById(data.placeId);
    if (!place || place.status !== 'active') {
      throw new NotFoundException('Lugar no encontrado o no disponible');
    }

    // Verificar que no esté ya en favoritos
    const existingFavorite = await this.favoriteRepository.findByUserAndPlace(userId, data.placeId);
    if (existingFavorite) {
      throw new ConflictException('El lugar ya está en favoritos');
    }

    // Crear el favorito
    const favorite = await this.favoriteRepository.create({
      userId,
      placeId: data.placeId,
      addedAt: new Date(),
      metadata: {
        addedFrom: 'api',
        notes: data.notes
      }
    });

    return {
      _id: place._id,
      name: place.name,
      description: place.description,
      type: place.type,
      location: place.location,
      address: place.address,
      images: place.images,
      rating: place.rating,
      status: place.status,
      isFavorite: true,
      favoritedAt: favorite.addedAt.toISOString()
    };
  }
}
