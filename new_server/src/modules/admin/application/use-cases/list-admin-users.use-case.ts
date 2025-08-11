import { Injectable, Inject } from '@nestjs/common';
import { ListAdminUsersUseCase } from '../../domain/interfaces/admin.use-cases';
import { AdminListUsersQueryDto } from '../dtos/request.dto';
import { UsersProvider } from '../../../users/domain/providers/users.tokens';

@Injectable()
export class ListAdminUsersUseCaseImpl implements ListAdminUsersUseCase {
  constructor(
    @Inject(UsersProvider.userRepository) private readonly userRepository: any,
  ) {}

  async execute(query: AdminListUsersQueryDto): Promise<{ data: any[]; total: number; page: number; limit: number; }> {
    const { page = 1, limit = 20, status, role, q, verified } = query;
    
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (role) {
      filter.role = role;
    }
    
    if (verified === 'true') {
      filter['metadata.emailVerified'] = true;
    } else if (verified === 'false') {
      filter['metadata.emailVerified'] = { $ne: true };
    }
    
    if (q) {
      filter.$or = [
        { username: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') },
        { 'profile.firstName': new RegExp(q, 'i') },
        { 'profile.lastName': new RegExp(q, 'i') }
      ];
    }

    const skip = (parseInt(page.toString()) - 1) * parseInt(limit.toString());
    const users = await this.userRepository.findWithFilter(filter, {
      skip,
      limit: parseInt(limit.toString()),
      sort: { createdAt: -1 }
    });
    
    const total = await this.userRepository.countDocuments(filter);

    return {
      data: users,
      total,
      page: parseInt(page.toString()),
      limit: parseInt(limit.toString())
    };
  }
}
