import { Injectable, Inject } from '@nestjs/common';
import { GetAdminStatsUseCase } from '../../domain/interfaces/admin.use-cases';
import { AdminStatsResponseDto } from '../dtos/response.dto';

@Injectable()
export class GetAdminStatsUseCaseImpl implements GetAdminStatsUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: any,
    @Inject('PlaceRepository') private readonly placeRepository: any,
    @Inject('ReviewRepository') private readonly reviewRepository: any,
  ) {}

  async execute(): Promise<AdminStatsResponseDto> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Stats básicos
    const [
      totalUsers,
      totalPlaces,
      totalReviews,
      activeUsers,
      activePlaces,
      pendingReviews
    ] = await Promise.all([
      this.userRepository.countDocuments({}),
      this.placeRepository.countDocuments({}),
      this.reviewRepository.countDocuments({}),
      this.userRepository.countDocuments({ status: 'active' }),
      this.placeRepository.countDocuments({ status: 'active' }),
      this.reviewRepository.countDocuments({ status: 'pending' })
    ]);

    // Actividad reciente (últimos 7 días)
    const [newUsers, newPlaces, newReviews] = await Promise.all([
      this.userRepository.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      this.placeRepository.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      this.reviewRepository.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    ]);

    // Top places por reviews
    const topPlaces = await this.placeRepository.getTopPlacesByReviews(5);

    // Crecimiento de usuarios (últimos 6 meses)
    const userGrowth = await this.getUserGrowthStats();

    // Places por tipo
    const placesByType = await this.placeRepository.getPlacesByType();

    // Reviews por rating
    const reviewsByRating = await this.reviewRepository.getReviewsByRating();

    return {
      totalUsers,
      totalPlaces,
      totalReviews,
      activeUsers,
      activePlaces,
      pendingReviews,
      recentActivity: {
        newUsers,
        newPlaces,
        newReviews
      },
      topPlaces: topPlaces || [],
      userGrowth: userGrowth || [],
      placesByType: placesByType || [],
      reviewsByRating: reviewsByRating || []
    };
  }

  private async getUserGrowthStats(): Promise<Array<{ period: string; count: number }>> {
    // Implementar agregación para crecimiento de usuarios por mes
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    try {
      return await this.userRepository.getUserGrowthByMonth(sixMonthsAgo);
    } catch (error) {
      console.error('Error getting user growth stats:', error);
      return [];
    }
  }
}
