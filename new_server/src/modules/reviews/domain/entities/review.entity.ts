import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface HelpfulVote {
  userId: Types.ObjectId;
  vote: 'yes' | 'no';
}

@Schema({ 
  collection: 'reviews',
  timestamps: true 
})
export class Review extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Place', required: true })
  placeId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true, minlength: 10, maxlength: 1000 })
  comment: string;

  @Prop({ 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  })
  status: string;

  @Prop()
  rejectionReason?: string;

  @Prop([String])
  images: string[];

  @Prop({ default: 0 })
  helpful: number;

  @Prop([{
    userId: { type: Types.ObjectId, ref: 'User' },
    vote: { type: String, enum: ['yes', 'no'] }
  }])
  helpfulVotes: HelpfulVote[];

  createdAt: Date;
  updatedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Create compound index for user-place uniqueness
ReviewSchema.index({ userId: 1, placeId: 1 }, { unique: true });
// Index for place reviews
ReviewSchema.index({ placeId: 1, status: 1, createdAt: -1 });
