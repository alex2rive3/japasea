import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { UpdateReviewUseCase } from '../../domain/interfaces/review-use-cases.interface';
import { ReviewRepository } from '../../domain/interfaces/review-repository.interface';
import { UpdateReviewRequestDto } from '../dtos/request/update-review.request.dto';
import { ReviewResponseDto } from '../dtos/response/review.response.dto';
import { ReviewMapper } from '../mappers/review.mapper';

@Injectable()
export class UpdateReviewUseCaseImpl implements UpdateReviewUseCase {
  constructor(
    @Inject('ReviewRepository') private readonly reviewRepository: ReviewRepository
  ) {}

  async execute(reviewId: string, userId: string, updateData: UpdateReviewRequestDto): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.findOne({ _id: reviewId, userId });
    if (!review) {
      throw new NotFoundException('Reseña no encontrada o no tienes permisos para editarla');
    }

    // Solo se pueden editar reseñas pendientes o rechazadas
    if (review.status === 'approved') {
      throw new BadRequestException('No puedes editar una reseña ya aprobada');
    }

    // Preparar datos de actualización
    const updatePayload: any = {};
    if (updateData.rating !== undefined) updatePayload.rating = updateData.rating;
    if (updateData.comment !== undefined) updatePayload.comment = updateData.comment;
    if (updateData.images !== undefined) updatePayload.images = updateData.images;
    
    // Resetear estado a pendiente
    updatePayload.status = 'pending';
    updatePayload.rejectionReason = null;

    const updatedReview = await this.reviewRepository.update(reviewId, updatePayload);
    
    if (!updatedReview) {
      throw new NotFoundException('Error al actualizar la reseña');
    }

    return ReviewMapper.toResponseDto(updatedReview);
  }
}
