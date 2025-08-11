import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Entity and Schema
import { Favorite, FavoriteSchema } from './domain/entities/favorite.entity';

// Repository
import { MongoFavoriteRepository } from './infrastructure/repositories/mongo-favorite.repository';

// Use Cases implementations
import { GetUserFavoritesUseCaseImpl } from './application/use-cases/get-user-favorites.use-case';
import { AddFavoriteUseCaseImpl } from './application/use-cases/add-favorite.use-case';
import { RemoveFavoriteUseCaseImpl } from './application/use-cases/remove-favorite.use-case';
import { CheckFavoriteUseCaseImpl } from './application/use-cases/check-favorite.use-case';

// Controller
import { FavoritesController } from './controllers/favorites.controller';

// Import PlacesModule to access PlaceRepository
import { PlacesModule } from '../places/places.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Favorite.name, schema: FavoriteSchema }
    ]),
    PlacesModule // Para acceder al PlaceRepository
  ],
  controllers: [FavoritesController],
  providers: [
    // Repository
    {
      provide: 'FavoriteRepository',
      useClass: MongoFavoriteRepository,
    },
    
    // Use Cases
    {
      provide: 'GetUserFavoritesUseCase',
      useClass: GetUserFavoritesUseCaseImpl,
    },
    {
      provide: 'AddFavoriteUseCase',
      useClass: AddFavoriteUseCaseImpl,
    },
    {
      provide: 'RemoveFavoriteUseCase',
      useClass: RemoveFavoriteUseCaseImpl,
    },
    {
      provide: 'CheckFavoriteUseCase',
      useClass: CheckFavoriteUseCaseImpl,
    },
    
    // TODO: Implementar use cases restantes
    {
      provide: 'CheckMultipleFavoritesUseCase',
      useFactory: () => ({
        execute: async (userId: string, data: any) => {
          throw new Error('CheckMultipleFavoritesUseCase no implementado aún');
        }
      }),
    },
    {
      provide: 'GetFavoriteStatsUseCase',
      useFactory: () => ({
        execute: async (userId: string) => {
          throw new Error('GetFavoriteStatsUseCase no implementado aún');
        }
      }),
    },
    {
      provide: 'SyncFavoritesUseCase',
      useFactory: () => ({
        execute: async (userId: string, data: any) => {
          throw new Error('SyncFavoritesUseCase no implementado aún');
        }
      }),
    },
  ],
  exports: [
    'FavoriteRepository',
    'GetUserFavoritesUseCase',
    'AddFavoriteUseCase',
    'RemoveFavoriteUseCase',
    'CheckFavoriteUseCase',
  ],
})
export class FavoritesModule {}
