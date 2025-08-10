import { LoginRequestDto, RegisterRequestDto } from '../../application/dtos/request/auth.request.dto';
import { LoginResponseDto, RegisterResponseDto } from '../../application/dtos/response/auth-response.dto';

export interface ILoginUseCase {
  execute(loginDto: LoginRequestDto): Promise<LoginResponseDto>;
}

export interface IRegisterUseCase {
  execute(registerDto: RegisterRequestDto): Promise<RegisterResponseDto>;
}
