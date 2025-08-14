import { Review } from '../entities/review.entity';

export interface ReviewRepository {
  create(reviewData: Partial<Review>): Promise<Review>;
  findById(id: string): Promise<Review | null>;
  findOne(query: any): Promise<Review | null>;
  findByPlaceId(placeId: string, options?: { page?: number; limit?: number; sort?: any; status?: string }): Promise<{ reviews: Review[]; total: number }>;
  findByUserId(userId: string, options?: { page?: number; limit?: number }): Promise<{ reviews: Review[]; total: number }>;
  update(id: string, updateData: Partial<Review>): Promise<Review | null>;
  delete(id: string): Promise<boolean>;
  getPlaceReviewStats(placeId: string): Promise<{ avgRating: number; totalReviews: number; distribution: Record<string, number> }>;
  countDocuments(query: any): Promise<number>;
  getReviewsByRating(): Promise<Array<{ _id: number; count: number }>>;
}
