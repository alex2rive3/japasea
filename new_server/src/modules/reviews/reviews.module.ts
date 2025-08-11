import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Entity and Schema
import { Review, ReviewSchema } from './domain/entities/review.entity';

// Controller
import { ReviewsController } from './controllers/reviews.controller';

// Mapper
import { ReviewMapper } from './application/mappers/review.mapper';

// Import PlacesModule to access PlaceRepository
import { PlacesModule } from '../places/places.module';

// Providers
import { providers } from './domain/providers/reviews.provider';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema }
    ]),
    PlacesModule // Para acceder al PlaceRepository
  ],
  controllers: [ReviewsController],
  providers: [
    ...providers,
    ReviewMapper,
  ],
  exports: [
    ...providers,
    ReviewMapper,
  ],
})
export class ReviewsModule {}
