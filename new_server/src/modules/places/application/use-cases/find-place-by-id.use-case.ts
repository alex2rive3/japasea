import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { FindPlaceByIdUseCase } from '../../domain/interfaces/place-use-cases.interface';
import { PlaceRepository } from '../../domain/interfaces/place-repository.interface';
import { PlaceResponseDto } from '../dtos/response/place-response.dto';
import { PlaceMapper } from '../mappers/place.mapper';
import { PLACE_REPOSITORY } from '../../tokens';

@Injectable()
export class FindPlaceByIdUseCaseImpl implements FindPlaceByIdUseCase {
  constructor(@Inject(PLACE_REPOSITORY) private readonly placeRepository: PlaceRepository) {}

  async execute(id: string): Promise<PlaceResponseDto> {
    const place = await this.placeRepository.findById(id);
    
    if (!place) {
      throw new NotFoundException(`Place with ID '${id}' not found`);
    }

    return PlaceMapper.toResponseDto(place);
  }
}
