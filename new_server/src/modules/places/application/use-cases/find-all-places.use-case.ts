import { Injectable, Inject } from '@nestjs/common';
import { FindAllPlacesUseCase } from '../../domain/interfaces/place-use-cases.interface';
import { PlaceRepository } from '../../domain/interfaces/place-repository.interface';
import { PlaceResponseDto } from '../dtos/response/place-response.dto';
import { PlaceMapper } from '../mappers/place.mapper';
import { PLACE_REPOSITORY } from '../../tokens';

@Injectable()
export class FindAllPlacesUseCaseImpl implements FindAllPlacesUseCase {
  constructor(@Inject(PLACE_REPOSITORY) private readonly placeRepository: PlaceRepository) {}

  async execute(type?: string): Promise<PlaceResponseDto[]> {
    const filters: any = {};
    if (type) {
      filters.type = new RegExp(type, 'i');
    }

    const places = await this.placeRepository.findAll(filters);
    return places.map(place => PlaceMapper.toResponseDto(place));
  }
}
