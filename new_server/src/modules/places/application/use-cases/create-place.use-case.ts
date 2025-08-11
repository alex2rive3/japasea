import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { CreatePlaceUseCase } from '../../domain/interfaces/place-use-cases.interface';
import { PlaceRepository } from '../../domain/interfaces/place-repository.interface';
import { CreatePlaceRequestDto } from '../dtos/request/create-place.request.dto';
import { PlaceResponseDto } from '../dtos/response/place-response.dto';
import { PlaceMapper } from '../mappers/place.mapper';
import { PLACE_REPOSITORY } from '../../tokens';

@Injectable()
export class CreatePlaceUseCaseImpl implements CreatePlaceUseCase {
  constructor(@Inject(PLACE_REPOSITORY) private readonly placeRepository: PlaceRepository) {}

  async execute(createPlaceData: CreatePlaceRequestDto): Promise<PlaceResponseDto> {
    // Verificar si ya existe un lugar con la misma key
    const existingPlace = await this.placeRepository.findByKey(createPlaceData.key);
    if (existingPlace) {
      throw new ConflictException(`Place with key '${createPlaceData.key}' already exists`);
    }

    // También verificar por nombre y dirección
    const duplicatePlace = await this.placeRepository.findOne({
      $and: [
        { name: createPlaceData.name },
        { address: createPlaceData.address }
      ]
    });

    if (duplicatePlace) {
      throw new ConflictException(`Place with name '${createPlaceData.name}' at address '${createPlaceData.address}' already exists`);
    }

    const placeEntity = PlaceMapper.toEntity(createPlaceData);
    const createdPlace = await this.placeRepository.create(placeEntity);
    
    return PlaceMapper.toResponseDto(createdPlace);
  }
}
