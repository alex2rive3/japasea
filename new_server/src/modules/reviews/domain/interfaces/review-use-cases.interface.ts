import { CreateReviewRequestDto } from '../../application/dtos/request/create-review.request.dto';
import { UpdateReviewRequestDto } from '../../application/dtos/request/update-review.request.dto';
import { VoteReviewRequestDto } from '../../application/dtos/request/vote-review.request.dto';
import { ReviewResponseDto, PlaceReviewsResponseDto, VoteResponseDto } from '../../application/dtos/response/review.response.dto';

export interface CreateReviewUseCase {
  execute(placeId: string, userId: string, createReviewData: CreateReviewRequestDto, metadata?: any): Promise<ReviewResponseDto>;
}

export interface GetPlaceReviewsUseCase {
  execute(placeId: string, page?: number, limit?: number, sort?: string, userId?: string): Promise<PlaceReviewsResponseDto>;
}

export interface UpdateReviewUseCase {
  execute(reviewId: string, userId: string, updateData: UpdateReviewRequestDto): Promise<ReviewResponseDto>;
}

export interface DeleteReviewUseCase {
  execute(reviewId: string, userId: string, metadata?: any): Promise<{ success: boolean; message: string }>;
}

export interface VoteReviewUseCase {
  execute(reviewId: string, userId: string, voteData: VoteReviewRequestDto): Promise<VoteResponseDto>;
}

export interface GetUserReviewsUseCase {
  execute(userId: string, page?: number, limit?: number): Promise<{ reviews: ReviewResponseDto[]; pagination: any }>;
}
