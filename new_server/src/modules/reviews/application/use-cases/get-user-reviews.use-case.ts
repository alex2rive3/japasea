import { Injectable, Inject } from '@nestjs/common';
import { GetUserReviewsUseCase } from '../../domain/interfaces/review-use-cases.interface';
import { ReviewRepository } from '../../domain/interfaces/review-repository.interface';
import { ReviewResponseDto } from '../dtos/response/review.response.dto';
import { ReviewMapper } from '../mappers/review.mapper';

@Injectable()
export class GetUserReviewsUseCaseImpl implements GetUserReviewsUseCase {
  constructor(
    @Inject('ReviewRepository') private readonly reviewRepository: ReviewRepository
  ) {}

  async execute(userId: string, page: number = 1, limit: number = 10): Promise<{ reviews: ReviewResponseDto[]; pagination: any }> {
    const { reviews, total } = await this.reviewRepository.findByUserId(userId, { page, limit });

    const mappedReviews: ReviewResponseDto[] = reviews.map(review => 
      ReviewMapper.toResponseDto(
        review,
        undefined,
        (review as any).placeId?.name, // Asumiendo que está populated
        (review as any).placeId?.type  // Asumiendo que está populated
      )
    );

    return {
      reviews: mappedReviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
