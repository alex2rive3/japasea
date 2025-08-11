import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Entity and Schema
import { Favorite, FavoriteSchema } from './domain/entities/favorite.entity';

// Controller
import { FavoritesController } from './controllers/favorites.controller';

// Import PlacesModule to access PlaceRepository
import { PlacesModule } from '../places/places.module';

// Providers
import { providers } from './domain/providers/favorites.provider';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Favorite.name, schema: FavoriteSchema }
    ]),
    PlacesModule // Para acceder al PlaceRepository
  ],
  controllers: [FavoritesController],
  providers: [
    ...providers,
    
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
    ...providers,
  ],
})
export class FavoritesModule {}
