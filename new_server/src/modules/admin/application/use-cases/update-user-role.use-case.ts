import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UpdateUserRoleUseCase } from '../../domain/interfaces/admin.use-cases';
import { UpdateUserRoleDto } from '../dtos/request.dto';

@Injectable()
export class UpdateUserRoleUseCaseImpl implements UpdateUserRoleUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: any,
    @Inject('AuditRepository') private readonly auditRepository: any,
  ) {}

  async execute(userId: string, data: UpdateUserRoleDto, adminUserId: string): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const oldRole = user.role;
    
    const updatedUser = await this.userRepository.update(userId, {
      role: data.role,
      'metadata.roleUpdatedBy': adminUserId,
      'metadata.roleUpdatedAt': new Date(),
      'metadata.roleUpdateReason': data.reason || undefined,
    });

    // Crear registro de auditoría
    await this.auditRepository.create({
      action: 'update_role',
      resource: 'user',
      resourceId: userId,
      userId: adminUserId,
      metadata: {
        targetUserId: userId,
        oldRole,
        newRole: data.role,
        reason: data.reason,
      },
      oldData: { role: oldRole },
      newData: { role: data.role },
    });

    return updatedUser;
  }
}
