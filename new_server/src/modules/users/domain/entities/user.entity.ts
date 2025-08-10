import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface Favorite {
  place: Types.ObjectId;
  addedAt: Date;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  newsletter: boolean;
}

export interface UserPreferences {
  notifications: NotificationPreferences;
  language: 'es' | 'pt' | 'en';
  theme: 'light' | 'dark' | 'auto';
  searchHistory: boolean;
}

export interface SearchHistoryItem {
  query: string;
  searchedAt: Date;
  resultsCount: number;
}

@Schema({ 
  collection: 'users',
  timestamps: true 
})
export class User extends Document {
  @Prop({ required: true, maxlength: 50, trim: true })
  name: string;

  @Prop({ 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  })
  email: string;

  @Prop({ required: true, minlength: 6, select: false })
  password: string;

  @Prop({ enum: ['user', 'admin'], default: 'user' })
  role: string;

  @Prop({ enum: ['active', 'suspended', 'deleted'], default: 'active' })
  status: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ default: null })
  profilePicture?: string;

  @Prop({ select: false })
  refreshToken?: string;

  @Prop({ select: false })
  passwordResetToken?: string;

  @Prop({ select: false })
  passwordResetExpires?: Date;

  @Prop({ select: false })
  emailVerificationToken?: string;

  @Prop({ select: false })
  emailVerificationExpires?: Date;

  @Prop({ default: 0 })
  loginAttempts: number;

  @Prop()
  lockUntil?: Date;

  @Prop()
  lastLogin?: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ 
    type: [{
      place: { type: Types.ObjectId, ref: 'Place' },
      addedAt: { type: Date, default: Date.now }
    }],
    default: []
  })
  favorites: Favorite[];

  @Prop({ 
    type: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        newsletter: { type: Boolean, default: false }
      },
      language: { type: String, enum: ['es', 'pt', 'en'], default: 'es' },
      theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'light' },
      searchHistory: { type: Boolean, default: true }
    },
    default: {
      notifications: { email: true, push: true, newsletter: false },
      language: 'es',
      theme: 'light',
      searchHistory: true
    }
  })
  preferences: UserPreferences;

  @Prop({ 
    type: [{
      query: String,
      searchedAt: { type: Date, default: Date.now },
      resultsCount: Number
    }],
    default: []
  })
  searchHistory: SearchHistoryItem[];

  @Prop({ default: false })
  emailVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
