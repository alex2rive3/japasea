import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings, SettingsDocument } from '../../domain/entities/settings.entity';
import { SettingsRepository } from '../../domain/interfaces/repositories';

@Injectable()
export class MongoSettingsRepository implements SettingsRepository {
  constructor(
    @InjectModel(Settings.name) private settingsModel: Model<SettingsDocument>,
  ) {}

  async findAll(): Promise<Settings[]> {
    return this.settingsModel.find({}).lean();
  }

  async findByKey(key: string): Promise<Settings | null> {
    return this.settingsModel.findOne({ key }).lean();
  }

  async updateByKey(key: string, value: any): Promise<Settings | null> {
    return this.settingsModel.findOneAndUpdate(
      { key },
      { value, updatedAt: new Date() },
      { new: true }
    ).lean();
  }

  async createOrUpdate(key: string, value: any, description?: string, type?: string): Promise<Settings> {
    const existing = await this.settingsModel.findOne({ key });
    
    if (existing) {
      existing.value = value;
      if (description !== undefined) existing.description = description;
      if (type !== undefined) existing.type = type;
      return existing.save();
    }

    const settings = new this.settingsModel({
      key,
      value,
      description,
      type: type || this.inferType(value),
      isActive: true,
      isSystem: false,
    });

    return settings.save();
  }

  async findActive(): Promise<Settings[]> {
    return this.settingsModel.find({ isActive: true }).lean();
  }

  private inferType(value: any): string {
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    return 'string';
  }
}
