import { IsString, IsOptional, IsBoolean, IsDateString, IsNumber, IsEnum, IsObject } from 'class-validator';

export class SetPlaceStatusDto {
  @IsEnum(['active', 'inactive', 'pending', 'suspended'])
  status: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class VerifyPlaceDto {
  @IsBoolean()
  verified: boolean;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class FeaturePlaceDto {
  @IsBoolean()
  featured: boolean;

  @IsDateString()
  @IsOptional()
  featuredUntil?: string;
}

export class AdminListPlacesQueryDto {
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  limit?: number = 20;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  q?: string;

  @IsString()
  @IsOptional()
  verified?: string;

  @IsString()
  @IsOptional()
  featured?: string;
}

export class UpdateUserRoleDto {
  @IsEnum(['user', 'admin', 'super_admin', 'moderator'])
  role: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class SuspendUserDto {
  @IsString()
  reason: string;

  @IsDateString()
  @IsOptional()
  suspendedUntil?: string;
}

export class AdminListUsersQueryDto {
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  limit?: number = 20;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  q?: string;

  @IsString()
  @IsOptional()
  verified?: string;
}

export class SendBulkNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(['all', 'users', 'admins', 'moderators', 'specific'])
  target: string;

  @IsOptional()
  userIds?: string[];

  @IsString()
  @IsOptional()
  type?: string = 'info';
}

export class UpdateSystemSettingsDto {
  @IsObject()
  settings: Record<string, any>;
}

export class AdminListReviewsQueryDto {
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  limit?: number = 20;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  placeId?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsNumber()
  @IsOptional()
  minRating?: number;

  @IsNumber()
  @IsOptional()
  maxRating?: number;

  @IsString()
  @IsOptional()
  q?: string;
}

export class ReviewModerationDto {
  @IsEnum(['approved', 'rejected'])
  status: string;

  @IsString()
  @IsOptional()
  reason?: string;
}
