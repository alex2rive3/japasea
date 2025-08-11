import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Audit, AuditDocument } from '../../domain/entities/audit.entity';
import { AuditRepository } from '../../domain/interfaces/repositories';

@Injectable()
export class MongoAuditRepository implements AuditRepository {
  constructor(
    @InjectModel(Audit.name) private auditModel: Model<AuditDocument>,
  ) {}

  async create(auditData: Partial<Audit>): Promise<Audit> {
    const audit = new this.auditModel({
      ...auditData,
      timestamp: auditData.timestamp || new Date(),
    });
    return audit.save();
  }

  async findByUserId(userId: string, page: number, limit: number): Promise<{ data: Audit[]; total: number; }> {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.auditModel
        .find({ userId })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'username email')
        .lean(),
      this.auditModel.countDocuments({ userId })
    ]);

    return { data, total };
  }

  async findByResource(resource: string, resourceId: string): Promise<Audit[]> {
    return this.auditModel
      .find({ resource, resourceId })
      .sort({ timestamp: -1 })
      .populate('userId', 'username email')
      .lean();
  }

  async findRecent(limit: number): Promise<Audit[]> {
    return this.auditModel
      .find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('userId', 'username email')
      .lean();
  }
}
