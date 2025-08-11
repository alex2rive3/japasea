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
}
