import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../domain/entities/user.entity';
import { SoftDeleteUserRequestDto } from '../dtos/request/soft-delete-user.request.dto';
import { UserResponseDto } from '../dtos/response/user-response.dto';
import { UserMapper } from '../mappers/user.mapper';
import { ISoftDeleteUserUseCase } from '../../domain';

@Injectable()
export class SoftDeleteUserUseCase implements ISoftDeleteUserUseCase {
  private readonly logger = new Logger(SoftDeleteUserUseCase.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  async execute(softDeleteDto: SoftDeleteUserRequestDto): Promise<UserResponseDto> {
    this.logger.log(`Soft deleting user with id: ${softDeleteDto.id}`);
    
    try {
      if (!Types.ObjectId.isValid(softDeleteDto.id)) {
        throw new NotFoundException('Invalid user ID format');
      }

      const deletedUser = await this.userModel
        .findOneAndUpdate(
          { _id: softDeleteDto.id, status: { $ne: 'deleted' } },
          { 
            $set: { 
              status: 'deleted',
              isActive: false,
              email: `deleted_${Date.now()}_${softDeleteDto.id}@japasea.com`
            }
          },
          { new: true, runValidators: true }
        )
        .exec();
      
      if (!deletedUser) {
        this.logger.warn(`User not found with id: ${softDeleteDto.id}`);
        throw new NotFoundException('User not found');
      }
      
      this.logger.log(`User soft deleted successfully with id: ${softDeleteDto.id}`);
      return UserMapper.toResponseDto(deletedUser);
    } catch (error) {
      this.logger.error(`Failed to soft delete user: ${error.message}`, error.stack);
      throw error;
    }
  }
}
