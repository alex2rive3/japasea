import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SuspendUserUseCase } from '../../domain/interfaces/admin.use-cases';
import { UsersProvider } from '../../../users/domain/providers/users.tokens';
import { SuspendUserDto } from '../dtos/request.dto';

@Injectable()
export class SuspendUserUseCaseImpl implements SuspendUserUseCase {
  constructor(
    @Inject(UsersProvider.userRepository) private readonly userRepository: any,
    @Inject('AuditRepository') private readonly auditRepository: any,
  ) {}

  async execute(userId: string, data: SuspendUserDto, adminUserId: string): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const suspendedUntil = data.suspendedUntil ? new Date(data.suspendedUntil) : null;
    const oldStatus = user.status;
    const oldSuspended = user.metadata?.suspended || false;
    
    const updatedUser = await this.userRepository.update(userId, {
      status: 'suspended',
      'metadata.suspended': true,
      'metadata.suspendedAt': new Date(),
      'metadata.suspendedBy': adminUserId,
      'metadata.suspendedUntil': suspendedUntil,
      'metadata.suspensionReason': data.reason,
    });

    // Crear registro de auditoría
    await this.auditRepository.create({
      action: 'suspend',
      resource: 'user',
      resourceId: userId,
      userId: adminUserId,
      metadata: {
        targetUserId: userId,
        oldStatus,
        newStatus: 'suspended',
        oldSuspended,
        newSuspended: true,
        reason: data.reason,
        suspendedUntil: suspendedUntil?.toISOString(),
      },
      oldData: { status: oldStatus, suspended: oldSuspended },
      newData: { status: 'suspended', suspended: true, suspendedUntil },
    });

    return updatedUser;
  }
}
