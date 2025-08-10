import { IsString, IsEmail, MinLength, MaxLength, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ description: 'User name', maxLength: 50, required: false })
  name?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ description: 'User email address', required: false })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @ApiProperty({ description: 'User password', minLength: 6, required: false })
  password?: string;

  @IsOptional()
  @IsEnum(['user', 'admin'])
  @ApiProperty({ description: 'User role', enum: ['user', 'admin'], required: false })
  role?: 'user' | 'admin';

  @IsOptional()
  @IsEnum(['active', 'suspended', 'deleted'])
  @ApiProperty({ description: 'User status', enum: ['active', 'suspended', 'deleted'], required: false })
  status?: 'active' | 'suspended' | 'deleted';

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'User phone number', required: false })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Profile picture URL', required: false })
  profilePicture?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Email verified status', required: false })
  isEmailVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'User active status', required: false })
  isActive?: boolean;

  @IsOptional()
  @IsEnum(['es', 'pt', 'en'])
  @ApiProperty({ description: 'User language preference', enum: ['es', 'pt', 'en'], required: false })
  language?: 'es' | 'pt' | 'en';
}
