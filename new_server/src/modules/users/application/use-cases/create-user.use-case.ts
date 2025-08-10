import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../../domain/entities/user.entity';
import { CreateUserRequestDto } from '../dtos/request/create-user.request.dto';
import { UserResponseDto } from '../dtos/response/user-response.dto';
import { UserMapper } from '../mappers/user.mapper';
import { ICreateUserUseCase } from '../../domain';

@Injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  async execute(createUserDto: CreateUserRequestDto): Promise<UserResponseDto> {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);
    
    try {
      // Check if user already exists
      const existingUser = await this.userModel.findOne({ 
        email: createUserDto.email.toLowerCase() 
      });
      
      if (existingUser) {
        this.logger.warn(`User with email ${createUserDto.email} already exists`);
        throw new ConflictException('Email already exists');
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

      // Create user data
      const userData = {
        ...createUserDto,
        password: hashedPassword,
        email: createUserDto.email.toLowerCase(),
        preferences: {
          notifications: { email: true, push: true, newsletter: false },
          language: createUserDto.language || 'es',
          theme: 'light',
          searchHistory: true
        }
      };

      const createdUser = new this.userModel(userData);
      const savedUser = await createdUser.save();
      
      this.logger.log(`User created successfully with id: ${savedUser._id}`);
      return UserMapper.toResponseDto(savedUser);
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }
}
