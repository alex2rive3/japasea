import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { SoftDeletePlaceUseCase } from '../../domain/interfaces/place-use-cases.interface';
import { PlaceRepository } from '../../domain/interfaces/place-repository.interface';
import { SoftDeletePlaceRequestDto } from '../dtos/request/soft-delete-place.request.dto';
import { PLACE_REPOSITORY } from '../../tokens';

@Injectable()
export class SoftDeletePlaceUseCaseImpl implements SoftDeletePlaceUseCase {
  constructor(@Inject(PLACE_REPOSITORY) private readonly placeRepository: PlaceRepository) {}

  async execute(id: string, softDeleteData: SoftDeletePlaceRequestDto): Promise<{ success: boolean; message: string }> {
    const existingPlace = await this.placeRepository.findById(id);
    if (!existingPlace) {
      throw new NotFoundException(`Place with ID '${id}' not found`);
    }

    const success = await this.placeRepository.softDelete(id, softDeleteData.reason);
    
    if (!success) {
      return {
        success: false,
        message: `Failed to soft delete place with ID '${id}'`
      };
    }

    return {
      success: true,
      message: `Place with ID '${id}' has been soft deleted successfully`
    };
  }
}
