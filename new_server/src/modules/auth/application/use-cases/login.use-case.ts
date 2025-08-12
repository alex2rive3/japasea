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
    const email = (loginDto.email || '').trim().toLowerCase();
    this.logger.log(`Login attempt for email: ${email}`);
    
    try {
      const user = await this.userModel
        .findOne({ email })
        .select('+password +loginAttempts +lockUntil')
        .exec();
      
      if (!user) {
        this.logger.warn(`User not found with email: ${email}`);
        throw new UnauthorizedException('Credenciales inválidas');
      }
      
      if (user.isActive === false) {
        this.logger.warn(`Inactive account login attempt: ${email}`);
        throw new UnauthorizedException('Cuenta desactivada. Contacte al administrador.');
      }
      
      // Check if account is locked
      if (user.lockUntil && user.lockUntil > new Date()) {
        this.logger.warn(`Locked account login attempt: ${email}`);
        throw new UnauthorizedException('Cuenta bloqueada temporalmente debido a múltiples intentos fallidos');
      }
      
      // Verify password (assuming comparePassword method exists on user model)
      const isValidPassword = await this.comparePassword(loginDto.password, (user as any).password);
      
      if (!isValidPassword) {
        await this.incrementLoginAttempts(user as any);
        this.logger.warn(`Invalid password attempt for: ${email}`);
        throw new UnauthorizedException('Credenciales inválidas');
      }
      
      // Reset login attempts on successful login
      await this.resetLoginAttempts(user as any);
      
      // Generate tokens
      const accessToken = this.generateAccessToken(user as any);
      const refreshToken = this.generateRefreshToken(user as any);
      
      // Save refresh token
      (user as any).refreshToken = refreshToken;
      (user as any).lastLogin = new Date();
      await (user as any).save();
      
      this.logger.log(`Successful login for user: ${user._id}`);
      
      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          user: {
            id: (user as any)._id.toString(),
            name: (user as any).name,
            email: (user as any).email,
            phone: (user as any).phone,
            role: (user as any).role,
            isEmailVerified: (user as any).isEmailVerified,
            createdAt: (user as any).createdAt
          },
          accessToken,
          refreshToken
        }
      };
      
    } catch (error) {
      this.logger.error(`Login failed: ${(error as any).message}`, (error as any).stack);
      
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
    if ((user.loginAttempts ?? 0) >= 4) {
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
