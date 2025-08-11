import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { DeleteReviewUseCase } from '../../domain/interfaces/review-use-cases.interface';
import { ReviewRepository } from '../../domain/interfaces/review-repository.interface';

@Injectable()
export class DeleteReviewUseCaseImpl implements DeleteReviewUseCase {
  constructor(
    @Inject('ReviewRepository') private readonly reviewRepository: ReviewRepository
  ) {}

  async execute(reviewId: string, userId: string, metadata?: any): Promise<{ success: boolean; message: string }> {
    const review = await this.reviewRepository.findOne({ _id: reviewId, userId });
    if (!review) {
      throw new NotFoundException('Reseña no encontrada o no tienes permisos para eliminarla');
    }

    const success = await this.reviewRepository.delete(reviewId);
    
    if (!success) {
      return {
        success: false,
        message: 'Error al eliminar la reseña'
      };
    }

    // TODO: Registrar en auditoría cuando esté implementado
    // await this.auditService.log({...});

    return {
      success: true,
      message: 'Reseña eliminada exitosamente'
    };
  }
}
