import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface';

@Injectable()
export class MongoUserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email, isDeleted: false }).exec();
  }

  async findById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({ isDeleted: false }).exec();
  }

  async findByRole(role: string): Promise<User[]> {
    return this.userModel.find({ role, isDeleted: false }).exec();
  }

  async create(userData: any): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async update(userId: string, updateData: any): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .exec();
  }

  async softDelete(userId: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, { isDeleted: true, deletedAt: new Date() })
      .exec();
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, { 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .exec();
  }

  async updateResetPasswordAttempt(userId: string, attemptDate: Date): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, { 
        lastResetPasswordAttempt: attemptDate,
        updatedAt: new Date()
      })
      .exec();
  }

  async countDocuments(filter: any): Promise<number> {
    return this.userModel.countDocuments(filter).exec();
  }

  async getUserGrowthByMonth(startDate: Date): Promise<Array<{ period: string; count: number }>> {
    const result = await this.userModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $project: {
          period: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              { $cond: { if: { $lt: ['$_id.month', 10] }, then: { $concat: ['0', { $toString: '$_id.month' }] }, else: { $toString: '$_id.month' } } }
            ]
          },
          count: 1,
          _id: 0
        }
      }
    ]).exec();

    return result;
  }
}
