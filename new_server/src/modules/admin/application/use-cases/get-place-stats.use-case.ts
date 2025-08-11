import { Injectable, Inject } from '@nestjs/common';
import { GetPlaceStatsUseCase } from '../../domain/interfaces/admin.use-cases';
import { PlaceStatsResponseDto } from '../dtos/response.dto';

@Injectable()
export class GetPlaceStatsUseCaseImpl implements GetPlaceStatsUseCase {
  constructor(
    @Inject('PlaceRepository') private readonly placeRepository: any,
  ) {}

  async execute(): Promise<PlaceStatsResponseDto> {
    const [
      totalPlaces,
      byStatus,
      byType,
      featured,
      verified,
      averageRating,
      topRated,
      recentlyAdded
    ] = await Promise.all([
      this.placeRepository.countDocuments({}),
      this.getPlacesByStatus(),
      this.getPlacesByType(),
      this.placeRepository.countDocuments({ 'metadata.featured': true }),
      this.placeRepository.countDocuments({ 'metadata.verified': true }),
      this.getAverageRating(),
      this.getTopRatedPlaces(),
      this.getRecentlyAddedPlaces()
    ]);

    return {
      totalPlaces,
      byStatus: byStatus || [],
      byType: byType || [],
      featured,
      verified,
      averageRating: averageRating || 0,
      topRated: topRated || [],
      recentlyAdded: recentlyAdded || []
    };
  }

  private async getPlacesByStatus(): Promise<Array<{ _id: string; count: number }>> {
    try {
      return await this.placeRepository.getPlacesByStatus();
    } catch (error) {
      console.error('Error getting places by status:', error);
      return [];
    }
  }

  private async getPlacesByType(): Promise<Array<{ _id: string; count: number }>> {
    try {
      return await this.placeRepository.getPlacesByType();
    } catch (error) {
      console.error('Error getting places by type:', error);
      return [];
    }
  }

  private async getAverageRating(): Promise<number> {
    try {
      return await this.placeRepository.getAverageRating();
    } catch (error) {
      console.error('Error getting average rating:', error);
      return 0;
    }
  }

  private async getTopRatedPlaces(): Promise<Array<{ _id: string; name: string; rating: number }>> {
    try {
      return await this.placeRepository.getTopRatedPlaces(5);
    } catch (error) {
      console.error('Error getting top rated places:', error);
      return [];
    }
  }

  private async getRecentlyAddedPlaces(): Promise<Array<{ _id: string; name: string; createdAt: string }>> {
    try {
      return await this.placeRepository.getRecentlyAddedPlaces(5);
    } catch (error) {
      console.error('Error getting recently added places:', error);
      return [];
    }
  }
}
