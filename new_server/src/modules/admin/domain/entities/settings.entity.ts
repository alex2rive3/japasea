import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingsDocument = Settings & Document;

@Schema({ 
  timestamps: true,
  collection: 'settings'
})
export class Settings {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ type: Object, required: true })
  value: any;

  @Prop()
  description?: string;

  @Prop({ default: 'string' })
  type: string; // 'string', 'number', 'boolean', 'object', 'array'

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isSystem: boolean; // true si es una configuración crítica del sistema
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);

// Índices
SettingsSchema.index({ key: 1 }, { unique: true });
SettingsSchema.index({ isActive: 1 });
SettingsSchema.index({ isSystem: 1 });
