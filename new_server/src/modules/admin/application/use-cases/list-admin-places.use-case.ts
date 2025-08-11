import { Injectable, Inject } from '@nestjs/common';
import { ListAdminPlacesUseCase } from '../../domain/interfaces/admin.use-cases';
import { AdminListPlacesQueryDto } from '../dtos/request.dto';

@Injectable()
export class ListAdminPlacesUseCaseImpl implements ListAdminPlacesUseCase {
  constructor(
    @Inject('PlaceRepository') private readonly placeRepository: any,
  ) {}

  async execute(query: AdminListPlacesQueryDto): Promise<{ data: any[]; total: number; page: number; limit: number; }> {
    const { page = 1, limit = 20, status, type, q, verified, featured } = query;
    
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (type) {
      filter.type = new RegExp(type, 'i');
    }
    
    if (verified === 'true') {
      filter['metadata.verified'] = true;
    } else if (verified === 'false') {
      filter['metadata.verified'] = { $ne: true };
    }
    
    if (featured === 'true') {
      filter['metadata.featured'] = true;
    } else if (featured === 'false') {
      filter['metadata.featured'] = { $ne: true };
    }
    
    if (q) {
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { address: new RegExp(q, 'i') },
        { tags: new RegExp(q, 'i') }
      ];
    }

    const skip = (parseInt(page.toString()) - 1) * parseInt(limit.toString());
    const places = await this.placeRepository.findWithFilter(filter, {
      skip,
      limit: parseInt(limit.toString()),
      sort: { createdAt: -1 }
    });
    
    const total = await this.placeRepository.countDocuments(filter);

    return {
      data: places,
      total,
      page: parseInt(page.toString()),
      limit: parseInt(limit.toString())
    };
  }
}
