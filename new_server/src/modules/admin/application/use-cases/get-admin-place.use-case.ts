import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { GetAdminPlaceUseCase } from '../../domain/interfaces/admin.use-cases';
import { PLACE_REPOSITORY } from '../../../places/tokens';

@Injectable()
export class GetAdminPlaceUseCaseImpl implements GetAdminPlaceUseCase {
  constructor(
    @Inject(PLACE_REPOSITORY) private readonly placeRepository: any,
  ) {}

  async execute(placeId: string): Promise<any> {
    const place = await this.placeRepository.findById(placeId);
    if (!place) {
      throw new NotFoundException('Lugar no encontrado');
    }

    // Obtener información adicional para admin (estadísticas, auditoría, etc.)
    const [reviewCount, averageRating] = await Promise.all([
      this.placeRepository.getPlaceReviewCount?.(placeId) || 0,
      this.placeRepository.getPlaceAverageRating?.(placeId) || 0,
    ]);

    return {
      ...place,
      adminStats: {
        reviewCount,
        averageRating,
        lastUpdated: place.updatedAt,
        createdBy: place.createdBy,
        status: place.status,
        verified: place.metadata?.verified || false,
        featured: place.metadata?.featured || false,
      }
    };
  }
}
