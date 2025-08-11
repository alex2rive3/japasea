import { Injectable, Inject } from '@nestjs/common';
import { SendBulkNotificationUseCase } from '../../domain/interfaces/admin.use-cases';
import { SendBulkNotificationDto } from '../dtos/request.dto';
import { UsersProvider } from '../../../users/domain/providers/users.tokens';

@Injectable()
export class SendBulkNotificationUseCaseImpl implements SendBulkNotificationUseCase {
  constructor(
    @Inject(UsersProvider.userRepository) private readonly userRepository: any,
    @Inject('AuditRepository') private readonly auditRepository: any,
    // @Inject('NotificationService') private readonly notificationService: any,
  ) {}

  async execute(data: SendBulkNotificationDto, adminUserId: string): Promise<{ sent: number; failed: number; }> {
    let targetUsers: any[] = [];
    
    // Determinar usuarios objetivo según el target
    switch (data.target) {
      case 'all':
        targetUsers = await this.userRepository.findAll();
        break;
      case 'users':
        targetUsers = await this.userRepository.findByRole('user');
        break;
      case 'admins':
        targetUsers = await this.userRepository.findByRole('admin');
        break;
      case 'moderators':
        targetUsers = await this.userRepository.findByRole('moderator');
        break;
      case 'specific':
        if (data.userIds && data.userIds.length > 0) {
          targetUsers = await this.userRepository.findByIds(data.userIds);
        }
        break;
    }

    let sent = 0;
    let failed = 0;

    // Simular envío de notificaciones (aquí se integraría con un servicio real de notificaciones)
    for (const user of targetUsers) {
      try {
        // TODO: Integrar con servicio de notificaciones real (email, push, etc.)
        console.log(`Sending notification to user ${user._id}: ${data.title}`);
        sent++;
      } catch (error) {
        console.error(`Failed to send notification to user ${user._id}:`, error);
        failed++;
      }
    }

    // Crear registro de auditoría
    await this.auditRepository.create({
      action: 'send_bulk_notification',
      resource: 'notification',
      userId: adminUserId,
      metadata: {
        title: data.title,
        message: data.message,
        target: data.target,
        targetCount: targetUsers.length,
        sent,
        failed,
        userIds: data.userIds,
      },
      newData: {
        title: data.title,
        target: data.target,
        sent,
        failed,
      },
    });

    return { sent, failed };
  }
}
