import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { RejectReviewUseCase } from '../../domain/interfaces/admin.use-cases';
import { ReviewsProvider } from '../../../reviews/domain/providers/reviews.tokens';
import { ReviewModerationDto } from '../dtos/request.dto';

@Injectable()
export class RejectReviewUseCaseImpl implements RejectReviewUseCase {
  constructor(
    @Inject(ReviewsProvider.reviewRepository) private readonly reviewRepository: any,
    @Inject('AuditRepository') private readonly auditRepository: any,
  ) {}

  async execute(reviewId: string, data: ReviewModerationDto, adminUserId: string): Promise<any> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Reseña no encontrada');
    }

    const oldStatus = review.status;
    
    const updatedReview = await this.reviewRepository.update(reviewId, {
      status: 'rejected',
      'moderation.status': 'rejected',
      'moderation.moderatedBy': adminUserId,
      'moderation.moderatedAt': new Date(),
      'moderation.reason': data.reason || 'Contenido inapropiado',
    });

    // Crear registro de auditoría
    await this.auditRepository.create({
      action: 'reject_review',
      resource: 'review',
      resourceId: reviewId,
      userId: adminUserId,
      metadata: {
        oldStatus,
        newStatus: 'rejected',
        reason: data.reason,
        reviewUserId: review.userId,
        reviewPlaceId: review.placeId,
      },
      oldData: { status: oldStatus },
      newData: { status: 'rejected' },
    });

    return updatedReview;
  }
}
