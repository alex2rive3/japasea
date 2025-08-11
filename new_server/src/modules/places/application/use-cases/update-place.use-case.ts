import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { UpdatePlaceUseCase } from '../../domain/interfaces/place-use-cases.interface';
import { PlaceRepository } from '../../domain/interfaces/place-repository.interface';
import { UpdatePlaceRequestDto } from '../dtos/request/update-place.request.dto';
import { PlaceResponseDto } from '../dtos/response/place-response.dto';
import { PlaceMapper } from '../mappers/place.mapper';
import { PLACE_REPOSITORY } from '../../tokens';

@Injectable()
export class UpdatePlaceUseCaseImpl implements UpdatePlaceUseCase {
  constructor(@Inject(PLACE_REPOSITORY) private readonly placeRepository: PlaceRepository) {}

  async execute(id: string, updateData: UpdatePlaceRequestDto): Promise<PlaceResponseDto> {
    const existingPlace = await this.placeRepository.findById(id);
    if (!existingPlace) {
      throw new NotFoundException(`Place with ID '${id}' not found`);
    }

    const updatePayload = {
      ...updateData,
      'metadata.lastUpdated': new Date()
    };

    const updatedPlace = await this.placeRepository.update(id, updatePayload);
    
    if (!updatedPlace) {
      throw new NotFoundException(`Failed to update place with ID '${id}'`);
    }

    return PlaceMapper.toResponseDto(updatedPlace);
  }
}
