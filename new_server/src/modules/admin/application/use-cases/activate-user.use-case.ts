import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ActivateUserUseCase } from '../../domain/interfaces/admin.use-cases';

@Injectable()
export class ActivateUserUseCaseImpl implements ActivateUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: any,
    @Inject('AuditRepository') private readonly auditRepository: any,
  ) {}

  async execute(userId: string, adminUserId: string): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const oldStatus = user.status;
    const oldSuspended = user.metadata?.suspended || false;
    
    const updatedUser = await this.userRepository.update(userId, {
      status: 'active',
      'metadata.suspended': false,
      'metadata.suspendedAt': null,
      'metadata.suspendedBy': null,
      'metadata.suspendedUntil': null,
      'metadata.suspensionReason': null,
      'metadata.activatedAt': new Date(),
      'metadata.activatedBy': adminUserId,
    });

    // Crear registro de auditoría
    await this.auditRepository.create({
      action: 'activate',
      resource: 'user',
      resourceId: userId,
      userId: adminUserId,
      metadata: {
        targetUserId: userId,
        oldStatus,
        newStatus: 'active',
        oldSuspended,
        newSuspended: false,
      },
      oldData: { status: oldStatus, suspended: oldSuspended },
      newData: { status: 'active', suspended: false },
    });

    return updatedUser;
  }
}
