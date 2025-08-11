import { 
  SetPlaceStatusDto, 
  VerifyPlaceDto, 
  FeaturePlaceDto, 
  AdminListPlacesQueryDto,
  UpdateUserRoleDto,
  SuspendUserDto,
  AdminListUsersQueryDto,
  SendBulkNotificationDto,
  UpdateSystemSettingsDto,
  AdminListReviewsQueryDto,
  ReviewModerationDto
} from '../../application/dtos/request.dto';

import {
  AdminStatsResponseDto,
  PlaceStatsResponseDto,
  UserDetailsResponseDto,
  SystemSettingsResponseDto
} from '../../application/dtos/response.dto';

// Places Management
export interface SetPlaceStatusUseCase {
  execute(placeId: string, data: SetPlaceStatusDto, adminUserId: string): Promise<any>;
}

export interface VerifyPlaceUseCase {
  execute(placeId: string, data: VerifyPlaceDto, adminUserId: string): Promise<any>;
}

export interface FeaturePlaceUseCase {
  execute(placeId: string, data: FeaturePlaceDto, adminUserId: string): Promise<any>;
}

export interface GetAdminPlaceUseCase {
  execute(placeId: string): Promise<any>;
}

export interface ListAdminPlacesUseCase {
  execute(query: AdminListPlacesQueryDto): Promise<{ data: any[]; total: number; page: number; limit: number; }>;
}

// Users Management
export interface ListAdminUsersUseCase {
  execute(query: AdminListUsersQueryDto): Promise<{ data: any[]; total: number; page: number; limit: number; }>;
}

export interface GetUserDetailsUseCase {
  execute(userId: string): Promise<UserDetailsResponseDto>;
}

export interface UpdateUserRoleUseCase {
  execute(userId: string, data: UpdateUserRoleDto, adminUserId: string): Promise<any>;
}

export interface SuspendUserUseCase {
  execute(userId: string, data: SuspendUserDto, adminUserId: string): Promise<any>;
}

export interface ActivateUserUseCase {
  execute(userId: string, adminUserId: string): Promise<any>;
}

export interface DeleteUserUseCase {
  execute(userId: string, adminUserId: string): Promise<void>;
}

// Statistics
export interface GetAdminStatsUseCase {
  execute(): Promise<AdminStatsResponseDto>;
}

export interface GetPlaceStatsUseCase {
  execute(): Promise<PlaceStatsResponseDto>;
}

// System Settings
export interface GetSystemSettingsUseCase {
  execute(): Promise<SystemSettingsResponseDto>;
}

export interface UpdateSystemSettingsUseCase {
  execute(data: UpdateSystemSettingsDto, adminUserId: string): Promise<SystemSettingsResponseDto>;
}

// Notifications
export interface SendBulkNotificationUseCase {
  execute(data: SendBulkNotificationDto, adminUserId: string): Promise<{ sent: number; failed: number; }>;
}

// Reviews Management
export interface ListAdminReviewsUseCase {
  execute(query: AdminListReviewsQueryDto): Promise<{ data: any[]; total: number; page: number; limit: number; }>;
}

export interface ApproveReviewUseCase {
  execute(reviewId: string, data: ReviewModerationDto, adminUserId: string): Promise<any>;
}

export interface RejectReviewUseCase {
  execute(reviewId: string, data: ReviewModerationDto, adminUserId: string): Promise<any>;
}

export interface DeleteReviewUseCase {
  execute(reviewId: string, adminUserId: string): Promise<void>;
}
