import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { SetPlaceStatusUseCase } from '../../domain/interfaces/admin.use-cases';
import { SetPlaceStatusDto } from '../dtos/request.dto';
import { PLACE_REPOSITORY } from '../../../places/tokens';

@Injectable()
export class SetPlaceStatusUseCaseImpl implements SetPlaceStatusUseCase {
  constructor(
    @Inject(PLACE_REPOSITORY) private readonly placeRepository: any,
    @Inject('AuditRepository') private readonly auditRepository: any,
  ) {}

  async execute(placeId: string, data: SetPlaceStatusDto, adminUserId: string): Promise<any> {
    const place = await this.placeRepository.findById(placeId);
    if (!place) {
      throw new NotFoundException('Lugar no encontrado');
    }

    const oldStatus = place.status;
    
    const updatedPlace = await this.placeRepository.update(placeId, {
      status: data.status,
      'metadata.statusUpdatedBy': adminUserId,
      'metadata.statusUpdatedAt': new Date(),
      'metadata.statusReason': data.reason || undefined,
    });

    // Crear registro de auditoría
    await this.auditRepository.create({
      action: 'update_status',
      resource: 'place',
      resourceId: placeId,
      userId: adminUserId,
      metadata: {
        oldStatus,
        newStatus: data.status,
        reason: data.reason,
      },
      oldData: { status: oldStatus },
      newData: { status: data.status },
    });

    return updatedPlace;
  }
}
