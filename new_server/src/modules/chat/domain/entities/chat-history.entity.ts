import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ChatHistoryDocument = ChatHistory & Document;

@Schema({ 
  timestamps: true,
  collection: 'chathistories'
})
export class ChatHistory {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  user: string;

  @Prop([{
    text: { type: String, required: true },
    sender: { type: String, enum: ['user', 'bot'], required: true },
    timestamp: { type: Date, default: Date.now },
    context: { type: String },
    response: {
      message: { type: String },
      places: [{
        _id: { type: String },
        id: { type: String },
        key: { type: String },
        name: { type: String, default: 'Lugar por definir' },
        category: { type: String },
        description: { type: String },
        address: { type: String },
        location: {
          lat: { type: Number },
          lng: { type: Number },
          address: { type: String },
          city: { type: String }
        },
        imageUrl: { type: String },
        tags: [{ type: String }],
        rating: { type: Number },
        priceLevel: { type: String },
        openingHours: { type: String },
        website: { type: String },
        phone: { type: String },
        features: [{ type: String }]
      }],
      travelPlan: {
        title: { type: String },
        duration: { type: String },
        totalDays: { type: Number },
        days: [{
          dayNumber: { type: Number },
          title: { type: String },
          description: { type: String },
          activities: [{
            time: { type: String },
            category: { type: String },
            place: { type: MongooseSchema.Types.Mixed },
            duration: { type: String },
            tips: [{ type: String }]
          }]
        }],
        budget: {
          total: { type: String },
          breakdown: [{
            category: { type: String },
            amount: { type: String }
          }]
        },
        recommendations: [{ type: String }]
      }
    }
  }])
  messages: Array<{
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    context?: string;
    response?: {
      message?: string;
      places?: any[];
      travelPlan?: any;
    };
  }>;

  @Prop({ default: Date.now })
  lastActivity: Date;

  @Prop({ index: true })
  sessionId: string;
  _id: any;
}

export const ChatHistorySchema = SchemaFactory.createForClass(ChatHistory);

// Índices para mejorar el rendimiento
ChatHistorySchema.index({ user: 1, createdAt: -1 });
ChatHistorySchema.index({ user: 1, lastActivity: -1 });
ChatHistorySchema.index({ user: 1, sessionId: 1 });

// Método para añadir un nuevo mensaje
ChatHistorySchema.methods.addMessage = function(messageData: any) {
  this.messages.push(messageData);
  this.lastActivity = new Date();
  return this.save();
};

// Método para obtener los últimos N mensajes
ChatHistorySchema.methods.getRecentMessages = function(limit: number = 10) {
  return this.messages.slice(-limit);
};
