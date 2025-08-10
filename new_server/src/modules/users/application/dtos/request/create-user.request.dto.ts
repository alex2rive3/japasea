import { IsString, IsEmail, MinLength, MaxLength, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestDto {
  @IsString()
  @MaxLength(50)
  @ApiProperty({ description: 'User name', maxLength: 50 })
  name: string;

  @IsEmail()
  @ApiProperty({ description: 'User email address' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ description: 'User password', minLength: 6 })
  password: string;

  @IsOptional()
  @IsEnum(['user', 'admin'])
  @ApiProperty({ description: 'User role', enum: ['user', 'admin'], default: 'user', required: false })
  role?: 'user' | 'admin';

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'User phone number', required: false })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Profile picture URL', required: false })
  profilePicture?: string;

  @IsOptional()
  @IsEnum(['es', 'pt', 'en'])
  @ApiProperty({ description: 'User language preference', enum: ['es', 'pt', 'en'], default: 'es', required: false })
  language?: 'es' | 'pt' | 'en';
}
