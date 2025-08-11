import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Entities and Schemas
import { Audit, AuditSchema } from './domain/entities/audit.entity';
import { Settings, SettingsSchema } from './domain/entities/settings.entity';

// Repositories
import { MongoAuditRepository } from './infrastructure/repositories/mongo-audit.repository';
import { MongoSettingsRepository } from './infrastructure/repositories/mongo-settings.repository';

// Use Cases implementations
import { SetPlaceStatusUseCaseImpl } from './application/use-cases/set-place-status.use-case';
import { VerifyPlaceUseCaseImpl } from './application/use-cases/verify-place.use-case';
import { FeaturePlaceUseCaseImpl } from './application/use-cases/feature-place.use-case';
import { GetAdminPlaceUseCaseImpl } from './application/use-cases/get-admin-place.use-case';
import { ListAdminPlacesUseCaseImpl } from './application/use-cases/list-admin-places.use-case';
import { ListAdminUsersUseCaseImpl } from './application/use-cases/list-admin-users.use-case';
import { GetUserDetailsUseCaseImpl } from './application/use-cases/get-user-details.use-case';
import { UpdateUserRoleUseCaseImpl } from './application/use-cases/update-user-role.use-case';
import { SuspendUserUseCaseImpl } from './application/use-cases/suspend-user.use-case';
import { ActivateUserUseCaseImpl } from './application/use-cases/activate-user.use-case';
import { DeleteUserUseCaseImpl } from './application/use-cases/delete-user.use-case';
import { GetAdminStatsUseCaseImpl } from './application/use-cases/get-admin-stats.use-case';
import { GetPlaceStatsUseCaseImpl } from './application/use-cases/get-place-stats.use-case';
import { GetSystemSettingsUseCaseImpl } from './application/use-cases/get-system-settings.use-case';
import { UpdateSystemSettingsUseCaseImpl } from './application/use-cases/update-system-settings.use-case';
import { SendBulkNotificationUseCaseImpl } from './application/use-cases/send-bulk-notification.use-case';
import { ListAdminReviewsUseCaseImpl } from './application/use-cases/list-admin-reviews.use-case';
import { ApproveReviewUseCaseImpl } from './application/use-cases/approve-review.use-case';
import { RejectReviewUseCaseImpl } from './application/use-cases/reject-review.use-case';
import { DeleteAdminReviewUseCaseImpl } from './application/use-cases/delete-admin-review.use-case';

// Controller
import { AdminController } from './controllers/admin.controller';

// Import other modules to access their repositories
import { UsersModule } from '../users/users.module';
import { PlacesModule } from '../places/places.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Audit.name, schema: AuditSchema },
      { name: Settings.name, schema: SettingsSchema }
    ]),
    UsersModule,       // Para acceder al UserRepository
    PlacesModule,      // Para acceder al PlaceRepository
    ReviewsModule,     // Para acceder al ReviewRepository
    FavoritesModule,   // Para acceder al FavoriteRepository
  ],
  controllers: [AdminController],
  providers: [
    // Repositories
    {
      provide: 'AuditRepository',
      useClass: MongoAuditRepository,
    },
    {
      provide: 'SettingsRepository',
      useClass: MongoSettingsRepository,
    },
    
    // Places Management Use Cases
    {
      provide: 'SetPlaceStatusUseCase',
      useClass: SetPlaceStatusUseCaseImpl,
    },
    {
      provide: 'VerifyPlaceUseCase',
      useClass: VerifyPlaceUseCaseImpl,
    },
    {
      provide: 'FeaturePlaceUseCase',
      useClass: FeaturePlaceUseCaseImpl,
    },
    {
      provide: 'GetAdminPlaceUseCase',
      useClass: GetAdminPlaceUseCaseImpl,
    },
    {
      provide: 'ListAdminPlacesUseCase',
      useClass: ListAdminPlacesUseCaseImpl,
    },
    
    // Users Management Use Cases
    {
      provide: 'ListAdminUsersUseCase',
      useClass: ListAdminUsersUseCaseImpl,
    },
    {
      provide: 'GetUserDetailsUseCase',
      useClass: GetUserDetailsUseCaseImpl,
    },
    {
      provide: 'UpdateUserRoleUseCase',
      useClass: UpdateUserRoleUseCaseImpl,
    },
    {
      provide: 'SuspendUserUseCase',
      useClass: SuspendUserUseCaseImpl,
    },
    {
      provide: 'ActivateUserUseCase',
      useClass: ActivateUserUseCaseImpl,
    },
    {
      provide: 'DeleteUserUseCase',
      useClass: DeleteUserUseCaseImpl,
    },
    
    // Statistics Use Cases
    {
      provide: 'GetAdminStatsUseCase',
      useClass: GetAdminStatsUseCaseImpl,
    },
    {
      provide: 'GetPlaceStatsUseCase',
      useClass: GetPlaceStatsUseCaseImpl,
    },
    
    // Settings Use Cases
    {
      provide: 'GetSystemSettingsUseCase',
      useClass: GetSystemSettingsUseCaseImpl,
    },
    {
      provide: 'UpdateSystemSettingsUseCase',
      useClass: UpdateSystemSettingsUseCaseImpl,
    },
    
    // Notifications Use Cases
    {
      provide: 'SendBulkNotificationUseCase',
      useClass: SendBulkNotificationUseCaseImpl,
    },
    
    // Reviews Management Use Cases
    {
      provide: 'ListAdminReviewsUseCase',
      useClass: ListAdminReviewsUseCaseImpl,
    },
    {
      provide: 'ApproveReviewUseCase',
      useClass: ApproveReviewUseCaseImpl,
    },
    {
      provide: 'RejectReviewUseCase',
      useClass: RejectReviewUseCaseImpl,
    },
    {
      provide: 'DeleteReviewUseCase',
      useClass: DeleteAdminReviewUseCaseImpl,
    },
  ],
  exports: [
    'AuditRepository',
    'SettingsRepository',
    'SetPlaceStatusUseCase',
    'VerifyPlaceUseCase',
    'FeaturePlaceUseCase',
    'ListAdminPlacesUseCase',
    'GetAdminStatsUseCase',
  ],
})
export class AdminModule {}
