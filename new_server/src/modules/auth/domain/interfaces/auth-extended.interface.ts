import { RefreshTokenRequestDto, VerifyEmailRequestDto, ForgotPasswordRequestDto, ResetPasswordRequestDto } from '../../application/dtos/request/auth.request.dto';
import { RefreshTokenResponseDto, MessageResponseDto } from '../../application/dtos/response/auth-response.dto';
import { UserAuthResponseDto } from '../../application/dtos/response/auth-response.dto';

export interface IRefreshTokenUseCase {
  execute(refreshDto: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto>;
}

export interface ILogoutUseCase {
  execute(userId: string): Promise<MessageResponseDto>;
}

export interface IGetProfileUseCase {
  execute(userId: string): Promise<{ success: boolean; message: string; data: { user: UserAuthResponseDto } }>;
}

export interface IUpdateProfileUseCase {
  execute(userId: string, updateData: { name?: string; phone?: string }): Promise<{ success: boolean; message: string; data: { user: UserAuthResponseDto } }>;
}

export interface IChangePasswordUseCase {
  execute(userId: string, currentPassword: string, newPassword: string): Promise<MessageResponseDto>;
}

export interface IDeleteAccountUseCase {
  execute(userId: string): Promise<MessageResponseDto>;
}

export interface IForgotPasswordUseCase {
  execute(forgotPasswordDto: ForgotPasswordRequestDto): Promise<MessageResponseDto>;
}

export interface IResetPasswordUseCase {
  execute(resetPasswordDto: ResetPasswordRequestDto): Promise<MessageResponseDto>;
}

export interface IVerifyEmailUseCase {
  execute(verifyEmailDto: VerifyEmailRequestDto): Promise<MessageResponseDto>;
}
