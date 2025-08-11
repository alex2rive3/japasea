import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class ReviewResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName?: string;

  @ApiProperty()
  placeId: string;

  @ApiProperty()
  placeName?: string;

  @ApiProperty()
  placeType?: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  rating: number;

  @ApiProperty()
  comment: string;

  @ApiProperty({ enum: ['pending', 'approved', 'rejected'] })
  status: string;

  @ApiProperty({ required: false })
  rejectionReason?: string;

  @ApiProperty({ type: [String] })
  images: string[];

  @ApiProperty()
  helpful: number;

  @ApiProperty({ required: false })
  isHelpful?: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ReviewStatsDto {
  @ApiProperty()
  avgRating: number;

  @ApiProperty()
  totalReviews: number;

  @ApiProperty()
  distribution: Record<string, number>;
}

export class PaginationDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;
}

export class PlaceReviewsResponseDto {
  @ApiProperty({ type: [ReviewResponseDto] })
  reviews: ReviewResponseDto[];

  @ApiProperty({ type: ReviewStatsDto })
  stats: ReviewStatsDto;

  @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto;
}

export class VoteResponseDto {
  @ApiProperty()
  helpful: number;

  @ApiProperty({ enum: ['yes', 'no'] })
  userVote: string;
}
