import { ForgotPasswordRequestDto } from '../../application/dtos/request/forgot-password.request.dto';
import { ResetPasswordRequestDto } from '../../application/dtos/request/reset-password.request.dto';
import { ForgotPasswordResponseDto, ResetPasswordResponseDto } from '../../application/dtos/response/password-recovery.response.dto';

export interface ForgotPasswordUseCase {
  execute(forgotPasswordDto: ForgotPasswordRequestDto): Promise<ForgotPasswordResponseDto>;
}

export interface ResetPasswordUseCase {
  execute(resetPasswordDto: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto>;
}
