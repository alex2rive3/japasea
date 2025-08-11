import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { VerifyPlaceUseCase } from '../../domain/interfaces/admin.use-cases';
import { PLACE_REPOSITORY } from '../../../places/tokens';
import { VerifyPlaceDto } from '../dtos/request.dto';

@Injectable()
export class VerifyPlaceUseCaseImpl implements VerifyPlaceUseCase {
  constructor(
    @Inject(PLACE_REPOSITORY) private readonly placeRepository: any,
    @Inject('AuditRepository') private readonly auditRepository: any,
  ) {}

  async execute(placeId: string, data: VerifyPlaceDto, adminUserId: string): Promise<any> {
    const place = await this.placeRepository.findById(placeId);
    if (!place) {
      throw new NotFoundException('Lugar no encontrado');
    }

    const oldVerified = place.metadata?.verified || false;
    
    const updatedPlace = await this.placeRepository.update(placeId, {
      'metadata.verified': data.verified,
      'metadata.verifiedBy': data.verified ? adminUserId : null,
      'metadata.verifiedAt': data.verified ? new Date() : null,
      'metadata.verificationReason': data.reason || undefined,
    });

    // Crear registro de auditoría
    await this.auditRepository.create({
      action: data.verified ? 'verify' : 'unverify',
      resource: 'place',
      resourceId: placeId,
      userId: adminUserId,
      metadata: {
        oldVerified,
        newVerified: data.verified,
        reason: data.reason,
      },
      oldData: { verified: oldVerified },
      newData: { verified: data.verified },
    });

    return updatedPlace;
  }
}
