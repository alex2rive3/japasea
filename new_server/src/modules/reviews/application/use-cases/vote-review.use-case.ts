import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { VoteReviewUseCase } from '../../domain/interfaces/review-use-cases.interface';
import { ReviewRepository } from '../../domain/interfaces/review-repository.interface';
import { VoteReviewRequestDto } from '../dtos/request/vote-review.request.dto';
import { VoteResponseDto } from '../dtos/response/review.response.dto';

@Injectable()
export class VoteReviewUseCaseImpl implements VoteReviewUseCase {
  constructor(
    @Inject('ReviewRepository') private readonly reviewRepository: ReviewRepository
  ) {}

  async execute(reviewId: string, userId: string, voteData: VoteReviewRequestDto): Promise<VoteResponseDto> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Reseña no encontrada');
    }

    // No se puede votar por reseñas propias
    if (review.userId.toString() === userId) {
      throw new BadRequestException('No puedes votar por tu propia reseña');
    }

    // Buscar voto existente
    const existingVoteIndex = review.helpfulVotes.findIndex(
      v => v.userId.toString() === userId
    );

    if (existingVoteIndex !== -1) {
      // Actualizar voto existente
      review.helpfulVotes[existingVoteIndex].vote = voteData.vote;
    } else {
      // Agregar nuevo voto
      review.helpfulVotes.push({ 
        userId: userId as any, 
        vote: voteData.vote 
      });
    }

    // Recalcular contador de útil
    const helpfulCount = review.helpfulVotes.filter(v => v.vote === 'yes').length;

    const updatedReview = await this.reviewRepository.update(reviewId, {
      helpful: helpfulCount,
      helpfulVotes: review.helpfulVotes
    });

    if (!updatedReview) {
      throw new NotFoundException('Error al actualizar el voto');
    }

    return {
      helpful: helpfulCount,
      userVote: voteData.vote
    };
  }
}
