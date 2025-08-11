import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AuditDocument = Audit & Document;

@Schema({ 
  timestamps: true,
  collection: 'audits'
})
export class Audit {
  @Prop({ required: true, index: true })
  action: string; // 'create', 'update', 'delete', 'login', 'logout', etc.

  @Prop({ required: true, index: true })
  resource: string; // 'user', 'place', 'review', etc.

  @Prop({ type: MongooseSchema.Types.ObjectId, index: true })
  resourceId?: string; // ID del recurso afectado

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: string; // Usuario que realizó la acción

  @Prop({ type: Object })
  metadata?: Record<string, any>; // Datos adicionales del cambio

  @Prop({ type: Object })
  oldData?: Record<string, any>; // Estado anterior (para updates/deletes)

  @Prop({ type: Object })
  newData?: Record<string, any>; // Estado nuevo (para creates/updates)

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;

  @Prop({ default: Date.now, index: true })
  timestamp: Date;
}

export const AuditSchema = SchemaFactory.createForClass(Audit);

// Índices compuestos para consultas comunes
AuditSchema.index({ userId: 1, timestamp: -1 });
AuditSchema.index({ resource: 1, resourceId: 1, timestamp: -1 });
AuditSchema.index({ action: 1, timestamp: -1 });
