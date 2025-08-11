import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DeleteReviewUseCase } from '../../domain/interfaces/admin.use-cases';
import { ReviewsProvider } from '../../../reviews/domain/providers/reviews.tokens';

@Injectable()
export class DeleteAdminReviewUseCaseImpl implements DeleteReviewUseCase {
  constructor(
    @Inject(ReviewsProvider.reviewRepository) private readonly reviewRepository: any,
    @Inject('AuditRepository') private readonly auditRepository: any,
  ) {}

  async execute(reviewId: string, adminUserId: string): Promise<void> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Reseña no encontrada');
    }

    // Crear registro de auditoría antes de eliminar
    await this.auditRepository.create({
      action: 'delete_review',
      resource: 'review',
      resourceId: reviewId,
      userId: adminUserId,
      metadata: {
        deletedReview: {
          userId: review.userId,
          placeId: review.placeId,
          rating: review.rating,
          comment: review.comment,
        },
      },
      oldData: {
        userId: review.userId,
        placeId: review.placeId,
        rating: review.rating,
        status: review.status,
      },
      newData: null,
    });

    // Soft delete de la reseña
    await this.reviewRepository.softDelete(reviewId);
  }
}
