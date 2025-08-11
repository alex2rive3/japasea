import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Patch, 
  Body, 
  Param, 
  Query, 
  Request,
  UseGuards,
  Inject
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Public, Roles, CurrentUser, UserRole } from '../../../shared';

// Use Cases interfaces
import { CreateReviewUseCase } from '../domain/interfaces/review-use-cases.interface';
import { GetPlaceReviewsUseCase } from '../domain/interfaces/review-use-cases.interface';
import { UpdateReviewUseCase } from '../domain/interfaces/review-use-cases.interface';
import { DeleteReviewUseCase } from '../domain/interfaces/review-use-cases.interface';
import { VoteReviewUseCase } from '../domain/interfaces/review-use-cases.interface';
import { GetUserReviewsUseCase } from '../domain/interfaces/review-use-cases.interface';

// DTOs
import { CreateReviewRequestDto } from '../application/dtos/request/create-review.request.dto';
import { UpdateReviewRequestDto } from '../application/dtos/request/update-review.request.dto';
import { VoteReviewRequestDto } from '../application/dtos/request/vote-review.request.dto';
import { ReviewResponseDto, PlaceReviewsResponseDto, VoteResponseDto } from '../application/dtos/response/review.response.dto';

@Controller({ path: 'reviews', version: '1' })
@ApiTags('reviews')
export class ReviewsController {
  constructor(
    @Inject('CreateReviewUseCase') private readonly createReviewUseCase: CreateReviewUseCase,
    @Inject('GetPlaceReviewsUseCase') private readonly getPlaceReviewsUseCase: GetPlaceReviewsUseCase,
    @Inject('UpdateReviewUseCase') private readonly updateReviewUseCase: UpdateReviewUseCase,
    @Inject('DeleteReviewUseCase') private readonly deleteReviewUseCase: DeleteReviewUseCase,
    @Inject('VoteReviewUseCase') private readonly voteReviewUseCase: VoteReviewUseCase,
    @Inject('GetUserReviewsUseCase') private readonly getUserReviewsUseCase: GetUserReviewsUseCase,
  ) {}

  @Get('place/:placeId')
  @Public()
  @ApiOperation({ summary: 'Get reviews for a specific place' })
  @ApiResponse({ status: 200, description: 'Success', type: PlaceReviewsResponseDto })
  @ApiResponse({ status: 404, description: 'Place not found' })
  async getPlaceReviews(
    @Param('placeId') placeId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
    @Request() req?: any
  ): Promise<{ success: boolean; data: PlaceReviewsResponseDto }> {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    const userId = req?.user?.id;

    const data = await this.getPlaceReviewsUseCase.execute(placeId, pageNum, limitNum, sort, userId);
    
    return {
      success: true,
      data
    };
  }

  @Post('place/:placeId')
  @ApiOperation({ summary: 'Create a new review for a place' })
  @ApiResponse({ status: 201, description: 'Review created successfully', type: ReviewResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Place not found' })
  @ApiBearerAuth()
  async createReview(
    @CurrentUser() user: any,
    @Param('placeId') placeId: string,
    @Body() createReviewDto: CreateReviewRequestDto,
    @Request() req: any
  ): Promise<{ success: boolean; data: ReviewResponseDto; message: string }> {
    const metadata = {
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    };

    const review = await this.createReviewUseCase.execute(placeId, user.id, createReviewDto, metadata);
    
    return {
      success: true,
      data: review,
      message: 'Reseña creada exitosamente. Será visible después de ser aprobada.'
    };
  }

  @Put(':reviewId')
  @ApiOperation({ summary: 'Update own review' })
  @ApiResponse({ status: 200, description: 'Review updated successfully', type: ReviewResponseDto })
  @ApiResponse({ status: 400, description: 'Cannot edit approved review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiBearerAuth()
  async updateReview(
    @CurrentUser() user: any,
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: UpdateReviewRequestDto
  ): Promise<{ success: boolean; data: ReviewResponseDto; message: string }> {
    const review = await this.updateReviewUseCase.execute(reviewId, user.id, updateReviewDto);
    
    return {
      success: true,
      data: review,
      message: 'Reseña actualizada. Será visible después de ser aprobada.'
    };
  }

  @Delete(':reviewId')
  @ApiOperation({ summary: 'Delete own review' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiBearerAuth()
  async deleteReview(
    @CurrentUser() user: any,
    @Param('reviewId') reviewId: string
  ): Promise<{ success: boolean; message: string }> {
    await this.deleteReviewUseCase.execute(reviewId, user.id);
    
    return {
      success: true,
      message: 'Reseña eliminada correctamente'
    };
  }

  @Post(':reviewId/vote')
  @ApiOperation({ summary: 'Vote on review helpfulness' })
  @ApiResponse({ status: 200, description: 'Vote registered successfully', type: VoteResponseDto })
  @ApiResponse({ status: 400, description: 'Cannot vote on own review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiBearerAuth()
  async voteReview(
    @CurrentUser() user: any,
    @Param('reviewId') reviewId: string,
    @Body() voteDto: VoteReviewRequestDto
  ): Promise<{ success: boolean; data: VoteResponseDto; message: string }> {
    const vote = await this.voteReviewUseCase.execute(reviewId, user.id, voteDto);
    
    return {
      success: true,
      data: vote,
      message: 'Voto registrado correctamente'
    };
  }

  @Get('user/my-reviews')
  @ApiOperation({ summary: 'Get current user reviews' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiBearerAuth()
  async getUserReviews(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ): Promise<{ success: boolean; data: ReviewResponseDto[]; pagination: any }> {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;

    const result = await this.getUserReviewsUseCase.execute(user.id, pageNum, limitNum);
    
    return {
      success: true,
      data: result.reviews,
      pagination: result.pagination
    };
  }
}
