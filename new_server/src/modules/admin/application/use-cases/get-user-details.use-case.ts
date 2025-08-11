import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { GetUserDetailsUseCase } from '../../domain/interfaces/admin.use-cases';
import { UserDetailsResponseDto } from '../dtos/response.dto';
import { UsersProvider } from '../../../users/domain/providers/users.tokens';
import { FavoritesProvider } from '../../../favorites/domain/providers/favorites.tokens';
import { ReviewsProvider } from '../../../reviews/domain/providers/reviews.tokens';

@Injectable()
export class GetUserDetailsUseCaseImpl implements GetUserDetailsUseCase {
  constructor(
    @Inject(UsersProvider.userRepository) private readonly userRepository: any,
    @Inject(ReviewsProvider.reviewRepository) private readonly reviewRepository: any,
    @Inject(FavoritesProvider.favoriteRepository) private readonly favoriteRepository: any,
    @Inject('AuditRepository') private readonly auditRepository: any,
  ) {}

  async execute(userId: string): Promise<UserDetailsResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Obtener estadísticas del usuario
    const [reviewCount, favoriteCount, recentActivity] = await Promise.all([
      this.reviewRepository.countDocuments({ userId }),
      this.favoriteRepository?.countByUserId?.(userId) || 0,
      this.auditRepository.findByUserId(userId, 1, 5)
    ]);

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      profile: {
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        avatar: user.profile?.avatar,
        bio: user.profile?.bio,
        location: user.profile?.location,
        languages: user.profile?.languages,
      },
      metadata: {
        verified: user.metadata?.verified || false,
        emailVerified: user.metadata?.emailVerified || false,
        suspended: user.metadata?.suspended || false,
        suspendedUntil: user.metadata?.suspendedUntil?.toISOString(),
        suspensionReason: user.metadata?.suspensionReason,
      },
      stats: {
        reviewCount,
        favoriteCount,
        placesVisited: 0, // TODO: Implementar lógica de lugares visitados
      },
      recentActivity: recentActivity.data.map(activity => ({
        action: activity.action,
        resource: activity.resource,
        timestamp: activity.timestamp.toISOString(),
      })),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
