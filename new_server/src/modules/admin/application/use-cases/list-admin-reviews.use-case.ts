import { Injectable, Inject } from '@nestjs/common';
import { ListAdminReviewsUseCase } from '../../domain/interfaces/admin.use-cases';
import { AdminListReviewsQueryDto } from '../dtos/request.dto';
import { ReviewsProvider } from '../../../reviews/domain/providers/reviews.tokens';

@Injectable()
export class ListAdminReviewsUseCaseImpl implements ListAdminReviewsUseCase {
  constructor(
    @Inject(ReviewsProvider.reviewRepository) private readonly reviewRepository: any,
  ) {}

  async execute(query: AdminListReviewsQueryDto): Promise<{ data: any[]; total: number; page: number; limit: number; }> {
    const { page = 1, limit = 20, status, placeId, userId, minRating, maxRating, q } = query;
    
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (placeId) {
      filter.placeId = placeId;
    }
    
    if (userId) {
      filter.userId = userId;
    }
    
    if (minRating !== undefined || maxRating !== undefined) {
      filter.rating = {};
      if (minRating !== undefined) filter.rating.$gte = minRating;
      if (maxRating !== undefined) filter.rating.$lte = maxRating;
    }
    
    if (q) {
      filter.$or = [
        { comment: new RegExp(q, 'i') },
        { title: new RegExp(q, 'i') }
      ];
    }

    const skip = (parseInt(page.toString()) - 1) * parseInt(limit.toString());
    
    const [reviews, total] = await Promise.all([
      this.reviewRepository.findWithFilter(filter, {
        skip,
        limit: parseInt(limit.toString()),
        sort: { createdAt: -1 },
        populate: [
          { path: 'userId', select: 'username email' },
          { path: 'placeId', select: 'name type' }
        ]
      }),
      this.reviewRepository.countDocuments(filter)
    ]);

    return {
      data: reviews,
      total,
      page: parseInt(page.toString()),
      limit: parseInt(limit.toString())
    };
  }
}
