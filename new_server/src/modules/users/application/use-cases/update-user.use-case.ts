import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../../domain/entities/user.entity';
import { UpdateUserRequestDto } from '../dtos/request/update-user.request.dto';
import { UserResponseDto } from '../dtos/response/user-response.dto';
import { UserMapper } from '../mappers/user.mapper';
import { IUpdateUserUseCase } from '../../domain';

@Injectable()
export class UpdateUserUseCase implements IUpdateUserUseCase {
  private readonly logger = new Logger(UpdateUserUseCase.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  async execute(id: string, updateUserDto: UpdateUserRequestDto): Promise<UserResponseDto> {
    this.logger.log(`Updating user with id: ${id}`);
    
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundException('Invalid user ID format');
      }

      // Prepare update data
      const updateData: any = { ...updateUserDto };

      // Hash password if provided
      if (updateData.password) {
        const saltRounds = 12;
        updateData.password = await bcrypt.hash(updateData.password, saltRounds);
      }

      // Convert email to lowercase if provided
      if (updateData.email) {
        updateData.email = updateData.email.toLowerCase();
      }

      // Update preferences if language is provided
      if (updateData.language) {
        updateData['preferences.language'] = updateData.language;
        delete updateData.language;
      }

      const updatedUser = await this.userModel
        .findOneAndUpdate(
          { _id: id, status: { $ne: 'deleted' } },
          { $set: updateData },
          { new: true, runValidators: true }
        )
        .populate('favorites.place')
        .exec();
      
      if (!updatedUser) {
        this.logger.warn(`User not found with id: ${id}`);
        throw new NotFoundException('User not found');
      }
      
      this.logger.log(`User updated successfully with id: ${id}`);
      return UserMapper.toResponseDto(updatedUser);
    } catch (error) {
      this.logger.error(`Failed to update user: ${error.message}`, error.stack);
      throw error;
    }
  }
}
