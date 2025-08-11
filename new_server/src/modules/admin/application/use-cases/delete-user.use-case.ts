import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DeleteUserUseCase } from '../../domain/interfaces/admin.use-cases';
import { UsersProvider } from '../../../users/domain/providers/users.tokens';

@Injectable()
export class DeleteUserUseCaseImpl implements DeleteUserUseCase {
  constructor(
    @Inject(UsersProvider.userRepository) private readonly userRepository: any,
    @Inject('AuditRepository') private readonly auditRepository: any,
  ) {}

  async execute(userId: string, adminUserId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Crear registro de auditoría antes de eliminar
    await this.auditRepository.create({
      action: 'delete',
      resource: 'user',
      resourceId: userId,
      userId: adminUserId,
      metadata: {
        targetUserId: userId,
        deletedUser: {
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      oldData: {
        username: user.username,
        email: user.email,
        status: user.status,
        role: user.role,
      },
      newData: null,
    });

    // Soft delete del usuario
    await this.userRepository.softDelete(userId);
  }
}
