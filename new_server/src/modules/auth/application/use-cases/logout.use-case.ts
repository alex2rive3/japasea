import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../users/domain/entities/user.entity';
import { MessageResponseDto } from '../dtos/response/auth-response.dto';
import { ILogoutUseCase } from '../../domain';

@Injectable()
export class LogoutUseCase implements ILogoutUseCase {
  private readonly logger = new Logger(LogoutUseCase.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  async execute(userId: string): Promise<MessageResponseDto> {
    this.logger.log(`Logging out user: ${userId}`);
    
    try {
      const user = await this.userModel.findById(userId).exec();
      
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
      
      this.logger.log(`User logged out successfully: ${userId}`);
      
      return {
        success: true,
        message: 'Sesión cerrada exitosamente'
      };
      
    } catch (error) {
      this.logger.error(`Logout failed: ${error.message}`, error.stack);
      throw new Error('Error interno del servidor');
    }
  }
}
