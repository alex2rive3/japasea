import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { GetPlaceReviewsUseCase } from '../../domain/interfaces/review-use-cases.interface';
import { ReviewRepository } from '../../domain/interfaces/review-repository.interface';
import { PlaceReviewsResponseDto, ReviewResponseDto } from '../dtos/response/review.response.dto';
import { ReviewMapper } from '../mappers/review.mapper';

@Injectable()
export class GetPlaceReviewsUseCaseImpl implements GetPlaceReviewsUseCase {
  constructor(
    @Inject('ReviewRepository') private readonly reviewRepository: ReviewRepository,
    @Inject('PlaceRepository') private readonly placeRepository: any // TODO: Import proper interface
  ) {}

  async execute(placeId: string, page: number = 1, limit: number = 10, sort: string = 'recent', userId?: string): Promise<PlaceReviewsResponseDto> {
    // Verificar que el lugar existe
    const place = await this.placeRepository.findById(placeId);
    if (!place) {
      throw new NotFoundException('Lugar no encontrado');
    }

    // Configurar ordenamiento
    let sortOption: any = { createdAt: -1 }; // Por defecto, más recientes
    if (sort === 'rating-high') sortOption = { rating: -1, createdAt: -1 };
    if (sort === 'rating-low') sortOption = { rating: 1, createdAt: -1 };
    if (sort === 'helpful') sortOption = { helpful: -1, createdAt: -1 };

    // Obtener solo reseñas aprobadas
    const { reviews, total } = await this.reviewRepository.findByPlaceId(placeId, {
      page,
      limit,
      sort: sortOption,
      status: 'approved'
    });

    // Obtener estadísticas
    const stats = await this.reviewRepository.getPlaceReviewStats(placeId);

    // Mapear reseñas con información adicional
    const mappedReviews: ReviewResponseDto[] = reviews.map(review => {
      const isHelpful = userId ? review.helpfulVotes.some(vote => 
        vote.userId.toString() === userId && vote.vote === 'yes'
      ) : false;

      return ReviewMapper.toResponseDto(
        review,
        (review as any).userId?.name, // Asumiendo que está populated
        undefined,
        undefined,
        isHelpful
      );
    });

    return {
      reviews: mappedReviews,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
