import { CreateReviewUseCaseImpl } from '../../application/use-cases/create-review.use-case';
import { GetPlaceReviewsUseCaseImpl } from '../../application/use-cases/get-place-reviews.use-case';
import { UpdateReviewUseCaseImpl } from '../../application/use-cases/update-review.use-case';
import { DeleteReviewUseCaseImpl } from '../../application/use-cases/delete-review.use-case';
import { VoteReviewUseCaseImpl } from '../../application/use-cases/vote-review.use-case';
import { GetUserReviewsUseCaseImpl } from '../../application/use-cases/get-user-reviews.use-case';
import { MongoReviewRepository } from '../../infrastructure/repositories/mongo-review.repository';
import { Provider } from '@nestjs/common';
import { ReviewsProvider } from './reviews.tokens';

export const providers: Provider[] = [
  {
    provide: ReviewsProvider.reviewRepository,
    useClass: MongoReviewRepository,
  },
  {
    provide: ReviewsProvider.createReviewUseCase,
    useClass: CreateReviewUseCaseImpl
  },
  {
    provide: ReviewsProvider.getPlaceReviewsUseCase,
    useClass: GetPlaceReviewsUseCaseImpl
  },
  {
    provide: ReviewsProvider.updateReviewUseCase,
    useClass: UpdateReviewUseCaseImpl
  },
  {
    provide: ReviewsProvider.deleteReviewUseCase,
    useClass: DeleteReviewUseCaseImpl
  },
  {
    provide: ReviewsProvider.voteReviewUseCase,
    useClass: VoteReviewUseCaseImpl
  },
  {
    provide: ReviewsProvider.getUserReviewsUseCase,
    useClass: GetUserReviewsUseCaseImpl
  }
];
