import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { CreateReviewUseCase } from '../../domain/interfaces/review-use-cases.interface';
import { ReviewRepository } from '../../domain/interfaces/review-repository.interface';
import { CreateReviewRequestDto } from '../dtos/request/create-review.request.dto';
import { ReviewResponseDto } from '../dtos/response/review.response.dto';
import { ReviewMapper } from '../mappers/review.mapper';

@Injectable()
export class CreateReviewUseCaseImpl implements CreateReviewUseCase {
  constructor(
    @Inject('ReviewRepository') private readonly reviewRepository: ReviewRepository,
    @Inject('PlaceRepository') private readonly placeRepository: any // TODO: Import proper interface
  ) {}

  async execute(placeId: string, userId: string, createReviewData: CreateReviewRequestDto, metadata?: any): Promise<ReviewResponseDto> {
    // Verificar que el lugar existe
    const place = await this.placeRepository.findById(placeId);
    if (!place) {
      throw new NotFoundException('Lugar no encontrado');
    }

    // Verificar si el usuario ya tiene una reseña para este lugar
    const existingReview = await this.reviewRepository.findOne({ userId, placeId });
    if (existingReview) {
      throw new BadRequestException('Ya has dejado una reseña para este lugar');
    }

    // Crear la reseña
    const reviewEntity = ReviewMapper.toEntity(userId, placeId, createReviewData, metadata);
    const createdReview = await this.reviewRepository.create(reviewEntity);
    
    // TODO: Registrar en auditoría cuando esté implementado
    // await this.auditService.log({...});

    return ReviewMapper.toResponseDto(createdReview);
  }
}
