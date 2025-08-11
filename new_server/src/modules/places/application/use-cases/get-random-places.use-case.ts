import { Injectable, Inject } from '@nestjs/common';
import { GetRandomPlacesUseCase } from '../../domain/interfaces/place-use-cases.interface';
import { PlaceRepository } from '../../domain/interfaces/place-repository.interface';
import { PlaceResponseDto } from '../dtos/response/place-response.dto';
import { PlaceMapper } from '../mappers/place.mapper';
import { PLACE_REPOSITORY } from '../../tokens';

@Injectable()
export class GetRandomPlacesUseCaseImpl implements GetRandomPlacesUseCase {
  constructor(@Inject(PLACE_REPOSITORY) private readonly placeRepository: PlaceRepository) {}

  async execute(count: number = 3): Promise<PlaceResponseDto[]> {
    const numPlaces = Math.max(1, Math.min(count, 10)); // Limite entre 1 y 10
    const places = await this.placeRepository.getRandomPlaces(numPlaces);
    return places.map(place => PlaceMapper.toResponseDto(place));
  }
}
