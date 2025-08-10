import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../users/domain/entities/user.entity';
import { RefreshTokenRequestDto } from '../dtos/request/auth.request.dto';
import { RefreshTokenResponseDto } from '../dtos/response/auth-response.dto';
import { IRefreshTokenUseCase } from '../../domain';

@Injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  private readonly logger = new Logger(RefreshTokenUseCase.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService
  ) {}

  async execute(refreshDto: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    this.logger.log('Refreshing token');
    
    try {
      const { refreshToken } = refreshDto;
      
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token requerido');
      }
      
      // Verify refresh token
      const decoded = this.jwtService.verify(refreshToken);
      
      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException('Token inválido');
      }
      
      // Find user with refresh token
      const user = await this.userModel
        .findById(decoded.id)
        .select('+refreshToken')
        .exec();
      
      if (!user || user.refreshToken !== refreshToken) {
        this.logger.warn(`Invalid refresh token for user: ${decoded.id}`);
        throw new UnauthorizedException('Refresh token inválido');
      }
      
      if (!user.isActive) {
        this.logger.warn(`Refresh token attempt for inactive user: ${user.email}`);
        throw new UnauthorizedException('Cuenta desactivada');
      }
      
      // Generate new tokens
      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);
      
      // Save new refresh token
      user.refreshToken = newRefreshToken;
      await user.save();
      
      this.logger.log(`Token refreshed successfully for user: ${user._id}`);
      
      return {
        success: true,
        message: 'Token renovado exitosamente',
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      };
      
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`, error.stack);
      
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expirado');
      }
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new Error('Error interno del servidor');
    }
  }
  
  private generateAccessToken(user: any): string {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      type: 'access'
    };
    
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }
  
  private generateRefreshToken(user: any): string {
    const payload = {
      id: user._id,
      type: 'refresh'
    };
    
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
}
