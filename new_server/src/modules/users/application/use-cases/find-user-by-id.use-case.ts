import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../dtos/response/user-response.dto';
import { UserMapper } from '../mappers/user.mapper';
import { IFindUserByIdUseCase } from '../../domain';

@Injectable()
export class FindUserByIdUseCase implements IFindUserByIdUseCase {
  private readonly logger = new Logger(FindUserByIdUseCase.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  async execute(id: string): Promise<UserResponseDto> {
    this.logger.log(`Finding user by id: ${id}`);
    
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundException('Invalid user ID format');
      }

      const user = await this.userModel
        .findOne({ 
          _id: id, 
          status: { $ne: 'deleted' } 
        })
        .populate('favorites.place')
        .exec();
      
      if (!user) {
        this.logger.warn(`User not found with id: ${id}`);
        throw new NotFoundException('User not found');
      }
      
      this.logger.log(`Found user with id: ${id}`);
      return UserMapper.toResponseDto(user);
    } catch (error) {
      this.logger.error(`Failed to find user by id: ${error.message}`, error.stack);
      throw error;
    }
  }
}
