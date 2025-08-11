import { GetUserFavoritesUseCaseImpl } from '../../application/use-cases/get-user-favorites.use-case';
import { AddFavoriteUseCaseImpl } from '../../application/use-cases/add-favorite.use-case';
import { RemoveFavoriteUseCaseImpl } from '../../application/use-cases/remove-favorite.use-case';
import { CheckFavoriteUseCaseImpl } from '../../application/use-cases/check-favorite.use-case';
import { MongoFavoriteRepository } from '../../infrastructure/repositories/mongo-favorite.repository';
import { Provider } from '@nestjs/common';
import { FavoritesProvider } from './favorites.tokens';

export const providers: Provider[] = [
  {
    provide: FavoritesProvider.favoriteRepository,
    useClass: MongoFavoriteRepository,
  },
  {
    provide: FavoritesProvider.getUserFavoritesUseCase,
    useClass: GetUserFavoritesUseCaseImpl
  },
  {
    provide: FavoritesProvider.addFavoriteUseCase,
    useClass: AddFavoriteUseCaseImpl
  },
  {
    provide: FavoritesProvider.removeFavoriteUseCase,
    useClass: RemoveFavoriteUseCaseImpl
  },
  {
    provide: FavoritesProvider.checkFavoriteUseCase,
    useClass: CheckFavoriteUseCaseImpl
  }
];
