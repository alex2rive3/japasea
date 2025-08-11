import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { FeaturePlaceUseCase } from '../../domain/interfaces/admin.use-cases';
import { FeaturePlaceDto } from '../dtos/request.dto';

@Injectable()
export class FeaturePlaceUseCaseImpl implements FeaturePlaceUseCase {
  constructor(
    @Inject('PlaceRepository') private readonly placeRepository: any,
    @Inject('AuditRepository') private readonly auditRepository: any,
  ) {}

  async execute(placeId: string, data: FeaturePlaceDto, adminUserId: string): Promise<any> {
    const place = await this.placeRepository.findById(placeId);
    if (!place) {
      throw new NotFoundException('Lugar no encontrado');
    }

    const oldFeatured = place.metadata?.featured || false;
    const featuredUntil = data.featured 
      ? (data.featuredUntil ? new Date(data.featuredUntil) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
      : null;
    
    const updatedPlace = await this.placeRepository.update(placeId, {
      'metadata.featured': data.featured,
      'metadata.featuredUntil': featuredUntil,
      'metadata.featuredBy': data.featured ? adminUserId : null,
      'metadata.featuredAt': data.featured ? new Date() : null,
    });

    // Crear registro de auditoría
    await this.auditRepository.create({
      action: data.featured ? 'feature' : 'unfeature',
      resource: 'place',
      resourceId: placeId,
      userId: adminUserId,
      metadata: {
        oldFeatured,
        newFeatured: data.featured,
        featuredUntil: featuredUntil?.toISOString(),
      },
      oldData: { featured: oldFeatured },
      newData: { featured: data.featured, featuredUntil },
    });

    return updatedPlace;
  }
}
