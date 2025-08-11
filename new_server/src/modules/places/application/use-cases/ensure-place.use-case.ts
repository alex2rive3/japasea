import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { EnsurePlaceUseCase } from '../../domain/interfaces/place-use-cases.interface';
import { PlaceRepository } from '../../domain/interfaces/place-repository.interface';
import { PlaceResponseDto } from '../dtos/response/place-response.dto';
import { PlaceMapper } from '../mappers/place.mapper';
import { PLACE_REPOSITORY } from '../../tokens';

@Injectable()
export class EnsurePlaceUseCaseImpl implements EnsurePlaceUseCase {
  constructor(@Inject(PLACE_REPOSITORY) private readonly placeRepository: PlaceRepository) {}

  async execute(placeData: any): Promise<PlaceResponseDto> {
    const {
      key,
      name,
      description,
      type,
      address,
      location
    } = placeData || {};

    const safeKey = key || name;
    const safeName = name || key;
    const safeDescription = description || 'Descripción no disponible';
    const safeType = type || 'Gastronomía';
    const safeAddress = address || 'Dirección por confirmar';

    // Validaciones mínimas
    if (!safeKey || !safeName) {
      throw new BadRequestException('key or name required');
    }

    // Buscar existente por key o por name+address
    let existing = await this.placeRepository.findOne({
      $or: [
        { key: safeKey },
        { $and: [{ name: safeName }, { address: safeAddress }] }
      ]
    });

    if (existing) {
      return PlaceMapper.toResponseDto(existing);
    }

    // Preparar coordenadas
    let lat = location?.lat;
    let lng = location?.lng;
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      lat = -27.3309;
      lng = -55.8663;
    }

    const toCreate = {
      key: safeKey,
      name: safeName,
      description: safeDescription,
      type: PlaceMapper.mapToValidPlaceType(safeType),
      address: safeAddress,
      location: {
        type: 'Point' as const,
        coordinates: [lng, lat] as [number, number]
      },
      status: 'active'
    };

    const created = await this.placeRepository.create(toCreate);
    return PlaceMapper.toResponseDto(created);
  }
}
