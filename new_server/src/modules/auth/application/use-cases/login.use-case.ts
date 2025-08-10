import { Injectable, UnauthorizedException, Logger, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../users/domain/entities/user.entity';
import { LoginRequestDto } from '../dtos/request/auth.request.dto';
import { LoginResponseDto } from '../dtos/response/auth-response.dto';
import { ILoginUseCase } from '../../domain';

@Injectable()
export class LoginUseCase implements ILoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService
  ) {}

  async execute(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);
    
    try {
      const user = await this.userModel
        .findOne({ email: loginDto.email })
        .select('+password +loginAttempts +lockUntil')
        .exec();
      
      if (!user) {
        this.logger.warn(`User not found with email: ${loginDto.email}`);
        throw new UnauthorizedException('Credenciales inválidas');
      }
      
      if (!user.isActive) {
        this.logger.warn(`Inactive account login attempt: ${loginDto.email}`);
        throw new UnauthorizedException('Cuenta desactivada. Contacte al administrador.');
      }
      
      // Check if account is locked
      if (user.lockUntil && user.lockUntil > new Date()) {
        this.logger.warn(`Locked account login attempt: ${loginDto.email}`);
        throw new UnauthorizedException('Cuenta bloqueada temporalmente debido a múltiples intentos fallidos');
      }
      
      // Verify password (assuming comparePassword method exists on user model)
      const isValidPassword = await this.comparePassword(loginDto.password, user.password);
      
      if (!isValidPassword) {
        await this.incrementLoginAttempts(user);
        this.logger.warn(`Invalid password attempt for: ${loginDto.email}`);
        throw new UnauthorizedException('Credenciales inválidas');
      }
      
      // Reset login attempts on successful login
      await this.resetLoginAttempts(user);
      
      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);
      
      // Save refresh token
      user.refreshToken = refreshToken;
      user.lastLogin = new Date();
      await user.save();
      
      this.logger.log(`Successful login for user: ${user._id}`);
      
      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt
          },
          accessToken,
          refreshToken
        }
      };
      
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`, error.stack);
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new Error('Error interno del servidor');
    }
  }
  
  private async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    const bcrypt = require('bcryptjs');
    return bcrypt.compare(plainPassword, hashedPassword);
  }
  
  private async incrementLoginAttempts(user: any): Promise<void> {
    const updates: any = { $inc: { loginAttempts: 1 } };
    
    // Lock account after 5 failed attempts
    if (user.loginAttempts >= 4) {
      updates.$set = {
        lockUntil: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes lock
      };
    }
    
    await this.userModel.findByIdAndUpdate(user._id, updates).exec();
  }
  
  private async resetLoginAttempts(user: any): Promise<void> {
    await this.userModel.findByIdAndUpdate(user._id, {
      $unset: { loginAttempts: 1, lockUntil: 1 }
    }).exec();
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
