import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review } from '../../domain/entities/review.entity';
import { ReviewRepository } from '../../domain/interfaces/review-repository.interface';

@Injectable()
export class MongoReviewRepository implements ReviewRepository {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>
  ) {}

  async create(reviewData: Partial<Review>): Promise<Review> {
    const review = new this.reviewModel(reviewData);
    return review.save();
  }

  async findById(id: string): Promise<Review | null> {
    return this.reviewModel.findById(id).exec();
  }

  async findOne(query: any): Promise<Review | null> {
    return this.reviewModel.findOne(query).exec();
  }

  async findByPlaceId(
    placeId: string, 
    options: { page?: number; limit?: number; sort?: any; status?: string } = {}
  ): Promise<{ reviews: Review[]; total: number }> {
    const { page = 1, limit = 10, sort = { createdAt: -1 }, status = 'approved' } = options;
    const skip = (page - 1) * limit;

    const query = { placeId: new Types.ObjectId(placeId), status };

    const [reviews, total] = await Promise.all([
      this.reviewModel
        .find(query)
        .populate('userId', 'name')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.reviewModel.countDocuments(query).exec()
    ]);

    return { reviews: reviews as Review[], total };
  }

  async findByUserId(
    userId: string, 
    options: { page?: number; limit?: number } = {}
  ): Promise<{ reviews: Review[]; total: number }> {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query = { userId: new Types.ObjectId(userId) };

    const [reviews, total] = await Promise.all([
      this.reviewModel
        .find(query)
        .populate('placeId', 'name type')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.reviewModel.countDocuments(query).exec()
    ]);

    return { reviews: reviews as Review[], total };
  }

  async update(id: string, updateData: Partial<Review>): Promise<Review | null> {
    return this.reviewModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.reviewModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async getPlaceReviewStats(placeId: string): Promise<{ avgRating: number; totalReviews: number; distribution: Record<string, number> }> {
    const stats = await this.reviewModel.aggregate([
      { $match: { placeId: new Types.ObjectId(placeId), status: 'approved' } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          distribution: { $push: '$rating' }
        }
      }
    ]).exec();

    // Calcular distribución de ratings
    let ratingDistribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    if (stats.length > 0 && stats[0].distribution) {
      stats[0].distribution.forEach((rating: number) => {
        ratingDistribution[rating.toString()]++;
      });
    }

    return {
      avgRating: stats[0]?.avgRating || 0,
      totalReviews: stats[0]?.totalReviews || 0,
      distribution: ratingDistribution
    };
  }

  async countDocuments(query: any): Promise<number> {
    return this.reviewModel.countDocuments(query).exec();
  }
}
