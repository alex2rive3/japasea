import { Injectable } from '@nestjs/common';
import { Review } from '../../domain/entities/review.entity';
import { ReviewResponseDto } from '../dtos/response/review.response.dto';
import { CreateReviewRequestDto } from '../dtos/request/create-review.request.dto';

@Injectable()
export class ReviewMapper {
  
  static toResponseDto(review: Review, userName?: string, placeName?: string, placeType?: string, isHelpful?: boolean): ReviewResponseDto {
    return {
      id: (review as any)._id?.toString() || (review as any).id,
      userId: review.userId.toString(),
      userName,
      placeId: review.placeId.toString(),
      placeName,
      placeType,
      rating: review.rating,
      comment: review.comment,
      status: review.status,
      rejectionReason: review.rejectionReason,
      images: review.images || [],
      helpful: review.helpful || 0,
      isHelpful,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt
    };
  }

  static toEntity(userId: string, placeId: string, createDto: CreateReviewRequestDto, metadata?: any): Partial<Review> {
    return {
      userId: userId as any,
      placeId: placeId as any,
      rating: createDto.rating,
      comment: createDto.comment,
      images: createDto.images || [],
      status: 'pending', // Las reseñas requieren aprobación
      helpful: 0,
      helpfulVotes: [],
      ...(metadata && { metadata })
    };
  }

  static calculateRatingDistribution(ratings: number[]): Record<string, number> {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(rating => {
      if (distribution[rating] !== undefined) {
        distribution[rating]++;
      }
    });
    return distribution;
  }
}
