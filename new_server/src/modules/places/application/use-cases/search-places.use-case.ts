import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { SearchPlacesUseCase } from '../../domain/interfaces/place-use-cases.interface';
import { PlaceRepository } from '../../domain/interfaces/place-repository.interface';
import { PlaceResponseDto } from '../dtos/response/place-response.dto';
import { PlaceMapper } from '../mappers/place.mapper';
import { PLACE_REPOSITORY } from '../../tokens';

@Injectable()
export class SearchPlacesUseCaseImpl implements SearchPlacesUseCase {
  constructor(@Inject(PLACE_REPOSITORY) private readonly placeRepository: PlaceRepository) {}

  async execute(query: string): Promise<PlaceResponseDto[]> {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException('Search query is required');
    }

    const places = await this.placeRepository.search(query.trim());
    return places.map(place => PlaceMapper.toResponseDto(place));
  }
}
