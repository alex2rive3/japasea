import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../dtos/response/user-response.dto';
import { UserMapper } from '../mappers/user.mapper';
import { IFindAllUsersUseCase } from '../../domain';

@Injectable()
export class FindAllUsersUseCase implements IFindAllUsersUseCase {
  private readonly logger = new Logger(FindAllUsersUseCase.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  async execute(): Promise<UserResponseDto[]> {
    this.logger.log('Finding all users');
    
    try {
      const users = await this.userModel
        .find({ status: { $ne: 'deleted' } })
        .populate('favorites.place')
        .sort({ createdAt: -1 })
        .exec();
      
      this.logger.log(`Found ${users.length} users`);
      return UserMapper.toResponseDtoArray(users);
    } catch (error) {
      this.logger.error(`Failed to find users: ${error.message}`, error.stack);
      throw error;
    }
  }
}
