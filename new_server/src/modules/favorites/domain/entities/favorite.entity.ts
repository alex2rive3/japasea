import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type FavoriteDocument = Favorite & Document;

@Schema({ 
  timestamps: true,
  collection: 'favorites'
})
export class Favorite {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Place', required: true, index: true })
  placeId: string;

  @Prop({ default: Date.now })
  addedAt: Date;

  @Prop({ type: Object })
  metadata?: {
    addedFrom?: string; // 'web', 'mobile', 'api'
    notes?: string;
  };
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);

// Índices para evitar duplicados y optimizar consultas
FavoriteSchema.index({ userId: 1, placeId: 1 }, { unique: true });
FavoriteSchema.index({ userId: 1, addedAt: -1 });
FavoriteSchema.index({ placeId: 1 });
