import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Entity and Schema
import { Review, ReviewSchema } from './domain/entities/review.entity';

// Repository
import { MongoReviewRepository } from './infrastructure/repositories/mongo-review.repository';

// Use Cases implementations
import { CreateReviewUseCaseImpl } from './application/use-cases/create-review.use-case';
import { GetPlaceReviewsUseCaseImpl } from './application/use-cases/get-place-reviews.use-case';
import { UpdateReviewUseCaseImpl } from './application/use-cases/update-review.use-case';
import { DeleteReviewUseCaseImpl } from './application/use-cases/delete-review.use-case';
import { VoteReviewUseCaseImpl } from './application/use-cases/vote-review.use-case';
import { GetUserReviewsUseCaseImpl } from './application/use-cases/get-user-reviews.use-case';

// Controller
import { ReviewsController } from './controllers/reviews.controller';

// Mapper
import { ReviewMapper } from './application/mappers/review.mapper';

// Import PlacesModule to access PlaceRepository
import { PlacesModule } from '../places/places.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema }
    ]),
    PlacesModule // Para acceder al PlaceRepository
  ],
  controllers: [ReviewsController],
  providers: [
    // Repository
    {
      provide: 'ReviewRepository',
      useClass: MongoReviewRepository,
    },
    
    // Use Cases
    {
      provide: 'CreateReviewUseCase',
      useClass: CreateReviewUseCaseImpl,
    },
    {
      provide: 'GetPlaceReviewsUseCase',
      useClass: GetPlaceReviewsUseCaseImpl,
    },
    {
      provide: 'UpdateReviewUseCase',
      useClass: UpdateReviewUseCaseImpl,
    },
    {
      provide: 'DeleteReviewUseCase',
      useClass: DeleteReviewUseCaseImpl,
    },
    {
      provide: 'VoteReviewUseCase',
      useClass: VoteReviewUseCaseImpl,
    },
    {
      provide: 'GetUserReviewsUseCase',
      useClass: GetUserReviewsUseCaseImpl,
    },
    
    // Mapper
    ReviewMapper,
  ],
  exports: [
    'ReviewRepository',
    'CreateReviewUseCase',
    'GetPlaceReviewsUseCase',
    'UpdateReviewUseCase',
    'DeleteReviewUseCase',
    'VoteReviewUseCase',
    'GetUserReviewsUseCase',
    ReviewMapper,
  ],
})
export class ReviewsModule {}
