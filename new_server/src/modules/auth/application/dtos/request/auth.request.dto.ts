import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @IsEmail()
  @ApiProperty({ description: 'User email address' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ description: 'User password', minLength: 6 })
  password: string;
}

export class RegisterRequestDto {
  @IsString()
  @ApiProperty({ description: 'User name' })
  name: string;

  @IsEmail()
  @ApiProperty({ description: 'User email address' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ description: 'User password', minLength: 6 })
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'User phone number', required: false })
  phone?: string;
}

export class RefreshTokenRequestDto {
  @IsString()
  @ApiProperty({ description: 'Refresh token' })
  refreshToken: string;
}

export class VerifyEmailRequestDto {
  @IsString()
  @ApiProperty({ description: 'Email verification token' })
  token: string;
}

export class ForgotPasswordRequestDto {
  @IsEmail()
  @ApiProperty({ description: 'User email address' })
  email: string;
}

export class ResetPasswordRequestDto {
  @IsString()
  @ApiProperty({ description: 'Password reset token' })
  token: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ description: 'New password', minLength: 6 })
  password: string;
}

export class UpdateProfileRequestDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'User name', required: false })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'User phone number', required: false })
  phone?: string;
}

export class ChangePasswordRequestDto {
  @IsString()
  @ApiProperty({ description: 'Current password' })
  currentPassword: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ description: 'New password', minLength: 6 })
  newPassword: string;
}
