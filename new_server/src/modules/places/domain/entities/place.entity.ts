import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface Location {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export interface Contact {
  phone?: string;
  email?: string;
  website?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

export interface Image {
  url: string;
  caption?: string;
  isPrimary: boolean;
}

export interface BusinessHour {
  day: number; // 0 = Sunday, 6 = Saturday
  open?: string; // HH:MM format
  close?: string; // HH:MM format
  isClosed: boolean;
}

export interface Rating {
  average: number;
  count: number;
}

export interface Pricing {
  level: number; // 1-4 ($ - $$$$)
  currency: 'PYG' | 'USD' | 'ARS' | 'BRL';
}

export interface PlaceMetadata {
  views: number;
  likes: number;
  bookmarks: number;
  verified: boolean;
  verifiedAt?: Date;
  featured: boolean;
  featuredUntil?: Date;
  lastUpdated: Date;
}

export interface SeasonalEvent {
  name: string;
  date: Date;
  description: string;
}

export interface HighSeasonPeriod {
  start: Date;
  end: Date;
  priceMultiplier: number;
}

export interface SeasonalInfo {
  highSeason: HighSeasonPeriod[];
  events: SeasonalEvent[];
}

@Schema({ 
  collection: 'places',
  timestamps: true 
})
export class Place extends Document {
  @Prop({ required: true, unique: true, trim: true })
  key: string;

  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ required: true, maxlength: 1000 })
  description: string;

  @Prop({ 
    required: true,
    enum: ['Alojamiento', 'Gastronomía', 'Turístico', 'Compras', 'Entretenimiento', 'Desayunos y meriendas', 'Comida']
  })
  type: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(coords: number[]) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 && // longitude
                 coords[1] >= -90 && coords[1] <= 90; // latitude
        },
        message: 'Invalid coordinates'
      }
    }
  })
  location: Location;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({
    type: {
      phone: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      website: { type: String, trim: true },
      social: {
        facebook: String,
        instagram: String,
        whatsapp: String
      }
    }
  })
  contact: Contact;

  @Prop([{ type: String, trim: true }])
  amenities: string[];

  @Prop([{
    url: { type: String, required: true },
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }])
  images: Image[];

  @Prop([{
    day: { type: Number, min: 0, max: 6, required: true },
    open: { type: String, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    close: { type: String, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    isClosed: { type: Boolean, default: false }
  }])
  businessHours: BusinessHour[];

  @Prop({
    type: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 }
    },
    default: { average: 0, count: 0 }
  })
  rating: Rating;

  @Prop({
    type: {
      level: { type: Number, min: 1, max: 4, default: 2 },
      currency: { type: String, default: 'PYG', enum: ['PYG', 'USD', 'ARS', 'BRL'] }
    },
    default: { level: 2, currency: 'PYG' }
  })
  pricing: Pricing;

  @Prop([{ type: String, trim: true }])
  features: string[];

  @Prop([{ type: String, trim: true, lowercase: true }])
  tags: string[];

  @Prop({ 
    enum: ['active', 'inactive', 'pending', 'seasonal'], 
    default: 'active' 
  })
  status: string;

  @Prop({
    type: {
      views: { type: Number, default: 0, min: 0 },
      likes: { type: Number, default: 0, min: 0 },
      bookmarks: { type: Number, default: 0, min: 0 },
      verified: { type: Boolean, default: false },
      verifiedAt: Date,
      featured: { type: Boolean, default: false },
      featuredUntil: Date,
      lastUpdated: { type: Date, default: Date.now }
    },
    default: {
      views: 0,
      likes: 0,
      bookmarks: 0,
      verified: false,
      featured: false,
      lastUpdated: Date.now
    }
  })
  metadata: PlaceMetadata;

  @Prop({
    type: {
      highSeason: [{
        start: Date,
        end: Date,
        priceMultiplier: { type: Number, default: 1.0 }
      }],
      events: [{
        name: String,
        date: Date,
        description: String
      }]
    }
  })
  seasonalInfo: SeasonalInfo;

  createdAt: Date;
  updatedAt: Date;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);

// Create geospatial index for location-based queries
PlaceSchema.index({ location: '2dsphere' });
