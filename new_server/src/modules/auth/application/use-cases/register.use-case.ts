import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { User } from '../../../users/domain/entities/user.entity';
import { RegisterRequestDto } from '../dtos/request/auth.request.dto';
import { RegisterResponseDto } from '../dtos/response/auth-response.dto';
import { IRegisterUseCase } from '../../domain';

@Injectable()
export class RegisterUseCase implements IRegisterUseCase {
  private readonly logger = new Logger(RegisterUseCase.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService
  ) {}

  async execute(registerDto: RegisterRequestDto): Promise<RegisterResponseDto> {
    this.logger.log(`Registration attempt for email: ${registerDto.email}`);
    
    try {
      const { name, email, password, phone } = registerDto;
      
      // Check if user already exists
      const existingUser = await this.userModel.findOne({ email }).exec();
      
      if (existingUser) {
        this.logger.warn(`Registration attempt with existing email: ${email}`);
        throw new ConflictException('El usuario ya existe con este email');
      }
      
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Create user
      const user = new this.userModel({
        name,
        email,
        password: hashedPassword,
        phone
      });
      
      // Generate email verification token
      const verificationToken = this.createEmailVerificationToken();
      user.emailVerificationToken = verificationToken;
      user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      await user.save();
      
      // Try to send verification email (don't fail registration if email fails)
      try {
        // TODO: Implement email service
        // await this.emailService.sendVerificationEmail(user, verificationToken);
        this.logger.log(`Verification email should be sent to: ${user.email}`);
      } catch (emailError) {
        this.logger.error('Error sending verification email:', emailError);
        // Don't fail registration if email service fails
      }
      
      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);
      
      // Save refresh token
      user.refreshToken = refreshToken;
      await user.save();
      
      this.logger.log(`User registered successfully with id: ${user._id}`);
      
      return {
        success: true,
        message: 'Usuario registrado exitosamente',
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
      this.logger.error(`Registration failed: ${error.message}`, error.stack);
      
      if (error instanceof ConflictException) {
        throw error;
      }
      
      if (error.code === 11000) {
        throw new ConflictException('El email ya está en uso');
      }
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err: any) => ({
          field: err.path,
          message: err.message
        }));
        
        throw new Error(`Datos de entrada inválidos: ${JSON.stringify(errors)}`);
      }
      
      throw new Error('Error interno del servidor');
    }
  }
  
  private createEmailVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
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
