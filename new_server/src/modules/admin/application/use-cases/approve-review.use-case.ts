import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ApproveReviewUseCase } from '../../domain/interfaces/admin.use-cases';
import { ReviewModerationDto } from '../dtos/request.dto';

@Injectable()
export class ApproveReviewUseCaseImpl implements ApproveReviewUseCase {
  constructor(
    @Inject('ReviewRepository') private readonly reviewRepository: any,
    @Inject('AuditRepository') private readonly auditRepository: any,
  ) {}

  async execute(reviewId: string, data: ReviewModerationDto, adminUserId: string): Promise<any> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Reseña no encontrada');
    }

    const oldStatus = review.status;
    
    const updatedReview = await this.reviewRepository.update(reviewId, {
      status: 'approved',
      'moderation.status': 'approved',
      'moderation.moderatedBy': adminUserId,
      'moderation.moderatedAt': new Date(),
      'moderation.reason': data.reason || undefined,
    });

    // Crear registro de auditoría
    await this.auditRepository.create({
      action: 'approve_review',
      resource: 'review',
      resourceId: reviewId,
      userId: adminUserId,
      metadata: {
        oldStatus,
        newStatus: 'approved',
        reason: data.reason,
        reviewUserId: review.userId,
        reviewPlaceId: review.placeId,
      },
      oldData: { status: oldStatus },
      newData: { status: 'approved' },
    });

    return updatedReview;
  }
}
